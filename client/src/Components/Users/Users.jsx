import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers, editUser } from "../../features/userSlice";
import { TailSpin } from 'react-loader-spinner';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Users = () => {
    const dispatch = useDispatch();
    const { users, usersLoading } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [editData, setEditData] = useState({ name: "", phoneNumber: "", address: "", role: "" });

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
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
    };

    // Edit Functions
    const handleEditClick = (user) => {
        setUserToEdit(user._id);
        setEditData({ name: user.name, phoneNumber: user.phoneNumber, address: user.address, role: user.role });
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
            })
            .catch((error) => {
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
    const allUsers = [
        ...usersArray.map(u => ({ ...u, userType: "User" })),
    ];

    const filteredUsers = allUsers.filter(u =>
        u &&
        (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 bg-bg-second">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h3 className="text-3xl font-bold text-title-blue">Users</h3>
                <div>
                    <Link to="/dashboard" className="text-lg font-semibold text-dark-grey">Dashboard</Link>
                    <span className="mx-2 font-semi text-dark-grey">/</span>
                    <Link to="/dashboard/users" className="text-lg font-semibold text-title-blue">Users</Link>
                </div>
            </div>

            <div className="mb-6 relative w-full">
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
                                <tr key={u.id || index} className={index % 2 !== 0 ? "bg-[#F9F9FF]" : ""}>
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
                                        <Link onClick={() => handleEditClick(u)} className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110">
                                            <FaEdit />
                                        </Link>
                                        <button onClick={() => handleDeleteClick(u._id)} className="text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110">
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-title-blue py-4">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-white p-12 rounded-lg shadow-xl w-2xl">
                            <h3 className="text-lg font-semibold text-main-blue mb-10">
                                Are you sure you want to delete this user?
                            </h3>
                            <div className="flex justify-end gap-4">
                                <button onClick={handleCancelDelete}
                                    className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md">
                                    Cancel
                                </button>
                                <button onClick={handleConfirmDelete}
                                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-500 shadow-lg">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
                            <h2 className="text-2xl font-semibold text-main-blue mb-6">Edit User</h2>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={editData.phoneNumber}
                                    onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                                    className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={editData.address}
                                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                    className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                                />
                                <select
                                    value={editData.role}
                                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                                    className="border border-light-grey rounded-md text-dark-grey py-2 px-3 mb-2 focus:outline-none hover:shadow transition"
                                >
                                    <option value="admin" className="bg-second text-dark-grey">Admin</option>
                                    <option value="merchant" className="bg-second text-dark-grey">Merchant</option>
                                    <option value="user" className="bg-second text-dark-grey">User</option>
                                </select>
                                <div className="flex justify-end gap-4 mt-4">
                                    <button onClick={handleCancelEdit} className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md">Cancel</button>
                                    <button onClick={handleConfirmEdit} className="bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-500 shadow-lg">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
