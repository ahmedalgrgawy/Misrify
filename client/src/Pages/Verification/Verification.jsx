import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyAccount } from "../../features/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

const Verification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const email = location.state?.email || "";

    const [otpDigits, setOtpDigits] = useState({
        digit1: "",
        digit2: "",
        digit3: "",
        digit4: "",
    });

    const digit1Ref = useRef(null);
    const digit2Ref = useRef(null);
    const digit3Ref = useRef(null);
    const digit4Ref = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
        setOtpDigits((prev) => ({ ...prev, [name]: sanitizedValue }));

        if (sanitizedValue !== "") {
            if (name === "digit1" && digit2Ref.current) {
                digit2Ref.current.focus();
            } else if (name === "digit2" && digit3Ref.current) {
                digit3Ref.current.focus();
            } else if (name === "digit3" && digit4Ref.current) {
                digit4Ref.current.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otp = Object.values(otpDigits).join("");
        const numericOtp = Number(otp);
        const result = await dispatch(verifyAccount({ email: user.email, otp: numericOtp }));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/login");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-2 text-center text-title-blue">
                    Verify Your Account
                </h2>
                <p className="text-center mb-6 text-title-blue">
                    Please Enter The 4 Digit Code Sent To <strong>{email}</strong>
                </p>

                {error && (
                    <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center items-center space-x-2">
                        <input
                            type="text"
                            name="digit1"
                            value={otpDigits.digit1}
                            onChange={handleChange}
                            maxLength="1"
                            ref={digit1Ref}
                            className="w-12 h-12 border border-light-grey hover:border-dark-grey rounded-md text-center text-2xl"
                            required
                        />
                        <input
                            type="text"
                            name="digit2"
                            value={otpDigits.digit2}
                            onChange={handleChange}
                            maxLength="1"
                            ref={digit2Ref}
                            className="w-12 h-12 border border-light-grey hover:border-dark-grey rounded-md text-center text-2xl"
                            required
                        />
                        <input
                            type="text"
                            name="digit3"
                            value={otpDigits.digit3}
                            onChange={handleChange}
                            maxLength="1"
                            ref={digit3Ref}
                            className="w-12 h-12 border border-light-grey hover:border-dark-grey rounded-md text-center text-2xl"
                            required
                        />
                        <input
                            type="text"
                            name="digit4"
                            value={otpDigits.digit4}
                            onChange={handleChange}
                            maxLength="1"
                            ref={digit4Ref}
                            className="w-12 h-12 border border-light-grey hover:border-dark-grey rounded-md text-center text-2xl"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-title-blue text-white py-2 mt-6 rounded-lg hover:bg-dark-blue transition duration-300 ease-in disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? (
                            <TailSpin
                                height={20}
                                width={20}
                                color="#ffffff"
                                ariaLabel="loading"
                            />
                        ) : (
                            "Verify"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Verification;
