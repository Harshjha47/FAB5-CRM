import { Link } from "react-router-dom";
import { formatDate } from "../../Services/dateFormat";
import { useAuth } from "../../Context/AuthContext";

function CustomerCard({ information }) {
  const mobdate = formatDate(information?.currentDisconnectDate).split(",")[0];
  const {tab, setTab} = useAuth();

  return (
      <div className="border border-[#99999910] bg-[#fff] shadow-md p-2 rounded-lg gap-2 flex">
        {tab!="Customers"&&<div className="flex-1 p-1 flex justify-center items-center font-semibold">#######</div>}
        <div className="flex-1 p-1 flex justify-center items-center font-semibold">Name</div>
       {tab=="Opportunities"&& <div className="flex-1 p-1 flex justify-center items-center ">100Mbps</div>}
        {tab=="Opportunities"&&<div className="flex-1 p-1 flex justify-center items-center font-semibold">Status</div>}
        {tab=="Customers"&&<div className="flex-1 p-1 flex justify-center items-center font-semibold">Count</div>}
        <div className="flex-1 p-1 flex justify-center items-center"><Link to={`/customer/${information?._id}`} className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4 rounded-md bg-[#1100ff27]">View</Link></div>
      </div>
  );
}

export default CustomerCard;
