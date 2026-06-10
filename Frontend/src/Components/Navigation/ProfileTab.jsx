import React from "react";
import { CiLogout } from "react-icons/ci";
import { useAuth } from "../../Context/AuthContext";

function ProfileTab() {
  const { profileData, LogoutUser } = useAuth();
  
  return (
    <section className="h-full md:w-[20%] flex gap-1 p-2 items-center relative">
      <div className="aspect-square border hidden md:flex h-full uppercase rounded-full justify-center items-center bg-zinc-300 text-white">
        {profileData?.name?.charAt(0)}
      </div>
      
      {/* FIX: Added aria-label for accessibility */}
      <button 
        type="button"
        aria-label="Logout"
        onClick={() => LogoutUser()} 
        className="aspect-square border mr-3 md:hidden text-xl flex h-[70%] uppercase rounded-full justify-center items-center cursor-pointer"
      >
        <CiLogout />
      </button>
      
      <div className="flex flex-col justify-center h-full leading-[1]">
        <div>{profileData?.name}</div>
        <div className="text-xs text-zinc-500">{profileData?.role}</div>
      </div>
      
      {/* FIX: Added aria-label for accessibility */}
      <button 
        type="button"
        aria-label="Logout"
        className="absolute text-lg p-2 hidden md:flex justify-center items-center right-2 cursor-pointer border-none bg-transparent" 
        onClick={() => LogoutUser()}
      >
        <CiLogout />
      </button>
    </section>
  );
}

export default ProfileTab;