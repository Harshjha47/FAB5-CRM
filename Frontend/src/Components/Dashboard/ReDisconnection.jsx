import React, { useState } from 'react'
import {InputUnit} from '../Utils/InputUnit'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SlArrowLeft } from 'react-icons/sl'
import { MdMoreTime } from 'react-icons/md'
import { VscDebugDisconnect } from "react-icons/vsc";
import { AiOutlineDisconnect } from "react-icons/ai";
import { useCustomer } from '../../Context/CustomerContext'

function ReDisconnection() {
    const {id}=useParams()
    const navigate=useNavigate()
    const [details,setDetails]=useState()
    const {redisconnection,getCustomerById}=useCustomer()
      const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getLastString = () => {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    return today.toISOString().split("T")[0];
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(value);
  };
    const handleSubmit=(e)=>{
      e.preventDefault()
      redisconnection(id,{reason:details})
      getCustomerById(id)
      navigate(`/customer/${id}`)
    }
  return (
    
    <section className="h-full w-full flex justify-center relative items-center">
      <Link
        to={`/customer/${id}`}
        className={` absolute top-2 left-2 flex justify-center gap-2  items-center`}
      >
        {" "}
        <div className="p-2 rounded-full border">
          <SlArrowLeft />{" "}
        </div>
        Back
      </Link>
      <div className="  rounded-lg  md:w-[40%] border shadow-[#ffb1b131] shadow-xl border-[#88888818] p-4 flex flex-col gap-3 items-start">
        <h3 className="p-3 rounded-lg text-2xl text-red-600 bg-[#ffc8c838]">
          <AiOutlineDisconnect />

        </h3>
        <div className="w-full">
          <h4 className="font-semibold">You want to raise disconnecction ?</h4>
          <p className="text-sm"> </p>
          <form
            action=""
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-3"
          >
            <InputUnit
            type="date"
            name="date"
            label="Raise Date"
            prop={true}
            value={getTodayString()}
          />
          <InputUnit
            type="date"
            name="newDate"
            label="Disconnection Date"
            prop={true}
            value={getLastString()}
          />
          <div className="">
            <label htmlFor="reason" className="pl-1 text-sm">
              Reason for disconnection
            </label>
            <textarea
              name="reason"
              required
              id="reason"
              placeholder="Reason"
              value={details}
              onChange={handleChange}
              className=" resize-none w-full border px-2 customScroller rounded-md outline-none"
            ></textarea>
          </div>

            <div className="w-full flex gap-2 justify-end py-3">
              <Link

                to={`/customer/${id}`}
                className="px-5 rounded-md p-1 border border-zinc-400"
              >
                Cancel
              </Link>
              <button className="px-5 rounded-md p-1 border bg-red-600 text-white border-red-400 hover:bg-red-800">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ReDisconnection