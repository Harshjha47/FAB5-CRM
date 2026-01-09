import React, { useEffect } from 'react'
import ProfileTab from './ProfileTab'
import SearchBar from './SearchBar';
import Menu from './Menu';
import { useAuth } from '../../Context/AuthContext';

function NavBar() {
  const {UserProfile}=useAuth()
  useEffect(()=>{
    UserProfile()
  },[])
  return (
    <nav className='w-full h-[10vh] items-center flex  shadow shadow-zinc-100'>
        <ProfileTab/>
        <SearchBar/>
        <Menu/>
    </nav>
  )
}

export default NavBar