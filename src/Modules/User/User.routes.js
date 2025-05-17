import express from 'express';
import { deleteUser, forgotPassword, getAllUsers, getCharites, getMe, getRestaurants, getUser, resetPassword, updatePassword, updateProfilePicture, updateUser, verifyOtp } from './User.controller.js';
import { allowTo, protectedRoutes } from '../Auth/Auth.controller.js';
import uploadSingle from '../../../utils/multerCloud.js';


const UserRoutes = express.Router();

UserRoutes.get('/', protectedRoutes, getMe);
UserRoutes.put('/', protectedRoutes, updateUser)
UserRoutes.put('/updatepassword', protectedRoutes, updatePassword)
UserRoutes.put('/profilePicture', protectedRoutes, uploadSingle, updateProfilePicture);
UserRoutes.get('/restaurants', getRestaurants);
UserRoutes.get('/charites', getCharites);
UserRoutes.get('/allusers', protectedRoutes, allowTo('admin'), getAllUsers);
UserRoutes.put('/forgetpassword', forgotPassword)
UserRoutes.put('/verifyotp', verifyOtp);
UserRoutes.put('/resetpassword', resetPassword)
UserRoutes.get('/:id', getUser);
UserRoutes.delete('/:id', protectedRoutes, allowTo('admin'), deleteUser);



export default UserRoutes;