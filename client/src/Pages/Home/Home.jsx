import { useDispatch } from "react-redux";
import { logout } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }
  return (
    <>
      <div className='text-5xl flex flex-col'>
        Home
        <button
          onClick={handleLogout}
          className="bg-red-700 text-white w-1/4 rounded-lg text-lg mt-4"
        >
          Logout
        </button>
      </div>
    </>

  )
};

export default Home;
