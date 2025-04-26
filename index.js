import express from 'express';
import DBConnection from './DB/DBConnection.js';
import AuthRouter from './src/Modules/Auth/Auth.routes.js';
import { globalErrorHandel } from './utils/GlobalError.js';
import cors from 'cors';
import UserRoutes from './src/Modules/User/User.routes.js';
import DonationRouter from './src/Modules/Donations/Donation.routes.js';
import dotenv from 'dotenv';





const app = express();
app.use(cors({
    origin: "*"
}));
dotenv.config();
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use('/auth', AuthRouter);
app.use('/user', UserRoutes);
app.use('/donation', DonationRouter);
app.use(globalErrorHandel)
DBConnection();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
