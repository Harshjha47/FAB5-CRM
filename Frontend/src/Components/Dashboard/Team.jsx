import TeamMembers from "./TeamMembers";
import { useAuth } from "../../Context/AuthContext";
import { Search } from "../Icons/Icons";
import SearchBar from "../Navigation/SearchBar";
const subHeading = [
  {
    name: "Name",
    Active: true,
  },
  {
    name: "Role",
    Active: true,
  },
  {
    name: "Action",
    Active: true,
  },
];
function Team() {
  const { allData } = useAuth();
  return (<>
    <section className="h-[90vh] mx-2 flex-[3] flex flex-col gap-2 rounded-xl overflow-hidden">

      <div className=" w-full flex p-2 gap-2 ">
        <SearchBar />
        <div className="w-[30%]">
          <select name="" className="h-full rounded-xl outline-none w-full flex justify-center items-center pl-4" id="">
            <option value="" className="">All</option>
          </select>
        </div>


      </div>
      <div className=" w-full py-1  gap-2 flex">
        {subHeading?.map((e) => e?.Active && <h3 key={e?.name} className="flex-1 text-center">{e?.name}</h3>)}
      </div>

      <div className="w-full customScroller flex gap-2 flex-col h-[70%] overflow-auto ">
        {allData?.users?.map((e) => <TeamMembers key={e?._id} information={e} />)}

      </div>
    </section>
  </>

  );
}
//      const {
//         filteredData,
//       } = useCustomer();
//       const {allData}=useAuth()
//   return (


//     <section className="flex flex-col gap-2 p-2 ">
//         {allData?.users?.map((e,i)=><TeamMembers key={i} information={e}/>)}

//     </section>
//   );
// }

export default Team;
