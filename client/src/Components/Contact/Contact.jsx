import { useState } from 'react';
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';
import { useSelector } from 'react-redux';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useSelector(state => state.auth);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Invalid phone number (10-15 digits)';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        if (formData.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        // Clear error for the field being edited
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // toast.error("Please fix the form errors", {
            //     position: "bottom-right",
            //     autoClose: 2000,
            //     hideProgressBar: false,
            //     closeOnClick: false,
            //     pauseOnHover: true,
            //     draggable: false,
            //     progress: undefined,
            //     theme: "dark",
            //     transition: Flip,
            // });
            return;
        }

        setIsSubmitting(true);

        try {
            await axiosInstance.post('user/contact', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email,
                message: formData.message
            });

            toast.success('Message sent successfully!', {
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
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });
            setErrors({});
        } catch (error) {
            // toast.error(newErrors.message, {
            //     position: "bottom-right",
            //     autoClose: 2000,
            //     hideProgressBar: false,
            //     closeOnClick: false,
            //     pauseOnHover: true,
            //     draggable: false,
            //     progress: undefined,
            //     theme: "dark",
            //     transition: Flip,
            // });
            console.error('API error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="px-4 md:px-16 py-16 bg-bg-second">
            <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-10 max-w-7xl mx-auto">
                {/* Contact Info */}
                <div className="bg-bg-second w-full md:w-1/2 transition-shadow duration-300 flex flex-col items-center md:items-start">
                    <div>
                        <h2 className="text-title-blue font-bold text-3xl mb-2 text-center md:text-left">Contact Us</h2>
                        <p className="text-dark-grey text-sm mb-3 text-center md:text-left">
                            We&apos;d love to hear from you! Whether you have a question, suggestion, or just want to <br />
                            say hello, feel free to reach out. Our team is always here to help.
                        </p>
                    </div>

                    <div className="w-[358px] h-[400px] bg-title-blue border-8 border-white rounded-xl shadow-custom-md flex flex-col justify-evenly items-center my-4">
                        <h3 className="text-2xl font-bold py-2 text-white">Contact Information</h3>
                        <p className="text-sm text-bg-main py-1">Say something to start a live chat!</p>

                        <div className="mb-4 text-center">
                            <FaPhone className="text-light-grey mx-auto text-lg" />
                            <p className="my-2 text-light-grey text-sm">+1012 3456 789</p>
                        </div>
                        <div className="mb-4 text-center">
                            <FaEnvelope className="text-light-grey mx-auto text-lg" />
                            <p className="my-2 text-light-grey text-sm">misrify@gmail.com</p>
                        </div>
                        <div className="mb-4 text-center">
                            <FaMapMarkerAlt className="text-light-grey mx-auto text-lg" />
                            <p className="my-2 text-light-grey text-sm">Damnhour, Egypt</p>
                        </div>

                        <div className="flex justify-center gap-6 mt-1">
                            <a href="#" className="text-xl text-light-grey hover:text-dark-grey transition duration-400">
                                <FaFacebookF />
                            </a>
                            <a href="#" className="text-xl text-light-grey hover:text-dark-grey transition duration-400">
                                <FaInstagram />
                            </a>
                            <a href="#" className="text-xl text-light-grey hover:text-dark-grey transition duration-400">
                                <FaTwitter />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-center gap-6 mt-4 w-full text-center md:text-left">
                        <div>
                            <h4 className="text-title-blue font-bold text-lg my-2">Customer Support</h4>
                            <p className="text-dark-grey text-sm">We’re here 24/7 for orders, accounts, or anything else.</p>
                        </div>
                        <div>
                            <h4 className="text-title-blue font-bold text-lg my-2">Feedback</h4>
                            <p className="text-dark-grey text-sm">Got ideas? We’d love to hear how we can do better.</p>
                        </div>
                        <div>
                            <h4 className="text-title-blue font-bold text-lg my-2">Media Inquiries</h4>
                            <p className="text-dark-grey text-sm">For press or partnerships, contact our comms team.</p>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="w-full md:w-1/2 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-2xl font-bold mb-4 text-title-blue text-center md:text-left">Get In Touch</h3>
                    <p className="text-dark-grey mb-6 text-center md:text-left">You can reach us anytime you want</p>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="firstName" className="block text-main-blue font-semibold mb-2">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    placeholder={user?.name.split(' ')[0]}
                                    onChange={handleChange}
                                    className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 px-3 mb-2 focus:outline-none focus:border-dark-grey hover:shadow ${errors.firstName ? 'border-red-500' : ''}`}
                                />
                                {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-main-blue font-semibold mb-2">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    placeholder={user?.name.split(' ')[1]}
                                    onChange={handleChange}
                                    className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 px-3 mb-2 focus:outline-none focus:border-dark-grey hover:shadow ${errors.lastName ? 'border-red-500' : ''}`}
                                />
                                {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-main-blue font-semibold mb-2">Your E-mail</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/3 transform -translate-y-1/2 text-main-blue text-l" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder={user?.email}
                                    className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 pl-10 mb-2 focus:outline-none focus:border-dark-grey hover:shadow ${errors.email ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-main-blue font-semibold mb-2">Phone</label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-1/3 transform -translate-y-1/2 text-main-blue text-l" />
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    placeholder={user?.phoneNumber}
                                    onChange={handleChange}
                                    className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 pl-10 mb-2 focus:outline-none focus:border-dark-grey hover:shadow ${errors.phone ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="message" className="block text-main-blue font-semibold mb-2">Your Message</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 px-3 mb-2 focus:outline-none focus:border-dark-grey hover:shadow resize-none ${errors.message ? 'border-red-500' : ''}`}
                                placeholder="Type Here..."
                                style={{ height: '100px' }}
                            ></textarea>
                            {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`bg-main-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded-md w-full transition duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <p className="text-center text-xs text-dark-grey mt-2">
                            By contacting us, you agree to our{' '}
                            <a href="#" className="underline text-main-blue">Terms of service</a> and{' '}
                            <a href="#" className="underline text-main-blue">Privacy Policy</a>.
                        </p>
                    </form>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default Contact;