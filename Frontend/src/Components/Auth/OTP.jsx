import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {InputUnit} from "../Utils/InputUnit";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";

function OTP() {
  const [otp, setOtp] = useState();
  const navigate = useNavigate();
  const { resendCode, registerData, RegisterUser, otpData } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOtp(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otpData == otp) {
      await RegisterUser(registerData);
      navigate("/profile");
    } else {
      toast.error("Enter valid code");
    }
  };
  return (
    <>
      <form
        action=""
        onSubmit={handleSubmit}
        className=" flex flex-col p-2 w-full  md:w-[75%] gap-3 "
      >
        <div className="w-full flex flex-col justify-center items-center py-4 ">
          <h2 className="font-serif font-light text-4xl">Verify Code</h2>
          <p className="text-xs">Enter 4 digit code sent to your email</p>
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
        <div
          className="w-full flex px-1 justify-end text-sm cursor-pointer"
          onClick={() => resendCode()}
        >
          Resend
        </div>

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

export default OTP;
