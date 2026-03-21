import { useState } from "react";
import { InputUnit } from "../Utils/InputUnit";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { LoginSchema } from "../../Services/AuthSchema";
import { useAuth } from "../../Context/AuthContext";

function Login() {
  const [tog, setTog] = useState(false);
  const { login,UserProfile } = useAuth();
  const navigate=useNavigate()

  const onSubmit = async (values, actions) => {
    try {
      await login(values.email, values.password);
      await UserProfile()
      navigate("/dashboard")
      actions.setSubmitting(false);
    } catch (err) {}
  };

  const {
    values,
    handleChange,
    handleBlur,
    isSubmitting,
    handleSubmit,
    errors,
  } = useFormik({
    initialValues: { password: "", email: "" },
    validationSchema: LoginSchema,
    onSubmit,
  });

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-2 w-full  md:w-[75%] gap-3"
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
          onBlur={handleBlur}
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
            onBlur={handleBlur}
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
              Forget password?
            </Link>
          </div>
        </div>

        <div className="py-3 w-full  flex justify-center items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border p-[10px] rounded-md bg-[#111] text-white disabled:opacity-50"
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </div>
      </form>

      <div className="text-xs p-2">
        Don't have an account?{" "}
        <Link to={`/auth`} className=" cursor-pointer font-semibold">
          Create account
        </Link>
      </div>
    </>
  );
}

export default Login;
