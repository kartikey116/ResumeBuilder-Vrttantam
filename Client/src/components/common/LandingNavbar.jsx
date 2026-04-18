import React, { useState } from 'react'
import Login from '../auth/Login.jsx'
import Signup from '../auth/Signup.jsx'

function Navbar() {
    const [showLogin, setShowLogin] = useState(false)
    const [showSignup, setShowSignup] = useState(false)

    return (
        <>
            <div className="fixed top-0 left-0 w-full h-16 bg-black text-white z-10 shadow-md">
                <div className="container mx-auto px-8">
                    <div className="flex items-center justify-between h-full">

                        {/* Brand */}
                        <div className="text-2xl font-bold">AIResumeCraft</div>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-6">
                            <a href="#features" className="text-lg font-medium hover:text-orange-400 transition-colors duration-200">Features</a>
                            <a href="#testimonials" className="text-lg font-medium hover:text-orange-400 transition-colors duration-200">Testimonials</a>
                            <a href="#faq" className="text-lg font-medium hover:text-orange-400 transition-colors duration-200">FAQ</a>
                            <a href="#contact" className="text-lg font-medium hover:text-orange-400 transition-colors duration-200">Contact</a>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="px-4 py-1.5 border border-white rounded-lg hover:bg-white hover:text-black transition duration-300"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setShowSignup(true)}
                                className="px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conditional Modals */}
            {showLogin && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
                        <Login />
                        <button
                            onClick={() => setShowLogin(false)}
                            className="mt-4 text-sm text-gray-600 hover:text-black"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {showSignup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-[90%] max-w-md">
                        <Signup />
                        <button
                            onClick={() => setShowSignup(false)}
                            className="mt-4 text-sm text-gray-600 hover:text-black"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Navbar
