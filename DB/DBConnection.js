import mongoose from "mongoose";


export default function DBConnection() {
    mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,  // 5 ثواني كـ timeout
        socketTimeoutMS: 45000,         // 45 ثانية
    })
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB...'));
}



// import mongoose from "mongoose";


// export default function DBConnection() {
//     mongoose.connect('mongodb+srv://hessenmansyy:<1597532486Mansy>@cluster0.pceprwd.mongodb.net/GradProject')
//         .then(() => console.log('Connected to MongoDB...'))
//         .catch(err => console.error('Could not connect to MongoDB...'));
// }