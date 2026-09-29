import React from 'react'
import Analytics from '../components/createMeet/Analytics'
import MeetForm from '../components/createMeet/MeetForm'
import ManageMeets from '../components/createMeet/ManageMeets'

function CreateMeets() {
    
    return (
        <div className='mx-5 flex flex-col gap-6 my-10'>
            <div className='flex flex-col gap-2'>
            <p className='text-xs text-[#e21d48] tracking-[0.35em] uppercase'>admin console</p>
            <h1 className=' sm:text-4xl lg:text-5xl uppercase font-extrabold'>Meet Dashboard</h1>
            </div>
            <Analytics />
            <div className='grid lg:grid-cols-2 grid-cols-1  gap-4'>
              <MeetForm />

              <ManageMeets/>
            </div>
        </div>
    )
}

export default CreateMeets