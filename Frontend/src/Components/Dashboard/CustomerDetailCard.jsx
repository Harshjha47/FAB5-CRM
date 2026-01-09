import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'
import { useCustomer } from '../../Context/CustomerContext'
import { useParams } from 'react-router-dom'
import { formatDate } from '../../Services/dateFormat'
import ActionDetails from './ActionDetails'

function CustomerDetailCard({info}) {
  const [details, setDetails] = useState(true);
  const { customerInformation, setCustomerImformation, getCustomerById } =
      useCustomer();


  return (
           <article className='w-full border flex flex-col rounded'>
            <div className="w-full  p-2 flex justify-between items-center leading-[1]">
            <div className="">
                <h3 className='font-semibold'>{customerInformation?.name?.split(" ")[0]}</h3>
                <p className='text-xs text-zinc-400'>{customerInformation?.name}</p>
            </div>
            <div className="text-xs border rounded">
                <p className='p-2'>{info?.action}</p>
            </div>
            <div onClick={()=>setDetails(!details)} className="text-xs border rounded p-2">
                {details?<SlArrowDown/>:<SlArrowUp />}
            </div>
            </div>
            <div className={` ${details?"hidden":"flex"} text-sm`}>
                <ActionDetails logInfo={info}/>
            </div>


        </article>
  )
}

export default CustomerDetailCard