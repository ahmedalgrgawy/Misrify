import { useState, useEffect } from "react";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import signImg from "../../assets/Sign imgs/signup.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../features/authSlice";
import { TailSpin } from "react-loader-spinner";

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

    const [touched, setTouched] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        if (error && error.toLowerCase().includes("exist")) {
            setFieldErrors({ general: "This user already exists" });
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (!value.trim()) {
            setFieldErrors((prev) => ({ ...prev, [name]: "This input is required" }));
        }
    };

    const validateFields = () => {
        const errors = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (!value.trim()) {
                errors[key] = "This input is required";
            }
        });
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) return;

        const result = await dispatch(signup(formData));
        if (result.meta.requestStatus === "fulfilled") {
            navigate("/verification");
        }
    };

    const ErrorBox = ({ message }) => (
        <div className="flex items-start gap-2 bg-red-100 text-red-800 border border-red-300 p-2 rounded-lg text-sm my-2">
            <FiAlertCircle className="mt-0.5" />
            <span>{message}</span>
        </div>
    );

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
            {/* Left side image */}
            <div className="hidden md:flex md:w-1/2">
                <img className="w-full h-full object-cover" src={signImg} alt="sign up" />
            </div>

            {/* Right side form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-10">
                <div className="w-full max-w-md space-y-6">
                    <h1 className="text-title-blue text-2xl font-bold">Sign Up</h1>

                    {fieldErrors.general && <ErrorBox message={fieldErrors.general} />}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="text-title-blue font-small">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="input-field"
                            />
                            {touched.name && fieldErrors.name && <ErrorBox message={fieldErrors.name} />}
                        </div>

                        <div>
                            <label htmlFor="email" className="text-title-blue font-small">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="input-field"
                            />
                            {touched.email && fieldErrors.email && <ErrorBox message={fieldErrors.email} />}
                        </div>

                        <div>
                            <label htmlFor="password" className="text-title-blue font-small">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="input-field"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute bottom-4 right-2 flex items-center"
                                >
                                    {showPassword ? <FiEyeOff className="text-title-blue" /> : <FiEye className="text-title-blue" />}
                                </button>
                            </div>
                            {touched.password && fieldErrors.password && <ErrorBox message={fieldErrors.password} />}
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="text-title-blue font-small">Phone Number</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="input-field"
                            />
                            {touched.phoneNumber && fieldErrors.phoneNumber && <ErrorBox message={fieldErrors.phoneNumber} />}
                        </div>

                        <div>
                            <label htmlFor="address" className="text-title-blue font-small">Address</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="input-field"
                            />
                            {touched.address && fieldErrors.address && <ErrorBox message={fieldErrors.address} />}
                        </div>

                        <div>
                            <label className="text-title-blue font-small">Gender</label>
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
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-title-blue text-white py-2 mt-2 rounded-lg hover:bg-dark-blue duration-300 ease-in disabled:opacity-50 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <TailSpin height={20} width={20} color="#ffffff" ariaLabel="loading" />
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    <p className="text-dark-blue text-center">
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
