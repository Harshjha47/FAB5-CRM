import CustomerDetailCard from "./CustomerDetailCard";
import { useParams } from "react-router-dom";
import { useConnection } from "../../Context/ConnectionContext";
import { useEffect } from "react";
import CreateConnection from "../Connection/CreateConnection";

function CustomerSumDetails() {
  const { getConnection,connectionData } = useConnection();
  const { id } = useParams();
  useEffect(() => {
    getConnection(id);
  }, []);
  

  return (
    <section className="w-full flex flex-col  gap-2 h-full ">
      {connectionData?.length>0?connectionData?.map((e, i) => {
        return <CustomerDetailCard key={i} info={e} />;
      }):<CreateConnection/>}
    </section>
  );
}

export default CustomerSumDetails; 
