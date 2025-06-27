import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../COmponent/Inputs/Input.jsx'
import { validateEmail } from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosinstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { UserContext } from '../../context/userContext.jsx'
import { useContext } from 'react'
import toast from 'react-hot-toast';


function Login({ setCurrentPage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      toast.error(data.message)

      return;
    }
    if (!password) {
      setError("Please enter a password");
      toast.error(data.message)
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      toast.error(data.message)
      return;
    }

    setError(null);
    // API call to login
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      });
      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        const msg = error.response.data.message.toLowerCase();
        if (msg.includes("password")) {
          setError("Incorrect password. Please try again.");
          toast.error(data.message)
        } else if (msg.includes("user") || msg.includes("email")) {
          setError("No account found with this email.");
          toast.error(data.message)
        } else {
          setError(error.response.data.message);
          toast.error(data.message)
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
        toast.error(data.message)
      }
    }

  }
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
          onChange={(e) => setEmail(e.target.value)}
          label='Email Address '
          type='text'
          placeholder='john@example.com'
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label='Password'
          type='password'
          placeholder='Min 8 characters'
        />
        {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
        <button type='submit' className='btn-primary'>
          LOGIN
        </button>
        <p className='text-[13px] text-slate-800 mt-3'>
          Don't have an account?{ }
          <button className='font-medium text-purple-700 underline cursor-pointer' onClick={() => setCurrentPage("signup")}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login