import express from 'express';
import AuthController from '../controllers/authController';

const routes = express.Router();

routes.post('/', AuthController.login);
routes.post('/logout/:id', AuthController.logout);
routes.post('/renovarToken', AuthController.renovarToken);

export default routes;
