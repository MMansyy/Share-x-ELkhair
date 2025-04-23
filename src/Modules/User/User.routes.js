import express from 'express';
import { getCharites, getMe, getRestaurants, getUser, updateProfilePicture, updateUser } from './User.controller.js';
import { protectedRoutes } from '../Auth/Auth.controller.js';
import uploadSingle from '../../../utils/multerCloud.js';


const UserRoutes = express.Router();

UserRoutes.get('/', protectedRoutes, getMe);
UserRoutes.put('/', protectedRoutes, updateUser)
UserRoutes.put('/profilePicture', protectedRoutes, uploadSingle, updateProfilePicture);
UserRoutes.get('/restaurants', getRestaurants);
UserRoutes.get('/charites', getCharites);
UserRoutes.get('/:id', getUser);



export default UserRoutes;