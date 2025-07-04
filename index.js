import express from 'express';
import DBConnection from './DB/DBConnection.js';
import AuthRouter from './src/Modules/Auth/Auth.routes.js';
import { globalErrorHandel } from './utils/GlobalError.js';
import cors from 'cors';
import UserRoutes from './src/Modules/User/User.routes.js';
import DonationRouter from './src/Modules/Donations/Donation.routes.js';
import dotenv from 'dotenv';
import RequestRouter from './src/Modules/Requests/Requests.routes.js';
import NotificationRouter from './src/Modules/Notfication/Notfiaction.routes.js';





const app = express();
dotenv.config({});
app.use(cors({
    origin: "*"
}));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use('/auth', AuthRouter);
app.use('/user', UserRoutes);
app.use('/donation', DonationRouter);
app.use('/request', RequestRouter);
app.use('/notification', NotificationRouter);
app.use('*', (req, res) => {
    res.status(404).json({ message: "Not Found" });
});
app.use(globalErrorHandel)
DBConnection();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


export default app;
