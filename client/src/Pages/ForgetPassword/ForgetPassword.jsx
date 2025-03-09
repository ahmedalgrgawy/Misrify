import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { LuKeyRound } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { setOtp } from "../../features/authSlice";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axiosInstance.post("/auth/forgot-password", { email });
            dispatch(setOtp(res.data.otp));
            navigate(`/check-gmail?email=${encodeURIComponent(email)}`);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong!");
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-bg-main">
            <div className="bg-white p-10 rounded-xl shadow-lg w-[420px] text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-[#E8EFFF] p-3 rounded-full">
                        <LuKeyRound className="text-[#3E63DD] text-2xl" />
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-main-blue">Forgotten your password?</h2>
                <p className="text-dark-grey text-sm mt-2">
                    There is nothing to worry about, we’ll send you a message to help you reset your password.
                </p>
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="text-left mb-4">
                        <label className="block text-sm font-medium text-title-blue">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-second-grey rounded-lg mt-1 bg-bg-main focus:outline-none focus:ring-1 focus:ring-light-grey"
                            placeholder="Enter personal or work email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-main-blue text-white py-2 rounded-lg hover:bg-title-blue transition-all"
                    >
                        Send Reset Code
                    </button>
                </form>
                {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 text-sm text-title-blue flex items-center justify-center gap-1 hover:text-dark-blue"
                >
                    <AiOutlineArrowLeft size={16} />
                    Back To Log In
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;
