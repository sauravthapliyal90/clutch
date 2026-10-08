import React, { useState } from 'react'
import Analytics from '../components/Analytics'
import MeetForm from '../components/createMeet/MeetForm'
import ManageMeets from '../components/createMeet/ManageMeets'
import { useCreateMeet, useDeleteMeet, useHostMeets, useMeet, useUpdateMeet, useUpload } from "../hooks/useMeets"
import { useAuth } from '../context/AuthProvider'

const STAT_ITEMS = [
    { key: "meets", label: "MEETS" },
    { key: "private", label: "PRIVATE MEETS" },
    { key: "reserve", label: "Total RSVPs" },
    { key: "verifiedCar", label: "Verified cars" }
]

const MEETS_PER_PAGE = 10

function CreateMeets() {

    const [editingMeet, setEditingMeet] = useState(null)
    const [page, setPage] = useState(1);


   const {user} = useAuth();
   console.log("userrr",user);
   
    const createMeet = useCreateMeet()
    const uploadUrl = useUpload()
    const updateMeet = useUpdateMeet();
    const deleteMeet = useDeleteMeet();


    // const {
    //     data,
    //     isLoading,
    //     isError,
    //     isFetching,
    // } = useMeet(page, MEETS_PER_PAGE);

    const {data, isLoading, isError, isFetching} = useHostMeets(user.id)

    const meets = data ?? [];

    const analyticsData = {
        meets: meets.length,
        private: meets.filter(meet => meet.meetType === "PRIVATE").length,
        reserve: meets.reduce((total, meet) => total + meet._count.registrations, 0) || 0,
        // verifiedCar: meets.reduce((total, meet) => total + meet.verifiedCarCount, 0)
    };

    console.log("meets data", meets);

    const currentPage = data?.pagination?.currentPage ?? page;
    const totalPages = data?.pagination?.totalPages ?? 1;

    const handleEdit = (meet) => {
        setEditingMeet(meet);
    };
    const handleCancelEdit = () => {
        setEditingMeet(null);
    };

    const handleDeleteFn = (meetId) => {
        try{
            console.log("Deleting meet with ID:", meetId);
            deleteMeet.mutateAsync(meetId)
        }catch(error){
            console.error("Failed to delete meet:", error);
        }
    }


    console.log("meets", meets);

    return (
        <div className='mx-5 flex flex-col gap-6 my-10'>
            <div className='flex flex-col gap-2'>
                <p className='text-xs text-[#e21d48] tracking-[0.35em] uppercase'>admin console</p>
                <h1 className=' text-3xl lg:text-5xl uppercase font-extrabold'>Meet Dashboard</h1>
            </div>
            <Analytics
                StatItem={STAT_ITEMS}
                className='lg:grid-cols-4'
                data={analyticsData}
            />
            <div className='grid lg:grid-cols-2 grid-cols-1  gap-4'>
                <MeetForm
                    createMeet={createMeet}
                    uploadFile={uploadUrl}
                    editingMeet={editingMeet}
                    onCancelEdit={handleCancelEdit}
                    updateMeet={updateMeet}
                    Loading={isLoading}
                />
                <div className='flex flex-col gap-2'>
                    <h1 className='uppercase text-2xl font-bold'>Manage Meets</h1>
                    {isLoading ? (
                        <div className='border-[0.2px] p-4 border-white/20'>
                            <p>NO MEETS YET</p>
                        </div>
                    ) : (
                        meets.map((meet) => (
                            <ManageMeets meet={meet} key={meet.id} onEdit={handleEdit} handleDelete={handleDeleteFn} />
                        )))}
                </div>
            </div>
        </div>
    )
}

export default CreateMeets