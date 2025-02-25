import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AiOutlineArrowLeft } from "react-icons/ai";


const ResetPassword = () => {
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = new URLSearchParams(location.search).get("email");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axiosInstance.post("/auth/reset-password", {
                email,
                resetPasswordOtp: otp,
                newPassword: password,
            });

            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.message || "Invalid OTP or something went wrong!");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-bg-main">
            <div className="bg-white p-8 rounded-lg shadow-md w-[400px] text-center">
                <h2 className="text-2xl font-semibold text-title-blue">Reset Your Password</h2>
                <p className="text-dark-grey text-sm mt-2">
                    Enter the verification code sent to <span className="font-medium">{email}</span> along with your new password.
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-light-grey rounded-lg mt-1 bg-bg-main focus:outline-none focus:ring-1 focus:ring-main-blue text-center tracking-widest text-xl"
                        maxLength="6"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-light-grey rounded-lg mt-3 bg-bg-main focus:outline-none focus:ring-1 focus:ring-main-blue"
                        placeholder="New Password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-main-blue text-white py-2 rounded-lg hover:bg-title-blue transition-all mt-4">
                        Reset Password
                    </button>
                </form>

                {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

                <button
                    onClick={() => navigate("/forgot-password")}
                    className="mt-4 text-sm text-main-blue  flex items-center justify-center gap-1 hover:text-dark-blue"
                >
                    <AiOutlineArrowLeft size={16} />
                    Back to Forgot Password
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
