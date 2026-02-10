import React, { useState } from 'react'
import { SlArrowLeft } from "react-icons/sl";
import { CiMenuFries } from "react-icons/ci";
import { Link, useParams } from 'react-router-dom';
import { RxCross1 } from "react-icons/rx";
import { useCustomer } from '../../Context/CustomerContext';
function CustomerNavBar() {
  const [tog,setTog]=useState(false)
  const {customerInformation}=useCustomer()
  const status= customerInformation?.activityLog?.at(-1).action
  const {id}=useParams()
  return (
    <nav className='w-full h-[10vh] flex items-center px-3  justify-between'>
        <Link to={"/dashboard"} className='h-[65%] flex gap-2  leading-[1] items-center'>
            <div className="h-full aspect-square border flex justify-center items-center rounded-full"><SlArrowLeft/></div>
            <div className="text-sm">Dashboard</div>
        </Link>
        <Link to={"create"} className='h-[65%] flex gap-2  leading-[1] items-center'>
            <div className="border p-2 px-3 rounded-md bg-[#eeeeee]">Add Connection</div>
        </Link>

        
    </nav>
  )
}

export default CustomerNavBar