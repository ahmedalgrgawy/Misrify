import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrands } from "../../features/brandSlice";
import { getAllCategories } from "../../features/categorySlice";
import { TailSpin } from "react-loader-spinner";
import { FaCheck, FaTimes } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import { unwrapResult } from "@reduxjs/toolkit";
import productImg from "../../assets/product.png";
import { getRequestedProducts, toggleProductApproval } from "../../features/adminProductsSlice";

const RequestedProducts = () => {
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(null);

    const requestedProducts = useSelector((state) => state.products?.requestedProducts ?? []);
    const loading = useSelector((state) => state.products?.loading ?? false);
    const brandsLoading = useSelector((state) => state.Brands?.loading ?? false);
    const categoriesLoading = useSelector((state) => state.Categories?.loading ?? false);

    const userRole = useSelector((state) => state.auth.user?.role);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    dispatch(getRequestedProducts()),
                    dispatch(getAllBrands()),
                    dispatch(getAllCategories()),
                ]);
            } catch (err) {
                setError("Failed to load data. Please try again.");
            }
        };
        fetchData();
    }, [dispatch, isSubmitting]);

    const handleToggleApproval = async (productId, isApproved) => {
        setIsSubmitting(productId);
        setError(null);
        setSuccess(null);
        try {
            await unwrapResult(
                dispatch(
                    toggleProductApproval({
                        productId,
                        isApproved: isApproved ? "yes" : "no",
                    })
                )
            );
            setSuccess(`Product ${isApproved ? "approved" : "rejected"} successfully`);
            dispatch(getRequestedProducts()); // Refresh the requested products list
        } catch (err) {
            setError(err.message || `Failed to ${isApproved ? "approve" : "reject"} product. Please try again.`);
        } finally {
            setIsSubmitting(null);
        }
    };

    const arrProducts = Array.isArray(requestedProducts) ? requestedProducts : [];

    return (
        <div className="p-6 bg-bg-second">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-title-blue">
                    {userRole === "admin" ? "Requested Products" : "Your Requested Products"}
                </h3>
            </div>
            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 p-4 bg-green-50 text-green-600 rounded-lg border border-green-200">
                    {success}
                </div>
            )}
            {loading || brandsLoading || categoriesLoading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <TailSpin color="#2B3D5B" height={100} width={100} />
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-light-grey">
                    <table className="min-w-full text-left">
                        <thead className="text-sm text-main-blue border-b-4">
                            <tr className="bg-[#F7F8FA]">
                                <th className="py-4 px-6 text-center">Image</th>
                                <th className="py-4 px-6 text-center">Product Name</th>
                                <th className="py-4 px-6 text-center">Category</th>
                                <th className="py-4 px-6 text-center">Brand</th>
                                {userRole === "admin" && (
                                    <th className="py-4 px-6 text-center">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {arrProducts.length > 0 ? (
                                arrProducts.map((product, index) => (
                                    <tr
                                        key={product._id}
                                        className={index % 2 !== 0 ? "bg-[#F9F9FF]" : ""}
                                    >
                                        <td className="py-4 px-6 w-16 h-16 mx-auto box-content flex justify-center">
                                            <img
                                                src={product?.imgUrl || productImg}
                                                alt={product.name}
                                                className="w-16 h-16 rounded-xl object-cover"
                                            />
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {product.name}
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {product.category?.name || "N/A"}
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {product.brand?.name || "N/A"}
                                        </td>
                                        {userRole === "admin" && (
                                            <td>
                                                <div className="py-4 px-6 text-center space-x-4 flex justify-center items-center">
                                                    <button
                                                        onClick={() => handleToggleApproval(product._id, true)}
                                                        className="text-green-500 hover:text-green-600 transition duration-300 transform hover:scale-110"
                                                        data-tooltip-id="Approve"
                                                        data-tooltip-content="Approve"
                                                        data-tooltip-place="bottom"
                                                        aria-label="Approve product"
                                                        disabled={isSubmitting === product._id}
                                                    >
                                                        {isSubmitting === product._id && !product.isApproved ? (
                                                            <TailSpin color="#22C55E" height={20} width={20} />
                                                        ) : (
                                                            <FaCheck />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleApproval(product._id, false)}
                                                        className="text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                                                        data-tooltip-id="Reject"
                                                        data-tooltip-content="Reject"
                                                        data-tooltip-place="bottom"
                                                        aria-label="Reject product"
                                                        disabled={isSubmitting === product._id}
                                                    >
                                                        {isSubmitting === product._id && product.isApproved ? (
                                                            <TailSpin color="#EF4444" height={20} width={20} />
                                                        ) : (
                                                            <FaTimes />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-title-blue py-4">
                                        No Requested Products found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {userRole === "admin" && (
                <>
                    <Tooltip id="Approve" className="!py-1 !px-2 !bg-green-600 !rounded-md" />
                    <Tooltip id="Reject" className="!py-1 !px-2 !bg-red-600 !rounded-md" />
                </>
            )}
        </div>
    );
};

export default RequestedProducts;