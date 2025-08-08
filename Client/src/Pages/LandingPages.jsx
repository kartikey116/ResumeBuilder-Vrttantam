import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import home from '../assets/home.png'
import Modal from '../COmponent/Modal.jsx'
import Login from '../Pages/Auth/Login.jsx'
import Signup from '../Pages/Auth/SignUp.jsx'
import { UserContext } from "../context/userContext.jsx";
import { useContext } from 'react';
import ProfileInfoCard from '../COmponent/Cards/ProfileInfoCard.jsx';
import Footer from '../Pages/Footer.jsx';
import { features, testimonials, faqs } from "../assets/Constant.jsx";

    function LandingPages() {
      const { user } = useContext(UserContext);
      const navigate = useNavigate();
      const [openAuthModal, setOpenAuthModal] = useState(false);
      const [currentPage, setCurrentPage] = useState('login');

      const handleCTA = () => {
        if (!user) {
          setOpenAuthModal(true);
        } else {
          navigate('/dashboard');
        }
      };

      return (
        <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
          <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <header className="flex items-center justify-between py-4">
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
                वृत्तान्तम्
                <span className="text-sm font-normal text-gray-500 ml-2">(Vṛttāntam)</span>
              </div>
              {user ? (
                <ProfileInfoCard />
              ) : (
                <button
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  onClick={() => setOpenAuthModal(true)}
                >
                  Login / Sign Up
                </button>
              )}
            </header>

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row items-center mt-16 gap-12">
              <div className="w-full md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  Craft Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse">
                    Perfect Resume
                  </span>
                </h1>
                <p className="text-lg text-gray-600 mt-4 mb-8">
                  Inspired by the Sanskrit term "वृttāntam" (narrative), our platform empowers you to create resumes that tell your unique professional story with ease and elegance.
                </p>
                <button
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:scale-105 transition-all duration-300"
                  onClick={handleCTA}
                >
                  Get Started Now
                </button>
              </div>
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <img
                    src={home}
                    alt="Resume Preview"
                    className="w-full rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <section className="mt-24">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why Choose Vṛttāntam?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="mt-24 py-12 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                What Our Users Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                    <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs Section */}
            <section className="mt-24">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Frequently Asked Questions
              </h2>
              <div className="max-w-3xl mx-auto space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="mt-24 py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Build Your Future?</h2>
              <p className="text-lg mb-8">Join thousands of professionals creating stunning resumes with Vṛttāntam.</p>
              <button
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300"
                onClick={handleCTA}
              >
                Start Building Now
              </button>
            </section>

            {/* Footer */}
            <footer className="mt-24 py-12 bg-gray-900 text-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      वृttāntam
                    </h3>
                    <p className="text-gray-400 mt-2">
                      Crafting professional narratives that empower your career.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Product</h4>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-400 hover:text-purplehaz400 transition-colors">Features</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Templates</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Pricing</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">API</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Support</h4>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Help Center</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Contact</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacy</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Terms</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Connect</h4>
                    <ul className="space-y-2">
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Twitter</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">LinkedIn</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">GitHub</a></li>
                      <li><a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">Discord</a></li>
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-8 mt-8 text-center">
                  <p className="text-gray-400">
                    © {new Date().getFullYear()} Vṛttāntam. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>

            {/* Auth Modal */}
            <Modal
              isOpen={openAuthModal}
              onClose={() => {
                setOpenAuthModal(false);
                setCurrentPage('login');
              }}
              hideHeader
            >
              {currentPage === 'login' && <Login setCurrentPage={setCurrentPage} />}
              {currentPage === 'signup' && <Signup setCurrentPage={setCurrentPage} />}
            </Modal>
          </div>
        </div>
      );
    }

export default LandingPages