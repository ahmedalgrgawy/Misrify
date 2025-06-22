import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../../features/userSlice";
import userImg from "../../assets/user.png";
import { TailSpin } from 'react-loader-spinner';
import { Link } from 'react-router-dom';
import { Tooltip } from "react-tooltip";

const DashNavbar = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(userProfile());
  }, [dispatch]);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <TailSpin color="#2B3D5B" height={100} width={100} timeout={5000} />
        </div>
      )}
      <div className="w-full bg-white shadow-lg">
        <nav className="h-16 flex justify-between items-center px-5 lg:px-10">
          <div className="flex-grow" />
          {user && (
            <div className="flex justify-end items-center">
              <div className="flex flex-col justify-center items-end">
                <span className="text-lg font-bold text-main-blue">
                  {user.name}
                </span>
                <span className="text-base capitalize text-second-grey">
                  {user.role}
                </span>
              </div>
              <div className="ml-4">
                <Link
                  data-tooltip-id="Profile"
                  data-tooltip-place="bottom"
                  data-tooltip-content="Profile"
                  to={"/profile"}
                  className="relative"
                >
                  <img
                    src={user.imgUrl || userImg}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="absolute right-0 top-0 bg-green-500 h-3 w-3 rounded-full"></span>
                </Link>
              </div>
            </div>
          )}
        </nav>
        <Tooltip
          id="Profile"
          className="!py-1 !px-2 !bg-title-blue !rounded-md"
        />
      </div>
    </>
  );
};

export default DashNavbar;