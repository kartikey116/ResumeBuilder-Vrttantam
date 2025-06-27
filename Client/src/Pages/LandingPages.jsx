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
    const [openAuthModal, setOpenAuthModal] = useState(false)
    const [currentPage, setCurrentPage] = useState("login");

    const handleCTA = () => {
        if(!user){
            setOpenAuthModal(true);
        } else {
            navigate('/dashboard')
        }
    };
    return (
        <div className='w-full min-h-full bg-white '>
            <div className='container mx-auto px-4 py-4'>
                <header className='flex items-center justify-between mb-16
         '>
                    <div className='text-xl font-bold'>
                        Resume Builder
                    </div>
                    {user ? <ProfileInfoCard /> : <button className='bg-purple-200 text-sm font-semibold text-blue-950 px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer' onClick={() => setOpenAuthModal(true)}>
                        Login / Sign Up
                    </button>}
                </header>

                {/* hero sectiion */}
                <div className='flex flex-col md:flex-row items-center mt-20'>
                    <div className='w-full md:w-1/2 pr-4 mb-8 md:mb-0'>
                        <h1 className='text-5xl font-bold mb-6 leading-tight'>
                            Build Your{" "}
                            <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 bg-[length:200%_200%] animate-text-shine'>
                                Resume Effortlessly
                            </span>
                        </h1>
                        <p className='text-lg text-gray-700 mb-8 text-justify mr-20'>
                            Craft a Student resume in minutes with our smart and intuitive resume builder.
                        </p>
                        <button className='bg-black text-sm font-semibold text-white px-8 py-3 rounded hover:bg-purple-200 hover:text-blue-950 transition-colors cursor-pointer'
                            onClick={handleCTA}>
                            Get Started
                        </button>
                    </div>
                    <div className='w-full md:w-1/2 border border-gray-200 pl-8 shadow-lg rounded-xl'>
                        <img src={home} alt="home"
                            className='w-full rounded-lg'
                        />
                    </div>
                </div>

                <section className='mt-30'>
                    <h2 className='text-2xl font-bold text-center mb-5'>
                        Features That Make You Shine
                    </h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-17'>
                        <div className='bg-gray-50 h-60 p-16 rounded-xl shadow-sm hover:shadow-purple-300 transition-all'>
                            <h3 className='text-lg font-semibold mb-3'>Easy Editing</h3>
                            <p className='text-gray-600'>
                                Update your resume section with live preview and instant formatting
                            </p>
                        </div>
                        <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-purple-300 transition-all'>
                            <h3 className='text-lg font-semibold mb-3'>Beautiful Templates</h3>
                            <p className='text-gray-600'>Choose from modern, professional templates that are easy to customize.</p>
                        </div>
                        <div className='bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-purple-300 transition-all'>
                            <h3 className='text-lg font-semibold mb-3'>One-Click Export</h3>
                            <p className='text-gray-600'>
                                Download your resume instantly as a high-quality
                            </p>
                        </div>
                    </div>
                </section>
                <div className='mt-16'>
                    <Footer />
                </div>
            </div>

            <Modal
                isOpen={openAuthModal}
                onClose={() => {
                    setOpenAuthModal(false);
                    setCurrentPage("login");
                }}
                hideHeader>
                <div>
                    {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
                    {currentPage === "signup" && <Signup setCurrentPage={setCurrentPage} />}
                </div>
            </Modal>
        </div>
    )
}

export default LandingPages