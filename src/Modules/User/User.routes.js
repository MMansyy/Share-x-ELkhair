import express from 'express';
import { deleteUser, deleteUserById, forgotPassword, getAllUsers, getCharites, getMe, getRestaurants, getUser, resetPassword, updatePassword, updateProfilePicture, updateUser, updateUserByEmail, updateUserById, verifyOtp } from './User.controller.js';
import { allowTo, protectedRoutes } from '../Auth/Auth.controller.js';
import uploadSingle from '../../../utils/multerCloud.js';


const UserRoutes = express.Router();

UserRoutes.get('/', protectedRoutes, getMe);
UserRoutes.put('/', protectedRoutes, updateUser)
UserRoutes.delete('/', protectedRoutes, deleteUser);
UserRoutes.put('/updatepassword', protectedRoutes, updatePassword)
UserRoutes.put('/profilePicture', protectedRoutes, uploadSingle, updateProfilePicture);
UserRoutes.get('/restaurants', getRestaurants);
UserRoutes.get('/charites', getCharites);
UserRoutes.get('/allusers', protectedRoutes, allowTo('admin'), getAllUsers);
UserRoutes.put('/forgetpassword', forgotPassword)
UserRoutes.put('/verifyotp', verifyOtp);
UserRoutes.put('/updateUser', protectedRoutes, allowTo('admin'), updateUserByEmail);
UserRoutes.put('/resetpassword', resetPassword)
UserRoutes.get('/:id', getUser);
UserRoutes.put('/:id', protectedRoutes, allowTo('admin'), updateUserById)
UserRoutes.delete('/:id', protectedRoutes, allowTo('admin'), deleteUserById)




export default UserRoutes;