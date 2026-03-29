import React, { useState } from "react";
import { InputUnitFlow } from "../Utils/InputUnit";
import { useConnection } from "../../Context/ConnectionContext";
import { useNavigate, useParams } from "react-router-dom";

const CreateIllOrder = () => {
  const { createConnection, getConnection } = useConnection();
  const { id } = useParams();
  const navigate = useNavigate();

  // Initial state without B-End details
  const init = {
    AbtsId: "",
    Aaddress: "",
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
    telcoProvider,
    serviceType,
    bandwidth,
    otc,
    advance,
    ratePerMb,
  } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Added orderType: "ILL" to help your backend differentiate the order types
    await createConnection(id, { ...data, mrc: bandwidth * ratePerMb, serviceType: "ILL" });
    await getConnection(id);
    navigate(`/customer/${id}`);
  };

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-5xl md:text-6xl">Create ILL Order</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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

          {/* B End has been completely removed from here */}

          <div className="flex flex-col gap-4 border-b">
            <label htmlFor="telcoProvider" className="text-sm">
              Telecom Provider
            </label>
            <select
              name="telcoProvider"
              id="telcoProvider"
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
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
          </div>

          {/* <div className="flex flex-col gap-4 border-b">
            <label htmlFor="ServiceType" className="text-sm">
              Service Type
            </label>
            <select
              name="serviceType"
              value={serviceType}
              id="ServiceType"
              onChange={handleChange}
              className="w-full outline-none bg-transparent"
            >
              {[ "ILL"].map((e, i) => {
                return (
                  <option key={i} value={e}>
                    {e}
                  </option>
                );
              })}
            </select>
          </div> */}

          <div className="flex items-center">
            <div className="flex-1">
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
            value={ratePerMb * bandwidth || ""}
            name={"mrc"}
            change={handleChange}
            label={"Monthly Recurring Charge"}
            readOnly
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
          className="border p-2 bg-blue-500 text-white rounded-md mb-[30vh] text-xl hover:bg-blue-600 transition-colors"
        >
          Create ILL Order
        </button>
      </form>
    </section>
  );
};

export default CreateIllOrder;