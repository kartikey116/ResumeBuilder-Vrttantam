import React from 'react'
import { useState , useContext } from 'react'
import Input from '../../COmponent/Inputs/Input'
import { useNavigate } from 'react-router-dom'
import { validateEmail } from '../../utils/helper.js'
import ProfilePhotoSelector from '../../COmponent/Inputs/ProfilePhotoSelector.jsx'
import axiosInstance from '../../utils/axiosinstance.js'
import { API_PATHS } from '../../utils/apiPaths.js'
import { UserContext } from '../../context/userContext.jsx';
import uploadImage from '../../utils/uploadImage.js';
import Dashboard from '../Home/Dashboard.jsx'

function SignUp({ setCurrentPage }) {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  //Handle Signup Form Submit
  const handleSignup = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setError(null);
    // API call to signup
    try {
      // upload image if present
      if(profilePic){
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

      const {token} = response.data;
      if(token){
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }

    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }

  }

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className='text-lg font-bold text-black'>Create an Account</h3>
      <p className='text-s text-slate-700 mt-[5px] mb-6 '>Join us and start building your resume today!</p>
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
          <button type='submit' className='btn-primary'>
            SIGN UP
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <button className='font-medium text-purple-700 underline cursor-pointer' onClick={() => setCurrentPage("login")}>
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  )

}

export default SignUp