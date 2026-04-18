import React, { useState } from "react";
import { useCustomer } from "../../Context/CustomerContext";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PowerOff, CalendarClock, AlertTriangle } from "lucide-react";

function Disconnect() {
  const { disconnection } = useCustomer();
  const navigate = useNavigate();
  const { cid, id } = useParams();

  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      toast.error("Please provide a reason for disconnection.");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await disconnection(cid, { reason });
      toast.success("Disconnection request raised successfully.");
      navigate(`/customer/${id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  const lastDate = new Date(today);
  lastDate.setDate(today.getDate() + 30);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200 shadow-sm ">
      
      <div className="mb-8 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
            <PowerOff size={20} />
          </div>
          Initiate Disconnection
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Submit a request to terminate this connection. A standard 30-day notice period applies.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 ">
        
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex gap-3 shadow-sm">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-amber-800 font-bold text-sm">Notice Period Initiated</h4>
            <p className="text-amber-700 text-xs mt-1 leading-relaxed">
              Once submitted, billing will continue for 30 days until the final disconnection date. The customer must clear all pending dues before final termination.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-start gap-4">
            <div className="p-3 bg-slate-100 text-slate-600 rounded-lg">
              <CalendarClock size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Request Raised On</p>
              <p className="text-xl font-extrabold text-slate-800 mt-1">{formatDate(today)}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">Today</p>
            </div>
          </div>

          <div className="bg-white border border-rose-200 rounded-xl p-5 shadow-sm flex items-start gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-10"></div>
            <div className="p-3 bg-rose-100 text-rose-600 rounded-lg z-10">
              <PowerOff size={24} />
            </div>
            <div className="z-10">
              <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Final Disconnection</p>
              <p className="text-xl font-extrabold text-rose-700 mt-1">{formatDate(lastDate)}</p>
              <p className="text-xs text-rose-500 mt-1 font-medium">30 days from today</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="reason" className="text-sm font-semibold text-slate-700">
            Reason for Disconnection <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason"
            id="reason"
            required
            placeholder="Please explain why the customer is disconnecting this service (e.g., Shifting office, better pricing elsewhere, business closed)..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full bg-white border border-slate-300 rounded-xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none shadow-sm"
          ></textarea>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button
            type="submit"
            disabled={isSubmitting || !reason.trim()}
            className={`w-full md:w-auto px-8 py-3.5 rounded-xl font-bold text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
              isSubmitting || !reason.trim()
                ? "bg-slate-300 cursor-not-allowed shadow-none text-slate-500"
                : "bg-rose-600 hover:bg-rose-700 hover:shadow-lg"
            }`}
          >
            {isSubmitting ? "Processing Request..." : "Confirm & Raise Disconnection"}
          </button>
        </div>

      </form>
    </section>
  );
}

export default Disconnect;