import React, { useEffect, useState } from "react";
import { useConnection } from "../../Context/ConnectionContext";
import { Link, useParams } from "react-router-dom";
import EditConnection from "./EditConnection";
import ShiftConnection from "./ShiftConnection";
import Disconnect from "../Dashboard/Disconnect";
import Extend from "../Dashboard/Extend";
import Retain from "../Dashboard/Retain";
import { TfiExchangeVertical } from "react-icons/tfi";
import { CiDeliveryTruck } from "react-icons/ci";
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { VscDebugDisconnect } from "react-icons/vsc";
import AddIp from "./AddIp";
import { useAuth } from "../../Context/AuthContext";

function ManageOrder() {
  const {
    getConnectionById,
    singleConnectionData,
  } = useConnection();
  const [data, setData] = useState(singleConnectionData);
  const [reason, setReason] = useState("");
  const [reasonTab, setReasonTab] = useState(false);

  const { user } = useAuth();
  const { cid ,id} = useParams();

  useEffect(() => {
    setData(singleConnectionData);
  }, [singleConnectionData]);

  useEffect(() => {
    if (cid) getConnectionById(cid);
  }, [cid]);

  // const data = connectionData?.find((e) => cid == e._id);
  
  
  const [tabs,setTabs]=useState()

  useEffect(()=>{
    const tag = data?.status == "Active" && "edit" || data?.status=="Notice Period" && "Extend";
    setTabs(tag)
  },[data])

  return <section>
    {data?.status=="Pending"&&
   <div className="border h-screen text-xl flex flex-col gap-4 justify-center items-center">
    <p>This Connection is not Active</p>
    <Link to={"/dashboard"} className="border p-2 px-6 bg-black text-white rounded-lg">Go To Dashboard</Link>
    
   </div> }
    <nav>{data?.status=="Active"&&<>
        <ul className="md:flex hidden divide-x border-b ">
            <li onClick={()=>setTabs("edit")} className={`flex-1 ${tabs == "edit" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}>Upgrade / Downgrade</li>
            <li onClick={()=>setTabs("shift")} className={`flex-1 ${tabs == "shift" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}>Shift</li>
            <li onClick={()=>setTabs("add")} className={`flex-1 ${tabs == "add" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}>Additional IP</li>
            <li onClick={()=>setTabs("dis")} className={`flex-1 ${tabs == "dis" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}>Disconnection</li>
        </ul>
        <ul className="flex md:hidden divide-x border-b text-xl ">
            <li onClick={()=>setTabs("edit")} className={`flex-1 ${tabs == "edit" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}><TfiExchangeVertical/></li>
            <li onClick={()=>setTabs("shift")} className={`flex-1 ${tabs == "shift" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}><CiDeliveryTruck/></li>
            <li onClick={()=>setTabs("add")} className={`flex-1 ${tabs == "add" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}><MdOutlinePlaylistAdd/></li>
            <li onClick={()=>setTabs("dis")} className={`flex-1 ${tabs == "dis" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}><VscDebugDisconnect/></li>
        </ul>
        </>}
        {data?.status=="Notice Period"&&
        <ul className="flex divide-x border-b ">
            <li onClick={()=>setTabs("Extend")} className={`flex-1 ${tabs == "Extend" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}>Extend</li>
            <li onClick={()=>setTabs("Retain")} className={`flex-1 ${tabs == "Retain" &&" text-[#fff] bg-[#111]"} cursor-pointer flex justify-center items-center p-2`}>Retain</li>
        </ul>}
        
    </nav>
    {data?.status=="Active"&&
    <div className="">
        {tabs=="edit"&&<EditConnection info={data}/>}
        {tabs=="shifting"&&<ShiftConnection info={data}/>}
        {tabs=="dis"&&<Disconnect info={data}/>}
        {tabs=="add"&&<AddIp info={data}/>}
    </div>}
    {data?.status=="Notice Period"&&
    <div className="">
        {tabs=="Extend"&&<Extend info={data}/>}
        {tabs=="Retain"&&<Retain info={data}/>}
    </div>}
  </section>;
}

export default ManageOrder;
