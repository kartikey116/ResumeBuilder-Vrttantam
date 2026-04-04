import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Input from '../../COmponent/Inputs/Input';
import { validateEmail } from '../../utils/helper.js';
import ProfilePhotoSelector from '../../COmponent/Inputs/ProfilePhotoSelector.jsx';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';
import uploadImage from '../../utils/uploadimage';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import AuthBackground from '../../COmponent/AuthBackground.jsx';

function SignUp({ setCurrentPage }) {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { updateUser } = useContext(UserContext);
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

  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";

    if (!fullName || !validateEmail(email) || !password || password !== confirmPassword) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        confirmPassword,
        profileImageUrl,
      });

      if (response.data) {
        toast.success("Account created successfully! Please login.");
        handleSwitchToLogin();
      }
    } catch (error) {
      const msg = error.response?.data?.message || "An error occurred. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    if (setCurrentPage) {
      setCurrentPage('login');
    } else {
      navigate('/login');
    }
  };

  return (
    <AuthBackground>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full max-w-[500px] p-1 shadow-2xl rounded-[2.5rem] bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 my-10"
      >
        <div 
          className="bg-[#0f0f13]/90 rounded-[2.4rem] p-8 md:p-10"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-gray-400 text-sm">Start building your professional story.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <a href={`${BASE_URL}/api/auth/google`} className="flex items-center justify-center gap-2 border border-white/5 bg-white/5 rounded-2xl py-2.5 hover:bg-white/10 transition-all group">
              <FaGoogle className="text-red-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-300">Google</span>
            </a>
            <a href={`${BASE_URL}/api/auth/github`} className="flex items-center justify-center gap-2 border border-white/5 bg-white/5 rounded-2xl py-2.5 hover:bg-white/10 transition-all group">
              <FaGithub className="text-white group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-gray-300">GitHub</span>
            </a>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="flex justify-center mb-2">
              <div className="transform scale-90">
                <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Full Name</label>
                <input 
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/50 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Confirm</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-[11px] font-medium text-center">{error}</p>}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 transition-all disabled:opacity-50 mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'CREATING SECURE ACCOUNT...' : 'CREATE ACCOUNT'}
            </motion.button>

            <p className="text-center text-xs text-gray-500 pt-2">
              Already have an account?{" "}
              <button 
                type="button" 
                className="text-purple-400 font-bold hover:underline" 
                onClick={handleSwitchToLogin}
              >
                Login here
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </AuthBackground>
  );
}

export default SignUp;