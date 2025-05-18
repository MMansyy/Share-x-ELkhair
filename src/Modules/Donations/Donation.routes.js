
import express from 'express';
import { createDonation, deleteDonation, getDonations, getMyDonations, getSingleDonation, updateDonation } from './Donations.controller.js';
import { allowTo, protectedRoutes } from '../Auth/Auth.controller.js';
import uploadSingle from '../../../utils/multerCloud.js';



const DonationRouter = express.Router();


DonationRouter.get('/', getDonations)
    .post('/', protectedRoutes, allowTo("donor", "restaurant", "admin"), uploadSingle, createDonation)
    .get('/mydonations', protectedRoutes, getMyDonations)
    .get('/:id', getSingleDonation)
    .put('/:id', protectedRoutes, uploadSingle, updateDonation)
    .delete('/:id', protectedRoutes, allowTo("donor", "restaurant", "admin"), deleteDonation)


export default DonationRouter;