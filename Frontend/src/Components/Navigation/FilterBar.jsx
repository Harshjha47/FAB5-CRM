import React from 'react'
import { Link } from 'react-router-dom'

function FilterBar() {
  return (
    <nav className='h-[10vh] w-full justify-center flex items-center'>
        {/* <ul className='w-[92%] flex gap-2 '>
            <Link className='px-3 text-sm py-1 rounded-md text-zinc-500 border hover:bg-zinc-100 transition-all duration-200'>All</Link>
            <Link className='px-3 text-sm py-1 rounded-md text-zinc-500 border hover:bg-zinc-100 transition-all duration-200'>Disconnections</Link>
            <Link className='px-3 text-sm py-1 rounded-md text-zinc-500 border hover:bg-zinc-100 transition-all duration-200'>Extended</Link>
            <Link className='px-3 text-sm py-1 rounded-md text-zinc-500 border hover:bg-zinc-100 transition-all duration-200'>Restrained</Link>
        </ul> */}

        
    </nav>
  )
}

export default FilterBar