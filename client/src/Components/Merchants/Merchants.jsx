import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllMerchants } from "../../features/userSlice";
import { TailSpin } from 'react-loader-spinner';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Merchants = () => {
    const dispatch = useDispatch();
    const { merchants, merchantsLoading } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleDeleteClick = (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };
    // Handle the cancellation of the delete action
    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };
    // Handle the confirmation of the delete action
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

    useEffect(() => {
        dispatch(getAllMerchants());
    }, [dispatch]);

    if (merchantsLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <TailSpin color="#2B3D5B" height={100} width={100} />
            </div>
        );
    }
    const merchantsArray = Array.isArray(merchants) ? merchants : [];

    const allMerchants = [
        ...merchantsArray.map(m => ({ ...m, userType: "Merchant" }))
    ];

    const filteredUsers = allMerchants.filter(u =>
        u &&
        (u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 bg-bg-second">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h3 className="text-3xl font-bold text-title-blue">Merchants</h3>
                <div>
                    <Link to="/dashboard" className="text-lg font-semibold text-dark-grey">Dashboard</Link>
                    <span className="mx-2 font-semi text-dark-grey">/</span>
                    <Link to="/dashboard/merchants" className="text-lg font-semibold text-title-blue">Merchants</Link>
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
                                        <Link to={`/admin/edit-user/${u._id}`} className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110">
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
                                <td colSpan="5" className="text-center text-title-blue py-4">No merchants found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-white p-12 rounded-lg shadow-xl w-2xl">
                            <h3 className="text-lg font-semibold text-main-blue mb-10">Are you sure you want to delete this merchant?</h3>
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
            </div>
        </div>
    );
};

export default Merchants;
