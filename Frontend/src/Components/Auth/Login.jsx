import React, { useState } from "react";
import InputUnit from "../Utils/InputUnit";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { MdCheckBox } from "react-icons/md";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { LoginSchema } from "../../Services/AuthSchema";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";

function Login() {
  const [tog, setTog] = useState(false);
  const { LoginUser } = useAuth();

  const onSubmit = async (values, actions) => {
    try {
      actions.resetForm();
      LoginUser(values);
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
    validationSchema: LoginSchema,
    onSubmit,
  });
  return (
    <>
      <form
        action=""
        onSubmit={handleSubmit}
        className="  flex flex-col p-2 w-full  md:w-[75%] gap-3"
      >
        <div className="w-full flex flex-col justify-center items-center py-4 ">
          <h2 className="font-serif font-light text-4xl">Welcome Back</h2>
          <p className="text-xs">
            Enter your email and password to access your account
          </p>
        </div>
        <InputUnit
          type="email"
          placeholder="Enter your Email"
          name="email"
          label="Email"
          value={values.email}
          em={errors.email}
          change={handleChange}
        />
        <div className="w-full">
          <InputUnit
            type={tog ? "text" : "password"}
            placeholder="Enter your password"
            name="password"
            label="Password"
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
            <Link to={"/auth/reset"} className="">
              forget password?
            </Link>
          </div>
        </div>
        <div className="py-3 w-full  flex justify-center items-center">
          <button
            type="submit"
            className="w-full border p-[10px] rounded-md bg-[#111] text-white "
          >
            Sign in
          </button>
        </div>
      </form>
      <div className="text-xs p-2">
        Don't have an account ?{" "}
        <Link to={`/auth`} className=" cursor-pointer font-semibold">
          Create account
        </Link>
      </div>
    </>
  );
}

export default Login;
