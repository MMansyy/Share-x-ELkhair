import express from 'express';
import { getNotifications } from './Notfication.controller.js';
import { protectedRoutes } from '../Auth/Auth.controller.js';


const NotificationRouter = express.Router();

NotificationRouter.get('/', protectedRoutes, getNotifications)

export default NotificationRouter;