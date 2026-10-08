import React, { useState } from 'react'
import loginImg from "../assets/carmeetLogin.png"
import AuthLayout from '../components/AuthLayout';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router';

function CompleteProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { completeProfile } = useAuth()

    const navigate = useNavigate()

   const handleSubmit = async(e) =>{

    e.preventDefault();
   
    try {
       setIsSubmitting(true);
        const data = await completeProfile({name, email})

        console.log("data",data);
        navigate("/")
    } catch (error) {
        console.log("error",error);
    }finally{
        setIsSubmitting(false);
    }
   }

  return (
     <div className='h-[calc(100dvh-4rem)] flex overflow-hidden'>
      <div className='md:w-6/12 hidden md:block h-full relative overflow-hidden'>
        <img src={loginImg} alt="Login" className='absolute inset-0 block h-full w-full object-cover' />
      </div>
      <div className='md:w-6/12 w-full h-full overflow-hidden bg-linear-to-r from-black to-black'>

        <AuthLayout title='Complete Profile' buttonText='Continue'>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6" >

            <div className='w-full flex flex-col gap-2'>
              <label 
              className='text-white text-xm font-medium uppercase tracking-widest'>Name</label>
              <input 
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/50' 
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="inpute"
              required 
              placeholder="Enter your name"
              />
            </div>
            <div className='w-full flex flex-col gap-2'>
            <label className='text-white text-xm font-medium uppercase tracking-widest'>email</label>
            <input 
            className='px-3 py-3 text-white w-full border-[0.5px] border-white/50'
            value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="inpute"
              required 
              placeholder="Enter your email"
            />
            </div>
            <div className='w-full flex justify-center items-center mt-6'>
              <button 
              className='uppercase text-white text-sm py-4 tracking-wide font-ligth w-full bg-red-600 '
              type='submit'
              disabled={isSubmitting}
              >{isSubmitting ? "Sending..." : "Continue"}</button>
            </div>
          </form>
        </AuthLayout>
      </div>
    </div>
  )
}

export default CompleteProfile