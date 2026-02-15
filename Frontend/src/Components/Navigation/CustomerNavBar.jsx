import React, { useState } from 'react'
import { SlArrowLeft } from "react-icons/sl";
import { Link, useParams } from 'react-router-dom';
import { useCustomer } from '../../Context/CustomerContext';
import { IoAdd } from "react-icons/io5";

function CustomerNavBar() {
  const [tog,setTog]=useState(false)
  const {customerInformation}=useCustomer()
  const status= customerInformation?.activityLog?.at(-1).action
  const {id}=useParams()
  return (
    <nav className='w-full h-[10vh] flex items-center px-3  justify-between'>
        <Link to={"/dashboard"} className='h-[65%] flex gap-2  leading-[1] items-center'>
            <div className="h-full aspect-square border flex justify-center items-center rounded-full bg-white"><SlArrowLeft/></div>
            <div className="text-sm">Dashboard</div>
        </Link>
        <Link to={"create"} className='h-[65%] flex gap-2  leading-[1] items-center'>
            <div className="border p-3 px-4 rounded-lg bg-[#fff] shadow-md flex gap-2 items-center"><IoAdd/>Add Connection</div>
        </Link>

        
    </nav>
  )
}

export default CustomerNavBar