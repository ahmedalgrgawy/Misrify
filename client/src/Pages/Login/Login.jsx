import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import loginImg from "../../assets/Sign imgs/login.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, checkAuth } from "../../features/authSlice"; 

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === "fulfilled") {
      await dispatch(checkAuth());
      navigate("/");
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row items-start">
      <div className="hidden md:flex md:w-2/3 lg:w-1/2 h-full">
        <img className="w-full h-full object-cover" src={loginImg} alt="Login" />
      </div>

      <div className="w-full md:w-2/3 lg:w-1/2 h-full bg-white flex flex-col p-6 md:p-14 justify-center">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-title-blue text-3xl font-bold mb-6 text-center md:text-left">Log In</h1>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="email" className="text-title-blue font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-bg-main text-title-blue border-b border-second-grey py-2 px-3 mb-4 text-dark-grey focus:outline-none focus:border-dark-grey hover:shadow"
            />

            <label htmlFor="password" className="text-title-blue font-medium">Password</label>
            <div className="relative pt-3">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-bg-main text-title-blue border-b border-second-grey py-2 px-3 mb-4 text-dark-grey focus:outline-none focus:border-dark-grey hover:shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center"
              >
                {showPassword ? <FiEyeOff className="text-title-blue" /> : <FiEye className="text-title-blue" />}
              </button>
            </div>

            <div className="w-full flex flex-row items-center justify-between text-sm">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <p>Remember Me</p>
              </div>
              <Link to="/forgot-password" className="text-main-blue hover:text-dark-blue">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-title-blue text-white py-2 mt-4 transition duration-300 ease-in rounded-lg hover:bg-dark-blue disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          <p className="mt-4 text-start text-sm text-dark-blue">
            Don't have an account?{" "}
            <Link to="/signup" className="text-title-blue hover:text-dark-blue font-medium">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
