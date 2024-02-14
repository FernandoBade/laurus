import express from 'express';
import TagController from '../controllers/tagController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, TagController.criarTag);
router.get('/', validarToken, TagController.listarTags);
router.get('/:id', validarToken, TagController.obterTagPorId);
router.put('/:id', validarToken, TagController.atualizarTag);
router.delete('/:id', validarToken, TagController.excluirTag);

export default router;
