import React from "react";
import { IoIosLogOut } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../../Context/AuthContext";

function ProfileTab() {
  const {profileData,LogoutUser}=useAuth()
  return (
    <section className="h-full   md:w-[20%]  flex gap-1 p-2 items-center relative">
      <div className=" aspect-square border hidden md:flex h-full uppercase rounded-full justify-center items-center bg-zinc-300 text-white">
        {profileData?.name?.split("")[0]}
      </div>
      <div onClick={()=>LogoutUser()} className=" aspect-square border mr-3 md:hidden text-xl flex h-[70%] uppercase rounded-full justify-center items-center ">
        <CiLogout/>
      </div>
      <div className="flex flex-col justify-center h-full  leading-[1]">
        <div className="">{profileData?.name}</div>
        <div className="text-xs text-zinc-500">{profileData?.role}</div>
      </div>
      <div className=" absolute text-lg p-2 hidden md:flex justify-center items-center right-2 cursor-pointer" onClick={()=>LogoutUser()}><CiLogout/></div>

    </section>
  );
}

export default ProfileTab;
