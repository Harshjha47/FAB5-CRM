import React, { useState } from "react";
import {InputUnit} from "../Utils/InputUnit";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate= useNavigate()
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const {EditProfile}=useAuth()
  const init = {
    name: "",
    dob: "",
    phone: "",
    adharNumber: "",
    panNumber: "",
  };
  const [details, setDetails] = useState(init);
  const { name, dob, phone, adharNumber, panNumber } = details;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails({ ...details, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await EditProfile(details)
    navigate("/dashboard")
  };
  return (
    <main className="h-screen w-full flex justify-center items-center bg-[#EBEDEC]">
    <section className="h-[95%] border-black  bg-white rounded-[38px] flex justify-between w-[95%] md:w-[60%] p-2">
        <aside className="h-full w-[48%]  rounded-[30px] bg-[#111] p-8 justify-between hidden md:flex flex-col text-white">
        <div className="w-[80%] flex items-center gap-3 uppercase ">
          start with <div className="border-b flex-1"></div>
        </div>
        <div className="w-[80%]">
          <h1 className="font-serif font-thin text-4xl">
            Hello! Create account to get started
          </h1>
          <p className="text-[10px] flex flex-col leading-[1.1] pt-2">
            <span>Developed by : {`</> Harsh Jha`}</span>
            <span>Powerd by : {`</Div>`}</span>
          </p>
        </div>
      </aside>
      <section className="h-full w-[51%] rounded-[30px] flex flex-col justify-between items-center">
        <div className="p-2">{``}</div>
        <form
          action=""
          onSubmit={handleSubmit}
          className="  flex flex-col p-2 w-full  md:w-[75%] gap-3"
        >
          <div className="w-full flex flex-col justify-center items-center py-4 ">
            <h2 className="font-serif font-light text-3xl">Personal Details</h2>
            <p className="text-xs">
              Enter email and password to create an account
            </p>
          </div>
          <InputUnit
            type="text"
            placeholder="Enter your Name"
            name="name"
            label="Full Name"
            change={handleChange}
            value={name}
          />
          <InputUnit
            type={"text"}
            placeholder="Enter your phone number"
            name="phone"
            value={phone}
            change={handleChange}
            label="Phone Number"
          />
          <InputUnit
            type={"date"}
            placeholder=""
            name="dob"
            label="Date of Birth"
            value={dob}
            change={handleChange}
            max={getTodayString()}
          />
          <InputUnit
            type={"text"}
            placeholder="Enter your adhar number"
            name="adharNumber"
            value={adharNumber}
            change={handleChange}
            label="Adhar Number"
          />
          <InputUnit
            type={"text"}
            placeholder="Enter your pen number"
            name="panNumber"
            value={panNumber}
            change={handleChange}
            label="Pan Number"
          />
          <div className="py-3 w-full  flex justify-center items-center">
            <button
              type="submit"
              className="w-full border p-[10px] rounded-md bg-[#111] text-white "
            >
              Save
            </button>
          </div>
        </form>
        <div className="text-xs p-2">
          {/* Already have an account ? <Link to={`/auth`} className=" cursor-pointer font-semibold">Sign in</Link> */}
        </div>
      </section>
    </section>
    </main>
  );
}

export default Profile;
