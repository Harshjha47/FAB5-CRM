import React, { useState } from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import InputUnit from "../Utils/InputUnit";
import { Link, useNavigate } from "react-router-dom";
import { RegisterSchema } from "../../Services/AuthSchema";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";

function Signup() {
  const [tog, setTog] = useState(false);
    const {sendOTP, setRegisterData,genrateOtp,setOtpData}=useAuth()
    const navigate= useNavigate()

  
  const onSubmit = async (values, actions) => {
    try {
      actions.resetForm();
      const otp=genrateOtp()
      setOtpData(otp)
      setRegisterData(values)
      sendOTP(values.email,otp)
      navigate('/auth/varification')
    } catch (err) {
      console.log(err);
      toast.error("User Login Failed");
    }
  };
  const {
    values,
    handleChange,
    touched,
    handleBlur,
    isSubmitting,
    handleSubmit,
    errors,
  } = useFormik({
    initialValues: {
      password: "",
      email: "",
    },
    validationSchema: RegisterSchema,
    onSubmit,
  });
  return (
    <>
        <form action="" onSubmit={handleSubmit} className=" flex flex-col p-2 w-full  md:w-[75%] gap-3">
          <div className="w-full flex flex-col justify-center items-center py-4 ">
            <h2 className="font-serif font-light text-4xl">Create account</h2>
            <p className="text-xs">
              Enter email and password to create an account
            </p>
          </div>
          <InputUnit
            type="email"
            placeholder="Enter your Email"
            name="email"
            label="Email"
            em={errors.email}
            value={values.email}
            change={handleChange}
          />
          <div className="w-full">
            <InputUnit
              type={tog ? "text" : "password"}
              placeholder="Create a password"
              name="password"
              label="Create Password"
              em={errors.password}
              value={values.password}
              change={handleChange}
            />
            <div className="flex justify-between px-2 leading-[1] text-sm pt-1">
              <div
                className=" flex gap-1 items-center"
                onClick={() => {
                  setTog(!tog);
                }}
              >
                {tog ? (
                  <span className="text-base text-blue-500">
                    <MdCheckBox />
                  </span>
                ) : (
                  <span className="text-base ">
                    <MdCheckBoxOutlineBlank />
                  </span>
                )}
                Show password
              </div>
            </div>
          </div>
          <div className="py-3 w-full  flex justify-center items-center">
            <button className="shadow-md hover:shadow transition-all duration-200 hover:shadow-[#85858579] shadow-[#8585857c] w-full p-[10px] rounded-md bg-[#111] text-white ">
              Create account
            </button>
          </div>
        </form>
        <div className="text-xs p-2">
          Already have an account ?{" "}
          <Link to={`/auth/login`} className=" cursor-pointer font-semibold">
            Sign in
          </Link>
        </div>
    </>
  );
}

export default Signup;
