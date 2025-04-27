import express from 'express';
import {
    createRequest,
    getChairtyRequest,
    getDonorRequest,
    updateRequest,
    deleteRequest,
    getAllRequests
} from './Requests.controller.js';
import { protectedRoutes, allowTo } from '../Auth/Auth.controller.js';

const RequestRouter = express.Router();

RequestRouter.post('/', protectedRoutes, allowTo('charity'), createRequest);

RequestRouter.get('/', getAllRequests);

RequestRouter.get('/charity', protectedRoutes, allowTo('charity'), getChairtyRequest);

RequestRouter.get('/donor', protectedRoutes, allowTo('donor', 'restaurant', 'admin'), getDonorRequest);

RequestRouter.put('/', protectedRoutes, allowTo('donor', 'restaurant', 'admin'), updateRequest);

RequestRouter.delete('/', protectedRoutes, allowTo('charity', 'admin'), deleteRequest);

export default RequestRouter;
