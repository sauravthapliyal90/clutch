import { useParams } from "react-router";
import { useMeetDetail } from "../hooks/useMeets";

function MeetDetail() {
    const { id } = useParams();
    const { data: meet, isLoading, isError } = useMeetDetail(id);

    if (isLoading) return <div className="text-white p-6">Loading...</div>;
    if (isError || !meet) return <div className="text-white p-6">Meet not found.</div>;

    return (
        <div className="text-white p-6">
            <h1 className="text-2xl font-bold">{meet.title}</h1>
            <p className="mt-2 text-gray-400">{meet.description}</p>
            <p className="mt-2 text-gray-400">{meet.location}</p>

            {/* map goes here, once this page exists */}
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-700">
                <iframe
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                        }&q=${meet.latitude},${meet.longitude}`}
                />
            </div>
        </div>
    );
}

export default MeetDetail;