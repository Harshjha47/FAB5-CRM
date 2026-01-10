import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../Services/dateFormat';

function CustomerCard({information}) {
    const mobdate =formatDate(information?.currentDisconnectDate).split(",")[0]
    
  return (<>
    <Link to={`/customer/${information?._id}`} className=' hidden md:block p-4 shadow rounded-2xl border hover:shadow transition-all duration-200'>
    <div className="w-full flex h-[8vh] justify-between leading-[1] items-start">
        <div className="flex justify-center items-center rounded-lg uppercase text-white text-xl bg-slate-400 h-full aspect-square">{information?.name?.split(" ")[0].split("")[0]}</div>
        <div className={`border px-3 py-[2px] ${information?.status=='Active'&&'bg-green-400'} ${information?.status=='Pending Disconnection'&&'bg-orange-400'} ${information?.status=='Disconnected'&&'bg-red-400'} text-white rounded-md flex justify-center items-center text-sm`}>{information?.status}</div>
    </div>
    <div className="w-full py-3 flex flex-col justify-center leading-[1] px-1">
        <h3 className='text-lg font-semibold'>{information?.name?.split(" ")[0]}</h3>
        <p className='text-xs text-zinc-500 '>{information?.name} </p>
    </div>
    <div className="w-full flex justify-between gap-2 flex-col ">
        <div className="w-full flex justify-between gap-2 h-[8vh] ">
            <div className="h-full flex-1 border border-dashed rounded-lg flex flex-col justify-center pl-3 leading-[1]">
                <div className="font-semibold">{formatDate(information?.currentDisconnectDate)}</div>
                <div className="text-xs font-semibold text-zinc-400">Last Date</div>
            </div>
            <div className="h-full flex-1 border border-dashed rounded-lg flex flex-col justify-center pl-3 leading-[1]">
                <div className="font-semibold">{information?.btsId}</div>
                <div className="text-xs font-semibold text-zinc-400">BTS ID</div>
            </div>
        </div>
        <div className="h-[8vh] border border-dashed rounded-lg flex flex-col justify-center pl-3 leading-[1]">
                <div className="font-semibold">{information?.circuitId}</div>
                <div className="text-xs font-semibold text-zinc-400">Circuit Id</div>
            </div>
    </div>

    </Link>
    <Link to={`/customer/${information?._id}`} className='flex flex-col md:hidden p-2 shadow rounded-xl border hover:shadow transition-all duration-200'>
        <div className="flex justify-center items-center rounded-lg uppercase text-white text-xl bg-slate-400 w-full aspect-square relative">
            {information?.name?.split(" ")[0].split("")[0]}
            <div className={` absolute bottom-[-5%] ${mobdate=='N/A'?"bg-green-400":"bg-slate-400"}  rounded-full leading-[1] p-[2px] border px-2 text-xs capitalize `}>{mobdate=='N/A'?"Active":mobdate} </div>

        </div>
        <p className='text-xs  text-zinc-800 font-semibold text-center pt-1'>{information?.name} </p>

    </Link>
    </>
  )
}

export default CustomerCard