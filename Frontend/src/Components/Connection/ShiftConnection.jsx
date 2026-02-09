import { useParams } from "react-router-dom";
import { useConnection } from "../../Context/ConnectionContext";
import { InputUnitFlow } from "../Utils/InputUnit";
import React, { useState } from "react";

function ShiftConnection({ info }) {
  const { patchConnection } = useConnection();
  const { cid } = useParams();
  const init = {
    ABtsId: "",
    BBtsId: "",
    serviceType: "",
    otc: "",
  };
  const [data, setData] = useState(init);
  const { ABtsId, BBtsId, serviceType, otc } = data;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    patchConnection(cid, data);
  };
  return (
    <div className="md:w-[70%] mt-6 mx-auto flex flex-col gap-6">
      <h2 className="text-xl">Current Status</h2>
      <div className=" p-2 rounded-lg shadow-md border flex flex-col text-sm gap-2">
        <div className="flex gap-1 w-full  flex-col ">
          <span className="">A End BTS ID</span>
          <span>{info?.technicalDetails?.aEnd?.btsId}</span>
        </div>
        <div className="flex gap-1 w-full  flex-col ">
          <span className="">B End BTS ID</span>
          <span>{info?.technicalDetails?.bEnd?.btsId}</span>
        </div>
      </div>
      <h2 className="text-xl">New Status</h2>
      <form
        onSubmit={handleSubmit}
        className="border p-2 rounded-lg shadow-md flex flex-col text-sm gap-2"
      >
        <div className="flex gap-1 w-full  flex-col ">
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter New a new A end BTS ID"}
            value={ABtsId}
            change={handleChange}
            name={"ABtsId"}
            label={"A End BTS ID"}
          />
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter New a new B end BTS ID"}
            value={BBtsId}
            change={handleChange}
            name={"BBtsId"}
            label={"B End BTS ID"}
          />
          <InputUnitFlow
            type={"text"}
            placeholder={"Enter Shifting Charges"}
            value={otc}
            change={handleChange}
            name={"otc"}
            label={"Shifting Charges"}
          />
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
              <option value={info?.serviceType}>{info?.serviceType}</option>
              {["DNC", "Mix", "ILL", "Peering", "IP"].map((e, i) => {
                return (
                  <>
                    <option key={i} value={e}>
                      {e}
                    </option>
                  </>
                );
              })}
            </select>
            <div className=""></div>
          </div>
        </div>
        <button
          type="submit"
          className="border p-2 rounded-md bg-green-400 text-white font-semibold"
        >
          Change
        </button>
      </form>
    </div>
  );
}

export default ShiftConnection;
