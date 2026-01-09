import React from 'react'
import NavBar from '../Components/Navigation/NavBar'
import FilterBar from '../Components/Navigation/FilterBar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  return (
    <main className='h-screen flex flex-col w-full px-2'>
        <NavBar/>
        <FilterBar/>
        <section className='flex-1  overflow-y-scroll customScroller'>
        <Outlet/>
        </section>
    </main>
  )
}

export default Dashboard