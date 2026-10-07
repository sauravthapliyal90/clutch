
import axios from "axios";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

function MeetForm({
    createMeet,
    updateMeet,
    uploadFile,
    editingMeet,
    onCancelEdit,
    loading,
}) {
    const {
        register,
        handleSubmit,
        reset,
        control,
    } = useForm({
        defaultValues: {
            title: "",
            location: "",
            date: "",
            registrationDeadline: "",
            description: "",
            latitude: "",
            longitude: "",
            maxParticipants: "",
            bannerImage: undefined,
            isPrivate: false,
        },
    });

    // Convert backend ISO date into datetime-local format
    const formatDateTimeLocal = (value) => {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const pad = (num) => String(num).padStart(2, "0");

        return `${date.getFullYear()}-${pad(
            date.getMonth() + 1
        )}-${pad(date.getDate())}T${pad(
            date.getHours()
        )}:${pad(date.getMinutes())}`;
    };

    // Whenever user clicks edit,
    // populate the form with current meet values
    useEffect(() => {
        if (!editingMeet) {
            reset({
                title: "",
                location: "",
                date: "",
                registrationDeadline: "",
                description: "",
                latitude: "",
                longitude: "",
                maxParticipants: "",
                bannerImage: undefined,
                isPrivate: false,
            });

            return;
        }

        reset({
            title: editingMeet.title ?? "",
            location: editingMeet.location ?? "",
            date: formatDateTimeLocal(editingMeet.date),
            registrationDeadline: formatDateTimeLocal(
                editingMeet.registrationDeadline
            ),
            description: editingMeet.description ?? "",
            latitude: editingMeet.latitude ?? "",
            longitude: editingMeet.longitude ?? "",
            maxParticipants: editingMeet.maxParticipants ?? "",
            bannerImage: undefined,

            // Load existing private/public value
            isPrivate: editingMeet.isPrivate ?? false,
        });
    }, [editingMeet, reset]);

    const onSubmit = async (data) => {
        try {
            // =========================
            // EDIT EXISTING MEET
            // =========================
            if (editingMeet) {
                const file = data.bannerImage?.[0];

                let bannerImageKey;

                // Only upload a new image if user selected one
                if (file) {
                    const { data: uploadData } =
                        await uploadFile.mutateAsync({
                            context: "meet-banner",
                            contentType: file.type,
                        });

                    const {
                        uploadUrl,
                        key,
                    } = uploadData;

                    await axios.put(uploadUrl, file, {
                        headers: {
                            "Content-Type": file.type,
                        },
                    });

                    bannerImageKey = key;
                }

                const payload = {
                    title: data.title,
                    location: data.location,
                    date: data.date,
                    registrationDeadline:
                        data.registrationDeadline,
                    description: data.description,
                    latitude: Number(data.latitude),
                    longitude: Number(data.longitude),
                    maxParticipants: Number(
                        data.maxParticipants
                    ),

                    // Send private/public status
                    isPrivate: data.isPrivate,
                };

                // Only change image if new image uploaded
                if (bannerImageKey) {
                    payload.bannerImageKey = bannerImageKey;
                }

                await updateMeet.mutateAsync({
                    id: editingMeet.id,
                    payload,
                });

                console.log("Meet updated successfully");

                onCancelEdit();

                return;
            }

            // =========================
            // CREATE NEW MEET
            // =========================

            const file = data.bannerImage?.[0];

            if (!file) {
                throw new Error("Banner image is required");
            }

            const { data: uploadData } =
                await uploadFile.mutateAsync({
                    context: "meet-banner",
                    contentType: file.type,
                });

            const {
                uploadUrl,
                key,
            } = uploadData;

            await axios.put(uploadUrl, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });

            await createMeet.mutateAsync({
                title: data.title,
                location: data.location,
                date: data.date,
                registrationDeadline:
                    data.registrationDeadline,
                description: data.description,
                latitude: Number(data.latitude),
                longitude: Number(data.longitude),
                maxParticipants: Number(
                    data.maxParticipants
                ),
                bannerImageKey: key,

                // Send private/public status
                isPrivate: data.isPrivate,
            });

            console.log("Meet created successfully");

            reset();
        } catch (error) {
            console.error(
                editingMeet
                    ? "Failed to update meet"
                    : "Failed to create meet",
                error
            );
        }
    };

    const isEditing = !!editingMeet;

    return (
        <div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="lg:col-span-3 border border-white/20 bg-[#141414] px-8 py-8 h-fit"
            >
                <div className="flex items-center justify-between">
                    <h1 className="uppercase text-white text-2xl font-bold">
                        {isEditing ? "Edit Meet" : "Add Meet"}
                    </h1>

                    {isEditing && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="text-sm text-white/60 hover:text-white"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                <div className="py-8 flex flex-col gap-5">

                    {/* TITLE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-md font-light uppercase">
                            Title
                        </label>

                        <input
                            className="px-3 py-3 placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20"
                            placeholder="FridayMeet"
                            {...register("title", {
                                required: true,
                            })}
                        />
                    </div>

                    {/* LOCATION */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-md font-light uppercase">
                            Location
                        </label>

                        <input
                            className="px-3 py-3 placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20"
                            placeholder="Sector 48, Gurugram"
                            {...register("location", {
                                required: true,
                            })}
                        />
                    </div>

                    {/* DATE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-md font-light uppercase">
                            Date
                        </label>

                        <input
                            type="datetime-local"
                            className="px-3 py-3 placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20"
                            {...register("date", {
                                required: true,
                            })}
                        />
                    </div>

                    {/* REGISTRATION DEADLINE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-md font-light uppercase">
                            Registration Deadline
                        </label>

                        <input
                            type="datetime-local"
                            className="px-3 py-3 text-white w-full border-[0.5px] border-white/20"
                            {...register("registrationDeadline", {
                                required: true,
                            })}
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-md font-light uppercase">
                            Description
                        </label>

                        <textarea
                            className="px-3 py-3 placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20"
                            placeholder="describe"
                            {...register("description", {
                                required: true,
                            })}
                        />
                    </div>

                    {/* LATITUDE / LONGITUDE */}
                    <div className="grid grid-cols-2 gap-3">

                        <div className="flex flex-col gap-2">
                            <label className="text-white text-md font-light uppercase">
                                Latitude
                            </label>

                            <input
                                className="px-3 py-3 placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20"
                                {...register("latitude", {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-white text-md font-light uppercase">
                                Longitude
                            </label>

                            <input
                                className="px-3 py-3 placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20"
                                {...register("longitude", {
                                    valueAsNumber: true,
                                })}
                            />
                        </div>

                    </div>

                    {/* MAX PARTICIPANTS */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-md font-light uppercase">
                            Max Participants
                        </label>

                        <input
                            type="number"
                            min={1}
                            className="px-3 py-3 placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20"
                            {...register("maxParticipants", {
                                required: true,
                                valueAsNumber: true,
                            })}
                        />
                    </div>

                    {/* BANNER IMAGE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-white text-md font-light uppercase">
                            Banner Image
                        </label>

                        {isEditing &&
                            editingMeet.bannerImageUrl && (
                                <img
                                    src={editingMeet.bannerImageUrl}
                                    alt={editingMeet.title}
                                    className="w-full max-h-48 object-cover"
                                />
                            )}

                        <input
                            type="file"
                            className="px-3 py-3 text-white w-full border-[0.5px] border-white/20"
                            {...register("bannerImage")}
                        />

                        {isEditing && (
                            <p className="text-xs text-white/50">
                                Leave empty to keep the current image.
                            </p>
                        )}
                    </div>

                    {/* PRIVATE MEET TOGGLE */}
                    <Controller
                        name="isPrivate"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center justify-between border border-white/10 p-4">

                                <div>
                                    <p className="text-white font-medium">
                                        Private Meet
                                    </p>

                                    <p className="text-sm text-white/50">
                                        Only approved users can join this meet.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={field.value}
                                    onClick={() =>
                                        field.onChange(!field.value)
                                    }
                                    className={`relative h-6 w-11 rounded-full transition-colors ${
                                        field.value
                                            ? "bg-blue-600"
                                            : "bg-gray-600"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                                            field.value
                                                ? "translate-x-5"
                                                : "translate-x-0"
                                        }`}
                                    />
                                </button>
                            </div>
                        )}
                    />

                    {/* SUBMIT */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="uppercase text-white text-sm py-4 tracking-wide font-light w-full bg-red-600"
                        >
                            {isEditing
                                ? "Update Meet"
                                : "Create Meet"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default MeetForm;