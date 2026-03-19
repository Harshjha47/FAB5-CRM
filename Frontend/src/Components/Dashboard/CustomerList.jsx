import CustomerCard from "./CustomerCard";
import { useAuth } from "../../Context/AuthContext";
import { GrAdd } from "react-icons/gr";
import { Link } from "react-router-dom";
import { Search } from "../Icons/Icons";

function CustomerList() {
  const { allData } = useAuth();
    const subHeading = [
    {
      name: "Name",
      Active: true,
    },
    {
      name: "Opportunities",
      Active: true,
    },
    {
      name: "Action",
      Active: true,
    },
  ];
  
  


  return (<>
    <section className="h-[90vh] mx-2 flex-[3] flex flex-col gap-2 rounded-xl overflow-hidden">
              <Link to={"/customers/add"} className="text-green-900 p-6 bg-[#E2E2F6] text-xl rounded-xl flex gap-4 items-center "><GrAdd/>Add Customer</Link>

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
        {allData?.customers?.map((e, i) =><CustomerCard key={i} information={e} />)}

        </div>
    </section>
    </>
    
  );
}

export default CustomerList;
