import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotifications, markAsRead, deleteNotification, deleteAllNotifications } from "../../features/notificationSlice";
import { TailSpin } from "react-loader-spinner";
import { TiInputChecked } from "react-icons/ti";
import { BiSolidCheckboxChecked } from "react-icons/bi";
import { FaTrashAlt } from "react-icons/fa";
import { Flip, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from 'react-tooltip';

const Notifications = () => {
  const dispatch = useDispatch();
  const { notifications, notificationsLoading } = useSelector(
    (state) => state.notifications
  );
  const { users } = useSelector((state) => state.user);

  const getSenderName = (sender) => {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(sender);
    if (!isObjectId) {
      return sender;
    }
    const matchedUser = users.find(user => user._id === sender);
    return matchedUser ? matchedUser.name : "Unknown Sender";
  };

  useEffect(() => {
    dispatch(getAllNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (id) => {
    dispatch(markAsRead(id))
      .then(() => {
        showToast("Notification marked as read!", "success");
      })
      .catch(() => {
        showToast("Something went wrong!", "error");
      });
  };

  const handleDeleteNotification = (id) => {
    dispatch(deleteNotification(id))
      .then(() => {
        showToast("Notification deleted!", "success");
      })
      .catch(() => {
        showToast("Failed to delete notification!", "error");
      });
  };

  const handleDeleteAll = () => {
    dispatch(deleteAllNotifications());
  };

  const showToast = (message, type = "success") => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Flip,
    });
  };

  if (notificationsLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <TailSpin color="#2B3D5B" height={100} width={100} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 lg:px-16 bg-bg-second flex flex-col items-center">
      <div className="flex justify-between items-center p-6 w-full max-w-4xl">
        <h3 className={`${notifications.length === 0 && "mx-auto"} text-3xl font-bold text-title-blue`}>Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition duration-500 shadow-lg"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 p-6 w-full min-h-72 max-w-4xl">
        {notifications.length === 0 ? (
          <div className="p-12 bg-white rounded-lg shadow-lg text-center border-2 border-gray-100 max-w-2xl mx-auto">
            <h4 className="text-2xl font-semibold text-main-blue mb-4">
              No Notifications Yet!
            </h4>
            <p className="text-lg text-dark-grey mb-4">
              Your inbox is empty. Download our app to start shopping and stay updated with exclusive offers!
            </p>
            <p className="text-lg text-main-blue">
              Need help? Contact us for support.
            </p>
          </div>
        ) : (
          notifications.map(({ _id, sender, content, isRead, createdAt }) => (
            <div
              key={_id}
              className={`p-6 bg-white rounded-lg shadow-md transition ease-in hover:shadow-lg duration-400 border border-gray-100 ${isRead ? "opacity-70" : "opacity-100"}`}
            >
              <div className="flex gap-4 items-center mb-4">
                <h4 className="font-semibold text-xl text-main-blue">
                  {getSenderName(sender)}
                </h4>
                <p className="text-sm text-dark-grey">
                  {new Date(createdAt).toLocaleString()}
                </p>
              </div>
              <p className="text-main-blue">{content}</p>
              <div className="flex justify-between items-center mt-4">
                <button onClick={() => handleMarkAsRead(_id)}>
                  {isRead ? (
                    <div className="text-blue-800 font-semibold flex items-center gap-1">
                      <span>Read</span>
                      <BiSolidCheckboxChecked />
                    </div>
                  ) : (
                    <div className="text-blue-500 transition duration-300 hover:text-blue-800 hover:scale-110 flex items-center gap-1">
                      <span>Mark as read</span>
                      <TiInputChecked />
                    </div>
                  )}
                </button>
                <button
                  onClick={() => handleDeleteNotification(_id)}
                  className="text-red-600 text-lg hover:text-red-700 transition duration-500"
                  data-tooltip-place="bottom"
                  data-tooltip-id="Delete"
                  data-tooltip-content="Delete"
                >
                  <FaTrashAlt className="transition-transform duration-300 hover:scale-110" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Tooltip
        id="Delete"
        className="!z-50 !py-1 !px-2 !bg-red-600 !rounded-md"
      />
    </div>
  );
};

export default Notifications;