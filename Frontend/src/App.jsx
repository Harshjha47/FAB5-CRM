import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
    {/* <div className="fixed h-screen w-full top-0 flex justify-center items-center bg-white z-50 lg:hidden lg:h-0 lg:w-0">
      This Site doesn't support phones and tabs yet
    </div> */}
    <Toaster/>
    <Outlet/>
    </>
  )
}

export default App