import React from "react";
import { CiMenuFries } from "react-icons/ci";
import { RiAddLargeFill } from "react-icons/ri";
import InputUnit from "../Utils/InputUnit";
import Disconnect from "../Dashboard/Disconnect";
import { useCustomer } from "../../Context/CustomerContext";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";

function Menu() {
    const {disconnectionTog,setDisconnectionTog}=useCustomer()
      const { profileData} = useAuth();
    
  
  return (
    <section className="flex-1 flex items-center  h-full justify-end p-2">
      {profileData.role=="admin"?
              <div className="flex gap-3">
              <Link to={`/dashboard/team`} className="px-3 rounded-lg bg-stone-100 p-1">Team</Link>
              <Link to={`/dashboard`} className="px-3 rounded-lg bg-stone-100 p-1">Customers</Link>
              </div>
            :
      <div onClick={()=>{setDisconnectionTog(!disconnectionTog)}} className="text-xl border p-3 rounded-full border-[#44444421]">
        <RiAddLargeFill />
      </div>}
            {disconnectionTog&&<Disconnect/>}
    </section>
  );
}

export default Menu;
