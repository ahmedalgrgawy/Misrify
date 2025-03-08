import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import signImg from "../../assets/Sign imgs/signup.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../features/authSlice";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        address: "",
        gender: "female",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(signup(formData));

        if (result.meta.requestStatus === "fulfilled") {
            navigate("/verification");
        }
    };

    return (
        <div className="w-full max-h-screen flex flex-col md:flex-row overflow-hidden">
            <div className="hidden md:flex md:w-2/3 lg:w-1/2 h-full">
                <img className="w-screen h-screen object-cover" src={signImg} alt="sign up" />
            </div>

            <div className="w-full md:w-2/3 lg:w-1/2 h-full bg-white flex flex-col p-4 md:p-6 items-center justify-center overflow-auto">
                <div className="w-full max-w-md mx-auto">
                    <h1 className="text-title-blue text-2xl font-bold mb-2">Sign Up</h1>
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <form className="w-full" onSubmit={handleSubmit}>
                        {/* Username */}
                        <label htmlFor="name" className="text-title-blue font-small">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            autoComplete="name"
                            required
                        />

                        {/* Email */}
                        <label htmlFor="email" className="text-title-blue font-small mt-4">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />

                        {/* Password */}
                        <label htmlFor="password" className="text-title-blue font-small mt-4">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-2 flex items-center"
                            >
                                {showPassword ? (
                                    <FiEyeOff className="text-title-blue" />
                                ) : (
                                    <FiEye className="text-title-blue" />
                                )}
                            </button>
                        </div>

                        {/* Phone Number */}
                        <label htmlFor="phoneNumber" className="text-title-blue font-small mt-4">Phone Number</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />

                        {/* Address */}
                        <label htmlFor="address" className="text-title-blue font-small mt-4">Address</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />

                        {/* Gender */}
                        <label className="text-title-blue font-small mt-4">Gender</label>
                        <div className="flex bg-bg-main rounded-full p-1 w-40">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: "male" })}
                                className={`flex-1 text-center py-1 rounded-full ${formData.gender === "male" ? "bg-title-blue text-white" : "text-dark-grey"}`}
                            >
                                Male
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, gender: "female" })}
                                className={`flex-1 text-center py-1 rounded-full ${formData.gender === "female" ? "bg-title-blue text-white" : "text-dark-grey"}`}
                            >
                                Female
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-title-blue text-white py-2 mt-4 rounded-lg hover:bg-dark-blue"
                            disabled={loading}
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-dark-blue text-center mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-dark-blue font-medium underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
