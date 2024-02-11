import express from 'express';
import UsuarioController from '../controllers/usuarioController';
import { validarToken } from '../utils/commons';

const router = express.Router();
router.post('/cadastro', UsuarioController.cadastrarUsuario);
router.get('/', validarToken, UsuarioController.listarUsuarios);
router.get('/:id', validarToken, UsuarioController.obterUsuarioPorId);
router.get('/nome/:nome', validarToken,  UsuarioController.obterUsuariosPorNome);
router.get('/email/:email', validarToken,  UsuarioController.obterUsuarioPorEmail);
router.put('/:id', validarToken, UsuarioController.atualizarUsuario);
router.delete('/:id', validarToken, UsuarioController.excluirUsuario);

export default router;
