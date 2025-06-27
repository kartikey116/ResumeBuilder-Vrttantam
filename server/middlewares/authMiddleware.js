import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();


export const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
         // ✅ Support token from query string for testing
        // if (!token && req.query.token) {
        //     token = `Bearer ${req.query.token}`;
        // }
        if (token && token.startsWith('Bearer ')) {
            token = token.split(" ")[1];//Extracting the token from the header
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();

        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }

    } catch (error) {
        res.status(401).json({ message: 'Token failed', error: error.message });
    }
}
