import { useNavigate, useParams } from "react-router";
import { useMeetDetail, useResgistration } from "../hooks/useMeets";
import {
    CalendarBlankIcon,
    MapPinIcon,
    UsersIcon,
    UserCircleIcon,
    LockIcon,
} from "@phosphor-icons/react";
import { useAuth } from "../context/AuthProvider";
import MeetsMap from "../components/MeetsMap";
import { useState } from "react";
import { usePayment, useVerifyPayment } from "../hooks/usePayment";
import { loadRazorpay } from "../utils/loadRazorpay";

function MeetDetail() {

    const [isRegistered, setIsRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { id } = useParams();
    const navigate = useNavigate()
    const { user } = useAuth()

    const {
        data: meet,
        isLoading,
        isError,
    } = useMeetDetail(id);


    
    const registration = useResgistration()
    
    const createOrder = usePayment();
    const verifyPayment = useVerifyPayment();


  


    // Handle loading BEFORE accessing meet
    if (isLoading) {
        return (
            <div className="text-white p-6">
                Loading...
            </div>
        );
    }

    if (isError || !meet) {
        return (
            <div className="text-white p-6">
                Meet not found.
            </div>
        );
    }

    // Now it is safe to access meet
    const {
        title,
        description,
        bannerImageUrl,
        host,
        date,
        location,
        maxParticipants,
        // _count?.registrations: participantCount,
        status,
        meetType
    } = meet;

    const participantCount = meet._count?.registrations ?? 0;
    console.log(meet, "participant");

    const formattedDate = date
        ? new Date(date).toLocaleDateString()
        : "No date";

    const time = date
        ? new Date(date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "No time";

    const CARD_ICONS = [
        {
            name: "Date & Time",
            detail: `${formattedDate} at ${time}`,
            icon: CalendarBlankIcon,
        },
        {
            name: "Location",
            detail: location,
            icon: MapPinIcon,
        },
        {
            name: "Participants",
            detail: `${participantCount}/${maxParticipants}`,
            icon: UsersIcon,
        },
    ];

      // Function to handle loading Razorpay script


    const handlePayment = async () => {
        if (!user) {
            navigate("/request-otp");
            return;
        }
        try {
            // 1. Load Razorpay Checkout script
            const loaded = await loadRazorpay();

            if (!loaded) {
                console.error("Razorpay SDK failed to load");
                setErrorMessage("Unable to load payment gateway");
                return;
            }

            // 2. Create order from backend
            const response = await createOrder.mutateAsync({
                meetId: id,
                plan: "THREE_MONTH",
            });

            console.log("Order created:", response);

            // Axios response -> actual backend data
            const order = response.data;

            // 3. Create Razorpay Checkout options
            const options = {
                key: order.keyId,

                amount: order.amount,

                currency: order.currency,

                name: "CarMeet",

                description: "Private Meet Registration",

                order_id: order.orderId,

                handler: async function (paymentResponse) {
                    try {
                        const {
                            razorpay_payment_id,
                            razorpay_order_id,
                            razorpay_signature,
                        } = paymentResponse;

                        const verifyResponse =
                            await verifyPayment.mutateAsync({
                                razorpayPaymentId: razorpay_payment_id,
                                razorpayOrderId: razorpay_order_id,
                                razorpaySignature: razorpay_signature,
                            });

                        console.log(
                            "Payment verification response:",
                            verifyResponse
                        );

                    } catch (error) {
                        console.error(
                            "Payment verification failed:",
                            error
                        );
                    }
                },

                prefill: {
                    name: user?.name || "",
                    contact: user?.phone || "",
                    email: user?.email || "",
                },

                theme: {
                    color: "#3399cc",
                },
            };

            // 4. Open Razorpay Checkout
            const paymentObject =
                new window.Razorpay(options);

            paymentObject.open();

        } catch (error) {
            console.error(
                "Payment initialization failed",
                error
            );

            setErrorMessage(
                error?.response?.data?.error ||
                "Unable to initialize payment"
            );
        }
    };

    const handleRSVP = async () => {
        if (!user) {
            navigate("/request-otp");
            return;
        }

        try {
            const { data, error } = await registration.mutateAsync(id);
            if (error) {
                console.error("Registration failed:", error);
                setErrorMessage(error.message || "Registration failed");
                return;
            }

            console.log("Registration successful:", data);

            setIsRegistered(true);
        } catch (error) {
            const message = error.response?.data?.error || "";

            if (error.response?.status === 409) {

                console.log("Registration failed:", error.response);
                if (message.toLowerCase().includes("already registered")) {
                    setIsRegistered(true);
                }

            } else {
                console.error("Registration failed:", error);
            }
            setErrorMessage(message);
        }
    };
    const isFull = participantCount >= maxParticipants;

    return (
        <div className="text-white">

            {meetType === "PRIVATE" ? (<span className="absolute flex  gap-2 top-3 left-3 text-black font-bold text-[10px] tracking-widest px-2 py-1 uppercase z-50 bg-[#ffbf00]">
                <LockIcon size={12} /> Private Meet
            </span>) : null
            }
            {/* Hero */}
            <div className="relative h-[52vh] overflow-hidden">

                <img
                    src={bannerImageUrl}
                    alt={title}
                    className="absolute inset-0 z-0 h-full w-full object-cover object-center"
                />

                <div className="absolute inset-0 z-10 bg-linear-to-t from-black via-black/40 to-black/20" />

                <div className="absolute inset-0 z-20 flex h-full w-full flex-col justify-end px-4 pb-8">

                    <h1 className="text-3xl font-extrabold uppercase lg:text-5xl">
                        {title}
                    </h1>

                    <div className="mt-2 flex items-center gap-2">
                        <UserCircleIcon
                            size={18}
                            className="text-gray-400"
                        />

                        <p className="text-md font-light text-gray-400">
                            Hosted by{" "}
                            {host?.user?.name?.toUpperCase() || "Unknown"}
                        </p>
                    </div>

                </div>
            </div>

            {/* Meet information */}
            {/* Meet information */}
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-6 relative">

                {/* Left side - 4 columns */}
                <div className="md:col-span-4 grid grid-cols-1 gap-4 md:grid-cols-3 w-full h-fit">

                    {CARD_ICONS.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.name}
                                className="border border-white/10 bg-[#141414] p-6"
                            >
                                <Icon
                                    size={28}
                                    className="text-red-500"
                                />

                                <p className="mt-4 text-sm text-gray-400">
                                    {card.name}
                                </p>

                                <p className="mt-2 font-medium">
                                    {card.detail}
                                </p>
                            </div>
                        );
                    })}

                    {/* Description */}
                    <div className=" mt-5 w-full col-span-4">
                        <h2 className="text-2xl font-bold">
                            About this meet
                        </h2>

                        <p className="mt-3 text-gray-400">
                            {description || "No description available."}
                        </p>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-lg border border-gray-700 col-span-4">
                        <MeetsMap />
                        {/* &q=${meet.latitude},${meet.longitude}*/}
                    </div>

                </div>

                {/* Right side - 2 columns */}
                <div className=" lg:sticky lg:top-24 md:col-span-2 border border-white/10 bg-[#141414] p-6  h-fit">

                    <p className="text-sm text-gray-400">
                        ENTRY
                    </p>

                    <h2 className="mt-4 text-4xl font-bold">
                        Free
                    </h2>

                    <button
                        type="button"
                        disabled={
                            registration.isPending ||
                            isFull
                        }
                        className={`mt-6 w-full text-sm font-light ${isRegistered ? 'text-red-500 border-red-500' : 'bg-red-500 hover:bg-red-600 '} py-4 font-medium uppercase tracking-widest border-[0.3px] `}
                        onClick={meetType === "PRIVATE" ? handlePayment : handleRSVP}
                    >
                        {status == "CANCELLED" ? "Meet Cancelled"
                            : registration.isPending
                                ? "Registering..."
                                : isRegistered
                                    ? "You are already registered"
                                    : isFull
                                        ? "Meet Full"
                                        : "RSVP Now"}
                    </button>
                    {errorMessage && (
                        <div className="w-full flex items-center justify-center">
                            <p className="mt-4 text-md text-red-500 uppercase font-bold">
                                {errorMessage}
                            </p>
                        </div>
                    )}

                    <p className="mt-6 text-sm leading-6 text-gray-400 w-full">
                        Free entry, capacity limited. Please verify your car in My Garage.
                    </p>

                </div>

            </div>



        </div>
    );
}

export default MeetDetail;