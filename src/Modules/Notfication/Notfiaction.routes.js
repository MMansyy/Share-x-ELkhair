import express from 'express';
import { getNotifications } from './Notfication.controller';
import { protectedRoutes } from '../Auth/Auth.controller';


const NotificationRouter = express.Router();

NotificationRouter.get('/', protectedRoutes, getNotifications)

export default NotificationRouter;