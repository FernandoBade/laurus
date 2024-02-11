import express from 'express';
import UsuarioController from '../controllers/usuarioController';
import { validarUsuario } from '../utils/commons';

const router = express.Router();
router.post('/cadastro', UsuarioController.cadastrarUsuario);
router.get('/', UsuarioController.listarUsuarios);
router.get('/:id', validarUsuario, UsuarioController.obterUsuarioPorId);
router.get('/nome/:nome', UsuarioController.obterUsuariosPorNome);
router.get('/email/:email', UsuarioController.obterUsuarioPorEmail);
router.put('/:id', UsuarioController.atualizarUsuario);
router.delete('/:id', UsuarioController.excluirUsuario);

export default router;
