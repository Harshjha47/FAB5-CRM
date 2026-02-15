import React from "react";
import { CiUser } from "react-icons/ci";

function TeamMembers({ information }) {
  return (
    <article className="border shadow-md rounded-md p-2 bg-white">
      <div className="flex justify-between items-center">
        <div className="">{information?.name}</div>
        <div
          className=" text-[0.7rem] px-3 p-1 leading-none rounded-full flex justify-center items-center"
          style={{
            backgroundColor: `${information?.role == "employee" ? "#00d1003d" : information?.role == "admin" ? "#00000027" : "#ff880027"}`,
            color: `${information?.role == "employee" ? "#003a00" : information?.role == "admin" ? "#000000" : "#3f2400"}`,
          }}
        >
          {information?.role}
        </div>
      </div>
      <div className="flex md:gap-4 gap-2 text-xs">
        <div className="border px-3 rounded-full border-[#0a0064] text-[#0a0064]">
          {information?.email}
        </div>
        <div className="border px-3 rounded-full border-[#00740f] text-[#00740f]">
          {information?.phone}
        </div>
      </div>
    </article>
  );
}

export default TeamMembers;
