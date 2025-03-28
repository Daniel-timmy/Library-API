import User from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

    
export const register = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password){
            const error = new Error('Missing required parameter');
            error.statusCode = 400;
            throw error;
        }
    
        // Check if a user already exists
        const existingUser = await User.findOne({ email });
    
        if(existingUser) {
          const error = new Error('User already exists');
          error.statusCode = 409;
          throw error;
        }
    
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
    
        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
        await session.commitTransaction();
        session.endSession();
    
        res.status(201).json({
          success: true,
          message: 'User created successfully',
          data: {
            token,
            user: newUsers[0],
          }
        })
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
      }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
    
        if(!user) {
          return res.status(400).json({
            success: false,
            message: 'User with email not found',
            data: null,
            details: 
              {
                "field": "email",
                "error": "Invalid Email Address"
              },
          });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if(!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid password',
            data: null,
            details: 
              {
                "field": "password",
                "error": "Your password is incorrect"
              },
            });
        }
    
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
        res.status(200).json({
          success: true,
          message: 'User signed in successfully',
          data: {
            token,
            user,
          }
        });
      } catch (error) {
        next(error);
      }
}

export const logout = async (req, res, next) => {}