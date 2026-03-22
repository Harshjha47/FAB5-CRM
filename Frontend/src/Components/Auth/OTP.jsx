import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InputUnit } from "../Utils/InputUnit";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/AuthContext";

function OTP() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { verifyOtpAndRegister, sendRegistrationOtp } = useAuth();
  const navigate = useNavigate();

  const email = sessionStorage.getItem("reg_email");
  const pass = sessionStorage.getItem("reg_password");
  useEffect(() => {
    if (!email || !pass) {
      navigate("/auth");
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setIsSubmitting(true);
    const success = await verifyOtpAndRegister(email, pass, otp);
    if (success) {
      sessionStorage.removeItem("reg_email");
      sessionStorage.removeItem("reg_password");
    }
    setIsSubmitting(false);
  };

  const handleResend = async () => {
    const success = await sendRegistrationOtp(email, pass);
    if (success) {
      setOtp("");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className=" flex  h-full flrx justify-center  flex-col p-2 w-full  md:w-[75%] gap-3 ">
        <div className="w-full flex flex-col justify-center items-center py-4 ">
          <h2 className="font-serif font-light text-4xl">Verify Code</h2>
          <p className="text-xs text-center">Enter 6 digit code sent to <strong>{email}</strong></p>
        </div>

        <InputUnit
          type="text"
          placeholder="Enter your OTP"
          name="otp"
          label="Verification Code"
          value={otp}
          change={(e) => setOtp(e.target.value)}
          maxLength={6}
        />

        <div
          className="w-full flex px-1 justify-end text-sm cursor-pointer text-blue-500"
          onClick={handleResend}
        >
          Resend OTP
        </div>

        <div className="py-3 w-full  flex justify-center items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border p-[10px] rounded-md bg-[#111] text-white ">
            {isSubmitting ? "Verifying..." : "Verify"}
          </button>
        </div>
      </form>
    </>
  );
}

export default OTP;
