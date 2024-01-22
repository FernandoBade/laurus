import express from 'express';
import AuthController from '../controllers/authController';

const routes = express.Router();

routes.post('/', AuthController.login);
routes.get('/logout', AuthController.logout);

export default routes;
