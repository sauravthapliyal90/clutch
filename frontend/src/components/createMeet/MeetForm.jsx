import React from 'react'
import { useForm } from 'react-hook-form'

function MeetForm() {

  const { register, handleSubmit } = useForm()

  const onSubmit = () => {

  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='lg:col-span-3 border border-white/20 bg-[#141414] px-8 py-8 h-fit'>
        <h1 className='uppercase text-white text-2xl font-bold'>ADD MEEt</h1>
        <div className='py-8  flex flex-col gap-5'>
          <div className='flex flex-col gap-2'>

            <label className='text-white text-md font-light h-fit uppercase'>title</label>
            <input
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='FridayMeet'
              {...register("carName")}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-white text-md font-light h-fit uppercase'>Location</label>
            <input
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='Sector 48, Gurugram'

              {...register("model")}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-white text-md font-light h-fit uppercase'>Date</label>
            <input
              type='datetime-local'
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='UK0718755'
              {...register("rcNumber")}
            />

          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-white text-md font-light h-fit uppercase'>Description</label>
            <textarea
              type='textarea'
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='describe'
              {...register("year")}
            ></textarea>

          </div>
          <div className='grid grid-cols-2 gap-3'>


            <div className='flex flex-col gap-2'>
              <label className='text-white text-md font-light h-fit uppercase'>latitude</label>
              <input
                className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
                placeholder='77.2090° E'
                {...register("color")}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-white text-md font-light h-fit uppercase'>longitude</label>
              <input
                className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
                placeholder='28.6139° N'
                {...register("color")}
              />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            {/* <label className='text-white text-md font-light h-fit uppercase'>upload</label> */}
            <input
              type='file' className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='hiiii'

              {...register("upload")}
            />
          </div>
          <div className='w-full'>
            <input
              type="file"
              id="imageUpload"
              className="hidden w-full"
              {...register("image")}
            />

            <label
              htmlFor="imageUpload"
              className="cursor-pointer px-4 py-3 border border-white/20 text-white w-full "
            >
              Upload Image
            </label>
          </div>


          <div>
            <button className='uppercase text-white text-sm py-4 tracking-wide font-ligth w-full bg-red-600'
              type='submit'
            // disabled={isSubmitting}
            >Create Meet</button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default MeetForm