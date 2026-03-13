import React from 'react'
import { useAuth } from '../../Context/AuthContext'
import ConnectionItem from './ConnectionItem'
import { useCustomer } from '../../Context/CustomerContext';
import Lists from '../Dashboard/Lists';
import CustomerCard from '../Dashboard/CustomerCard';
import { Search } from '../Icons/Icons';
import FlowNav from '../Dashboard/FlowNav';

function Connections() {
    const {allData} = useAuth()
    const subHeading = [
    {
      name: "UID",
      Active: true,
    },
    {
      name: "Name",
      Active: true,
    },
    {
      name: "Service",
      Active: true,
    },
    {
      name: "Status",
      Active: true,
    },
    {
      name: "Action",
      Active: true,
    },
  ];
          
  return (
      <section className="h-[90vh] mx-2 flex-[3] flex flex-col gap-2 rounded-xl overflow-hidden">
        <FlowNav />
      <div className=" w-full flex p-2 gap-2 ">
        <div className="bg-white flex items-center gap-2 p-2 rounded-xl flex-1"><span className="text-2xl "><Search/></span><input type="text" placeholder="Search" className="flex-1 text-lg px-2 outline-none"/></div>
        <div className="w-[30%]">
            <select name="" className="h-full rounded-xl outline-none w-full flex justify-center items-center pl-4" id="">
                <option value="" className="">All</option>
            </select>
        </div>
        
        
      </div>
      <div className=" w-full py-1  gap-2 flex">
        {subHeading?.map(
          (e, i) =>
            e.Active && <h3 key={i} className="flex-1 text-center">{e.name}</h3>,
        )}
      </div>
      
      <div className="w-full customScroller flex gap-2 flex-col h-[60%] overflow-auto ">
        {allData?.connections?.map((e,i)=>{
            return <ConnectionItem info={e} key={i} />
        })}

        </div>
    </section>
    
  )
}

export default Connections

    