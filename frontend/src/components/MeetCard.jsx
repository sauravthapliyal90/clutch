import { memo } from "react";



const MeetCard =memo(({ title = "MeetCard", subtitle = "Meeting details", date = "Today", time = "10:00 AM" }) => {
  return (
    <div className="w-full overflow-hidden  border border-[#27272a] bg-[#141414] shadow-md">
      <div className="relative h-52 overflow-hidden">
        <img
        loading="lazy"
        decoding="async"
          src="https://images.unsplash.com/photo-1610374634235-b51ef357f905?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000"
          alt="Team meeting workspace"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="p-4 text-white">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
        <p className="mt-2 text-sm">{date}</p>
        <p className="text-sm">{time}</p>
      </div>
    </div>
  );
})

export default MeetCard;