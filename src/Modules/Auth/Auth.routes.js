import express from 'express';
import {  login, register, verifyEmail } from './Auth.controller.js';


const AuthRouter = express.Router();

AuthRouter.post('/register', register);
AuthRouter.post('/login', login);
AuthRouter.get('/verify/:token', verifyEmail);

export default AuthRouter;