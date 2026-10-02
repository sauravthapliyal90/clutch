import React from 'react'
import Analytics from '../components/Analytics'
import MeetForm from '../components/createMeet/MeetForm'
import ManageMeets from '../components/createMeet/ManageMeets'
import {useCreateMeet, useUpload} from "../hooks/useMeets"

const STAT_ITEMS = [
    { key: "meets", label: "MEETS" },
    { key: "private", label: "PRIVATE MEETS" },
    { key: "reserve", label: "Total RSVPs" },
    { key: "verifiedCar", label: "Verified cars" }
]

function CreateMeets() {
    

    const createMeet = useCreateMeet()
    const uploadUrl = useUpload()
    
    
    return (
        <div className='mx-5 flex flex-col gap-6 my-10'>
            <div className='flex flex-col gap-2'>
            <p className='text-xs text-[#e21d48] tracking-[0.35em] uppercase'>admin console</p>
            <h1 className=' text-3xl lg:text-5xl uppercase font-extrabold'>Meet Dashboard</h1>
            </div>
            <Analytics 
            StatItem={STAT_ITEMS}
            className='lg:grid-cols-4'
            />
            <div className='grid lg:grid-cols-2 grid-cols-1  gap-4'>
              <MeetForm createMeet={createMeet} uploadFile={uploadUrl} />

              <ManageMeets/>
            </div>
        </div>
    )
}

export default CreateMeets