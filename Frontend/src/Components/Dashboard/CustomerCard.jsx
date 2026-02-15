import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../Services/dateFormat";
import { FaRegUser } from "react-icons/fa6";

function CustomerCard({ information }) {
  const mobdate = formatDate(information?.currentDisconnectDate).split(",")[0];

  return (
    <>
      <Link
        to={`/customer/${information?._id}`}
        className="border border-[#99999910] bg-[#fff] shadow-md p-2 rounded-lg gap-2 flex"
      ><div className="border aspect-square p-3 text-lg bg-[#15ff0018] text-[#085e00] rounded-xl border-[#399c005d] flex justify-center items-center"><FaRegUser/></div>
        <div className="w-full flex flex-col items-start justify-center">
          <h3 className="font-semibold">{information?.name}</h3>
          <p className={` text-xs py-[2px] flex gap-2 flex-wrap text-[#1d1d1d] rounded-md  opacity-80  justify-start items-center`}>
            {information?.person} <span className="border border-[blue] text-[#000075] px-2 rounded-full">{information?.email}</span> <span className="border md:block hidden border-[green] text-[#004200] px-2 rounded-full">{information?.mobile}</span>
          </p>
        </div>
      </Link>
    </>
  );
}

export default CustomerCard;
