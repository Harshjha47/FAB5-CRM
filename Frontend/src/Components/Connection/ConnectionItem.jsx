import React from "react";
import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";

function ConnectionItem({ info }) {

  return (
    <Link to={`/customer/${info?.customer?._id}/connection/${info?._id}/history`} className="border gap-2 items-center flex shadow-md bg-white rounded-lg p-2">
      <div className=" flex p-2 bg- rounded-lg text-2xl bg-[#ffc4561a] border-[#7a5000] text-[#5e3d00]"><MdArrowOutward/></div>
      
      <div className="flex-1">
      <div className="flex justify-between">
        {info?.customer?.name}{" "}
        <span
          className=" text-[0.65rem] px-3 p-1 leading-none rounded-full flex justify-center items-center"
          style={{
            backgroundColor: `${info?.status == "Active" ? "#00d1003d" : "#ff880027"}`,
            color: `${info?.role == "employee" ? "#003a00" : "#3f2400"}`,
          }}
        >
          {info?.status}
        </span>
      </div>
      <div className="flex gap-2 flex-wrap md:gap-4">
        <span className=" bg-[#0000ff28] border-[blue] text-[#000070] text-[0.65rem] px-3 p-1 leading-none border rounded-full flex justify-center items-center">{info?.bandwidth}Mbps</span>
        <span className=" bg-[#66ff0028] border-[green] text-[#255c00] text-[0.65rem] px-3 p-1 leading-none border rounded-full flex justify-center items-center">{info?.serviceType}</span>
        <span className=" bg-[#ffa60028] border-[orange] text-[#523c00] text-[0.65rem] px-3 p-1 leading-none border rounded-full flex justify-center items-center">{info?.technicalDetails?.telcoProvider}</span>
        </div>
        </div>
    </Link>
  );
}

export default ConnectionItem;
