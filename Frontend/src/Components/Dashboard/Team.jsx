import TeamMembers from "./TeamMembers";
import { useCustomer } from "../../Context/CustomerContext";
import { useAuth } from "../../Context/AuthContext";

function Team() {
     const {
        filteredData,
      } = useCustomer();
      const {allData}=useAuth()
  return (
     

    <section className="flex flex-col gap-2 p-2 ">
        {filteredData?.users?.map((e,i)=><TeamMembers key={i} information={e}/>)}
      
    </section>
  );
}

export default Team;
