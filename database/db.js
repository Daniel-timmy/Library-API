import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from '../config/env.js';

if(!DB_URI) {
    throw new Error('The MongoDB_URI env variable needs to be defined in .env.<development/production>.local');
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to db in ${NODE_ENV}`)
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1)
    }
}

export default connectToDatabase;