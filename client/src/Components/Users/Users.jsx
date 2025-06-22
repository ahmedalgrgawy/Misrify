import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers, editUser, createUser } from "../../features/userSlice";
import { TailSpin } from "react-loader-spinner";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Flip, toast, ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";

const Users = () => {
  const dispatch = useDispatch();
  const { users, usersLoading } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    role: "",
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
    gender: "male",
    role: "user",
  });

  const handleConfirmCreate = () => {
    dispatch(createUser(newUserData))
      .then(() => {
        setShowAddUserModal(false);
        setNewUserData({
          name: "",
          email: "",
          password: "",
          phoneNumber: "",
          address: "",
          gender: "male",
          role: "user",
        });
        setTimeout(() => {
          showToast("User has been created 👍", "success");
        }, 0);
        dispatch(getAllUsers());
      })
      .catch(() => {
        setTimeout(() => {
          showToast("There was an error 👎", "error");
        }, 0);
      });
  };

  // Delete Funcs
  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteUser(userToDelete))
      .then(() => {
        setShowDeleteModal(false);
        setUserToDelete(null);

        setTimeout(() => {
          showToast("user has been deleted 👍", "success");
        }, 0);

      })
      .catch((error) => {
        setTimeout(() => {
          showToast("there is something wrong 👎", "error");
        }, 0);
        console.error("Error deleting user:", error);
      });
  };

  // Edit Functions
  const handleEditClick = (user) => {
    setUserToEdit(user._id);
    setEditData({
      name: user.name,
      phoneNumber: user.phoneNumber,
      address: user.address,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setUserToEdit(null);
    setEditData({ name: "", phoneNumber: "", address: "", role: "" });
  };

  const handleConfirmEdit = () => {
    dispatch(editUser({ userId: userToEdit, updatedData: editData }))
      .then(() => {
        setShowEditModal(false);
        setUserToEdit(null);
        setEditData({ name: "", phoneNumber: "", address: "", role: "" });
        setTimeout(() => {
          showToast("user has been updated 👍", "success");
        }, 0);
        dispatch(getAllUsers());


      })
      .catch((error) => {
        setTimeout(() => {
          showToast("there is something wrong 👎", "error");
        }, 0);
        console.error("Error editing user:", error);
      });
  };

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  if (usersLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <TailSpin color="#2B3D5B" height={100} width={100} />
      </div>
    );
  }

  const usersArray = Array.isArray(users) ? users : [];
  const allUsers = [...usersArray.map((u) => ({ ...u, userType: "User" }))];

  const filteredUsers = allUsers.filter(
    (u) =>
      u &&
      (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
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
  return (
    <div className="p-6 bg-bg-second">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h3 className="text-3xl font-bold text-title-blue">Users</h3>
        <div>
          <Link
            to="/analytics"
            className="text-lg font-semibold text-dark-grey"
          >
            Analytics
          </Link>
          <span className="mx-2 font-semi text-dark-grey">/</span>
          <Link
            to="/analytics/users"
            className="text-lg font-semibold text-title-blue"
          >
            Users
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 flex-nowrap gap-4">
        <div className="relative w-full">
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 rounded-md border border-light-grey focus:outline-none focus:ring-2
                    focus:ring-second-grey hover:shadow transition ease-in-out duration-300 bg-white text-base"
          />
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="btn text-lg hover:bg-main-blue bg-title-blue text-white p-3 rounded-3xl flex items-center gap-2"
        >
          <FaPlus /> Add User
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-light-grey">
        <table className="min-w-full text-left">
          <thead className="text-sm text-main-blue">
            <tr className="bg-[#F7F8FA]">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Gender</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u, index) => (
                <tr
                  key={u.id || index}
                  className={index % 2 !== 0 ? "bg-[#F9F9FF]" : ""}
                >
                  <td className="py-4 px-6 flex items-center gap-3 text-main-blue">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{u.name}</span>
                  </td>
                  <td className="py-4 px-6 text-main-blue">{u.role}</td>
                  <td className="py-4 px-6 text-main-blue">{u.email}</td>
                  <td className="py-4 px-6 text-main-blue">{u.gender}</td>
                  <td className="py-4 px-6 text-center space-x-4 flex justify-center items-center">
                    <Link
                      onClick={() => handleEditClick(u)}
                      className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110"
                      data-tooltip-id="Edit"
                      data-tooltip-content="Edit"
                      data-tooltip-place="bottom"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(u._id)}
                      className="text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                      data-tooltip-place="bottom"
                      data-tooltip-id="Delete"
                      data-tooltip-content="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-title-blue py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Tooltip
          id="Edit"
          className="!z-50 !py-1 !px-2 !bg-title-blue !rounded-md"
        />
        <Tooltip
          id="Delete"
          className="!z-50 !py-1 !px-2 !bg-red-600 !rounded-md"
        />
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white p-12 rounded-lg shadow-xl w-2xl">
              <h3 className="text-lg font-semibold text-main-blue mb-10">
                Are you sure you want to delete this user?
              </h3>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleCancelDelete}
                  className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-500 shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-2xl font-semibold text-main-blue mb-6">
                Edit User
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={editData.phoneNumber}
                  onChange={(e) =>
                    setEditData({ ...editData, phoneNumber: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                />
                <select
                  value={editData.role}
                  onChange={(e) =>
                    setEditData({ ...editData, role: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                >
                  <option value="admin" className="bg-second text-dark-grey">
                    Admin
                  </option>
                  <option value="merchant" className="bg-second text-dark-grey">
                    Merchant
                  </option>
                  <option value="user" className="bg-second text-dark-grey">
                    User
                  </option>
                </select>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={handleCancelEdit}
                    className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmEdit}
                    className="bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-500 shadow-lg"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddUserModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
              <h2 className="text-2xl font-semibold text-main-blue mb-6">Create User</h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={newUserData.name}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, name: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUserData.password}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, password: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={newUserData.phoneNumber}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, phoneNumber: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3"
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={newUserData.address}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, address: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3"
                />
                <select
                  value={newUserData.gender}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, gender: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3"
                >
                  <option value="male" className="bg-second text-dark-grey">
                    Male
                  </option>
                  <option value="female" className="bg-second text-dark-grey">
                    Female
                  </option>
                </select>
                <select
                  value={newUserData.role}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, role: e.target.value })
                  }
                  className="border border-light-grey rounded-md text-dark-grey py-2 px-3"
                >
                  <option value="admin" className="bg-second text-dark-grey">
                    Admin
                  </option>
                  <option value="merchant" className="bg-second text-dark-grey">
                    Merchant
                  </option>
                  <option value="user" className="bg-second text-dark-grey">
                    User
                  </option>
                </select>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmCreate}
                    className="bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-500 shadow-lg"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
        theme="dark"
        transition={Flip}
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default Users;
