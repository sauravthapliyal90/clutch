import React, { useState } from 'react'
import Analytics from '../components/Analytics'
import ManageMeets from '../components/createMeet/ManageMeets'
import { useDashboardStats, useUsersList } from '../hooks/useAdmin'


const STAT_ITEMS = [
  { key: 'totalUsers', label: 'Total users' },
  { key: 'totalHost', label: 'Total hosts', },
  { key: 'totalMeets', label: 'Total meets' },
  { key: 'upcomingMeets', label: 'Upcoming meets', },
  { key: 'totalRegistrations', label: 'Registrations',  },
  { key: 'activeSubscriptions', label: 'Active subscriptions', },
] 

const limit = 10;

function AdminDashboard() {

  const [page, setPage] = useState(1);

   const {userData, userIsLoading} = useUsersList(page, limit)
    console.log(userData, "--userdata");
  
  // const currentPage = userData?.pagination?.currentPage ?? page;
  // const totalPages = userData?.pagination?.totalPages ?? 1;

  

  const { data, isLoading, isError } = useDashboardStats()
  console.log(data, "--dash");

  return (
    <div className='mx-5 flex flex-col gap-6 my-10'>
      <div className='flex flex-col gap-2'>
        <p className='text-xs text-[#e21d48] tracking-[0.35em] uppercase'>Control Room</p>
        <h1 className='text-3xl lg:text-5xl uppercase font-extrabold'>Admin</h1>
      </div>
      <Analytics
        data={data}
        isLoading={isLoading}
        StatItem={STAT_ITEMS}
        className="grid-cols-3"
      />
      {/* <div className='grid lg:grid-cols-2 grid-cols-1  gap-4'>
              <MeetForm /> */}

      <ManageMeets />
      {/* </div> */}
    </div>
  )
}

export default AdminDashboard