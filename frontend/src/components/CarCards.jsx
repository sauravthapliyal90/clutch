import { TrashSimpleIcon } from "@phosphor-icons/react";
import { memo } from "react";

const CarCards =({ title = "MeetCard",onDelete,imageUrl, subtitle = "Meeting details", status="pending", time = "10:00 AM", imgSrc="https://images.unsplash.com/photo-1610374634235-b51ef357f905?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000"}) => {
  console.log("imageurl",imageUrl);
  
  return (
    <div className="w-full overflow-hidden relative border border-[#27272a] bg-[#141414] shadow-md">
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageUrl||imgSrc}
          alt="Team meeting workspace"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="p-4 text-white ">
        <div className="flex my-2 justify-between">
          <div>

        <h2 className="text-xl uppercase font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          </div>
        
        <p className="text-sm uppercase text-amber-300 border h-8 border-amber-300 bg-amber-300/20 py-1 px-2">{status}</p>
        
        </div>
        <button className="uppercase border-[0.5px] w-full px-2 py-2 text-white border-white/20 ">Verify RC</button>
      </div>
      <div className="absolute z-50 top-2 right-2 p-2 hover:bg-red-500 bg-black/50 flex justify-center items-center rounded-full">
      <button onClick={onDelete} className="cursor-pointer" >
        <TrashSimpleIcon size={24} className="text-white group-hover:text-red-500 transition-colors duration-200" />
      </button>
      </div>
    </div>
  );
}

export default CarCards;