import React, { useState } from "react";
import { InputUnitFlow } from "../Utils/InputUnit";
import { useConnection } from "../../Context/ConnectionContext";
import { useNavigate, useParams } from "react-router-dom";

const CreateConnection = () => {
    const {createConnection}=useConnection()
    const {id}=useParams()
    const navigate=useNavigate()
  const init = {
    AbtsId: "",
    Aaddress: "",
    BbtsId: "",
    Baddress: "",
    telcoProvider: "",
    serviceType: "",
    bandwidth: "",
    mrc: "",
    otc: "",
    advance: "",
    ratePerMb: "",
  };
  const [data, setData] = useState(init);
  const {
    AbtsId,
    Aaddress,
    BbtsId,
    Baddress,
    telcoProvider,
    serviceType,
    bandwidth,
    mrc,
    otc,
    advance,
    ratePerMb,
  } = data;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    createConnection(id,{...data,mrc:bandwidth*ratePerMb})
    navigate(`/customer/${id}`)

  };
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-5xl md:text-6xl">Create New Connection</h2>
      <form action="" onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="flex flex-col gap-6">
          <h3 className="text-3xl">Technical Details</h3>
          <h4 className="text-xl">A End</h4>
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter BTS ID"}
            name={"AbtsId"}
            label={"BTS ID"}
            value={AbtsId}
            change={handleChange}
          />
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter address"}
            name={"Aaddress"}
            value={Aaddress}
            change={handleChange}
            label={"Address"}
          />
          <h4 className="text-xl">B End</h4>
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter BTS ID"}
            value={BbtsId}
            name={"BbtsId"}
            change={handleChange}
            label={"BTS ID"}
          />
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter address"}
            value={Baddress}
            change={handleChange}
            name={"Baddress"}
            label={"Address"}
          />
          <div className="flex flex-col gap-4 border-b">
            <label htmlFor="telcoProvider" className="text-sm">
              Telecom Provider
            </label>
            <select
              name="telcoProvider"
              id="telcoProvider"
              onChange={handleChange}
              className="w-full outline-none"
              value={telcoProvider}
            >
              <option value="">Select</option>
              {["Airtel", "TCL", "Vodafone", "Other"].map((e, i) => {
                return (
                    <option key={i} value={e}>
                      {e}
                    </option>
                );
              })}
            </select>
            <div className=""></div>
          </div>
          <div className="flex flex-col gap-4 border-b">
            <label htmlFor="ServiceType" className="text-sm">
              Service Type
            </label>
            <select
              name="serviceType"
              value={serviceType}
              id="ServiceType"
              onChange={handleChange}
              className="w-full outline-none"
            >
              <option value="">Select</option>
              {["DNC", "Mix", "ILL", "Peering", "IP"].map((e, i) => {
                return (
                    <option key={i} value={e}>
                      {e}
                    </option>
                );
              })}
            </select>
            <div className=""></div>
          </div>
          <div className="flex items-center">
            <div className=" flex-1 ">
              <InputUnitFlow
            type={"text"}
            placeholder={"Enter Bandwidth"}
            name={"bandwidth"}
            value={bandwidth}
            change={handleChange}
            label={"Bandwidth"}
          />
            </div>
            <div className="">in Mb</div>
          </div>
          
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter rate per Mb"}
            value={ratePerMb}
            change={handleChange}
            name={"ratePerMb"}
            label={"Rate Per Mb"}
          />
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter Monthly Recurring Charge"}
            value={ratePerMb*bandwidth}
            name={"mrc"}
            change={handleChange}
            label={"Monthly Recurring Charge"}
          />
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter One Time Charge"}
            value={otc}
            name={"otc"}
            change={handleChange}
            label={"One Time Charge"}
          />
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter Advance Payment"}
            value={advance}
            change={handleChange}
            name={"advance"}
            label={"Advance Payment"}
          />
          
        </section>
        <button
          type="submit"
          className="border p-2 bg-blue-500 text-white rounded-md mb-[30vh] text-xl"
        >
          Create
        </button>
      </form>
    </section>
  );
};

export default CreateConnection;
