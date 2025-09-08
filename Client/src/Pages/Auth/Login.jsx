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

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // --- Client-side validation with corrected toasts ---
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

    // --- API call to login ---
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });
      console.log("API Response Data:", response.data);
      
      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
        toast.success("Login successful!"); // Optional: Add a success toast
      }
    } catch (error) {
      // --- Server-side error handling with corrected toasts ---
      if (error.response && error.response.data && error.response.data.message) {
        const serverMessage = error.response.data.message;
        const msg = serverMessage.toLowerCase();
        
        if (msg.includes("password")) {
          const customMessage = "Incorrect password. Please try again.";
          setError(customMessage);
          toast.error(customMessage);
        } else if (msg.includes("user") || msg.includes("email")) {
          const customMessage = "No account found with this email.";
          setError(customMessage);
          toast.error(customMessage);
        } else {
          setError(serverMessage);
          toast.error(serverMessage);
        }
      } else {
        const fallbackMessage = "An unexpected error occurred. Please try again.";
        setError(fallbackMessage);
        toast.error(fallbackMessage);
      }
    }
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>
        Welcome Back
      </h3>
      <p className='text-xs text-state-700 mt-[5px] mb-6'>
        Please enter your email and password to login
      </p>

      <form onSubmit={handleLogin}>
        <Input
          value={email}
          onChange={(val) => setEmail(val)}
          label='Email Address '
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
        <button type='submit' className='btn-primary'>
          LOGIN
        </button>
        <p className='text-[13px] text-slate-800 mt-3'>
          Don't have an account?{" "}
          <button type='button' className='font-medium text-purple-700 underline cursor-pointer' onClick={() => setCurrentPage("signup")}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;