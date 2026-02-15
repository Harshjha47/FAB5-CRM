import React, { useState } from 'react'
import { useAuth } from '../../Context/AuthContext'
import { FaCheck } from "react-icons/fa6";
import { InputUnit } from '../Utils/InputUnit';
import { useConnection } from '../../Context/ConnectionContext';

function ConnectionStatus({info}) {
    const { profileData, getAllUser, allProfileData } = useAuth();
      const {approveConnection,activeConnection,auditConnection}=useConnection()
      const [init, setInit] = useState({
        fabCircuitId: "",
        talcoCircuitId: "",
      });
      const { fabCircuitId, talcoCircuitId } = init;
      const handleChange = (e) => {
        const { name, value } = e.target;
        setInit({ ...init, [name]: value });
      };
      const handleSubmit=(e)=>{
        e.preventDefault()
        activeConnection(info?._id,init)
      }

    const project=(profileData?.role === "project" || profileData?.role === "admin") && info?.status === "Generation"
    const generation=(profileData?.role === "generation" || profileData?.role === "admin") && info?.status === "Approved"
    const owner=(profileData?.role === "owner" || profileData?.role === "admin") && info?.status === "Pending"
    
  return (
    <div className="border border-[#99999910] bg-[#fff] shadow-md p-5 rounded-2xl items-start flex flex-col gap-3">
            <div className=" w-full flex justify-between  items-center"> <span className='border px-3 rounded-md'>{info?.status}</span><span className=''>
              {(generation||owner||(project&&info?.circuitId))?<div onClick={()=>auditConnection(info._id)} className="flex justify-center items-center border-green-200 border bg-[#00e9001a] text-[#00e900] cursor-pointer p-1 rounded  gap-2"><FaCheck/></div>:""}  
                </span></div>
            <div className="">
              <div className="text-xl ">{info?.bandwidth}Mbps</div>
            <div className="font-semibold text-[#363636]">{info?.serviceType} / {info?.technicalDetails?.telcoProvider}</div>
    
            </div>
    
            <div className="flex justify-between w-full">
              <div className=" flex-1 flex flex-col items-start">
                <div className="">A End : {info?.technicalDetails?.aEnd?.btsId}</div>
                <div className="border text-sm px-2 rounded-md">{info?.technicalDetails?.aEnd?.address}</div>
              </div>
              <div className=" flex-1 flex flex-col items-start">
                <div className="">B End : {info?.technicalDetails?.bEnd?.btsId}</div>
                <div className="border text-sm px-2 rounded-md">{info?.technicalDetails?.bEnd?.address}</div>
              </div>
            </div>

            {(profileData?.role=="generation"||profileData?.role=="project")?"":<div className="w-full">
              <div className="flex justify-between"><span>mrc</span><span>{info?.commercials?.mrc}</span></div>
              <div className="flex justify-between"><span>Rate per Mb</span><span>{info?.commercials?.ratePerMb}</span></div>
              <div className="flex justify-between"><span>One time Charge</span><span>{info?.commercials?.otc}</span></div>
              <div className="flex justify-between"><span>Advance</span><span>{info?.commercials?.advance}</span></div>
            </div>}
            {(!info?.circuitId&&project)?
            <form action="" onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          <InputUnit
            type="text"
            placeholder="FAB Circuit ID"
            name="fabCircuitId"
            value={fabCircuitId}
            change={handleChange}
          />
          <InputUnit
            type="text"
            placeholder="Telecom Circuit ID"
            change={handleChange}
            name="talcoCircuitId"
            value={talcoCircuitId}
          />
          <button
            type="submit"
            className="border p-2 rounded-md text-white font-semibold bg-green-500"
          >Activate
          </button>
        </form>:""}
    
            
    
            {
            info?.status == "Notice Period" &&
             <div className="w-full">
              <div className="flex justify-between"><span>Final date</span><span>{formatDate( info?.terminationDetails?.finalDate)}</span></div>
              <div className="flex justify-between"><span>Raise date</span><span>{formatDate(info?.terminationDetails?.raiseDate)}</span></div>
              <div className="flex justify-between"><span>Reason</span><span>{info?.terminationDetails?.reason}</span></div>
            </div>}
    
    
            
          </div>
  )
}

export default ConnectionStatus