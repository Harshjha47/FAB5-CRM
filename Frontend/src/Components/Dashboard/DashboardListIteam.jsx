import { useAuth } from '../../Context/AuthContext';
import { Link } from 'react-router-dom';

function DashboardListIteam({information}) {
    const {tab, setTab,allData} = useAuth();
    
   const Connections = allData?.connections?.filter((e)=>e?.customer?._id===information?._id)
  return (
    <div className="border border-[#99999910] bg-[#fff] shadow-md p-2 rounded-lg gap-2 flex">
        {tab=="Opportunities"&&<div className="flex-1  p-1 flex justify-center border  items-center font-semibold">#######</div>}
        <div className="flex-1 p-1 flex justify-center  items-center font-semibold">{information?.name||information?.customer?.name}</div>
        {tab=="Opportunities"&& <div className="flex-1 p-1  flex justify-center items-center ">{information?.bandwidth}Mbps</div>}
        {tab=="Employees"&& <div className="flex-1 p-1 flex  justify-center items-center ">{information?.role}</div>}
        {tab=="Opportunities"&&<div className="flex-1 p-1  flex justify-center items-center font-semibold">{information?.status}</div>}
        {tab=="Customers"&&<div className="flex-1 p-1 flex  justify-center items-center font-semibold">{Connections?.length}</div>}
        <div className="flex-1 p-1 flex justify-center items-center">
         {tab=="Customers"&& <Link to={`/customer/${information?._id}`} className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4 rounded-md bg-[#1100ff27]">View</Link>}
        {tab=="Opportunities"&&  <Link to={`/customer/${information?.customer?._id}/connection/${information?._id}/history`} className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4 rounded-md bg-[#1100ff27]">View</Link>}
        {tab=="Employees"&&  <Link to={`/employees/${information?._id}`} className="border border-[#0000ff2a] text-[#00001f] font-semibold px-4 rounded-md bg-[#1100ff27]">View</Link>}
        </div>
      </div>
  )
}

export default DashboardListIteam