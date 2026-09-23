import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router'


function App() {

  return (
    <>
   <div className='bg-black w-full min-h-screen '>

     <Navbar/>
     {/* <Home/> */}
     <Outlet/>
   </div>
    </>
  )
}

export default App
