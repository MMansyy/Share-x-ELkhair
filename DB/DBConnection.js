import mongoose from "mongoose";


export default function DBConnection() {
    mongoose.connect('mongodb://127.0.0.1:27017/GradProj')
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...'));
}