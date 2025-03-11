import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { LuKeyRound } from "react-icons/lu";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const email = new URLSearchParams(location.search).get("email") || "";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axiosInstance.post("/auth/reset-password", {
                email,
                newPassword,
                resetPasswordOtp: new URLSearchParams(location.search).get("otp"),
            });
            if (response.data.success) {
                navigate("/password-success");
            } else {
                setError("Failed to reset password.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Server error, please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-bg-main p-6">
            <div className="bg-white p-8 rounded-2xl shadow-md w-[400px] text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-[#E8EFFF] p-3 rounded-full">
                        <LuKeyRound className="text-[#3E63DD] text-2xl" />
                    </div>
                </div>
                <h2 className="text-title-blue text-2xl font-bold">Set New Password</h2>
                <p className="text-dark-grey text-sm text-center">
                    Your new password must be different from the previously used password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-light-grey rounded-lg bg-bg-main focus:outline-none focus:ring-1 focus:ring-dark-grey pr-10"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2/3 transform -translate-y-3 text-title-blue"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-light-grey rounded-lg bg-bg-main focus:outline-none focus:ring-1 focus:ring-dark-grey pr-10"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2/3 transform -translate-y-3 text-title-blue"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-main-blue text-white px-4 py-2 rounded-lg hover:bg-dark-blue transition-all mt-4"
                    >
                        Reset Password
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
            </div>
        </div>
    );
};

export default ResetPassword;
