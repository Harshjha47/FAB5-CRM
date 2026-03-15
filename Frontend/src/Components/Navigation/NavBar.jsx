import React, { useEffect } from 'react'
import { useAuth } from '../../Context/AuthContext';
import { NavLink } from 'react-router-dom';
import { HamburgerMenu } from '../Icons/Icons';

function NavBar() {
  const {UserProfile}=useAuth()
  useEffect(()=>{
    UserProfile()
  },[])

  const list =[
    {
      name:"Home",
      url:"/",
      visible:true
    },
    {
      name:"Dashboard",
      url:"/dashboard",
      visible:true
    },
    {
      name:"Customer",
      url:"/customers",
      visible:true
    },
    {
      name:"Opportunity",
      url:"/connections",
      visible:true
    },
    {
      name:"Employees",
      url:"/employees",
      visible:true
    },
  ]
  return (
    <nav className='w-full h-[10vh] items-center px-8 justify-between  flex '>
      <section className='flex  gap-8'>
      <div className="cursor-pointer flex justify-center items-center"><HamburgerMenu/></div>
      <ul className=' flex  gap-8 '>
        {list?.map((e,i)=>{
          return (
            <li key={i} className=''><NavLink to={e.url}>{e.name}</NavLink></li>
         )
        })}
      </ul>
      </section>
      <section className=''>Hello, Harsh Jha</section>


    </nav>
  )
}

export default NavBar