import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'User name is required'], 
        trim: true, 
        minLength: 2,
        maxLength: 40,},
    pages : {
        type: Number,
        required: [true, 'Enter the number of pages'],

    },
    author: {
        type: String,
        required: [true, "Enter the author's name"],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The owner of the book is missing'],
        index: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Borrowed'],
        default: 'Available',
    },
    genre: {
        type: String,
        enum: ['war', 'technology', 'sport', 'history', 'politics'],
        required: true,
    },
    borrowed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    }
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

export default Book;