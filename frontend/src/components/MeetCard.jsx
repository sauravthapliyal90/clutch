import { memo } from "react";



const MeetCard =memo(({meet}) => {
  console.log("meet data in meet card:", meet);
  const { title, date,bannerImageUrl,description, maxParticipants, participantCount } = meet;

  const formattedDate = date ? new Date(date).toLocaleDateString() : null;

  const time = date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <div className="w-full overflow-hidden  border border-[#27272a] bg-[#141414] shadow-md">
      <div className="relative h-52 overflow-hidden">
        <img
        loading="lazy"
        decoding="async"
          src={bannerImageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"}
          alt="Team meeting workspace"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="p-4 text-white">
        <h2 className="text-xl font-semibold">{title || "No title"}</h2>
        <p className="mt-2 text-sm text-gray-600">{description || "No description available"}</p>
        <p className="mt-2 text-sm">{formattedDate|| "No date available"}</p>
        <p className="text-sm">{time || "No time available"}</p>
      </div>
    </div>
  );
})

export default MeetCard;