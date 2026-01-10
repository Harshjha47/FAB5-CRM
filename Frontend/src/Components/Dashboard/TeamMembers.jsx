import React from 'react'
import { CiUser } from 'react-icons/ci'

function TeamMembers({information}) {
  return (
    <article className="border rounded-2xl p-2">
        <div className=" w-full flex gap-2 md:flex-col md:justify-center items-center">
        <div className="  h-[8vh] md:w-full md:h-auto md:rounded-2xl rounded-full md:aspect-auto md:p-4 flex text-white text-3xl justify-center items-center bg-slate-300  aspect-square">
            <CiUser/>
        </div>
          <div className="flex flex-col md:w-[85%]  flex-1 justify-center leading-[1]">
            <h1 className="font-semibold w-full flex justify-between items-center">{information?.name} <span className="text-sm text-stone-500 font-normal">{information?.role}</span></h1>
            <p className="text-sm text-stone-500">{information?.email}</p>
            <p className="text-xs text-stone-500">+91 {information?.phone}</p>
          </div>
        </div>
      </article>
  )
}

export default TeamMembers