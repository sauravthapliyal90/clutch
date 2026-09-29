import React, { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import loginImg from "../assets/carmeetLogin.png"
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthProvider';

function VerifyOtp() {

  const navigate = useNavigate();

  const { verifyOtpAuth } = useAuth()

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      const data = await verifyOtpAuth(otp)
      console.log("success",data, data.status === 'LOGGED_IN')

      if(data.status === 'LOGGED_IN') {
          navigate("/");
        }else{
          navigate("/request-otp/verify/complete-profile")
        }

    } catch (error) {
     console.log("error",error);
        
    }finally{
      setIsSubmitting(false)
    }
  }


  return (
    <div className='h-[calc(100dvh-4rem)] flex overflow-hidden'>
      <div className='md:w-6/12  hidden md:block h-full relative overflow-hidden'>
        <img src={loginImg} alt="Login" className='absolute inset-0 block h-full w-full object-cover' />
      </div>
      <div className='md:w-6/12 w-full h-full overflow-hidden bg-linear-to-r from-black to-black'>

        <AuthLayout title='Confirm phone number' subTitle='Join the Crew' buttonText='Continue'>
          <form className='w-full flex flex-col gap-6' onSubmit={handleSubmit}>

            <div className='w-full flex flex-col gap-2'>
              <label className='text-white text-xm font-medium uppercase tracking-widest'>ENTER OTP</label>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="tel"
                inputMode="numeric"
                required
                placeholder="Enter the OTP"
                className='px-3 py-3 text-white w-full border-[0.5px] border-white/50' maxLength={6}
              />
            </div>
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

export default VerifyOtp