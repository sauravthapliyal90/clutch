import React, { useEffect, useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import loginImg from "../assets/carmeetLogin.png"
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router'

function RequestOtp() {
   
  const navigate = useNavigate();
  
  const { requestOtpAuth } = useAuth()

  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await requestOtpAuth(phone);
      console.log("OTP requested successfully");
      navigate("/request-otp/verify")
     
    } catch (error) {
      console.error("Failed to request OTP:", error);
    }finally{
      setIsSubmitting(false);
    }

  }

  return (
    <div className='h-[calc(100dvh-4rem)] flex overflow-hidden'>
      <div className='md:w-6/12  hidden md:block h-full relative overflow-hidden'>
        <img src={loginImg} alt="Login" className='absolute inset-0 block h-full w-full object-cover' />
      </div>
      <div className='md:w-6/12 w-full h-full overflow-hidden bg-linear-to-r from-black to-black'>

        <AuthLayout title='Sign in' buttonText='Sign in'>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6" >

            <div className='w-full flex flex-col gap-2'>
              <label 
              className='text-white text-xm font-medium uppercase tracking-widest'>Phone number</label>
              <input 
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/50' 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              inputMode="numeric"
              required 
              placeholder="Enter phone number"
              />
            </div>
            {/* <div className='w-full flex flex-col gap-2'>
            <label className='text-white text-xm font-medium uppercase tracking-widest'>Password</label>
            <input className='px-3 py-3 text-white w-full border-[0.5px] border-white/50'/>
            </div> */}
            <div className='w-full flex justify-center items-center mt-6'>
              <button 
              className='uppercase text-white text-sm py-4 tracking-wide font-ligth w-full bg-red-600 '
              type='submit'
              disabled={isSubmitting}
              >{isSubmitting ? "Sending..." : "Request OTP"}</button>
            </div>
          </form>
        </AuthLayout>
      </div>
    </div>
  )
}

export default RequestOtp