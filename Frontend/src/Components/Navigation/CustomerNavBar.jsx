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
        {/* <section className="flex items-center relative">
          <div className="text-xl" onClick={()=>setTog(!tog)}>
            {tog?<RxCross1/>:<CiMenuFries/>}
          </div>
          {tog &&
           <div className="flex absolute flex-col border bg-white top-[140%] z-50 right-0 rounded-2xl">
            
           {status=="RETAINED"&&<Link onClick={()=>setTog(!tog)} to={`/customer/${id}/disconnect`} className='border-b px-8 py-2 '>Disconnect</Link>} 
            {status!="RETAINED"&&<Link onClick={()=>setTog(!tog)} to={`/customer/${id}/extend`} className='border-b px-8 py-2 '>Extend</Link>}
            {status!="RETAINED"&&<Link onClick={()=>setTog(!tog)} to={`/customer/${id}/retain`} className='border-b px-8 py-2 '>Retain</Link>}
            <Link onClick={()=>setTog(!tog)} to={`/customer/${id}/transfer`} className=' px-8 py-2 '>Transfer</Link>
            </div>
          }
         
        </section> */}
        
    </nav>
  )
}

export default CustomerNavBar