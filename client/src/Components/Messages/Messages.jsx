import { useEffect, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllContactMessages } from "../../features/messageSlice";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";

const Messages = () => {
    const dispatch = useDispatch();
    const { messages, messageLoading } = useSelector(
        (state) => state.messages);

    useEffect(() => {
        dispatch(getAllContactMessages());
    }, [dispatch]);

    if (messageLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <TailSpin color="#2B3D5B" height={100} width={100} />
            </div>
        );
    }
    const messagesArray = Array.isArray(messages) ? messages : [];
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h3 className="text-3xl font-bold text-title-blue">Contact Messages</h3>
                <div>
                    <Link
                        to="/analytics"
                        className="text-lg font-semibold text-dark-grey"
                    >
                        Analytics
                    </Link>
                    <span className="mx-2 font-semi text-dark-grey">/</span>
                    <Link
                        to="/analytics/messages"
                        className="text-lg font-semibold text-title-blue"
                    >
                        Messages
                    </Link>
                </div>
            </div>
            <div className="flex flex-col justify-between gap-5 max-w-5xl mx-auto p-6">
                {messagesArray.length > 0 ? (
                    messagesArray.map(({ _id, firstName, lastName, email, message }) => {
                        const username = `${firstName} ${lastName}`;
                        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

                        return (
                            <div key={_id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200  transition ease-in hover:shadow-lg duarition-400">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 flex items-center justify-center bg-red-600 rounded-full text-white">
                                        {initials}
                                    </div>
                                    <h3 className="text-xl font-semibold text-title-blue mb-2 ml-2">
                                        {username}
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 ml-9">
                                    {email}
                                </p>
                                <p className="text-main-blue mt-3 font-semibold">{message}</p>
                            </div>
                        );
                    })
                ) : (
                    <p colSpan="5" className="text-center text-title-blue py-4">
                        No messages found
                    </p>
                )}
            </div>
        </div>

    );
}

export default Messages;