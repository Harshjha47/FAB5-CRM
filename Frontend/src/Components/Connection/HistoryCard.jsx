import React, { useEffect, useState } from "react";
import { useConnection } from "../../Context/ConnectionContext";
import { useNavigate, useParams } from "react-router-dom";
import HistoryTimeline from "./HistoryTimeline";
import { useAuth } from "../../Context/AuthContext";
import QuickActions from "./QuickActions";
import { X } from "lucide-react";
import { InputUnit } from "../Utils/InputUnit";
import { Edit, Send } from "../Icons/Icons";

function OpportunityDetails() {
  const {
    getConnectionById,
    Generate,
    singleConnectionData,
    approveConnection,
    activeConnection,
    Reject,
    // Cancel,
    Delete
  } = useConnection();
  
  const [data, setData] = useState(singleConnectionData);
  const [formData, setFormData] = useState({
    remark: data?.remarks || "No remarks available.",
  });

  const [remarkStatus, setRemarkStatus] = useState(true);
  const { remark } = formData;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [reason, setReason] = useState("");
  const [reasonTab, setReasonTab] = useState(false);

  const { user } = useAuth();
  const { cid } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setData(singleConnectionData);
  }, [singleConnectionData]);

  useEffect(() => {
    if (cid) getConnectionById(cid);
  }, [cid]);

  const handleApprove = async () => {
    await approveConnection(cid);
    await getConnectionById(cid);
  };

  const handleReject = () => {
    setReasonTab(true);
  };
  
  const conectionReject = async () => {
    await Reject(cid, { reason });
    await getConnectionById(cid);
    setReasonTab(false);
  };

  const handleGenerate = async () => {
    await Generate(cid);
    await getConnectionById(cid);
  };
  
  const handleCancel = async () => {
    await Cancel(cid);
    await getConnectionById(cid);
  };
  
  const handleDelete = async () => {
    await Delete(cid);
    navigate("/dashboard");
  };
  
  const handleActivate = async (telecoCircuitId) => {
    await activeConnection(cid, telecoCircuitId);
    await getConnectionById(cid);
  };

  const handleRemarkEdit = () => {
    setRemarkStatus(true);
    console.log(cid, remark);
  };

  if (!data)
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(val || 0);

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleString("en-IN", {
        dateStyle: "medium",
      })
      : "N/A";

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Approved":
      case "Generation":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Notice Period":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Disconnected":
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const renderDocCard = (label, doc) => {
    if (!doc || !doc.url) return null;
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className="text-2xl">📄</span>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</span>
            <span className="text-sm font-semibold text-gray-800 truncate" title={doc.fileName}>{doc.fileName}</span>
          </div>
        </div>
        <a 
          href={`https://docs.google.com/viewer?url=${doc.url}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-4 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors whitespace-nowrap"
        >
          View PDF
        </a>
      </div>
    );
  };

  return (
    <div className="p-6 w-full mx-auto flex-col md:flex-row flex gap-6 font-sans ">
      {reasonTab && (
        <div className="fixed top-0 p-2 left-0 h-screen w-full flex justify-center items-center z-50 bg-[#0000001f] ">
          <div className="rounded-lg bg-white w-full md:w-[50%] lg:w-[30%] border shadow-[#ff989850] shadow-xl border-[#88888818] p-4 flex flex-col gap-3 items-start">
            <h3 className="p-3 rounded-lg text-xl text-red-600 bg-[#ffc8c838] cursor-pointer" onClick={() => setReasonTab(false)}>
              <X />
            </h3>
            <div className="w-full">
              <h4 className="font-semibold text-lg mb-2">
                Are you sure you want to Reject ?
              </h4>
              <InputUnit
                placeholder={"Reason"}
                type={"text"}
                value={reason}
                change={(e) => setReason(e.target.value)}
              />
            </div>
            <div className="w-full flex gap-2 justify-end py-3">
              <button onClick={() => setReasonTab(false)} className="px-5 rounded-md p-1 border border-zinc-400">
                Cancel
              </button>
              <button onClick={conectionReject} className="px-5 rounded-md p-1 border bg-red-600 text-white border-red-400">
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Column */}
      <div className="flex flex-col flex-1 gap-6 customScroller overflow-auto max-h-[80vh]">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
            Lifecycle Tracking
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Approved By:</span>
              <span>{data.approvedBy?.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Activated By:</span>
              <span>{data.activatedBy?.name || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Acceptance Date:</span>
              <span>{formatDate(data.acceptanceDate) || "-"}</span>
            </div>
            <div className="flex flex-col pt-2 border-t">
              <span className="text-gray-500 mb-1">Remark:</span>
              <div className="relative flex items-center justify-end">
                {remarkStatus ? (
                  <button className="absolute right-3" onClick={() => setRemarkStatus(false)}>
                    <Edit className={`h-4 hover:opacity-50 transition-all duration-200 cursor-pointer`} />
                  </button>
                ) : (
                  <button className="absolute right-3" onClick={() => handleRemarkEdit()}>
                    <Send className={'h-4 hover:opacity-50 transition-all duration-200 cursor-pointer'} />
                  </button>
                )}
                <input 
                  type="text" 
                  value={remark} 
                  name="remark" 
                  disabled={remarkStatus} 
                  onChange={handleChange} 
                  className="w-full text-gray-700 italic bg-gray-50 p-2 rounded border-dashed border border-gray-200"
                />
              </div> 
            </div>
            {(user?.role == "admin" || user?.role == "project_manager" || user?.role == "order_generation") && (
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-500">Telco Circuit ID:</span>
                <span className="font-mono text-xs bg-gray-100 px-1 rounded">
                  {data.telecoCircuitId || "Pending"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
            Customer Info
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Company:</span>
              <span className="font-semibold text-gray-900 truncate">
                {data.customer?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact:</span>
              <span>{data.customer?.person}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <a href={`mailto:${data.customer?.email}`} className="text-blue-600 hover:underline">
                {data.customer?.email}
              </a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mobile:</span>
              <span>{data.customer?.mobile}</span>
            </div>
          </div>
        </div>

        {(user?.role != "project_manager" && user?.role != "order_generation") && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
              Service & Billing
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type & Bandwidth:</span>
                <span className="font-bold text-indigo-700">
                  {data.serviceType} - {data.bandwidth} Mbps
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">MRC:</span>
                <span className="font-semibold text-green-700">
                  {formatCurrency(data.commercials?.mrc)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Advance Paid:</span>
                <span>{formatCurrency(data.commercials?.advance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">OTC:</span>
                <span>{formatCurrency(data.commercials?.otc)}</span>
              </div>
              {data.ips?.count > 0 && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-500">IP Allocation:</span>
                  <span>
                    {data.ips.count} IPs ({formatCurrency(data.ips.cost)})
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="flex-[3] customScroller min-w-[60vw] overflow-auto max-h-[80vh]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-6 gap-4 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {data.fabCircuitId || data.opportunityId}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm uppercase tracking-wide ${getStatusColor(data.status)}`}>
                {data.status}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Created on {formatDate(data.createdAt)} by{" "}
              <span className="font-medium text-gray-700">
                {data.createdBy?.name || "Unknown"}
              </span>
            </p>
          </div>

          <div className="flex gap-2">
            <QuickActions
              status={data.status}
              userRole={user?.role}
              onApprove={handleApprove}
              onReject={handleReject}
              onGenerate={handleGenerate}
              onActivate={handleActivate}
              onCancel={handleCancel}
              connection={data}
              onDelete={handleDelete}
            />
          </div>
        </div>

        {data.status === "Rejected" && data.rejectionDetails && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
            <h3 className="text-red-800 font-bold text-sm">Connection Rejected</h3>
            <p className="text-red-700 text-sm mt-1">Reason: {data.rejectionDetails.reason}</p>
            <p className="text-red-500 text-xs mt-1">
              By: {data.rejectionDetails.rejectedBy?.name} on {formatDate(data.rejectionDetails.rejectedAt)}
            </p>
          </div>
        )}

        {(data.status === "Notice Period" || data.status === "Disconnected") && data.terminationDetails && (
          <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r shadow-sm">
            <h3 className="text-orange-800 font-bold text-sm">Termination Notice</h3>
            <div className="flex gap-6 mt-1 text-sm text-orange-700">
              <p>Raised: <span className="font-semibold">{formatDate(data.terminationDetails.raiseDate)}</span></p>
              <p>Final Disconnect: <span className="font-semibold">{formatDate(data.terminationDetails.finalDate)}</span></p>
            </div>
            <p className="text-orange-600 text-sm mt-1">Reason: {data.terminationDetails.reason}</p>
          </div>
        )}

        {/* NETWORK TOPOLOGY */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
            Network Topology
          </h2>

          <div className={`grid grid-cols-1 ${data.serviceType === "ILL" ? "md:grid-cols-2" : "md:grid-cols-3"} gap-6`}>
            
            {/* A-End Location (Always Visible) */}
            <div className="bg-gray-50 p-3 rounded border">
              <h3 className="text-[10px] uppercase font-bold text-indigo-500 mb-2">A-End Location</h3>
              <p className="text-sm font-medium text-gray-900 mb-1">BTS: {data.technicalDetails?.aEnd?.btsId || "Not Assigned"}</p>
              <p className="text-xs text-gray-600">{data.technicalDetails?.aEnd?.address || "No address provided"}</p>
            </div>

            {/* Render middle line and B-End ONLY if service is NOT ILL */}
            {data.serviceType !== "ILL" ? (
              <>
                <div className="flex flex-col items-center justify-center text-center p-3">
                  <div className="w-full h-px bg-gray-300 mb-2"></div>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {data.technicalDetails?.telcoProvider || "Unknown Provider"}
                  </span>
                  <div className="w-full h-px bg-gray-300 mt-2"></div>
                </div>

                <div className="bg-gray-50 p-3 rounded border">
                  <h3 className="text-[10px] uppercase font-bold text-indigo-500 mb-2">B-End Location</h3>
                  <p className="text-sm font-medium text-gray-900 mb-1">BTS: {data.technicalDetails?.bEnd?.btsId || "Not Assigned"}</p>
                  <p className="text-xs text-gray-600">{data.technicalDetails?.bEnd?.address || "No address provided"}</p>
                </div>
              </>
            ) : (
              /* If ILL, show a sleek "Internet Direct" badge instead of B-End */
              <div className="flex flex-col justify-center items-start p-3">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-1 border border-indigo-200">
                  {data.technicalDetails?.telcoProvider || "Unknown"} Provider
                </span>
                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Direct to Internet (ILL)
                </span>
              </div>
            )}
          </div>
        </div>

        {(user?.role == "admin" || user?.role == "owner" || user?.role == "employee" ) && (data.purchaseOrder || data.caf || data.businessAgreement) && (
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b pb-2">
              Connection Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderDocCard("Purchase Order", data.purchaseOrder)}
              {renderDocCard("CAF Document", data.caf)}
              {renderDocCard("Business Agreement", data.businessAgreement)}
            </div>
          </div>
        )}

        <div className="mt-6">
          <HistoryTimeline history={data.history} />
        </div>
      </div>
    </div>
  );
}

export default OpportunityDetails;