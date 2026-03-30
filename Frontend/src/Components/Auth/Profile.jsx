import { useEffect, useState } from "react";
import { InputUnit } from "../Utils/InputUnit";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { updateProfile,user, } = useAuth()
  const navigate = useNavigate()

  useEffect(()=>{
    if(user?.isProfileComplete){
      navigate("/dashboard")
    }
  },[user])
  
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [details, setDetails] = useState({
    name: user?.name||"",
    dob: user?.dob||"",
    phone: user?.phone||"",
    adharNumber: user?.adharNumber||"",
    panNumber: user.panNumber||"",
  })

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await updateProfile(details)
    setIsSubmitting(false);
  };

  return (
    <main className="h-screen w-full flex justify-center items-center bg-[#EBEDEC]">
      <section className="h-[95%] border-black  bg-white rounded-[38px] flex justify-between w-[95%] md:w-[60%] p-2">
        <aside className="h-full w-[48%]  rounded-[30px] bg-[#111] p-8 justify-between hidden md:flex flex-col text-white">
          <div className="w-[80%] flex items-center gap-3 uppercase ">
            Start with <div className="border-b flex-1"></div>
          </div>
          <div className="w-[80%]">
            <h1 className="font-serif font-thin text-4xl">
              Complete your Profile to get started
            </h1>
            {/* <p className="text-[10px] flex flex-col leading-[1.1] pt-2">
              <span>Developed by : {`</> Harsh Jha`}</span>
              <span>Powerd by : {`</Div>`}</span>
            </p> */}
          </div>
        </aside>
        <section className="h-full  w-full md:w-[51%] rounded-[30px] flex flex-col justify-between items-center">
          <div className="p-2"></div>
          <form
            action=""
            onSubmit={handleSubmit}
            className="flex flex-col p-2 w-full  md:w-[75%] gap-3"
          >
            <div className="w-full flex flex-col justify-center items-center py-4 ">
              <h2 className="font-serif font-light text-3xl">Personal Details</h2>
              <p className="text-xs">Fill in your personal details to complete setup</p>
            </div>
            <InputUnit
              type="text"
              placeholder="Enter your Full Name"
              name="name"
              label="Full Name"
              change={handleChange}
              value={details.name}
            />
            <InputUnit
              type="text"
              placeholder="Enter your phone number"
              name="phone"
              value={details.phone}
              change={handleChange}
              label="Phone Number"
            />
            <InputUnit
              type="date"
              placeholder=""
              name="dob"
              label="Date of Birth"
              value={details.dob}
              change={handleChange}
              max={getTodayString()}
            />
            <InputUnit
              type="text"
              placeholder="Enter your Adhar number"
              name="adharNumber"
              value={details.adharNumber}
              change={handleChange}
              label="Adhar Number"
              maxLength={12}
            />
            <InputUnit
              type="text"
              placeholder="Enter your PAN number"
              name="panNumber"
              value={details.panNumber}
              change={handleChange}
              label="Pan Number"
              maxLength={10}
            />
            <div className="py-3 w-full  flex justify-center items-center">
              <button
                type="submit"
                className="w-full border p-[10px] rounded-md bg-[#111] text-white "
              >
                {isSubmitting ? "Save..." : "Save & Continue"}
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

export default Profile;
