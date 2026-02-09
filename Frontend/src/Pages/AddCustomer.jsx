import React, { useState } from "react";
import { InputUnitFlow } from "../Components/Utils/InputUnit";
import { useCustomer } from "../Context/CustomerContext";
import { Link } from "react-router-dom";
import { SlArrowLeft } from "react-icons/sl";
function AddCustomer() {
  const { newCustommer, setNewCustomer,createCustomer } = useCustomer();
  const [billing, setBilling] = useState(
    newCustommer.billingProfiles.length > 0
      ? newCustommer.billingProfiles
      : [
          {
            label: "",
            gstNumber: "",
            address: { street: "", pincode: "", city: "", state: "" },
          },
        ],
  );

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustommer, [name]: value });
  };

  const handleBillingChange = (index, e) => {
    const { name, value } = e.target;
    const updatedBilling = [...billing];

    // Check if the field belongs to the nested 'address' object
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
    // Sync back to context
    setNewCustomer({ ...newCustommer, billingProfiles: updatedBilling })
    
  };

  // 3. Add New Empty Profile
  const extentBillingAddresses = () => {
    const newProfile = {
      label: "",
      gstNumber: "",
      address: { street: "", pincode: "", city: "", state: "" },
    };
    setBilling([...billing, newProfile]);
  };

  const handalSubmit= async (e)=>{
    e.preventDefault()
    await createCustomer(newCustommer)

  }

  return (
    <section className=" flex flex-col ">
      <form
        action=""
        className=" flex flex-col justify-between w-full p-6 gap-10 "
        onSubmit={handalSubmit}
      >
      <Link to={"/dashboard"} className=" py-2 flex items-center gap-4"><SlArrowLeft/>Dashboard</Link>

        <section className="  flex flex-col gap-6">
          <h3 className="text-3xl">Customer Details</h3>
          <InputUnitFlow
            type="text"
            placeholder="Enter customer name"
            name="name"
            label="Customer Name"
            change={handleCustomerChange}
            value={newCustommer.name}
          />
          <InputUnitFlow
            type="text"
            placeholder="Enter contact person name "
            name="person"
            label="Contact Person"
            change={handleCustomerChange}
            value={newCustommer.person}
          />
          <InputUnitFlow
            type="text"
            placeholder="Enter contact number"
            name="mobile"
            label="Contact Number"
            change={handleCustomerChange}
            value={newCustommer.mobile}
          />
          <InputUnitFlow
            type="email"
            placeholder="Enter contact email"
            name="email"
            label="Contact Email"
            change={handleCustomerChange}
            value={newCustommer.email}
          />
        </section>

        {billing?.map((item, i) => {
          return (
            <section className="flex flex-col gap-6" key={i}>
              <h3 className="text-3xl">Billing Details #{i + 1}</h3>
              <InputUnitFlow
                type="text"
                placeholder="Enter Billing label"
                name="label"
                label="Billing label"
                value={item.label}
                change={(e) => handleBillingChange(i, e)}
              />

              <InputUnitFlow
                type="text"
                placeholder="Enter GST Number"
                name="gstNumber"
                label="GST Number"
                value={item.gstNumber}
                change={(e) => handleBillingChange(i, e)}
              />

              <InputUnitFlow
                type="text"
                placeholder="Enter street Address"
                name="street"
                label="Street Address"
                value={item.street}
                change={(e) => handleBillingChange(i, e)}
              />
              <InputUnitFlow
                type="text"
                placeholder="Enter pincode"
                name="pincode"
                label="Pincode"
                value={item.pincode}
                change={(e) => handleBillingChange(i, e)}
              />
              <InputUnitFlow
                type="text"
                placeholder="Enter city"
                name="city"
                label="City"
                value={item.city}
                change={(e) => handleBillingChange(i, e)}
              />
              <InputUnitFlow
                type="text"
                placeholder="Enter state"
                name="state"
                label="State"
                value={item.state}
                change={(e) => handleBillingChange(i, e)}
              />
            </section>
          );
        })}

        <div className="flex justify-between gap-2">
          <button type="submit" className="border flex-1 p-2 text-lg rounded-md mb-[25vh] bg-[#009FF3] text-white font-semibold">
            Submit
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
