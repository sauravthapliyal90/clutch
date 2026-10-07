import React from "react";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";

function ManageMeets({ meet, onEdit, handleDelete }) {
    const {
        title,
        date,
        maxParticipants,
        participantCount
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
        <div className="flex flex-col gap-4">
            <div className="flex border-[0.2px] px-3 py-2 border-white/20 gap-2 justify-between items-center">
                
                <div>
                    <h1 className="text-md uppercase font-medium">
                        {title}
                    </h1>

                    <p className="text-xs text-[#a1a1aa]">
                        {formattedDate} at {time} - {participantCount || 0}/{maxParticipants}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(meet)}
                        className="border border-border p-2 hover:border-red-500 hover:text-red-500"
                    >
                        <PencilSimpleIcon size={16} />
                    </button>

                    <button
                        type="button"
                        className="border border-border p-2 hover:border-red-500 hover:text-red-500"
                        onClick={() => handleDelete(meet.id)}
                    >
                        <TrashIcon size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ManageMeets;











// import React from 'react'
// import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";

// function ManageMeets({ meet }) {
//     const { title, date, maxParticipants, participantCount } = meet

//     const formattedDate = date ? new Date(date).toLocaleDateString() : null;

//     const time = date ? new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

//     return (
//         <div className='flex flex-col gap-4'>


//             <div className='flex border-[0.2px] px-3 py-2 border-white/20 gap-2 justify-between items-center'>
//                 <div className=''>
//                     <h1 className='text-md uppercase font-medium'>{title}</h1>
//                     <p className='text-xs text-[#a1a1aa] '>{formattedDate} at {time} -{participantCount}/{maxParticipants}</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <button className='border border-border p-2 hover:border-red-500 hover:text-red-500'>
//                         <PencilSimpleIcon size={16} />
//                     </button>
//                     <button className='border border-border p-2 hover:border-red-500 hover:text-red-500'>
//                         <TrashIcon size={16} />
//                     </button>
//                 </div>
//             </div>

//         </div>
//     )
// }

// export default ManageMeets