import React, { useEffect } from "react";
import { formatDate } from "../../Services/dateFormat";
import { useCustomer } from "../../Context/CustomerContext";
import { useParams } from "react-router-dom";

function ActionDetails({ logInfo }) {
  const {getCustomerById}=useCustomer()
  const {id}=useParams()
  return (
    <>
      {logInfo?.action == "DISCONNECT_INITIATED" && (
        <div className="flex">
          <div className=" p-2">
            <p>Action</p>
            <p>By</p>
            <p>On</p>
            <p>To</p>
            <p>Reason</p>
          </div>
          <div className=" p-2">
            <p>: {logInfo?.action}</p>
            <p>: {logInfo?.performedBy?.email}</p>
            <p>: {formatDate(logInfo?.date)}</p>
            <p>: {formatDate(logInfo?.newDate)}</p>
            <p>: {logInfo?.reason}</p>
          </div>
        </div>
      )}
      {logInfo?.action == "EXTENDED" && (
        <div className="flex">
          <div className=" p-2">
            <p>Action</p>
            <p>By</p>
            <p>On</p>
            <p>To</p>
            <p>From</p>
          </div>
          <div className=" p-2">
            <p>: {logInfo?.action}</p>
            <p>: {logInfo?.performedBy?.email}</p>
            <p>: {formatDate(logInfo?.date)}</p>
            <p>: {formatDate(logInfo?.newDate)}</p>
            <p>: {formatDate(logInfo?.previousDate)}</p>
          </div>
        </div>
      )}
      {logInfo?.action == "TRANSFERRED" && (
        <div className="flex">
          <div className=" p-2">
            <p>Action</p>
            <p>By</p>
            <p>On</p>
          </div>
          <div className=" p-2">
            <p>: {logInfo?.action}</p>
            <p>: {logInfo?.performedBy?.email}</p>
            <p>: {formatDate(logInfo?.date)}</p>
          </div>
        </div>
      )}
      {logInfo?.action == "RETAINED" && (
        <div className="flex">
          <div className=" p-2">
            <p>Action</p>
            <p>By</p>
            <p>On</p>
          </div>
          <div className=" p-2">
            <p>: {logInfo?.action}</p>
            <p>: {logInfo?.performedBy?.email}</p>
            <p>: {formatDate(logInfo?.date)}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ActionDetails;
