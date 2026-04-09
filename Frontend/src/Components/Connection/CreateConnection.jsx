import React, { useState } from "react";
import { InputUnitFlow } from "../Utils/InputUnit";
import { useConnection } from "../../Context/ConnectionContext";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomer } from "../../Context/CustomerContext";
import toast from "react-hot-toast";

const CreateConnection = () => {
  const { createConnection, getConnection } = useConnection()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams()
  const navigate = useNavigate()
  
  const init = {
    AbtsId: "", Aaddress: "",
    BbtsId: "", Baddress: "",
    telcoProvider: "", serviceType: "",
    bandwidth: "", mrc: "", otc: "", advance: "", ratePerMb: "",
    ipCount: "", ipCost: "", RatePerIP: "", remarks: "",
  };
  
  const [data, setData] = useState(init);
  
  // Naya State: Files ke liye
  const [files, setFiles] = useState({
    purchaseOrder: null,
    caf: null,
    businessAgreement: null
  });

  const {
    AbtsId, Aaddress, BbtsId, Baddress,
    telcoProvider, serviceType, bandwidth,
    otc, advance, ratePerMb, ipCount, RatePerIP, remarks,
  } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  // Naya Handler: File changes ke liye
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({ ...files, [name]: selectedFiles[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!files.purchaseOrder) return toast.error("Purchase Order is mandatory!");
    if (!files.caf) return toast.error("CAF Document is mandatory!");

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Calculations
      const calculatedMrc = (Number(bandwidth) * Number(ratePerMb)) + (Number(ipCount) * Number(RatePerIP));
      const calculatedIpCost = Number(ipCount) * Number(RatePerIP);

      // Har text field ko append karo
      const textPayload = { ...data, mrc: calculatedMrc, ipCost: calculatedIpCost };
      Object.keys(textPayload).forEach(key => {
        formData.append(key, textPayload[key]);
      });

      // Files ko append karo
      if (files.purchaseOrder) formData.append("purchaseOrder", files.purchaseOrder);
      if (files.caf) formData.append("caf", files.caf);
      if (files.businessAgreement) formData.append("businessAgreement", files.businessAgreement);

      // JSON ki jagah FormData pass karo
      await createConnection(id, formData);
      await getConnection(id);
      navigate(`/customer/${id}`);
      
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-5xl md:text-6xl">Create New Connection</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="flex flex-col gap-6">
          <h3 className="text-3xl">Technical Details</h3>
          
          <div className="flex flex-col gap-4 border-b">
            <label htmlFor="ServiceType" className="text-sm">Service Type</label>
            <select name="serviceType" value={serviceType} id="ServiceType" onChange={handleChange} className="w-full outline-none bg-transparent" required>
              <option value="">Select</option>
              {["DNC", "Mix", "ILL", "IP", "Peering"].map((e, i) => (
                <option key={i} value={e}>{e}</option>
              ))}
            </select>
          </div>
          
          <h4 className="text-xl">A End</h4>
          <InputUnitFlow type="text" placeholder="Enter BTS ID" name="AbtsId" label="BTS ID" value={AbtsId} change={handleChange} />
          <InputUnitFlow type="text" placeholder="Enter address" name="Aaddress" value={Aaddress} change={handleChange} label="Address" />

          {serviceType !== "ILL" && (
            <>
              <h4 className="text-xl">B End</h4>
              <InputUnitFlow type="text" placeholder="Enter BTS ID" value={BbtsId} name="BbtsId" change={handleChange} label="BTS ID" />
              <InputUnitFlow type="text" placeholder="Enter address" value={Baddress} change={handleChange} name="Baddress" label="Address" />
            </>
          )}

          <div className="flex flex-col gap-4 border-b">
            <label htmlFor="telcoProvider" className="text-sm">Telecom Provider</label>
            <select name="telcoProvider" id="telcoProvider" onChange={handleChange} className="w-full outline-none bg-transparent" value={telcoProvider} required>
              <option value="">Select</option>
              {["Airtel", "TCL", "Vodafone", "Other"].map((e, i) => (
                <option key={i} value={e}>{e}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <div className="flex-1">
              <InputUnitFlow type="text" placeholder="Enter Bandwidth" name="bandwidth" value={bandwidth} change={handleChange} label="Bandwidth" required />
            </div>
            <div className="">in Mb</div>
          </div>

          <InputUnitFlow type="text" placeholder="Enter rate per Mb" value={ratePerMb} change={handleChange} name="ratePerMb" label="Rate Per Mb" required />
          <InputUnitFlow type="text" placeholder="Enter Number of IPs" name="ipCount" label="Number of IPs" value={ipCount} change={handleChange} />
          <InputUnitFlow type="text" placeholder="Enter rate per IP" value={RatePerIP} change={handleChange} name="RatePerIP" label="Rate Per IP" />
          
          <InputUnitFlow type="text" placeholder="Monthly Recurring Charge" value={(Number(bandwidth) * Number(ratePerMb)) + (Number(ipCount) * Number(RatePerIP))} name="mrc" change={handleChange} label="Monthly Recurring Charge (Calculated)" readOnly />
          
          <InputUnitFlow type="text" placeholder="Enter One Time Charge" value={otc} name="otc" change={handleChange} label="One Time Charge" />
          <InputUnitFlow type="text" placeholder="Enter Advance Payment" value={advance} change={handleChange} name="advance" label="Advance Payment" />
          
          <div className="w-full flex flex-col gap-4">
            <label htmlFor="remarks">Remark</label>
            <textarea name="remarks" value={remarks} onChange={handleChange} placeholder="Enter your Remark" id="Remark" className="bg-transparent resize-none outline-none border-b py-2"></textarea>
          </div>

          {/* ---------------- DOCUMENTS SECTION ---------------- */}
          <h3 className="text-3xl mt-6 border-b pb-2">Mandatory Documents</h3>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Purchase Order (PO) *</label>
              <input type="file" name="purchaseOrder" accept=".pdf, image/*" onChange={handleFileChange} required className="border p-2 rounded" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">CAF Document *</label>
              <input type="file" name="caf" accept=".pdf, image/*" onChange={handleFileChange} required className="border p-2 rounded" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">Business Agreement 
                {/* (Optional) */}
                </label>
              <input type="file" name="businessAgreement" accept=".pdf, image/*" onChange={handleFileChange} className="border p-2 rounded" />
            </div>
          </div>
          {/* -------------------------------------------------- */}

        </section>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`border p-3 text-white rounded-md mb-[20vh] text-xl font-bold mt-4 transition-colors ${
            isSubmitting ? "bg-blue-300 cursor-not-allowed" : "bg-[#009FF3] hover:bg-[#007acc]"
          }`}
        >
          {isSubmitting ? "Creating Order..." : "Create Connection"}
        </button>
      </form>
    </section>
  );
};

export default CreateConnection;