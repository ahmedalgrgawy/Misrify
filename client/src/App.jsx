import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./features/authSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const hasCheckedAuth = useSelector(state => state.auth.hasCheckedAuth);

  useEffect(() => {
    const authenticate = async () => {
      try {
        if (!isAuthenticated && !hasCheckedAuth) {
          await dispatch(checkAuth()).unwrap();
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      }
    };

    authenticate();
  }, [dispatch, isAuthenticated, hasCheckedAuth]);

  return <RouterProvider router={router} />;
}

export default App;
