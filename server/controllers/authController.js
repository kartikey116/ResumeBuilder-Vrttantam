import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Generate JWT token
const generateToken = (user) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET,{expiresIn:"7d"});
};


const registerUser = async (req, res) => {
    try{
        const {name, password, profileImageUrl} = req.body;
        const email = req.body.email.toLowerCase().trim();

        //Check if user already exists
        const userExixsts = await User.findOne({email});
        if(userExixsts){
            return res.status(400).json({msg: "User already exists"});
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create new user
        const newUser = await User.create({name, email, password: hashedPassword, profileImageUrl});

        //Return user data with Jwt
        res.status(201).json({msg: "User created successfully"});
    } catch (error){
        res.status(500).json({msg: "Error creating user", error: error.message});
    }

}

const loginUser = async (req, res) => {
   try {
    console.log("Login attempt with body:", req.body);
    const email = req.body.email.toLowerCase().trim();
    const { password } = req.body;

     const user = await User.findOne({email});
     if(!user){
       return res.status(404).json({msg: "User not found"});
     }

     //Check password
     const isPasswordCorrect = await bcrypt.compare(password, user.password);
     if(!isPasswordCorrect){
       return res.status(401).json({msg: "Incorrect password"});
     }

     res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user),
     })
   } catch (error) {
     res.status(500).json({msg: "Error logging in user", error: error.message});
   }
}    

const getUserProfile = async (req, res) => {

        const user = await User.findById(req.user._id).select('-password');
        if(!user){
            return res.status(404).json({msg: "User not found"});
        }
        res.json(user);
    
}

export {registerUser, loginUser, getUserProfile};