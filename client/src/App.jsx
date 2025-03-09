import { RouterProvider } from "react-router-dom"
import router from "./routes/Router"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./features/authSlice";

function App() {

  // const dispatch = useDispatch();
  // const { user, isAuthenticated } = useSelector(state => state.auth)

  // useEffect(() => {
  //   dispatch(checkAuth());
  // }, [user, isAuthenticated]);


  return (

    <RouterProvider router={router} />

  )
}

export default App;
