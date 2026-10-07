import { memo } from "react";
import { CalendarBlankIcon, MapPinIcon, UsersIcon, LockIcon, UserCircle } from "@phosphor-icons/react";
import {Link } from "react-router"

const MeetCard = memo(({ meet }) => {
  // console.log("meet data in meet card:", meet);

  const {
    title,
    date,
    bannerImageUrl,
    description,
    maxParticipants,
    participantCount,
    location,
    meetType
  } = meet;

  const formattedDate = date
    ? new Date(date).toLocaleDateString()
    : null;

  const time = date
    ? new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : null;

  return (
    <Link
      to={`/meets/${meet.id}`}
      className="relative group w-full overflow-hidden h-fit border border-[#27272a] bg-[#141414] shadow-md hover:border-red-500 ">

      {/* Image */}
      { meetType === "PRIVATE" ?(<span className="absolute flex  gap-2 top-3 left-3 text-black font-bold text-[10px] tracking-widest px-2 py-1 uppercase z-50 bg-[#ffbf00]">
        <LockIcon size={12}/> Private Meet
      </span>): null
      }
      <div className="relative h-52 overflow-hidden">
        <img
          loading="lazy"
          decoding="async"
          src={
            bannerImageUrl ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1170&q=80"
          }
          alt={title || "Meet banner"}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4 text-white ">

        <h2 className="text-xl group-hover:text-red-500 font-semibold">
          {title || "No title"}
        </h2>

        <div className="flex text-red-500 items-center gap-2 mt-2">
          <MapPinIcon size={16} />
          <p className=" text-sm text-gray-400 truncate">
            {location || "No description available"}
          </p>
        </div>

        <div className="flex items-center text-red-500 gap-2 mt-1">
          <CalendarBlankIcon size={16} />
          <p className=" text-gray-400 text-sm">
            {formattedDate ? `${formattedDate} at ${time}` : "Date not available"}
          </p>
        </div>

        <div className="flex items-center text-red-500 gap-2 mt-1">
          <UsersIcon size={16} />
          <p className="text-sm text-gray-400 ">
            {participantCount}/{maxParticipants} participants
          </p>
        </div>

      </div>
    </Link>
  );
});

export default MeetCard;