import React from 'react'
import { useState, useContext } from 'react'
import Input from '../../COmponent/Inputs/Input'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper.js'
import ProfilePhotoSelector from '../../COmponent/Inputs/ProfilePhotoSelector.jsx'
import axiosInstance from '../../utils/axiosinstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { UserContext } from '../../context/userContext.jsx';
import uploadImage from '../../utils/uploadimage';
import toast from 'react-hot-toast';

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

  //Handle Signup Form Submit
  const handleSignup = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    // Client-side validation
    if (!fullName) {
      const message = "Please enter your full name";
      setError(message);
      toast.error(message);
      return;
    }
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
    if (password !== confirmPassword) {
      const message = "Passwords do not match";
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setIsLoading(true);

    // API call to signup
    try {
      // Upload image if present
      if (profilePic) {
        try {
          const imgUploadRes = await uploadImage(profilePic);
          profileImageUrl = imgUploadRes.imageUrl || "";
        } catch (imgError) {
          console.error("Image upload failed:", imgError);
          toast.error("Failed to upload profile picture, continuing without it");
        }
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
        setCurrentPage("login");
      }

    } catch (error) {
      console.error("Signup error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else if (error.code === 'ERR_NETWORK') {
        const message = "Cannot connect to server. Please check if the server is running.";
        setError(message);
        toast.error(message);
      } else {
        const message = "An error occurred. Please try again.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className='text-lg font-bold text-black'>Create an Account</h3>
      <p className='text-s text-slate-700 mt-[5px] mb-6'>Join us and start building your resume today!</p>
      <form onSubmit={handleSignup}>

        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className='grid grid-cols-1 md:grid-cols-1 gap-2'>
          <Input
            value={fullName}
            onChange={(val) => setFullName(val)}
            label='Full Name'
            type='text'
            placeholder='John Doe'
          />
          <Input
            value={email}
            onChange={(val) => setEmail(val)}
            label='Email Address'
            type='email'
            placeholder='john@example.com'
          />
          <Input
            value={password}
            onChange={(val) => setPassword(val)}
            label='Password'
            type='password'
            placeholder='Min 8 characters'
          />
          <Input
            value={confirmPassword}
            onChange={(val) => setConfirmPassword(val)}
            label='Confirm Password'
            type='password'
            placeholder='Min 8 characters'
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}
          <button 
            type='submit' 
            className='btn-primary'
            disabled={isLoading}
          >
            {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <button 
              type='button'
              className='font-medium text-purple-700 underline cursor-pointer' 
              onClick={() => setCurrentPage("login")}
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export default SignUp