import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "../../features/userSlice";
import { TailSpin } from 'react-loader-spinner';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Users = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(userProfile());
    }, [dispatch]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <TailSpin color="#2B3D5B" height={100} width={100} />
        </div>
    );

    const usersArray = Array.isArray(user) ? user : [user];
    const filteredUsers = usersArray.filter(u =>
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
                    <Link className="text-lg font-semibold text-title-blue">Users</Link>
                </div>
            </div>

            <div className="mb-6 relative w-full">
                <FaSearch className="absolute left-4 top-3.5 text-gray-400 " />
                <input
                    type="text"
                    placeholder="Search for a User by name or email"
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
                                <tr
                                    key={index}
                                    className={index % 2 !== 0 ? "bg-[#F9FBFF]" : ""}
                                >
                                    <td className="py-4 px-6 flex items-center gap-3 text-title-blue">
                                        <img
                                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                                            alt={u.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{u.name}</span>
                                    </td>
                                    <td className="py-4 px-6">{u.role}</td>
                                    <td className="py-4 px-6">{u.email}</td>
                                    <td className="py-4 px-6">{u.gender}</td>
                                    <td className="py-4 px-6 text-center space-x-4">
                                        <button className="text-blue-600 hover:scale-110 transition">
                                            <FaEdit />
                                        </button>
                                        <button className="text-red-500 hover:scale-110 transition">
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
            </div>

        </div>
    );
};

export default Users;
