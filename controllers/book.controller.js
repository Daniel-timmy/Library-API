import Book from "../models/book.model.js";
import jwt from 'jsonwebtoken';

import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import mongoose from 'mongoose';
import User from "../models/user.model.js";
import getDecodedToken from "../utils/getToken.utils.js";


export const addBook = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const {name, pages, author, genre} = req.body;
        if (!name || !pages || !author || !genre) {
            const error = new Error('Missing required parameters');
            error.statusCode = 400;
            throw error;
        }

        const decoded = getDecodedToken(req, res)
    
        const owner = await User.findById(decoded.userId);

        if(!owner) return res.status(401).json({ message: 'Unauthorized' });
        let status = 'Available';
        const newBooks = await Book.create([{name, pages, author, owner, status, genre}], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'Book added succesfully',
            data: {
                book: newBooks[0],
            }
        })
    } catch (error){
        await session.abortTransaction();
        session.endSession();
        next(error);

    }
}

export const getAllBooks = async (req, res, next) => {

    try {
    
    const allBooks = await Book.find();

    res.status(200).json({
        success: true,
        data: allBooks
    });
    } catch (error) {
        next(error);
    }
}

export const getBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
    
        if (!book) {
          const error = new Error('Book not found');
          error.statusCode = 404;
          throw error;
        }
    
        res.status(200).json({ success: true, data: book });
      } catch (error) {
        next(error);
      }
}

export const borrowBook = async (req, res, next) =>{

    try {

        const decoded = getDecodedToken(req, res)
    
        const borower = await User.findById(decoded.userId);
        const book = await Book.findById(req.params.id);

        if (!book){
            // const error = new Error('Invalid Book ID');
            // error.statusCode = 400;
            // throw error;
            return res.status(400).json({
                success: false,
                message: 'Book not found',
                details: {
                    field: 'id',
                    error: 'Invalid Book ID'
                }
            })
        }
        if (book.status === "Available"){
            book.status = 'Borrowed';
            book.borrowed_by = borower;
            await book.save();
        } else {
            res.status(409).json({
                success: false,
                message: 'Book is already borrowed',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Book borrowed successfully',
            data: book
        });
    } catch (error){
        next(error);
    }

}

export  const returnBook = async (req, res, next) => {
    try {
  
        const decoded = getDecodedToken(req, res)
    
        const book = await Book.findById(req.params.id);
     
        if (!book){
            // const error = new Error('Invalid Book ID');
            // error.statusCode = 404;
            // throw error;
            return res.status(404).json({
                success: false,
                message: 'Book not found',
                details: {
                    field: 'id',
                    error: 'Invalid Book ID'
                }
            })
        }
        if (book.borrowed_by === null){
            return res.status(400).json({
            success: false,
            message: 'Book is not currently borrowed',
         })
        }

        if (decoded.userId !== book.borrowed_by.toString()){
            return res.status(400).json({
                success: false,
                message: 'Book can not be returned by another person.',
                details: {
                    field: 'userId',
                    error: 'Current user is not the borrower'
                }
            })
            
        }

        if (book.status === "Borrowed"){
            book.status = "Available";
            book.borrowed_by = null;
            await book.save();
          
        } else {
           return res.status(409).json({
                success: false,
                message: 'Book is already returned',
            })
        }
        res.status(200).json({
            success: true,
            message: 'Book returned successfully',
            data: book
        });
       
    } catch (error){
        next(error);
    }
}


export  const updateBook = async (req, res, next) => {
    try {
        const decoded = getDecodedToken(req, res)
        
        const book = await Book.findById(req.params.id);
     
        if (!book){
            return res.status(404).json({
                success: false,
                message: 'Book not found',
                details: {
                    field: 'id',
                    error: 'Invalid Book ID'
                }
            })
        }

        if (decoded.userId !== book.owner.toString()){
            return res.status(400).json({
                success: false,
                message: 'Book can only be updated by the owner.',
                details: {
                    field: 'userId',
                    error: 'Current user is not the owner'
                }
            })    
        }

        const ubook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json({
            success: true,
            message: 'Book updated successfully',
            data: ubook
        });
       
    } catch (error){
        next(error);
    }
}

export  const deleteBook = async (req, res, next) => {
    try {
        const decoded = getDecodedToken(req, res)
        
        const book = await Book.findById(req.params.id);
     
        if (!book){
            return res.status(400).json({
                success: false,
                message: 'Book not found',
                details: {
                    field: 'id',
                    error: 'Invalid Book ID'
                }
            })
        }

        // console.log(book.borrowed_by.toString())
        // console.log(borower.id)
        // console.log(decoded.userId)

        if (decoded.userId !== book.owner.toString()){
            return res.status(400).json({
                success: false,
                message: 'Books can only be deleted by their owner.',
                details: {
                    field: 'userId',
                    error: 'Current user is not the owner'
                }
            })   
        }

        const ubook = await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: ubook
        });
       
    } catch (error){
        next(error);
    }
}