import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Input from '../../COmponent/Inputs/Input.jsx';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import AuthBackground from '../../COmponent/AuthBackground.jsx';

function Login({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(UserContext);
  const { updateUser } = context || {};
  const navigate = useNavigate();

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        if (typeof updateUser === 'function') {
          updateUser(response.data);
          toast.success("Welcome back!");
          navigate("/dashboard");
        }
      }
    } catch (error) {
       const msg = error.response?.data?.message || "An unexpected error occurred.";
       setError(msg);
       toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSignup = () => {
    if (setCurrentPage) {
      setCurrentPage('signup');
    } else {
      navigate('/signup');
    }
  };

  return (
    <AuthBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full max-w-[450px] p-1 shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10"
      >
        <div 
          className="bg-[#0f0f13]/90 rounded-[2.4rem] p-8 md:p-10"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Elevate your career narrative today.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <a 
              href={`${BASE_URL}/api/auth/google`} 
              className="flex items-center justify-center gap-2 border border-white/5 bg-white/5 rounded-2xl py-3 hover:bg-white/10 transition-all group"
            >
              <FaGoogle className="text-red-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-300">Google</span>
            </a>
            <a 
              href={`${BASE_URL}/api/auth/github`} 
              className="flex items-center justify-center gap-2 border border-white/5 bg-white/5 rounded-2xl py-3 hover:bg-white/10 transition-all group"
            >
              <FaGithub className="text-white group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-300">GitHub</span>
            </a>
          </div>

          <div className="relative flex py-4 items-center mb-6">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] text-gray-500 uppercase tracking-widest font-bold">Or use email</span>
              <div className="flex-grow border-t border-white/5"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 ml-1">Email</label>
              <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-1 focus-within:border-purple-500/50 transition-all">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent border-none outline-none text-white text-sm py-2 placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 ml-1">Password</label>
              <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-1 focus-within:border-purple-500/50 transition-all">
                 <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none outline-none text-white text-sm py-2 placeholder:text-gray-600"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-[11px] font-medium text-center">{error}</p>}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 transition-all disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'SECURELY LOGGING IN...' : 'CONTINUE'}
            </motion.button>

            <p className="text-center text-xs text-gray-500 pt-4">
              New to Vṛttāntam?{" "}
              <button 
                type="button" 
                className="text-purple-400 font-bold hover:underline" 
                onClick={handleSwitchToSignup}
              >
                Create Account
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </AuthBackground>
  );
}

export default Login;