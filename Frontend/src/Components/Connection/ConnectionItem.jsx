import { Link } from "react-router-dom";

function ConnectionItem({ info }) {
  

  return (
   <div className="border  border-[#99999910] bg-[#fff] shadow-md p-2 rounded-lg gap-2 flex">
        {<div className="flex-1 p-1 flex justify-center items-center font-semibold">#######</div>}
        <div className="flex-1 p-1 flex justify-center items-center font-semibold">{info?.customer?.name}</div>
       { <div className="flex-1 p-1 flex justify-center items-center ">{info?.bandwidth}Mbps</div>}
        {<div className="flex-1 p-1 flex justify-center items-center font-semibold">{info?.status}</div>}
        <div className="flex-1 p-1 flex justify-center items-center"><Link to={`/customer/${info?.customer?._id}/connection/${info?._id}/history`} className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4 rounded-md bg-[#1100ff27]">View</Link></div>
      </div>
  );
}

export default ConnectionItem;
