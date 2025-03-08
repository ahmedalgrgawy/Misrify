import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { LuMail } from "react-icons/lu";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckGmail = () => {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email") || "";

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axiosInstance.post("/auth/verify-email", {
                email,
                otp: String(otp),
            });

            if (response.data.success) {
                toast.success("OTP Verified Successfully!");
                navigate(`/reset-password?email=${encodeURIComponent(email)}`);
            } else {
                setError("Invalid OTP");
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || "Error verifying OTP.";
            setError(errMsg);
            toast.error(errMsg);
        }
    };

    const handleResend = async () => {
        setError("");

        try {
            const response = await axiosInstance.post("/auth/forgot-password", { email });

            if (response.data.success) {
                toast.success("A new OTP has been sent to your email.");
            }
        } catch (err) {
            const errMsg = err.response?.data?.message || "Error resending OTP.";
            setError(errMsg);
            toast.error(errMsg);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-bg-main p-6">
            <div className="bg-white p-8 rounded-lg shadow-md w-[400px] text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-[#f6caff] p-3 rounded-full">
                        <LuMail className="text-[#9e00bd] text-2xl" />
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-title-blue">Check Your Email</h2>
                <p className="text-dark-grey text-sm mt-2">
                    We sent a password reset code to{" "}
                    <span className="font-medium">{email}</span>.
                </p>
                <form onSubmit={handleVerifyOTP} className="mt-6">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-3 py-2 border border-second-grey rounded-lg mt-1 bg-bg-main focus:outline-none focus:ring-1 focus:ring-main-blue text-center tracking-widest text-xl"
                        required
                    />
                    <button
                        type="submit"
                        className="mt-4 w-full bg-main-blue text-white py-2 rounded-lg hover:bg-dark-blue transition-all"
                    >
                        Verify OTP
                    </button>
                </form>

                {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 text-sm text-main-blue flex items-center justify-center gap-1 hover:text-dark-blue"
                >
                    <AiOutlineArrowLeft size={16} />
                    Back to Log In
                </button>

                <p className="mt-4 text-sm text-dark-grey">
                    You don’t receive the email?{" "}
                    <span
                        className="text-main-blue cursor-pointer hover:text-dark-blue"
                        onClick={handleResend}
                    >
                        Resend
                    </span>
                </p>
            </div>
        </div>
    );
};

export default CheckGmail;
