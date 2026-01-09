import React, { useEffect, useState } from "react";
import { SlArrowLeft } from "react-icons/sl";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdMoreTime } from "react-icons/md";
import InputUnit from "../Utils/InputUnit";
import { useCustomer } from "../../Context/CustomerContext";
import { useAuth } from "../../Context/AuthContext";

function Extend() {
  const { id } = useParams();
  const {profileData}= useAuth()
    const navigate= useNavigate()

  const { customerInformation,extension,getCustomerById } = useCustomer();


  const [details, setDetails] = useState();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    extension(id, {newDate:details});
    navigate(`/customer/${id}`)
    getCustomerById(id)
  };
  const minDate = customerInformation?.currentDisconnectDate.split('T')[0];
  
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
      <div className="  rounded-lg  w-[40%] border shadow-[#b1b1ff9a] shadow-xl border-[#88888818] p-4 flex flex-col gap-3 items-start">
        <h3 className="p-3 rounded-lg text-2xl text-blue-600 bg-[#c8c8ff38]">
          <MdMoreTime />
        </h3>
        <div className="w-full">
          <h4 className="font-semibold">You want to extend duration ?</h4>
          <p className="text-sm"> </p>
          <form
            action=""
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-3"
          >
            <InputUnit
              type="date"
              name="newDate"
              label="Enter new date for disconnection."
              min={minDate}
              change={handleChange}
            />

            <div className="w-full flex gap-2 justify-end py-3">
              <Link
                to={`/customer/${id}`}
                className="px-5 rounded-md p-1 border border-zinc-400"
              >
                Cancel
              </Link>
              <button className="px-5 rounded-md p-1 border bg-blue-600 text-white border-blue-400 hover:bg-blue-800">
                Extend
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Extend;
