import React, { useState } from "react";
import InputUnit from "../Utils/InputUnit";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate=useNavigate()
    const {requestReset,status, setStatus,otpData,resetPassword,resendCode}=useAuth()
  const init = {
    email: "",
    otp: "",
    password: "",
    conformPassword: "",
  };
  const [details, setDetails] = useState(init);
  const [tog, setTog] = useState(false);
  const { email, otp, password, conformPassword } = details;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
    if(name=='otp'&&value==otpData){
        setStatus(4)
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(status==4){
        if(password==conformPassword){
        resetPassword(details)
        navigate('/auth/login')
        }else{
            toast.error("password must match")
        }
    }else{
        requestReset(details)
    }
  };
  return (<>
        <form
          action=""
          onSubmit={handleSubmit}
          className=" flex flex-col p-2 w-full  md:w-[75%] gap-3"
        >
          <div className="w-full flex flex-col justify-center items-center py-4 ">
            <h2 className="font-serif font-light text-4xl">Reset password</h2>
          </div>
          <InputUnit
            type="email"
            placeholder="Enter your Email"
            name="email"
            label="Email"
            value={email}
            change={handleChange}
          />

          {status&&
          <div className="flex flex-col">
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
          </div>
          }
          {status==4&&<InputUnit
              type={tog ? "text" : "password"}
              placeholder="Create a new password"
              name="password"
              label="New Password"
              value={password}
              change={handleChange}
            />}
            
         {status==4&& <div className="w-full ">
            
            <InputUnit
              type={tog ? "text" : "password"}
              placeholder="Match your password"
              name="conformPassword"
              label="Match password"
              value={conformPassword}
              change={handleChange}
            />
            <div className="flex justify-between px-2 leading-[1] text-sm pt-1">
              <div
                className=" flex gap-1 items-center"
                onClick={() => {
                  setTog(!tog);
                }}
              >
                {tog ? (
                  <span className="text-base text-blue-500">
                    <MdCheckBox />
                  </span>
                ) : (
                  <span className="text-base ">
                    <MdCheckBoxOutlineBlank />
                  </span>
                )}
                Show password
              </div>
            </div>
          </div>}
          <div className="py-3 w-full  flex justify-center items-center">
            <button className="w-full border p-[10px] rounded-md bg-[#111] text-white ">
              Enter
            </button>
          </div>
        </form>
        <div className="text-xs p-2"></div>
        </>
  );
}

export default ResetPassword;
