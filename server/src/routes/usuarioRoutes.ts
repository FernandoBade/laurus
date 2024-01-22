import express from 'express';
import UsuarioController from '../controllers/usuarioController';

const router = express.Router();

router.post('/cadastro', UsuarioController.cadastrarUsuario);
router.get('/', UsuarioController.listarUsuarios);
router.get('/:id', UsuarioController.buscarUsuarioPorId);
router.get('/nome/:nome', UsuarioController.buscarUsuarioPorNome);
router.get('/email/:email', UsuarioController.buscarUsuarioPorEmail);
router.put('/:id', UsuarioController.atualizarUsuario);
router.delete('/:id', UsuarioController.excluirUsuario);

export default router;
