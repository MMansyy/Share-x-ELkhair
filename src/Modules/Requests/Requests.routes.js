import express from 'express';
import {
    createRequest,
    updateRequest,
    deleteRequest,
    getAllRequests,
    getUserRequests
} from './Requests.controller.js';
import { protectedRoutes, allowTo } from '../Auth/Auth.controller.js';

const RequestRouter = express.Router();

RequestRouter.get('/', protectedRoutes, allowTo('donor', 'restaurant', 'charity', 'admin'), getUserRequests);

RequestRouter.post('/', protectedRoutes, allowTo('charity'), createRequest);

RequestRouter.put('/', protectedRoutes, allowTo('donor', 'restaurant', 'admin'), updateRequest);

RequestRouter.delete('/', protectedRoutes, allowTo('charity', 'admin'), deleteRequest);

RequestRouter.get('/allRequests', allowTo('admin'), getAllRequests);




export default RequestRouter;
