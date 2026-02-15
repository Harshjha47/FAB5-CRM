import React, { useState } from 'react'
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { InputUnit } from '../Utils/InputUnit';
import { useParams } from 'react-router-dom';
import { useConnection } from '../../Context/ConnectionContext';

function AddIp() {
  const {addIp}=useConnection()
  const [Init,setInit]=useState({
    ip:"",
    cost:""
  })  
  const {ip,cost}=Init
  const {id,cid}=useParams()
  const handleChange=(e)=>{
    const {name,value}=e.target
    setInit({...Init,[name]:value})
  }
  const handleSubmit= async (e)=>{
    e.preventDefault()
    await addIp(id,Init)
  }


  return (
    <div className=' h-[70vh] flex justify-center items-center  border-black'>
        <form onSubmit={handleSubmit} className="p-4  bg-white  gap-4 border-[#0000ff73] shadow-2xl w-full items-start flex flex-col md:w-[40%] shadow-[#0000ff54] rounded-xl">
            <h3 className='text-2xl border border-[#0000ff73] bg-[#0000ff25] rounded-lg  text-[#000079] p-2 gap-2 '><MdOutlinePlaylistAdd/></h3>
            <div className=" w-full flex flex-col gap-2">
              <InputUnit
              type="number"
            placeholder="Number of IPs"
            name="ip"
            change={handleChange}
            value={ip}
              />
              <InputUnit
              type="number"
            placeholder="IP Charges"
            name="cost"
            change={handleChange}
            value={cost}
              />
            </div>
            <div className=" w-full flex justify-end">
              <button type='submit' className='border px-4 rounded-md bg-blue-600 text-white p-1'>Submit</button>
            </div>
            
        </form>
    </div>
  )
}

export default AddIp