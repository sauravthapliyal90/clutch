import React, { useEffect, useState } from 'react'
import MeetCard from '../components/MeetCard'
import { useForm } from "react-hook-form"
import {  useCars, useCreateCar, useUpload } from '../hooks/useMeets'
import axios from 'axios'
import CarCards from '../components/CarCards'

function MyGarage() {

  const { register, handleSubmit, watch } = useForm()

  const createCar = useCreateCar();
  const uploadFile = useUpload();

    
  const {
  data: cars = [],
  isLoading,
  isError,
} = useCars();

console.log("cars:", cars);
 

  

 const onSubmit = async (data) => {
  try {
    const file = data.upload?.[0];

    if (!file) {
      throw new Error("Please select an image");
    }

    // 1. Get presigned URL
    const { data: uploadData } = await uploadFile.mutateAsync({
      context: "car",
      contentType: file.type,
    });

    const { uploadUrl, key } = uploadData;

    console.log("upload url", uploadUrl,"  --", key);
    

    // 2. Upload actual file directly to S3
    const result = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    console.log("S3 upload result:", result);

    // 3. Save car + S3 key in your backend
    const res = await createCar.mutateAsync({
      name: data.carName,
      model: data.model,
      color: data.color,
      rcNumber: data.rcNumber,
      imageKey: key,
    });

    console.log("car created:", res);

  } catch (error) {
    console.error("Failed to create car:", error);
  }
};

  return isLoading ? (<div>LOADING......</div>) : (
    <div className='h-full mx-5 pb-8'>
      <div className='py-12 flex flex-col gap-3 '>
        <p className='text-red-600 text-sm font-extralight tracking-[0.35em] uppercase'>SCHEDULE</p>
        <h1 className='md:text-5xl text-3xl text-white font-extrabold  uppercase'>MY GARAGE</h1>
      </div>
      <div className='grid lg:grid-cols-5 gap-8 grid-cols-1 px-5 '>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='lg:col-span-3 border border-white/20 bg-[#141414] px-8 py-8 h-fit'>
          <h1 className='uppercase text-white text-2xl font-bold'>ADD A CAR</h1>
          <div className='py-8  flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>

              <label className='text-white text-md font-light h-fit uppercase'>Car Name</label>
              <input
                className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
                placeholder='Lamborghini'
                {...register("carName")}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-white text-md font-light h-fit uppercase'>Model</label>
              <input
                className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
                placeholder='Hurcan'

                {...register("model")}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-white text-md font-light h-fit uppercase'>RC Number</label>
              <input
                className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
                placeholder='UK0718755'
                {...register("rcNumber")}
              />

            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-white text-md font-light h-fit uppercase'>Year</label>
              <input
                className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
                placeholder='2022'
                {...register("year")}
              />

            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-white text-md font-light h-fit uppercase'>Color</label>
              <input
                className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
                placeholder='Arancio'
                {...register("color")}
              />
            </div>
            <div className='flex flex-col gap-2'>
              {/* <label className='text-white text-md font-light h-fit uppercase'>upload</label> */}
              <input
                type='file' className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'

                {...register("upload")}
              />
            </div>
            <div>
              <button className='uppercase text-white text-sm py-4 tracking-wide font-ligth w-full bg-red-600'
                type='submit'
              // disabled={isSubmitting}
              >Submit</button>
            </div>
            <p className='text-white text-sm font-light'>RC is checked against the government vehicle registry (VAHAN). Verification is currently MOCKED.</p>

          </div>

        </form>
        <div className='lg:col-span-2'>
          <div className='lg:sticky top-24 flex flex-col gap-4'>
            {cars.map((car)=>{
              
              return <CarCards key={car.id} title={car.name} subtitle={`${car.model}-${car.color}-${car.rcNumber}`}/>
            })}

          </div>
        </div>
      </div>
    </div>
  )
}

export default MyGarage