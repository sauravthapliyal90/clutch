import React from 'react'

const STATS = [
    { key: "meets", label: "MEETS" },
    { key: "private", label: "PRIVATE MEETS" },
    { key: "reserve", label: "Total RSVPs" },
    { key: "verifiedCar", label: "Verified cars" }
]

function Analytics() {
    return (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 '>
            {STATS.map((stats) => (
                <div className='flex flex-col bg-[#141414] gap-2 border border-white/20 p-4 w-full' key={stats.key}>
                    <p className='text-xs  uppercase font-light tracking-widest text-white'>{stats.label}</p>
                    <p className='lg:text-3xl text-xl font-extrabold'>0</p>
                </div>
            )
            )}
        </div>
    )
}

export default Analytics