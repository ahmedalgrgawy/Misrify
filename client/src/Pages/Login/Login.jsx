import { useEffect, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import loginImg from "../../assets/Sign imgs/login.png";
import { loginUser, checkAuth, clearError } from "../../features/authSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const emailRequired = touched.email && email.trim() === "";
  const passwordRequired = touched.password && password.trim() === "";

  const emailErrorFromServer =
    error?.toLowerCase().includes("user not found") ||
    error?.toLowerCase().includes("validation")
      ? error
      : "";

  const passwordErrorFromServer = error
    ?.toLowerCase()
    .includes("wrong password")
    ? error
    : "";

  let fallbackError =
    error &&
    !emailErrorFromServer &&
    !passwordErrorFromServer &&
    error !== "Validation error: Missing fields";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === "fulfilled") {
      await dispatch(checkAuth());
      navigate("/");
    }
  };
  useEffect(() => {
    // used to remove the message error " Wrong email or password. Please try again. " when go to any other pages
    dispatch(clearError());
  }, []);
  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
      <div className="hidden md:flex md:w-2/3 lg:w-1/2 h-full">
        <img
          className="w-full h-full object-cover"
          src={loginImg}
          alt="Login"
        />
      </div>

      <div className="w-full md:w-2/3 lg:w-1/2 h-full bg-white flex flex-col p-6 md:p-14 justify-center">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-title-blue text-3xl font-bold mb-6 text-center md:text-left">
            Log In
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* EMAIL INPUT */}
            <label htmlFor="email" className="text-title-blue font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                dispatch(clearError());
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              required
              className={`w-full bg-bg-main text-title-blue border-b py-2 px-3 mb-1  focus:outline-none focus:border-dark-grey hover:shadow transition-all duration-300 ${
                emailRequired || emailErrorFromServer
                  ? "border-red-500"
                  : "border-second-grey"
              }`}
            />
            {emailRequired && (
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm mb-3">
                Email is required
              </div>
            )}
            {emailErrorFromServer && (
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm mb-3">
                {emailErrorFromServer}
              </div>
            )}

            {/* PASSWORD INPUT */}
            <label htmlFor="password" className="text-title-blue font-medium">
              Password
            </label>
            <div className="relative pt-3">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  dispatch(clearError());
                }}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, password: true }))
                }
                required
                className={`w-full bg-bg-main text-title-blue border-b py-2 px-3 mb-1 focus:outline-none focus:border-dark-grey hover:shadow transition-all duration-300 ${
                  passwordRequired || passwordErrorFromServer
                    ? "border-red-500"
                    : "border-second-grey"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute bottom-4 right-2 flex items-center"
              >
                {showPassword ? (
                  <FiEyeOff className="text-title-blue" />
                ) : (
                  <FiEye className="text-title-blue" />
                )}
              </button>
            </div>
            {passwordRequired && (
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm mb-3">
                Password is required
              </div>
            )}
            {passwordErrorFromServer && (
              <div className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm mb-3">
                {passwordErrorFromServer}
              </div>
            )}

            <div className="w-full flex items-center justify-end text-sm mt-2">
              <Link
                to="/forgot-password"
                className="text-main-blue hover:text-dark-blue"
              >
                Forgot Password?
              </Link>
            </div>

            {/*General / Server Error */}
            {fallbackError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mt-4">
                Wrong email or password. Please try again.
              </div>
            )}

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
                "Log In"
              )}
            </button>
          </form>
          <p className="mt-4 text-start text-sm text-dark-blue">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-title-blue hover:text-dark-blue font-medium"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
