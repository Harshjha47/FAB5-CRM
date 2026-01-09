import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import InputUnit from '../Utils/InputUnit';
import toast from 'react-hot-toast';
import { useAuth } from '../../Context/AuthContext';

function OTP() {
    const [otp,setOtp]=useState()
    const navigate=useNavigate()
        const {resendCode,registerData,RegisterUser,otpData}=useAuth()
    
    const handleChange=(e)=>{
        const {name,value} =e.target
        setOtp(value)
    }
    const handleSubmit= async (e)=>{
        e.preventDefault()
        if(otpData==otp){
          await RegisterUser(registerData)
          navigate('/profile')
        }else{
          toast.error('Enter valid code')
        }
    }
  return (
    <section className="h-[95%] border-black  bg-white rounded-[38px] flex justify-between w-[60%] p-2">
      <aside className="h-full w-[48%]  rounded-[30px] bg-[#111] p-8 justify-between flex flex-col text-white">
        <div className="w-[80%] flex items-center gap-3 uppercase ">
          start with <div className="border-b flex-1"></div>
        </div>
        <div className="w-[80%]">
          <h1 className="font-serif font-thin text-4xl">
            Hello! Verify Code to get started
          </h1>
          <p className="text-[10px] flex flex-col leading-[1.1] pt-2">
            <span>Developed by : {`</> Harsh Jha`}</span>
            <span>Powerd by : {`</Div>`}</span>
          </p>
        </div>
      </aside>
      <section className="h-full w-[51%] rounded-[30px] flex flex-col justify-between items-center">
        <div className="p-2">{``}</div>
        <form action="" onSubmit={handleSubmit} className=" flex flex-col p-2 w-[75%] ">
          <div className="w-full flex flex-col justify-center items-center py-4 ">
            <h2 className="font-serif font-light text-4xl">Verify Code</h2>
            <p className="text-xs">
              Enter 4 digit code sent to your email
            </p>
          </div>
          <InputUnit
            type="text"
            placeholder="Enter your OTP"
            name="otp"
            label="Enter valid code"
            value={otp}
            change={handleChange}
            maxLength={4}
          />
          <div className="w-full flex px-1 justify-end text-sm cursor-pointer" onClick={()=>resendCode()}>Resend</div>

          <div className="py-3 w-full  flex justify-center items-center">
            <button className="w-full border p-[10px] rounded-md bg-[#111] text-white ">
              Enter
            </button>
          </div>
        </form>
        <div className="text-xs p-2">
        </div>
      </section>
    </section>
  );
}

export default OTP