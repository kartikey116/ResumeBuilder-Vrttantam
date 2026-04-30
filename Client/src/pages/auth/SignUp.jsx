import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { validateEmail } from '../../utils/helper.js';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector.jsx';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';
import uploadImage from '../../utils/uploadimage';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { FiMail, FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import AuthBackground from '../../components/ui/AuthBackground.jsx';

function SignUp({ setCurrentPage }) {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['6deg', '-6deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-6deg', '6deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const handleSignup = async (e) => {
    e.preventDefault();
    let profileImageUrl = '';
    if (!fullName || !validateEmail(email) || !password || password !== confirmPassword) {
      toast.error('Please fill all fields correctly');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || '';
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName, email, password, confirmPassword, profileImageUrl,
      });
      if (response.data) {
        toast.success('Account created! Please log in.');
        handleSwitchToLogin();
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'An error occurred. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    if (setCurrentPage) setCurrentPage('login');
    else navigate('/login');
  };

  const fieldStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 14, padding: '0 14px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const inputStyle = {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: '#fff', fontSize: 13, padding: '11px 0',
  };
  const labelStyle = {
    fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.38)',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: 5, display: 'block',
  };

  const handleFieldFocus = (e) => {
    const wrapper = e.currentTarget.closest('[data-field]');
    if (wrapper) { wrapper.style.borderColor = 'rgba(124,58,237,0.55)'; wrapper.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }
  };
  const handleFieldBlur = (e) => {
    const wrapper = e.currentTarget.closest('[data-field]');
    if (wrapper) { wrapper.style.borderColor = 'rgba(255,255,255,0.10)'; wrapper.style.boxShadow = 'none'; }
  };

  return (
    <AuthBackground>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full max-w-[520px] my-8"
      >
        <div style={{
          padding: '1px', borderRadius: 34,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.6) 0%, rgba(219,39,119,0.4) 50%, rgba(79,70,229,0.5) 100%)',
          boxShadow: '0 0 60px rgba(124,58,237,0.22), 0 40px 100px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            background: 'rgba(12,12,28,0.88)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            borderRadius: 33, padding: '36px 36px',
            transform: 'translateZ(20px)',
          }}>

            {/* Header */}
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 48, height: 48, borderRadius: 14, marginBottom: 14,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.2))',
                border: '1px solid rgba(124,58,237,0.4)',
                boxShadow: '0 0 20px rgba(124,58,237,0.25)',
              }}>
                <span style={{ fontSize: 20 }}>✦</span>
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                Create Account
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13, marginTop: 5 }}>
                Start building your professional story
              </p>
            </div>

            {/* OAuth */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { href: `${BASE_URL}/api/auth/google`, icon: <FaGoogle size={14} color="#ea4335" />, label: 'Google' },
                { href: `${BASE_URL}/api/auth/github`, icon: <FaGithub size={14} color="#fff" />, label: 'GitHub' },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  padding: '10px 12px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: 600,
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                >
                  {icon} {label}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>or sign up</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            <form onSubmit={handleSignup}>
              {/* Profile Photo */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}>
                  <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
                </div>
              </div>

              {/* Grid fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 12px', marginBottom: 14 }}>
                
                {/* Full Name */}
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <div data-field style={fieldStyle}>
                    <FiUser size={13} color="rgba(255,255,255,0.28)" />
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" style={inputStyle} onFocus={handleFieldFocus} onBlur={handleFieldBlur} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email</label>
                  <div data-field style={fieldStyle}>
                    <FiMail size={13} color="rgba(255,255,255,0.28)" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" style={inputStyle} onFocus={handleFieldFocus} onBlur={handleFieldBlur} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <div data-field style={fieldStyle}>
                    <FiLock size={13} color="rgba(255,255,255,0.28)" />
                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} onFocus={handleFieldFocus} onBlur={handleFieldBlur} />
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.28)', padding: 0 }}>
                      {showPass ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                    </button>
                  </div>
                </div>

                {/* Confirm */}
                <div>
                  <label style={labelStyle}>Confirm</label>
                  <div data-field style={fieldStyle}>
                    <FiLock size={13} color="rgba(255,255,255,0.28)" />
                    <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" style={inputStyle} onFocus={handleFieldFocus} onBlur={handleFieldBlur} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.28)', padding: 0 }}>
                      {showConfirm ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '9px 14px', fontSize: 12, color: '#fca5a5', textAlign: 'center', marginBottom: 12 }}>
                  {error}
                </div>
              )}

              <motion.button
                type="submit" disabled={isLoading}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%', padding: '13px', marginTop: 4,
                  background: isLoading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #db2777 100%)',
                  color: '#fff', border: 'none', borderRadius: 16,
                  fontSize: 14, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 24px rgba(124,58,237,0.38)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                {isLoading ? (
                  <>
                    <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Creating account…
                  </>
                ) : (
                  <>Create Account <FiArrowRight size={15} /></>
                )}
              </motion.button>

              <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.32)', marginTop: 14 }}>
                Already have an account?{' '}
                <button type="button" onClick={handleSwitchToLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a855f7', fontWeight: 700, fontSize: 13, padding: 0 }}>
                  Sign in →
                </button>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthBackground>
  );
}

export default SignUp;