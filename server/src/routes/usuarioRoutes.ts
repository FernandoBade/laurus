import express from 'express';
import UsuarioController from '../controllers/usuarioController';

const router = express.Router();

router.post('/cadastro', UsuarioController.cadastrarUsuario);

export default router;
