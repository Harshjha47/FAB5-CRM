import React, { useEffect, useState } from "react";
import { InputUnitFlow } from "../Utils/InputUnit";
import { useConnection } from "../../Context/ConnectionContext";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FileText, ArrowRight, UploadCloud, CheckCircle2, ArrowDown } from "lucide-react";

function EditConnection({ info }) {
  const { putConnection } = useConnection();
  const { cid } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const init = {
    serviceType: info?.serviceType || "",
    bandwidth: info?.bandwidth || "",
    ratePerMb: info?.commercials?.ratePerMb || "",
  };

  const [data, setData] = useState(init);
  const [poFile, setPoFile] = useState(null); // State for the mandatory Purchase Order

  const { serviceType, bandwidth, ratePerMb } = data;
  
  // Calculate real-time MRC
  const currentMrc = info?.commercials?.mrc || 0;
  const newMrc = Number(bandwidth) * Number(ratePerMb) || 0;

  useEffect(() => {
    setData({
      serviceType: info?.serviceType || "",
      bandwidth: info?.bandwidth || "",
      ratePerMb: info?.commercials?.ratePerMb || "",
    });
  }, [info]);

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
      toast.error("A Purchase Order (PO) document is mandatory for modifications.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("serviceType", serviceType);
      formData.append("bandwidth", bandwidth);
      formData.append("ratePerMb", ratePerMb);
      formData.append("mrc", newMrc);
      
      // Append the mandatory file
      formData.append("purchaseOrder", poFile);

      await putConnection(cid, formData);
      toast.success("Order modified successfully!");
      setPoFile(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderDelta = (oldVal, newVal, suffix = "") => {
    const diff = Number(newVal) - Number(oldVal);
    if (diff === 0 || isNaN(diff)) return null;
    return (
      <span className={`text-xs font-bold ml-2 ${diff > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
        ({diff > 0 ? '+' : ''}{diff}{suffix})
      </span>
    );
  };

  return (
    <section className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200 shadow-sm mt-4">
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800">Modify Connection Request</h2>
        <p className="text-slate-500 text-sm mt-1">Update bandwidth or commercials. A new Purchase Order is required.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        
       
        <div className="lg:w-[55%] flex flex-col gap-8">
          
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div> Configuration
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <InputUnitFlow
                  type={"number"}
                  placeholder={"e.g. 500"}
                  name={"bandwidth"}
                  value={bandwidth}
                  change={handleChange}
                  label={"New Bandwidth (Mbps)"}
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <InputUnitFlow
                  type={"number"}
                  placeholder={"e.g. 150"}
                  value={ratePerMb}
                  change={handleChange}
                  name={"ratePerMb"}
                  label={"New Rate Per Mb (₹)"}
                  required
                />
              </div>
            </div>
          </div>

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
                  <p className="text-sm font-semibold text-slate-700">Upload Revised Purchase Order (PO) <span className="text-red-500">*</span></p>
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
        </div>

        <div className="flex-1 flex flex-col gap-6">
          
          <div className="flex flex-col gap-4 relative">
            <div className="bg-slate-100 border border-slate-200 rounded-xl p-5 shadow-inner">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Current Configuration</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Bandwidth</span>
                  <span className="font-semibold text-slate-800">{info?.bandwidth} Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span>Rate per Mb</span>
                  <span className="font-semibold text-slate-800">₹{info?.commercials?.ratePerMb}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span>Monthly Recurring</span>
                  <span className="font-bold text-slate-800">₹{currentMrc}</span>
                </div>
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm z-10 hidden lg:flex">
              <ArrowDown size={16} className="text-slate-400" />
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-3">Proposed Configuration</h3>
              <div className="space-y-3 text-sm text-indigo-900">
                <div className="flex justify-between items-center">
                  <span>Bandwidth</span>
                  <div>
                    <span className="font-bold">{bandwidth || 0} Mbps</span>
                    {renderDelta(info?.bandwidth, bandwidth, 'M')}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rate per Mb</span>
                  <div>
                    <span className="font-bold">₹{ratePerMb || 0}</span>
                    {renderDelta(info?.commercials?.ratePerMb, ratePerMb)}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-indigo-200/60">
                  <span className="font-semibold">New MRC</span>
                  <div>
                    <span className="font-extrabold text-lg text-indigo-700">₹{newMrc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting || !poFile}
            className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all active:scale-[0.98] ${
              !poFile 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : isSubmitting 
                  ? "bg-indigo-400 text-white cursor-wait" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isSubmitting ? "Processing..." : "Confirm & Submit Modification"}
          </button>

        </div>
      </form>
    </section>
  );
}

export default EditConnection;