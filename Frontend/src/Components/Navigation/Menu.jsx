import React from "react";
import { CiMenuFries } from "react-icons/ci";
import { RiAddLargeFill } from "react-icons/ri";
import InputUnit from "../Utils/InputUnit";
import Disconnect from "../Dashboard/Disconnect";
import { useCustomer } from "../../Context/CustomerContext";

function Menu() {
    const {disconnectionTog,setDisconnectionTog}=useCustomer()
  
  return (
    <section className="flex-1 flex items-center  h-full justify-end p-2">
      <div onClick={()=>{setDisconnectionTog(!disconnectionTog)}} className="text-xl border p-3 rounded-full border-[#44444421]">
        <RiAddLargeFill />
      </div>
      {disconnectionTog&&<Disconnect/>}
    </section>
  );
}

export default Menu;
