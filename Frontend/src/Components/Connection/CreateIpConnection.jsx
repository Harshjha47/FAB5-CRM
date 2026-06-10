import React, { useState } from "react";
import { InputUnitFlow } from "../Utils/InputUnit";
import { useConnection } from "../../Context/ConnectionContext";
import { useNavigate, useParams } from "react-router-dom";
 const init = {
    serviceType:"IP",
    ipCount: "",
    ipCost: "", 
  };
const CreateIpOrder = () => {
  const { createConnection, getConnection } = useConnection();
  const { id } = useParams();
  const navigate = useNavigate();
 

  const [data, setData] = useState(init);
  const { ipCount, ipCost } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createConnection(id, { ...data, mrc: ipCost });
    await getConnection(id);
    navigate(`/customer/${id}`);
  };

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-5xl md:text-6xl">Create IP Order</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="flex flex-col gap-6">
          <h3 className="text-3xl">Order Details</h3>
          
          <InputUnitFlow
            type={"number"}
            placeholder={"Enter Number of IDs"}
            name={"ipCount"}
            label={"Number of IDs"}
            value={ipCount}
            change={handleChange}
          />
          
          <InputUnitFlow
            type={"number"}
            placeholder={"Enter Total Cost Per Month"}
            value={ipCost}
            change={handleChange}
            name={"ipCost"}
            label={"Total Cost Per Month"}
          />
          
        </section>
        
        <button
          type="submit"
          className="border p-2 bg-blue-500 text-white rounded-md mb-[30vh] text-xl hover:bg-blue-600 transition"
        >
          Create IP Order
        </button>
      </form>
    </section>
  );
};

export default CreateIpOrder;