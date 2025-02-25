import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { AiOutlineArrowLeft } from "react-icons/ai";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await axiosInstance.post("/auth/forgot-password", { email });
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong!");
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-bg-main">
            <div className="bg-white p-8 rounded-lg shadow-md w-[400px] text-center">
                <h2 className="text-2xl font-semibold text-title-blue">Forgotten your password?</h2>
                <p className="text-dark-grey text-sm mt-2">
                    Enter your email, and we’ll send a verification code to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="text-left mb-4">
                        <label className="block text-sm font-medium text-title-blue">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border border-light-grey rounded-lg mt-1 bg-bg-main focus:outline-none focus:ring-1 focus:ring-main-blue"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-main-blue text-white py-2 rounded-lg hover:bg-title-blue transition-all"
                    >
                        Send Verification Code
                    </button>
                </form>

                {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 text-sm text-main-blue flex items-center justify-center gap-1 hover:text-dark-blue"
                >
                    <AiOutlineArrowLeft size={16} />
                    Back To Log In
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;
