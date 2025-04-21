import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./features/authSlice";
import { TailSpin } from 'react-loader-spinner';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, hasCheckedAuth } = useSelector(state => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const token = localStorage.getItem('token');
      if (token && !isAuthenticated && !hasCheckedAuth) {
        setLoading(true);
        try {
          await dispatch(checkAuth()).unwrap();
        } catch (error) {
          console.error("Authentication check failed:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    authenticate();
  }, [dispatch, isAuthenticated, hasCheckedAuth]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <TailSpin color="#2B3D5B" height={100} width={100} timeout={5000} />
        </div>
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default App;