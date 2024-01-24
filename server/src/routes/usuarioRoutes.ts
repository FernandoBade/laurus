import express from 'express';
import UsuarioController from '../controllers/usuarioController';

const router = express.Router();

router.post('/cadastro', UsuarioController.cadastrarUsuario);
router.get('/', UsuarioController.listarUsuarios);
router.get('/:id', UsuarioController.obterUsuarioPorId);
router.get('/nome/:nome', UsuarioController.obterUsuarioPorNome);
router.get('/email/:email', UsuarioController.obterUsuarioPorEmail);
router.put('/:id', UsuarioController.atualizarUsuario);
router.delete('/:id', UsuarioController.excluirUsuario);

export default router;
