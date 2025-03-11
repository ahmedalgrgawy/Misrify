import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PasswordSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-bg-main p-6">
            <div className="bg-white p-8 rounded-2xl shadow-md w-[400px] text-center">
                <div className="flex justify-center items-center mb-4">
                    <div className="bg-green-200 p-3 rounded-full">
                        <FaCheckCircle className="text-green-600 text-3xl" />
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-title-blue">Password Reset</h2>
                <p className="text-dark-grey text-sm mt-2">
                    Your password has been successfully reset. Click below to log in.
                </p>
                <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-main-blue text-white py-2 rounded-lg hover:bg-dark-blue transition-all mt-4"
                >
                    Back to Log In
                </button>
            </div>
        </div>
    );
};

export default PasswordSuccess;
