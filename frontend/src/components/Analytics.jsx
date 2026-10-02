import React from 'react'



function Analytics({data, StatItem, isLoading, className="grid-cols-4" }) {
    console.log(data);
    
    return (
        <div className={`grid grid-cols-2 ${className} gap-4 `}>
            {StatItem.map((stats) => (
                <div className='flex flex-col bg-[#141414] gap-2 border border-white/20 p-4 w-full' key={stats.key}>
                    <p className='text-xs  uppercase font-light tracking-widest text-white'>{stats.label}</p>
                    <p className='lg:text-3xl text-xl font-extrabold'>{isLoading ? "..." : data?.[stats.key] ?? 0}</p>
                </div>
            )
            )}
        </div>
    )
}

export default Analytics