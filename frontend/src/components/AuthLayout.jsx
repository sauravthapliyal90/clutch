import React from 'react'
import { Link } from 'react-router'

function AuthLayout({
  title = "Login",
  subTitle = "WELCOME BACK",
  // buttonText = "Login",
  children,
  // footerText = "New here?",
  // footerLinkText = "Create an account",
  // footerLinkTo = "/register",

}) {
  return (
    <div className='w-full h-full px-16 flex flex-col items-start pt-16 gap-6'>
      <div className='flex flex-col gap-2'>
        <p className="text-red-500 uppercase tracking-[0.2em] text-sm font-light">{subTitle}</p>
        <h2 className=' text-white text-3xl font-bold uppercase'>{title}</h2>
      </div>
      <div className='w-full flex flex-col gap-6'>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout