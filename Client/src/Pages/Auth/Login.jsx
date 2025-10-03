import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../COmponent/Inputs/Input.jsx';
import { validateEmail } from '../../utils/helper.js';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { UserContext } from '../../context/userContext.jsx';
import toast from 'react-hot-toast';

function Login({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const context = useContext(UserContext);
  
  // Debug: Check if context is received
  console.log("UserContext in Login:", context);
  
  if (!context) {
    console.error("UserContext is undefined! Make sure UserProvider wraps this component.");
  }

  const { updateUser } = context || {};
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // --- Client-side validation ---
    if (!validateEmail(email)) {
      const message = "Please enter a valid email address";
      setError(message);
      toast.error(message);
      return;
    }
    if (!password) {
      const message = "Please enter a password";
      setError(message);
      toast.error(message);
      return;
    }
    if (password.length < 8) {
      const message = "Password must be at least 8 characters";
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setIsLoading(true);

    // --- API call to login ---
    try {
      console.log("Sending login request to:", API_PATHS.AUTH.LOGIN);
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      
      console.log("API Response Data:", response.data);
      
      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        
        // Check if updateUser exists before calling
        if (typeof updateUser === 'function') {
          updateUser(response.data);
          toast.success("Login successful!");
          navigate("/dashboard");
        } else {
          console.error("updateUser is not a function:", updateUser);
          toast.error("Login error: Context not initialized properly");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // --- Server-side error handling ---
      if (error.response?.data?.message) {
        const serverMessage = error.response.data.message;
        const msg = serverMessage.toLowerCase();
        
        if (msg.includes("password")) {
          const customMessage = "Incorrect password. Please try again.";
          setError(customMessage);
          toast.error(customMessage);
        } else if (msg.includes("user") || msg.includes("not found")) {
          const customMessage = "No account found with this email.";
          setError(customMessage);
          toast.error(customMessage);
        } else {
          setError(serverMessage);
          toast.error(serverMessage);
        }
      } else if (error.code === 'ERR_NETWORK') {
        const networkMessage = "Cannot connect to server. Please check if the server is running.";
        setError(networkMessage);
        toast.error(networkMessage);
      } else {
        const fallbackMessage = "An unexpected error occurred. Please try again.";
        setError(fallbackMessage);
        toast.error(fallbackMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>
        Welcome Back
      </h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Please enter your email and password to login
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={(val) => setEmail(val)}
          label='Email Address'
          type='text'
          placeholder='john@example.com'
        />
        <Input
          value={password}
          onChange={(val) => setPassword(val)}
          label='Password'
          type='password'
          placeholder='Min 8 characters'
        />
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button 
          type='submit' 
          className='btn-primary'
          disabled={isLoading}
        >
          {isLoading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
        <p className='text-[13px] text-slate-800 mt-3'>
          Don't have an account?{" "}
          <button 
            type='button' 
            className='font-medium text-purple-700 underline cursor-pointer' 
            onClick={() => setCurrentPage("signup")}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;