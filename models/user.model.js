import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'User name is required'], 
        trim: true, 
        minLength: 2,
        maxLength: 40,},
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        trim: true, 
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'PLease use a valid email'],},
    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: 6,}
        }, 
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;