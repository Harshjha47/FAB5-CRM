import React, { useState } from 'react'
import { PiRepeatFill } from 'react-icons/pi'
import { SlArrowLeft } from 'react-icons/sl'
import { TbTransfer } from "react-icons/tb";

import { Link, useNavigate, useParams } from 'react-router-dom'
import { useCustomer } from '../../Context/CustomerContext';
import InputUnit from '../Utils/InputUnit';

function Transfer() {
  const {id}=useParams()
  const navigate=useNavigate()

  const [details,setDetails]=useState()
    const {transfer,getCustomerById}=useCustomer()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(value);
  };
    const handleSubmit=(e)=>{
      e.preventDefault()
      transfer(id,{empMail:details})
      getCustomerById(id)
      navigate(`/customer/${id}`)
    }

  return (
        <section className='h-full w-full flex justify-center relative items-center'>
      <Link to={`/customer/${id}`} className={` absolute top-2 left-2 flex justify-center gap-2  items-center`}> <div className="p-2 rounded-full border"><SlArrowLeft/> </div>Back</Link>
      <div className="  rounded-lg  md:w-[40%] border shadow-[#b1b1ff9a] shadow-xl border-[#88888818] p-4 flex flex-col gap-3 items-start">
       <h3 className='p-3  rounded-lg text-xl text-blue-600 bg-[#c8c8ff38]'><TbTransfer/></h3>
       <div className="w-full">
        <h4 className='font-semibold'>You want to transfer customer ?</h4>
        <p className='text-sm'> </p>
        <form action="" onSubmit={handleSubmit} className='w-full flex flex-col gap-3'>
       <InputUnit
            type="email"
            placeholder="Transfer to"
            name="email"
            label="Enter email of employee."
            change={handleChange}
            value={details}
          />
       
       <div className="w-full flex gap-2 justify-end py-3">
        <Link to={`/customer/${id}`}  className='px-5 rounded-md p-1 border border-zinc-400'>Cancel</Link>
        <button  className='px-5 rounded-md p-1 border bg-blue-600 text-white border-blue-400 hover:bg-blue-800'>Transfer</button>
       </div>
        </form>
        </div>


      </div>
    </section>
  )
}

export default Transfer