
import express from 'express';
import { createDonation, deleteDonation, getDonations, getMyDonations, getSingleDonation, updateDonation } from './Donations.controller.js';
import { allowTo, protectedRoutes } from '../Auth/Auth.controller.js';
import uploadSingle from '../../../utils/multerCloud.js';



const DonationRouter = express.Router();


DonationRouter.get('/', getDonations)
    .get('/mydonations', protectedRoutes, getMyDonations)
    .get('/:id', getSingleDonation)
    .post('/', protectedRoutes, allowTo("donor", "restaurant", "admin"), uploadSingle, createDonation)
    .put('/:id', protectedRoutes, uploadSingle, updateDonation)
    .delete('/:id', protectedRoutes, deleteDonation)

    
export default DonationRouter;