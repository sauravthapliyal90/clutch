import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from 'react-router'

import {Footer} from './components/Footer'

function App() {

  return (
    <>
   <div className='bg-black w-full min-h-screen '>

     <Navbar/>
     {/* <Home/> */}
     <Outlet/>
     <Footer/>
   </div>
    </>
  )
}

export default App
