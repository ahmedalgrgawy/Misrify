import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { getMerchantOrders } from "../../features/merchantAnalyticsSlice";
import { useEffect } from "react";

export const MerchantOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.merchantAnalytics);

    useEffect(() => {
        dispatch(getMerchantOrders());
    }, [dispatch]);

    const errorMessage = error
        ? typeof error === "string"
            ? error
            : error.message || "An error occurred"
        : null;

    return (
        <div className="p-6 bg-bg-second">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-title-blue">Your Product Orders</h3>
            </div>
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {errorMessage}
                </div>
            )}
            {loading ? (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <TailSpin color="#2B3D5B" height={100} width={100} />
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-light-grey">
                    <table className="min-w-full text-left">
                        <thead className="text-sm text-main-blue border-b-4">
                            <tr className="bg-[#F7F8FA]">
                                <th className="py-4 px-6 text-center">Order Code</th>
                                <th className="py-4 px-6 text-center">Status & Date</th>
                                <th className="py-4 px-6 text-center">Total Price</th>
                                <th className="py-4 px-6 text-center">Products</th>
                                <th className="py-4 px-6 text-center">Product Images</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order, index) => (
                                    <tr
                                        key={order._id}
                                        className={index % 2 !== 0 ? "bg-[#F9F9FF]" : ""}
                                    >
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {order.trackCode}
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            <div className="flex flex-col items-center gap-1">
                                                <span
                                                    className={`px-2 py-1 rounded-full ${order.status === "paid"
                                                        ? "bg-green-100 text-green-600"
                                                        : order.status === "shipped"
                                                            ? "bg-blue-100 text-blue-600"
                                                            : order.status === "pending" || order.status === "unpaid"
                                                                ? "bg-yellow-100 text-yellow-600"
                                                                : order.status === "cancelled"
                                                                    ? "bg-red-100 text-red-600"
                                                                    : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            ${order.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6 text-main-blue">
                                            <div className="flex flex-col gap-2">
                                                {order.orderItems.map((item) => (
                                                    <div
                                                        key={item._id}
                                                        className="flex flex-col items-center justify-center border-b border-light-grey pb-2 last:border-b-0"
                                                    >
                                                        <span className="font-medium">{item.product.name}</span>
                                                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                {order.orderItems.map((item) => (
                                                    <img
                                                        key={item._id}
                                                        src={item.product.imgUrl || "/default-product.png"}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                ))}
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-title-blue py-4">
                                        No Orders Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};