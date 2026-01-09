import React from 'react'
import { MdArrowForwardIos } from "react-icons/md";
import { MdSpeed, MdAutorenew, MdVisibility } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Hero() {
    const navigate=useNavigate()
  return (
    
        <section className=" overflow-hidden relative p-[70px] rounded-tl-[40px] rounded-tr-[40px] bg-[#EBEDEC] w-[95%] flex flex-col justify-center items-center">
            <div className="text-center w-[70%]  border-black flex flex-col gap-8  items-center">
                <div  className='bg-white p-1 pr-5 font-semibold rounded-full text-sm flex gap-2 items-center'><div className='p-2 px-3 rounded-full bg-[#D8FD59]'>Customer</div>  Disconnection & Retention Portal</div>
            
            <h1 className='text-8xl font-semibold'>Transform your workflow with us</h1>
            <p className='text-lg text-stone-700 w-[70%]'>Effortlessly manage the entire customer lifecycle—from disconnection requests to successful retention.</p>
            <button onClick={()=>navigate('/dashboard')} className=' shadow-lg hover:shadow-md transition-all duration-200 hover:shadow-[#858585] shadow-[#858585] px-10 rounded-xl font-semibold  p-4 bg-[#0e0e0e] flex gap-2 items-center  text-[#f1f1f1]'>Go to Dashboard <MdArrowForwardIos/></button>

            <div className=" shadow-xl relative z-10 border-[black] py-8 w-full  bg-white my-10 rounded-3xl flex justify-evenly ">
                <div className=" p-2 border-black flex flex-col gap-2 items-center">
                    <div className=" p-4 px-7 rounded-3xl flex justify-center items-center text-xl border"><MdSpeed/></div>
                    <h3 className=' text-sm font-semibold'>Efficiency</h3>
                    <p className=' text-sm text-stone-700'>Smart Workflow Management</p>
                </div>
                 <div className=" p-2 border-black flex flex-col gap-2 items-center">
                    <div className=" p-4 px-7 rounded-3xl flex justify-center items-center text-xl border"><MdAutorenew/></div>
                    <h3 className=' text-sm font-semibold'>Automation</h3>
                    <p className=' text-sm text-stone-700'>Automated Deadline Intelligence</p>
                </div>
                 <div className=" p-2 border-[#858585] flex flex-col gap-2 items-center">
                    <div className=" p-4 px-7 rounded-3xl flex justify-center items-center text-xl border"><MdVisibility/></div>
                    <h3 className=' text-sm font-semibold'>Transparency</h3>
                    <p className=' text-sm text-stone-700'>Complete Activity Audit</p>
                </div>
            </div>
            <div className="flex gap-4 absolute bottom-3 text-stone-600 text-xs">
                <div className="">Powerd by : {`<Div/>`}</div>
                <div className="">Developed by : {`</> Harsh jha`}</div>
            </div>
            </div>
                <div className=" shadow-2xl absolute bottom-0 border-t border-l p-2 right-0 w-[30%] h-[50%] rounded-tl-[200px] border-[#b4b4b438]"></div>
                <div className=" shadow-2xl absolute bottom-0 border-t border-r p-2 left-0 w-[30%] h-[50%] rounded-tr-[200px] border-[#b4b4b438]"></div>
        </section>
    
  )
}

export default Hero