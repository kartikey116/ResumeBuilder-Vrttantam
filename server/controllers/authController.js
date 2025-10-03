import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Generate JWT token
const generateToken = (user) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});
};

const registerUser = async (req, res) => {
    try{
        const {name, password, confirmPassword, profileImageUrl} = req.body;
        const email = req.body.email.toLowerCase().trim();

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({message: "Please provide all required fields"});
        }

        if (password.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters"});
        }

        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({message: "Passwords do not match"});
        }

        //Check if user already exists
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists"});
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new user
        const newUser = await User.create({
            name, 
            email, 
            password: hashedPassword, 
            profileImageUrl: profileImageUrl || ""
        });

        //Return success message
        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profileImageUrl: newUser.profileImageUrl
            }
        });
    } catch (error){
        console.error("Register error:", error);
        return res.status(500).json({message: "Error creating user", error: error.message});
    }
}

const loginUser = async (req, res) => {
   try {
    console.log("Login attempt with body:", req.body);
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;

    // Find user by email
    const user = await User.findOne({email});
    if(!user){
       return res.status(404).json({message: "User not found"});
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
       return res.status(401).json({message: "Incorrect password"});
    }

    // Return user data with token
    return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user),
    });
   } catch (error) {
     console.error("Login error:", error);
     return res.status(500).json({message: "Error logging in user", error: error.message});
   }
}    

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        return res.json(user);
    } catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({message: "Error fetching user profile", error: error.message});
    }
}

export {registerUser, loginUser, getUserProfile};