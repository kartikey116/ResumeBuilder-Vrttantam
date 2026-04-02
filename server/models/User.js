import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() { return this.authProvider === 'local'; }
    },
    profileImageUrl:{
        type: String,
        default:null
    },
    googleId: {
        type: String,
        default: null,
    },
    githubId: {
        type: String,
        default: null,
    },
    authProvider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    }
} , {timestamps: true});

export default mongoose.model('User', userSchema);