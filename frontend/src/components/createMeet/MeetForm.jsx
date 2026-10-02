import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form'

function MeetForm({ createMeet, uploadFile }) {

  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    try {
      console.log("form data:", data);

      const file = data.bannerImage?.[0]

      console.log("file data:", file);

      if (!file) {
        throw new Error("Banner image is required");
      }
      console.log("file2222 data:",);


      const { data: uploadData } = await uploadFile.mutateAsync({
        context: "meet-banner",
        contentType: file.type,
      });


      console.log("uploaddata:", uploadData);
      const { uploadUrl, key } = uploadData

      const result = await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      const { bannerImage, ...meetData } = data;

      // 4. Create meet
      await createMeet.mutateAsync({
        ...meetData,
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
        maxParticipants: Number(data.maxParticipants),
        bannerImageKey: key,
      });

      console.log("Meet created successfully");
    } catch (error) {
      console.error("Failed to create meet:", error);
    }
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
              required
              {...register("title", { required: true })}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-white text-md font-light h-fit uppercase'>Location</label>
            <input
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='Sector 48, Gurugram'

              {...register("location", { required: true })}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-white text-md font-light h-fit uppercase'>Date</label>
            <input
              type='datetime-local'
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='UK0718755'
              {...register("date", { required: true })}
            />

          </div>

          <div className="flex flex-col gap-2">
            <label className="text-white text-md font-light uppercase">
              Registration Deadline
            </label>

            <input
              type="datetime-local"
              className="px-3 py-3 text-white w-full border-[0.5px] border-white/20"
              {...register("registrationDeadline", {
                required: true,
              })}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-white text-md font-light h-fit uppercase'>Description</label>
            <textarea
              type='textarea'
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='describe'
              {...register("description", { required: true })}
            ></textarea>

          </div>
          <div className='grid grid-cols-2 gap-3'>


            <div className='flex flex-col gap-2'>
              <label className='text-white text-md font-light h-fit uppercase'>latitude</label>
              <input
                type='number'
                step="any"
                className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
                placeholder='77.2090° E'
                {...register("latitude", { valueAsNumber: true })}
              />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='text-white text-md font-light h-fit uppercase'>longitude</label>
              <input
                type='number'

                className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
                placeholder='28.6139° N'
                {...register("longitude", { valueAsNumber: true })}

              />
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-white text-md font-light h-fit uppercase'>Max Participants</label>
            <input
              type='number'
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='10'
              min={1}
              {...register("maxParticipants", { required: true, valueAsNumber: true })}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-white text-md font-light h-fit uppercase'>Banner Image</label>
            <input
              type='file' className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/20'
              placeholder='hiiii'

              {...register("bannerImage", { required: true })}
            />
          </div>
          {/* <div className='w-full'>
            <input
              type="file"
              id="imageUpload"
              className="hidden w-full"
              {...register("bannerImageUrl")}
            />

            <label
              htmlFor="imageUpload"
              className="cursor-pointer px-4 py-3 border border-white/20 text-white w-full "
            >
              Upload Image
            </label>
          </div> */}


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