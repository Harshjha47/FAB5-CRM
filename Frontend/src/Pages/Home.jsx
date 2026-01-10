import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Hero from '../Components/Home/Hero'
import { useAuth } from '../Context/AuthContext'

function Home() {
    const navigate=useNavigate()
    const {profileData}=useAuth()
  return (
    <main className=' w-full bg-[#fff] flex justify-between flex-col items-center gap-1'>
      <nav className=" h-[13vh] items-center font-semibold text-xs md:text-sm flex justify-center gap-3 w-[90%] ">
        <Link className='px-6 border p-2 rounded-xl bg-[#EBEDEC] ' to={`/`}>Home</Link>
       {profileData&&<Link className='px-6 border p-2 rounded-xl bg-[#EBEDEC] ' to={`/dashboard`}>Dashboard</Link>} 
       {!profileData&& <Link className='px-6 border p-2 rounded-xl bg-[#EBEDEC] ' to={`/auth/login`}>Login</Link>}
        {!profileData&&<Link className='px-6 border p-2 rounded-xl bg-[#EBEDEC] ' to={`/auth`}>Create account</Link>}
      </nav>
    <Hero/>
    </main>
  )
}

export default Home