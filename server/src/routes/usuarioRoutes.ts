import express from 'express';
import UsuarioController from '../controllers/usuarioController';
import { validarToken, validarCorpoDaRequisicao, validarFiltrosBusca } from '../utils/commons';
import { usuarioSchema, usuarioUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/cadastro', validarCorpoDaRequisicao(usuarioSchema), UsuarioController.cadastrarUsuario);
router.get('/', validarToken, validarFiltrosBusca, UsuarioController.listarUsuarios);
router.get('/:id', validarToken, UsuarioController.obterUsuarioPorId);
router.get('/nome/:nome', validarToken, validarFiltrosBusca, UsuarioController.obterUsuariosPorNome);
router.get('/email/:email', validarToken, validarFiltrosBusca, UsuarioController.obterUsuarioPorEmail);
router.put('/:id', validarToken, validarCorpoDaRequisicao(usuarioUpdateSchema), UsuarioController.atualizarUsuario);
router.delete('/:id', validarToken, UsuarioController.excluirUsuario);

export default router;
