import React, { useState } from 'react'
import MeetCard from '../components/MeetCard'
import MeetsMap from '../components/MeetsMap'
import { useCreateMeet, useMeet } from '../hooks/useMeets'

const MEETS_PER_PAGE = 6;

function Meets() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    isFetching,
  } = useMeet(page, MEETS_PER_PAGE);

  const meets = data?.data ?? [];

  const currentPage = data?.pagination?.currentPage ?? page;
  const totalPages = data?.pagination?.totalPages ?? 1;
  return (
    <div className='h-full pb-8'>
      <div className='px-5 py-12 flex flex-col gap-3 '>
        <p className='text-red-600 text-sm font-extralight tracking-[0.35em] uppercase'>SCHEDULE</p>
        <h1 className='md:text-5xl text-3xl text-white font-extrabold  uppercase'>CARMEETS</h1>
      </div>
      <div className='grid lg:grid-cols-5 gap-8 grid-cols-1 px-5'>
        <div className='lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {meets.map((meet) => (
            <MeetCard meet={meet} key={meet.id} />

          ))}

        </div>
        <div className='lg:col-span-2 '>
          <div className='lg:sticky top-24'>
            <MeetsMap />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Meets