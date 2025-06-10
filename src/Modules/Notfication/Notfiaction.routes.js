import express from 'express';
import { deleteNotifications, getNotifications } from './Notfication.controller.js';
import { protectedRoutes } from '../Auth/Auth.controller.js';


const NotificationRouter = express.Router();

NotificationRouter.get('/', protectedRoutes, getNotifications)
NotificationRouter.delete('/', protectedRoutes, deleteNotifications);

export default NotificationRouter;