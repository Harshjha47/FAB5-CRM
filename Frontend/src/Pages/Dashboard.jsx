
import { NavLink, Outlet } from 'react-router-dom'
import SearchBar from '../Components/Navigation/SearchBar'
import { FiHome } from "react-icons/fi";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { HiOutlineUserGroup } from "react-icons/hi";
import { LuNetwork } from "react-icons/lu";
import { useAuth } from '../Context/AuthContext';
import { FaRegUser } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";


function Dashboard() {
  const {profileData,LogoutUser}=useAuth()
  
  return (
    <main className='h-screen flex w-full bg-zinc-100'>
      <aside className=' p-2 w-[20vw] md:flex hidden flex-col justify-between'>
        <div className="  p-2 flex leading-none items-center gap-2">
          <span className='text-lg rounded-full flex justify-center items-center p-3 bg-[#111] text-white'><FaRegUser/></span>

          
          <div className="">
          <div className="flex flex-col">
            {profileData?.name}
          <span className='text-sm '>
            {profileData?.role}
          </span>
            </div></div>
          
        </div>
        <div className="  flex flex-col gap-2">
          <NavLink className={({ isActive }) => isActive ? "text-lg p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "text-lg p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/" ><FiHome/>Home</NavLink>
          <NavLink className={({ isActive }) => isActive ? "text-lg p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "text-lg p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/dashboard" ><MdOutlineSpaceDashboard/>Dashboard</NavLink>
       {profileData?.role!="employee"&&  <NavLink className={({ isActive }) => isActive ? "text-lg p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "text-lg p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/employees" ><HiOutlineUserGroup/>Employees</NavLink>} 
          <NavLink className={({ isActive }) => isActive ? "text-lg p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "text-lg p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/customers" ><CgProfile/>Customers</NavLink>
          <NavLink className={({ isActive }) => isActive ? "text-lg p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "text-lg p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/connections" ><LuNetwork/>Opportunities</NavLink>
          
        </div>
        <div className="text-lg p-3 flex gap-2 items-center hover:bg-[#111] hover:text-white rounded-xl cursor-pointer" onClick={()=>LogoutUser()}><div className=""><BiLogOut/></div>Logout</div>

      </aside>
      <div className="md:hidden flex fixed bottom-0 text-2xl justify-evenly w-full bg-zinc-100 border p-2 gap-2">
          <NavLink className={({ isActive }) => isActive ? "p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/" ><FiHome/></NavLink>
          <NavLink className={({ isActive }) => isActive ? "p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/dashboard" ><MdOutlineSpaceDashboard/></NavLink>
       {profileData?.role!="employee"&&  <NavLink className={({ isActive }) => isActive ? "p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/employees" ><HiOutlineUserGroup/></NavLink>} 
          <NavLink className={({ isActive }) => isActive ? "p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/customers" ><CgProfile/></NavLink>
          <NavLink className={({ isActive }) => isActive ? "p-3 flex gap-2 items-center text-white bg-[#111] rounded-xl" : "p-3 flex gap-2 items-center hover:bg-[#1f1f1f2f] rounded-xl"} to="/connections" ><LuNetwork/></NavLink>
          
        </div>
      <div className="w-full">
                <SearchBar/>

        <section className='  h-[90vh] border-black overflow-y-scroll customScroller'>
        <Outlet/>
        </section>
        </div>
    </main>
  )
}

export default Dashboard