import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS, BASE_URL } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import AuthBackground from '../../components/ui/AuthBackground.jsx';

function Login({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(UserContext);
  const { updateUser } = context || {};
  const navigate = useNavigate();

  // 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) { toast.error('Please enter a valid email address'); return; }
    if (!password || password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setError(null);
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        if (typeof updateUser === 'function') {
          updateUser(response.data);
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'An unexpected error occurred.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSignup = () => {
    if (setCurrentPage) setCurrentPage('signup');
    else navigate('/signup');
  };

  return (
    <AuthBackground>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full max-w-[440px]"
      >
        {/* Outer gradient border ring */}
        <div style={{
          padding: '1px',
          borderRadius: 32,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.6) 0%, rgba(219,39,119,0.4) 50%, rgba(79,70,229,0.5) 100%)',
          boxShadow: '0 0 60px rgba(124,58,237,0.25), 0 40px 100px rgba(0,0,0,0.5)',
        }}>
          {/* Glass card */}
          <div style={{
            background: 'rgba(12,12,28,0.85)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            borderRadius: 31,
            padding: '40px 40px',
            transform: 'translateZ(30px)',
          }}>

            {/* Logo / Title */}
            <div style={{ marginBottom: 28, textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 52, height: 52, borderRadius: 16, marginBottom: 16,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.2))',
                border: '1px solid rgba(124,58,237,0.4)',
                boxShadow: '0 0 20px rgba(124,58,237,0.3)',
              }}>
                <span style={{ fontSize: 22 }}>✦</span>
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
                Welcome back
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginTop: 6 }}>
                Sign in to your Vṛttāntam account
              </p>
            </div>

            {/* OAuth buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[
                { href: `${BASE_URL}/api/auth/google`, icon: <FaGoogle size={15} color="#ea4335" />, label: 'Google' },
                { href: `${BASE_URL}/api/auth/github`, icon: <FaGithub size={15} color="#fff" />, label: 'GitHub' },
              ].map(({ href, icon, label }) => (
                <a key={label} href={href} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '11px 16px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(255,255,255,0.80)',
                  fontSize: 13, fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; }}
                >
                  {icon} {label}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>or continue</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              
              {/* Email */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.40)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' }}>
                  Email
                </label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 14, padding: '0 14px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.55)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <FiMail size={15} color="rgba(255,255,255,0.30)" />
                  <input
                    type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      color: '#fff', fontSize: 14, padding: '13px 0',
                    }}
                    onFocus={e => { e.currentTarget.parentElement.style.borderColor = 'rgba(124,58,237,0.55)'; e.currentTarget.parentElement.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                    onBlur={e => { e.currentTarget.parentElement.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.parentElement.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.40)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, display: 'block' }}>
                  Password
                </label>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 14, padding: '0 14px',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}>
                  <FiLock size={15} color="rgba(255,255,255,0.30)" />
                  <input
                    type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      flex: 1, background: 'transparent', border: 'none', outline: 'none',
                      color: '#fff', fontSize: 14, padding: '13px 0',
                    }}
                    onFocus={e => { e.currentTarget.parentElement.style.borderColor = 'rgba(124,58,237,0.55)'; e.currentTarget.parentElement.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                    onBlur={e => { e.currentTarget.parentElement.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.parentElement.style.boxShadow = 'none'; }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.30)', padding: 0 }}>
                    {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#fca5a5', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%', padding: '14px', marginTop: 4,
                  background: isLoading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #db2777 100%)',
                  backgroundSize: '200% 200%',
                  color: '#fff', border: 'none', borderRadius: 16,
                  fontSize: 14, fontWeight: 700, cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 24px rgba(124,58,237,0.40)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'box-shadow 0.2s',
                }}
              >
                {isLoading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Signing in…
                  </>
                ) : (
                  <>Continue <FiArrowRight size={15} /></>
                )}
              </motion.button>

              <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                New to Vṛttāntam?{' '}
                <button type="button" onClick={handleSwitchToSignup} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a855f7', fontWeight: 700, fontSize: 13, padding: 0 }}>
                  Create account →
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

export default Login;