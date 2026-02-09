import React, { useEffect, useState } from "react";
import { InputUnitFlow } from "../Utils/InputUnit";
import { useConnection } from "../../Context/ConnectionContext";
import { useParams } from "react-router-dom";

function EditConnection({ info }) {
  const { putConnection } = useConnection();
  const init = {
    serviceType: info?.serviceType || "",
    bandwidth: info?.bandwidth || "",
    mrc: info?.commercials?.mrc || "",
    ratePerMb: info?.commercials?.ratePerMb || "",
  };
  const [data, setData] = useState(init);
  const { cid } = useParams();
  const { serviceType, bandwidth, mrc, ratePerMb } = data;
  useEffect(() => {
    setData({
      serviceType: info?.serviceType || "",
      bandwidth: info?.bandwidth || "",
      mrc: info?.commercials?.mrc || "",
      ratePerMb: info?.commercials?.ratePerMb || "",
    });
  }, [info]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    putConnection(cid, { ...data, mrc: bandwidth * ratePerMb });
  };
  return (
    <section className="">
      <form action="" onSubmit={handleSubmit} className=" flex flex-wrap ">
        <div className="md:w-[60%]  w-full  p-2 flex flex-col gap-6 mt-6 ">
          <h2 className="text-xl">Manage Order</h2>
          <div className="flex items-center">
            <div className="flex-1">
              <InputUnitFlow
                type={"text"}
                placeholder={"Enter New Bandwidth"}
                name={"bandwidth"}
                value={bandwidth}
                change={handleChange}
                label={"New Bandwidth"}
              />
            </div>
            Mbps
          </div>
          <div className="flex items-center">
            <div className="flex-1">
              <InputUnitFlow
                type={"text"}
                placeholder={"Enter New rate per Mbps"}
                value={ratePerMb}
                change={handleChange}
                name={"ratePerMb"}
                label={"New Rate Per Mb"}
              />
            </div>
            /-
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

        <div className="flex-1 mt-6 flex flex-col gap-6">
          <h2 className="text-xl">Current Status</h2>
          <div className=" p-2 rounded-lg shadow-md border flex flex-col text-sm gap-2">
            <div className="flex justify-between w-full items-center ">
              <span className="">Service type</span>
              <span>{info?.serviceType}</span>
            </div>
            <div className="flex justify-between w-full items-center ">
              <span className="">Bandwidth</span>
              <span>{info?.bandwidth}Mbps</span>
            </div>
            <div className="flex justify-between w-full items-center ">
              <span className="">Rate per Mb</span>
              <span>{info?.commercials?.ratePerMb}/-</span>
            </div>
            <div className="flex justify-between w-full items-center font-semibold">
              <span className="">Monthly Recurring Charge</span>
              <span>{info?.commercials?.mrc}/-</span>
            </div>
          </div>
          <h2 className="text-xl">New Status</h2>
          <div className="border p-2 rounded-lg shadow-md flex flex-col text-sm gap-2">
            <div className="flex justify-between w-full items-center ">
              <span className="">Service type</span>
              <span>{serviceType}</span>
            </div>
            <div className="flex justify-between w-full items-center ">
              <span className="">Bandwidth</span>
              <span>{bandwidth}Mbps</span>
            </div>
            <div className="flex justify-between w-full items-center ">
              <span className="">Rate per Mb</span>
              <span>{ratePerMb}/-</span>
            </div>
            <div className="flex justify-between w-full items-center font-semibold">
              <span className="">Monthly Recurring Charge</span>
              <span>{bandwidth * ratePerMb}/-</span>
            </div>
            <button type="submit" className="border p-2 rounded-md bg-green-400 text-white font-semibold">
              Change
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default EditConnection;
