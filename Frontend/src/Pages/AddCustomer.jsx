import React, { useState } from "react";
import { InputUnitFlow } from "../Components/Utils/InputUnit";
import { useCustomer } from "../Context/CustomerContext";
import { Link, useNavigate } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
import toast from "react-hot-toast";

function AddCustomer() {
  const { newCustommer, setNewCustomer, createCustomer, newCustomeInit } = useCustomer();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [billing, setBilling] = useState(
    newCustommer?.billingProfiles.length > 0
      ? newCustommer?.billingProfiles:[]
      // : [{ label: "", gstNumber: "", address: { street: "", pincode: "", city: "", state: "" } }]
  );

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustommer, [name]: value });
  };

  const handleBillingChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBilling = [...billing];
    const addressFields = ["street", "pincode", "city", "state"];

    if (addressFields.includes(name)) {
      updatedBilling[index].address = {
        ...updatedBilling[index].address,
        [name]: value,
      };
    } else {
      updatedBilling[index][name] = value;
    }
    setBilling(updatedBilling);
    setNewCustomer({ ...newCustommer, billingProfiles: updatedBilling });
  };

  const extentBillingAddresses = () => {
    setBilling([...billing, { label: "", gstNumber: "", address: { street: "", pincode: "", city: "", state: "" } }]);
  };

  // --- Document Handlers ---
  const handleDocChange = (type, index, field, value) => {
    const docKey = type === "company" ? "companyDocs" : "signatoryDocs";
    const updatedDocs = [...newCustommer[docKey]];
    updatedDocs[index][field] = value;
    setNewCustomer({ ...newCustommer, [docKey]: updatedDocs });
  };

  const addDocField = (type) => {
    const docKey = type === "company" ? "companyDocs" : "signatoryDocs";
    const defaultType = type === "company" ? "Company PAN" : "PAN";
    setNewCustomer({
      ...newCustommer,
      [docKey]: [...newCustommer[docKey], { file: null, documentType: defaultType }]
    });
  };

  const removeDocField = (type, index) => {
    const docKey = type === "company" ? "companyDocs" : "signatoryDocs";
    const updatedDocs = [...newCustommer[docKey]];
    updatedDocs.splice(index, 1);
    setNewCustomer({ ...newCustommer, [docKey]: updatedDocs });
  };

  // --- Submit Handler ---
  const handalSubmit = async (e) => {
    console.log("1");
    
    e.preventDefault();
    if (isSubmitting) return;

    // Validation for files
    const hasCompanyFile = newCustommer.companyDocs.some(doc => doc.file !== null);
    const hasSignatoryFile = newCustommer.signatoryDocs.some(doc => doc.file !== null);
    
    if (!hasCompanyFile) return toast.error("Please upload at least one company document.");
    if (!hasSignatoryFile) return toast.error("Please upload at least one signatory document.");

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", newCustommer.name);
      formData.append("person", newCustommer.person);
      formData.append("email", newCustommer.email);
      formData.append("mobile", newCustommer.mobile);
      formData.append("customerType", newCustommer.customerType);
    console.log("2");

      
      formData.append("billingProfiles", JSON.stringify(billing));

      // Append Company Documents
      newCustommer.companyDocs.forEach((doc) => {
        if (doc.file) {
          formData.append("companyDocuments", doc.file);
          formData.append("companyDocumentsType", doc.documentType);
        }
      });

      // Append Signatory Documents
      newCustommer.signatoryDocs.forEach((doc) => {
        if (doc.file) {
          formData.append("signatoryDocuments", doc.file);
          formData.append("signatoryDocumentsType", doc.documentType);
        }
      });
    for (let [key, value] of formData.entries()) {
  console.log(key, value);
}

      await createCustomer(formData);
      navigate("/dashboard");
      setNewCustomer(newCustomeInit); 

    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex flex-col h-[90vh] overflow-auto customScroller">
      <form className="flex flex-col justify-between w-full p-6 gap-10" onSubmit={handalSubmit}>
        <Link to={"/dashboard"} className="py-2 flex items-center gap-4">
          <SlArrowLeft /> Back
        </Link>

        {/* --- Customer Details --- */}
        <section className="flex flex-col gap-6">
          <h3 className="text-3xl">Customer Details</h3>
          <InputUnitFlow type="text" placeholder="Enter customer name" name="name" label="Customer Name" change={handleCustomerChange} value={newCustommer.name} required />
          <div className="flex flex-col gap-4 border-b pb-4">
            <label htmlFor="customerType" className="text-sm">Customer Type</label>
            <select name="customerType" id="customerType" onChange={handleCustomerChange} className="w-full outline-none bg-transparent" value={newCustommer.customerType} required>
              <option value="">Select</option>
              {["Enterprise", "ISP", "Operator", "Government"].map((e, i) => (
                <option key={i} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <InputUnitFlow type="text" placeholder="Enter contact person name" name="person" label="Contact Person" change={handleCustomerChange} value={newCustommer.person} required />
          <InputUnitFlow type="text" placeholder="Enter contact number" name="mobile" maxLength={10} label="Contact Number" change={handleCustomerChange} value={newCustommer.mobile} required />
          <InputUnitFlow type="email" placeholder="Enter contact email" name="email" label="Contact Email" change={handleCustomerChange} value={newCustommer.email} required />
        </section>

        {/* --- Document Uploads --- */}
        <section className="flex flex-col gap-6 border p-4 rounded-md">
          <h3 className="text-2xl">KYC Documents</h3>

          {/* Company Documents */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Company Documents</h4>
              <button type="button" onClick={() => addDocField("company")} className="text-sm bg-gray-200 px-3 py-1 rounded">Add More</button>
            </div>
            {newCustommer?.companyDocs?.map((doc, i) => (
              <div key={i} className="flex gap-4 items-center bg-gray-50 p-2 rounded">
                <select 
                  value={doc.documentType} 
                  onChange={(e) => handleDocChange("company", i, "documentType", e.target.value)}
                  className="p-2 border rounded outline-none"
                >
                  <option value="Incorporation Certificate">Incorporation Certificate</option>
                  <option value="Company PAN">Company PAN</option>
                  <option value="ISP License">ISP License</option>
                </select>
                <input 
                  type="file" 
                  accept=".pdf, application/pdf"
                  onChange={(e) => handleDocChange("company", i, "file", e.target.files[0])} 
                  className="flex-1 border-b"
                  required={i === 0}
                />
                {i > 0 && (
                  <button type="button" onClick={() => removeDocField("company", i)} className="text-red-500 font-bold">X</button>
                )}
              </div>
            ))}
          </div>

          <hr />

          {/* Signatory Documents */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Signatory Documents</h4>
              <button type="button" onClick={() => addDocField("signatory")} className="text-sm bg-gray-200 px-3 py-1 rounded">Add More</button>
            </div>
            {newCustommer.signatoryDocs?.map((doc, i) => (
              <div key={i} className="flex gap-4 items-center bg-gray-50 p-2 rounded">
                <select 
                  value={doc.documentType} 
                  onChange={(e) => handleDocChange("signatory", i, "documentType", e.target.value)}
                  className="p-2 border rounded outline-none"
                >
                  <option value="PAN">PAN</option>
                  <option value="AADHAAR">AADHAAR</option>
                </select>
                <input 
                  type="file" 
                  accept=".pdf, application/pdf"
                  onChange={(e) => handleDocChange("signatory", i, "file", e.target.files[0])} 
                  className="flex-1 border-b"
                  required={i === 0}
                />
                {i > 0 && (
                  <button type="button" onClick={() => removeDocField("signatory", i)} className="text-red-500 font-bold">X</button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* --- Billing Details --- */}
        {billing?.map((item, i) => (
          <section className="flex flex-col gap-6" key={i}>
            <h3 className="text-3xl">Billing Details #{i + 1}</h3>
            <InputUnitFlow type="text" placeholder="Enter Billing label" name="label" label="Billing label" value={item.label} change={(e) => handleBillingChange(i, e)} />
            <InputUnitFlow type="text" placeholder="Enter GST Number" name="gstNumber" label="GST Number" value={item.gstNumber} change={(e) => handleBillingChange(i, e)} />
            <InputUnitFlow type="text" placeholder="Enter street Address" name="street" label="Street Address" value={item.street} change={(e) => handleBillingChange(i, e)} />
            <InputUnitFlow type="text" placeholder="Enter pincode" name="pincode" label="Pincode" value={item.pincode} change={(e) => handleBillingChange(i, e)} />
            <InputUnitFlow type="text" placeholder="Enter city" name="city" label="City" value={item.city} change={(e) => handleBillingChange(i, e)} />
            <InputUnitFlow type="text" placeholder="Enter state" name="state" label="State" value={item.state} change={(e) => handleBillingChange(i, e)} />
          </section>
        ))}

        <div className="flex justify-between gap-2">
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`border flex-1 p-2 text-lg rounded-md mb-[25vh] bg-[#009FF3] text-white font-semibold ${isSubmitting ? "cursor-not-allowed opacity-70" : "hover:bg-[#007acc] cursor-pointer"}`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <div
            onClick={extentBillingAddresses}
            className="border text-center p-2 flex-1 text-lg cursor-pointer hover:bg-[#494949] rounded-md mb-[25vh] bg-[#9b9b9b] text-white font-semibold"
          >
            Add New GST ID
          </div>
        </div>
      </form>
    </section>
  );
}

export default AddCustomer;