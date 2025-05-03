import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';

const Support = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const faqs = [
        {
            question: "What services do you offer?",
            answer: "We provide a range of services including [brief overview of services]."
        },
        {
            question: "How can I contact customer support?",
            answer: "You can reach our customer support team through the contact form on this page, or by emailing us at [support email]."
        },
        {
            question: "What are your support hours?",
            answer: "Our support team is available from [insert hours, e.g., 9 AM to 5 PM, Monday to Friday]."
        },
        {
            question: "How long does it take to receive a response?",
            answer: "We aim to respond to all inquiries within [insert timeframe, e.g., 24-48 hours]."
        },
        {
            question: "Can I change my account information?",
            answer: "Yes, you can update your account information by logging into your account and navigating to the settings section."
        }
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\+?\d{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Invalid phone number (10-15 digits)';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fix the form errors');
            return;
        }
        setIsSubmitting(true);
        try {
            await axiosInstance.post('user/contact', formData);
            toast.success('Message sent successfully!');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                message: ''
            });
            setErrors({});
        } catch (error) {
            toast.error('Failed to send message');
            console.error('API error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-10 max-w-7xl mx-auto">
                {/* Contact Form */}
                <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
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
                                    placeholder="Your Email"
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

            {/* FAQ Section (Inline, Not Extracted) */}
            <section className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6 mt-10 hover:shadow-lg transition-shadow duration-300 mx-auto">
                <h3 className="text-2xl font-bold mb-6 text-title-blue text-center">Frequently Asked Questions</h3>
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index}>
                            <h4 className="font-semibold text-main-blue">{index + 1}. {faq.question}</h4>
                            <p className="text-dark-grey mt-1">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            <ToastContainer position="bottom-right" />
        </>
    );
};

export default Support;
