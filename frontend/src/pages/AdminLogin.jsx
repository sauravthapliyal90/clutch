import React, { useEffect, useState } from 'react'
import AuthLayout from '../components/AuthLayout'
import loginImg from "../assets/carmeetLogin.png"
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router';

function AdminLogin() {
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
      const [isSubmitting, setIsSubmitting] = useState(false);

      const navigate = useNavigate();
      
      const {adminLogin} = useAuth();
      

      const handleSubmit = async(e) => {
        console.log(username, password,"--pass");
        
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await adminLogin(username,password)
            navigate("/")
        } catch (error) {
            console.log("Invalid Credintial", error)
        }finally{
            setIsSubmitting(false)
        }
      }

  return (
     <div className='h-[calc(100dvh)] flex overflow-hidden'>
      <div className='md:w-6/12  hidden md:block h-full relative overflow-hidden'>
        <img src={loginImg} alt="Login" className='absolute inset-0 block h-full w-full object-cover' />
      </div>
      <div className='md:w-6/12 w-full h-full overflow-hidden bg-linear-to-r from-black to-black'>

        <AuthLayout title='Sign In Admin Only' buttonText='Sign in'>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6" >

            <div className='w-full flex flex-col gap-2'>
              <label 
              className='text-white text-xm font-medium uppercase tracking-widest'>Username</label>
              <input 
              className='px-3 py-3  placeholder:text-white/50 text-white w-full border-[0.5px] border-white/50' 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              placeholder="Enter Username"
              />
            </div>

            <div className='w-full flex flex-col gap-2'>
            <label className='text-white text-xm font-medium uppercase tracking-widest'>Password</label>
            <input 
            className='px-3 py-3 text-white w-full border-[0.5px] border-white/50'
            placeholder='Enter Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            
            <div className='w-full flex justify-center items-center mt-6'>
              <button 
              className='uppercase text-white text-sm py-4 tracking-wide font-ligth w-full bg-red-600 '
              type='submit'
              disabled={isSubmitting}
              >{isSubmitting ? "Sign In..." : "Sign In"}</button>
            </div>
          </form>
        </AuthLayout>
      </div>
    </div>
  )
}

export default AdminLogin