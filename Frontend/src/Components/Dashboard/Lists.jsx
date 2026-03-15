import { Search } from "../Icons/Icons";
import CustomerCard from "./CustomerCard";
import { useAuth } from "../../Context/AuthContext";

function Lists({info}) {
  const subHeading = [
    {
      name: "UID",
      Active: true,
    },
    {
      name: "Name",
      Active: true,
    },
    {
      name: "Service",
      Active: true,
    },
    {
      name: "Status",
      Active: true,
    },
    {
      name: "Action",
      Active: true,
    },
  ];
  return (
    <section className="h-[60vh] flex-[3] border rounded-xl overflow-hidden">
      <div className=" w-full flex p-2 gap-2 ">
        <div className="bg-white flex items-center gap-2 p-2 rounded-xl flex-1"><span className="text-2xl "><Search/></span><input type="text" placeholder="Search" className="flex-1 text-lg px-2 outline-none"/></div>
        <div className="w-[30%]">
            <select name="" className="h-full rounded-xl outline-none w-full flex justify-center items-center pl-4" id="">
                <option value="" className="">All</option>
            </select>
        </div>
        
        
      </div>
      <div className=" w-full py-1  gap-2 flex">
        {subHeading?.map(
          (e, i) =>
            e.Active && <h3 key={i} className="flex-1 text-center">{e.name}</h3>,
        )}
      </div>
      
      <div className="w-full customScroller flex gap-2 flex-col h-[60%] overflow-auto ">
            <CustomerCard/>

        </div>
    </section>
  );
}

export default Lists