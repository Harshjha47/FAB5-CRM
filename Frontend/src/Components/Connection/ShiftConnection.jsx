import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useConnection } from "../../Context/ConnectionContext";
import { InputUnitFlow } from "../Utils/InputUnit";
import toast from "react-hot-toast";
import { MapPin, FileText, UploadCloud, CheckCircle2, ArrowDown } from "lucide-react";

function ShiftConnection({ info }) {
  const { patchConnection } = useConnection();
  const { cid } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const init = {
    ABtsId: "",
    Aaddress: "",
    BBtsId: "",
    Baddress: "",
    otc: "",
  };
  
  const [data, setData] = useState(init);
  const [poFile, setPoFile] = useState(null);

  const { ABtsId, Aaddress, BBtsId, Baddress, otc } = data;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!poFile) {
      toast.error("A Purchase Order (PO) document is mandatory for shifting requests.");
      return;
    }

    if (!ABtsId && !BBtsId) {
      toast.error("Please provide at least one new BTS ID to shift.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      if (ABtsId) formData.append("ABtsId", ABtsId);
      if (Aaddress) formData.append("Aaddress", Aaddress);
      if (BBtsId) formData.append("BBtsId", BBtsId);
      if (Baddress) formData.append("Baddress", Baddress);
      if (otc) formData.append("otc", otc);
      
      formData.append("purchaseOrder", poFile);

      await patchConnection(cid, formData);
      toast.success("Shifting request submitted successfully!");
      
      setData(init);
      setPoFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200 shadow-sm mt-4">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Shift Connection</h2>
        <p className="text-slate-500 text-sm mt-1">Move A-End or B-End to a new location. A new Purchase Order is required.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Input Form & File Upload */}
        <div className="lg:w-[55%] flex flex-col gap-8">
          <form id="shiftForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Shifting Details */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                <MapPin size={18} className="text-indigo-500" /> New Location Details
              </h3>
              
              <div className="flex flex-col gap-6">
                
                {/* A-End Group */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Shift A-End</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputUnitFlow
                      type="text"
                      placeholder="e.g. BTS-1042-XYZ"
                      value={ABtsId}
                      change={handleChange}
                      name="ABtsId"
                      label="New A-End BTS ID"
                      required={false}
                    />
                    <InputUnitFlow
                      type="text"
                      placeholder="Enter full address"
                      value={Aaddress}
                      change={handleChange}
                      name="Aaddress"
                      label="New A-End Address"
                      required={false}
                    />
                  </div>
                </div>

                {/* B-End Group */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-slate-600 uppercase tracking-wider">Shift B-End</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputUnitFlow
                      type="text"
                      placeholder="e.g. BTS-8921-ABC"
                      value={BBtsId}
                      change={handleChange}
                      name="BBtsId"
                      label="New B-End BTS ID"
                      required={false}
                    />
                    <InputUnitFlow
                      type="text"
                      placeholder="Enter full address"
                      value={Baddress}
                      change={handleChange}
                      name="Baddress"
                      label="New B-End Address"
                      required={false}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <InputUnitFlow
                    type="number"
                    placeholder="e.g. 5000"
                    value={otc}
                    change={handleChange}
                    name="otc"
                    label="Shifting Charges (OTC) ₹"
                    required={false}
                  />
                </div>
              </div>
            </div>

            {/* Mandatory Document Upload */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-4">
                <FileText size={18} className="text-indigo-500" /> Mandatory Document
              </h3>
              
              <div className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 text-center ${poFile ? 'border-emerald-400 bg-emerald-50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'}`}>
                <input 
                  type="file" 
                  accept=".pdf, application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                
                {!poFile ? (
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <div className="p-3 bg-white rounded-full shadow-sm text-indigo-500">
                      <UploadCloud size={24} />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Upload Shifting Purchase Order (PO) <span className="text-red-500">*</span></p>
                    <p className="text-xs text-slate-500">PDF files only. Click or drag & drop.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600">
                      <CheckCircle2 size={28} />
                    </div>
                    <p className="text-sm font-bold text-emerald-800 truncate px-4">{poFile.name}</p>
                    <p className="text-xs text-emerald-600 font-medium">Ready to submit</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Right Side: Current Status Summary & Button */}
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 shadow-inner relative">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Current Network Topology</h3>
            
            <div className="flex flex-col gap-5 text-sm">
              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block mb-1">A-End Location</span>
                <span className="font-bold text-slate-800 text-base block">{info?.technicalDetails?.aEnd?.btsId || "Not Assigned"}</span>
                <span className="text-xs text-slate-500 mt-1 block leading-relaxed">{info?.technicalDetails?.aEnd?.address || "No address on file"}</span>
              </div>
              
              <div className="flex justify-center -my-2 z-10">
                <div className="bg-slate-200 rounded-full p-1 border-4 border-slate-100">
                  <ArrowDown size={16} className="text-slate-500 rotate-90 md:rotate-0" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block mb-1">B-End Location</span>
                <span className="font-bold text-slate-800 text-base block">{info?.technicalDetails?.bEnd?.btsId || "Not Assigned"}</span>
                <span className="text-xs text-slate-500 mt-1 block leading-relaxed">{info?.technicalDetails?.bEnd?.address || "No address on file"}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            form="shiftForm"
            disabled={isSubmitting || !poFile}
            className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98] mt-auto ${
              !poFile 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : isSubmitting 
                  ? "bg-indigo-400 text-white cursor-wait" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isSubmitting ? "Processing..." : "Submit Shift Request"}
          </button>

        </div>
      </div>
    </section>
  );
}

export default ShiftConnection;