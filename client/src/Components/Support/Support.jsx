import { useState } from 'react';
import { Flip, toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaPhone, FaStore, FaBoxOpen, FaTruck, FaUndo, FaCommentDots, FaCreditCard, FaRobot } from 'react-icons/fa';
import { PiStudentFill } from "react-icons/pi";
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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
    <>
      <div className="max-w-4xl mx-auto py-10">
        <div className="flex flex-col items-center justify-center mb-4">
          <h2 className="text-3xl font-bold text-main-blue text-center mb-4">
            Access Our Help & Support Center
          </h2>
          <p className="text-dark-grey text-sm text-center mb-4">
            Got a question? You're in the right place! Check out our FAQs for
            speedy answers. Still need help? We're just a message away
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white flex flex-col items-center justify-center p-7 rounded-lg">
            <FaStore className="text-main-blue text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-main-blue">
              What do we do?
            </h3>
            <p className="text-dark-grey text-center text-sm">
              Misrify aims to connect Egyptian brands and stores with
              consumers, promoting local products and supporting economic
              growth.
            </p>
          </div>
          <div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg">
            <FaBoxOpen className="text-main-blue text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-main-blue">
              What products are available?
            </h3>
            <p className="text-dark-grey text-center text-sm">
              You can find a variety of gyptian brands and stores, showcasing
              a wide range of categories from traditional crafts to modern
              goods.
            </p>
          </div>
          <div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg">
            <FaTruck className="text-main-blue text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-main-blue">
              How can I track my order?
            </h3>
            <p className="text-dark-grey text-center text-sm">
              Once your order is confirmed, you will receive tracking
              information via email, allowing you to monitor its status.
            </p>
          </div>
          <div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg">
            <FaUndo className="text-main-blue text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-main-blue">
              What is the return policy?
            </h3>
            <p className="text-dark-grey text-center text-sm">
              Customers can return products within a specified period if
              unsatisfied, provided items are in original condition.
            </p>
          </div>
          <div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg">
            <FaCommentDots className="text-main-blue text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-main-blue">
              How do I leave a review for a product?
            </h3>
            <p className="text-dark-grey text-center text-sm">
              After purchasing a product, you can leave a review on the
              product page by rating it and providing your feedback.
            </p>
          </div>
          <div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg">
            <FaCreditCard className="text-main-blue text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-main-blue">
              What payment methods do you accept?
            </h3>
            <p className="text-dark-grey text-center text-sm">
              The marketplace supports a variety of payment options, including
              credit/debit cards and digital wallets.
            </p>
          </div>
          <div className="bg-white flex flex-col items-center justify-center p-8 rounded-lg md:col-span-2 md:justify-self-center md:max-w-[50%]">
            <PiStudentFill className="text-main-blue text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-main-blue">
              What are student special codes?
            </h3>
            <p className="text-dark-grey text-center text-sm">
              Student special codes allow you to earn points for discounts and
              promotions on the platform. Use your university email to access
              these benefits!
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-3xl font-bold mb-4 text-main-blue text-center">
            Get In Touch
          </h3>
          <p className="text-dark-grey mb-6 text-center">
            You can reach us anytime you want
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Form Fields */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-main-blue font-semibold mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 px-3 mb-2 focus:outline-none hover:shadow ${errors.firstName ? "border-red-500" : ""
                    }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-main-blue font-semibold mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 px-3 mb-2 focus:outline-none hover:shadow ${errors.lastName ? "border-red-500" : ""
                    }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-main-blue font-semibold mb-2"
              >
                Your E-mail
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/3 transform -translate-y-1/2 text-main-blue text-l" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 pl-10 mb-2 focus:outline-none hover:shadow ${errors.email ? "border-red-500" : ""
                    }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-main-blue font-semibold mb-2"
              >
                Phone
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/3 transform -translate-y-1/2 text-main-blue text-l" />
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 pl-10 mb-2 focus:outline-none hover:shadow ${errors.phone ? "border-red-500" : ""
                    }`}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-main-blue font-semibold mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={`w-full bg-bg-second text-title-blue border-b border-second-grey py-2 px-3 mb-2 focus:outline-none hover:shadow ${errors.message ? "border-red-500" : ""
                  }`}
                placeholder="Type Here..."
              ></textarea>
              {errors.message && (
                <p className="text-red-500 text-xs">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-main-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded-md w-full transition duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <p className="text-center text-xs text-dark-grey mt-2">
              By contacting us, you agree to our{" "}
              <a href="#" className="underline text-main-blue">
                Terms of service
              </a>{" "}
              and{" "}
              <a href="#" className="underline text-main-blue">
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Support;
