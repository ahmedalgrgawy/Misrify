import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Contact = () => {

    const formRef = useRef();
    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_4nlnc0m', 'template_sto6jpa', formRef.current, '1PczDjoXIqfE2Anou')
            .then(() => {
                toast.success('Message sent successfully!');
                formRef.current.reset();
            })
            .catch(() => {
                toast.error('Failed to send message');
            });
    };

    return (
        <div className="px-4 md:px-16 py-16 bg-bg-second">
            <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-10 max-w-7xl mx-auto">
                {/* Contact Info */}
                <div className="bg-bg-second w-full md:w-1/2 transition-shadow duration-300 flex flex-col items-center md:items-start">
                    <div>
                        <h2 className="text-title-blue font-bold text-3xl mb-2 text-center md:text-left">Contact Us</h2>
                        <p className="text-dark-grey text-sm mb-3 text-center md:text-left">
                            We'd love to hear from you! Whether you have a question, suggestion, or just want to <br />
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
                    <form ref={formRef} onSubmit={sendEmail}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="firstName" className="block text-main-blue font-semibold mb-2">First Name</label>
                                <input type="text" id="firstName" name="from_name" required className="w-full bg-bg-second text-title-blue border-b 
                                border-second-grey py-2 px-3 mb-4 text-dark-grey focus:outline-none focus:border-dark-grey hover:shadow" />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-main-blue font-semibold mb-2">Last Name</label>
                                <input type="text" id="lastName" className="w-full bg-bg-second text-title-blue border-b border-second-grey 
                                py-2 px-3 mb-4 text-dark-grey focus:outline-none focus:border-dark-grey hover:shadow" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-main-blue font-semibold mb-2">Your E-mail</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/3 transform -translate-y-1/2 text-main-blue text-l" />
                                <input type="email" name="user_email" placeholder="Your Email" required id="email" className="w-full bg-bg-second
                                 text-title-blue border-b border-second-grey py-2 pl-10 mb-4 text-dark-grey focus:outline-none focus:border-dark-grey hover:shadow" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-main-blue font-semibold mb-2">Phone</label>
                            <div className="relative">
                                <FaPhone className="absolute left-3 top-1/3 transform -translate-y-1/2 text-main-blue text-l" />
                                <input type="text" id="phone" className="w-full bg-bg-second text-title-blue border-b border-second-grey py-2 pl-10 mb-4 
                                text-dark-grey focus:outline-none focus:border-dark-grey hover:shadow" />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="message" className="block text-main-blue font-semibold mb-2">Your Message</label>
                            <textarea id="message" rows="5" className="w-full bg-bg-second text-title-blue border-b border-second-grey py-2 px-3 mb-4 text-dark-grey
                             focus:outline-none focus:border-dark-grey hover:shadow resize-none"
                                placeholder="Type Here..."
                                style={{ height: '100px' }}
                                name="message"
                                required
                            ></textarea>
                        </div>

                        <button type="submit" className="bg-main-blue hover:bg-dark-blue text-white font-bold py-2 px-4 rounded-md w-full transition duration-300" >Submit</button>
                        <p className="text-center text-xs text-dark-grey mt-2">By contacting us, you agree to our <a href="#" className="underline text-main-blue">Terms of service</a> and <a href="#" className="underline text-main-blue">Privacy Policy</a>.</p>
                    </form>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default Contact;
