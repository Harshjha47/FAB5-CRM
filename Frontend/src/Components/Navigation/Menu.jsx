import { RiAddLargeFill } from "react-icons/ri";
import Disconnect from "../Dashboard/Disconnect";
import { useCustomer } from "../../Context/CustomerContext";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import { BsMicrosoftTeams } from "react-icons/bs";
import { AiOutlineTeam } from "react-icons/ai";
import { IoMdPersonAdd } from "react-icons/io";

function Menu() {
    const {disconnectionTog,setDisconnectionTog}=useCustomer()
      const { profileData} = useAuth();
    
  
  return (
    <section className="flex-1 flex items-center gap-3 h-full justify-end p-2">
      {profileData.role=="admin"&&
              <div className="flex gap-3">
              <Link to={`/dashboard/team`} className="px-3 rounded-lg bg-stone-100 p-1">
              <div className="md:block hidden">Team</div>
              <div className="block md:hidden"><BsMicrosoftTeams/></div>
              

              </Link>
              <Link to={`/dashboard`} className="px-3 rounded-lg bg-stone-100 p-1">
              <div className="md:block hidden">Customers</div>
              <div className="block md:hidden"><AiOutlineTeam/></div>

              </Link>
              </div>
            }
            {profileData.role=="admin" || profileData.role=="employee" &&
              <Link to={`/dashboard/add`} className="px-3 rounded-lg bg-stone-100 p-1">
              <div className="md:block hidden">Add customer</div>
              <div className="block md:hidden"><IoMdPersonAdd/></div>

              </Link>
}


    </section>
  );
}

export default Menu;
