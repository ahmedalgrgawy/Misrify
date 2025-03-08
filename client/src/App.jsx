import { RouterProvider } from "react-router-dom"
import router from "./routes/Router"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./features/authSlice";

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return (

    <RouterProvider router={router} />

  )
}

export default App;
