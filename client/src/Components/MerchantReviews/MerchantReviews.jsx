import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMerchantReviews, replyToComment, clearReplyError } from "../../features/merchantReviewsSlice";
import { TailSpin } from "react-loader-spinner";
import { FaStar, FaComment, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Tooltip } from "react-tooltip";

const MerchantReviews = () => {
    const dispatch = useDispatch();
    const { reviews, loading, error, replyLoading, replyError } = useSelector(
        (state) => state.merchantReviews
    );
    const arrReviews = Array.isArray(reviews) ? reviews : [];

    const [showReplyModal, setShowReplyModal] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    useEffect(() => {
        dispatch(getMerchantReviews());
    }, [dispatch]);

    useEffect(() => {
        if (replyError) {
            showToast(
                typeof replyError === "string" ? replyError : replyError.message || "Failed to reply to comment",
                "error"
            );
            dispatch(clearReplyError());
        }
    }, [replyError, dispatch]);

    const handleReplyClick = (reviewId) => {
        setSelectedReviewId(reviewId);
        setShowReplyModal(true);
    };

    const handleReplySubmit = () => {
        if (!replyText.trim()) {
            showToast("Reply text is required ❗", "error");
            return;
        }

        dispatch(replyToComment({ commentText: replyText, reviewId: selectedReviewId }))
            .unwrap()
            .then(() => {
                setShowReplyModal(false);
                setReplyText("");
                setSelectedReviewId(null);
                showToast("Reply submitted successfully 👍", "success");
            })
            .catch(() => {
                showToast("Failed to submit reply 👎", "error");
            });
    };

    const showToast = (message, type = "success") => {
        toast[type](message, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            theme: "dark",
            transition: Flip,
        });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <TailSpin color="#2B3D5B" height={100} width={100} />
            </div>
        );
    }

    return (
        <div className="p-6 bg-bg-second font-montserrat">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h3 className="text-3xl font-bold text-title-blue">Reviews & Comments</h3>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                    {typeof error === "string" ? error : error.message || "An error occurred"}
                </div>
            )}

            {/* Reviews Section */}
            <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-semibold text-bg-footer">Product Reviews</h4>
            </div>
            <SwiperSection
                title="Reviews"
                data={arrReviews}
                type="review"
            />

            {/* Comments Section */}
            <div className="flex justify-between items-center mb-8 mt-12">
                <h4 className="text-xl font-semibold text-bg-footer">Comments</h4>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-light-grey">
                <table className="min-w-full text-left">
                    <thead className="text-sm text-main-blue border-b-4">
                        <tr className="bg-[#F7F8FA]">
                            <th className="py-4 px-6 text-center">Comment Text</th>
                            <th className="py-4 px-6 text-center">User</th>
                            <th className="py-4 px-6 text-center">Product Name</th>
                            <th className="py-4 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrReviews.flatMap((review) =>
                            review.comments.length > 0 ? (
                                review.comments.map((comment, index) => (
                                    <tr
                                        key={comment._id}
                                        className={index % 2 !== 0 ? "bg-[#F9F9FF]" : ""}
                                    >
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {comment.text}
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {comment.user.name}
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {review.product.name}
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            <div className="flex justify-center items-center">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <FaStar key={i} className="text-yellow-400" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleReplyClick(review._id)}
                                                className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110"
                                                data-tooltip-id="Reply"
                                                data-tooltip-content="Reply"
                                                data-tooltip-place="bottom"
                                            >
                                                <FaComment />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : null
                        ).filter(Boolean).length > 0 ? (
                            arrReviews.flatMap((review) =>
                                review.comments.map((comment, index) => (
                                    <tr
                                        key={comment._id}
                                        className={index % 2 !== 0 ? "bg-[#F9F9FF]" : ""}
                                    >
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {comment.text}
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {comment.user.name}
                                        </td>
                                        <td className="py-4 px-6 text-main-blue text-center">
                                            {review.product.name}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => handleReplyClick(review._id)}
                                                className="text-blue-900 hover:text-main-blue transition duration-300 transform hover:scale-110"
                                                data-tooltip-id="Reply"
                                                data-tooltip-content="Reply"
                                                data-tooltip-place="bottom"
                                            >
                                                <FaComment />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-title-blue py-4">
                                    No Comments Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reply Modal */}
            {showReplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
                        <h2 className="text-2xl font-semibold text-main-blue mb-6">Reply to Comment</h2>
                        <textarea
                            placeholder="Your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="border border-light-grey rounded-md text-dark-blue py-2 px-3 mb-2 w-full h-32 focus:outline-none hover:shadow transition"
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => {
                                    setShowReplyModal(false);
                                    setReplyText("");
                                    setSelectedReviewId(null);
                                }}
                                className="bg-bg-main text-dark-grey py-2 px-4 rounded-lg hover:bg-light-grey transition duration-500 shadow-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReplySubmit}
                                disabled={replyLoading}
                                className={`bg-main-blue text-white py-2 px-4 rounded-lg hover:bg-title-blue transition duration-500 shadow-lg ${replyLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {replyLoading ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
            <Tooltip id="Reply" className="!z-50 !py-1 !px-2 !bg-title-blue !rounded-md" />
        </div>
    );
};

const SwiperSection = ({ title, data, type }) => {
    const navNext = `.swiper-${title}-next`;
    const navPrev = `.swiper-${title}-prev`;

    return (
        <div className="mb-10">
            <Swiper
                modules={[Navigation, Pagination]}
                breakpoints={{
                    0: { slidesPerView: 1, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 30 },
                    1280: { slidesPerView: 3, spaceBetween: 30 },
                }}
                navigation={{ nextEl: navNext, prevEl: navPrev }}
                pagination={{ clickable: true }}
                className="relative pb-10"
            >
                {data.length > 0 ? (
                    data.map((item) => (
                        <SwiperSlide
                            key={item._id}
                            className="w-80 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-lg transition-all duration-300"
                        >
                            <img
                                src={item.product.imgUrl}
                                alt={item.product.name}
                                className="h-48 w-full object-cover bg-[#d9d9d9]"
                            />
                            <div className="p-4">
                                <h6 className="font-bold text-main-blue text-xl mb-2">
                                    {item.product.name}
                                </h6>
                                <div className="flex items-center mb-2">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <FaStar key={i} className="text-yellow-400" />
                                    ))}
                                    <span className="ml-2 text-sm text-dark-grey">
                                        ({item.rating}/5)
                                    </span>
                                </div>
                                <p className="mb-2 text-sm font-normal text-dark-grey">
                                    {item.reviewText}
                                </p>
                                <p className="text-sm text-gray-500">
                                    By: <span className="font-semibold">{item.user.name}</span>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Date: <span className="font-semibold">{new Date(item.createdAt).toLocaleDateString()}</span>
                                </p>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <div className="text-center font-bold text-title-blue text-xl p-10">
                        No {title}
                    </div>
                )}
            </Swiper>
            <div className="flex justify-between">
                <button
                    className={`swiper-${title}-prev text-2xl text-main-blue hover:text-title-blue transition duration-300 transform hover:scale-110`}
                >
                    <FaArrowLeft />
                </button>
                <button
                    className={`swiper-${title}-next text-2xl text-main-blue hover:text-title-blue transition duration-300 transform hover:scale-110`}
                >
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default MerchantReviews;