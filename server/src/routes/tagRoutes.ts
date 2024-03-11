import express from 'express';
import TagController from '../controllers/tagController';
import { validarToken, validarCorpoDaRequisicao, validarFiltrosBusca } from '../utils/commons';
import { tagSchema, tagUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(tagSchema), TagController.criarTag);
router.get('/', validarToken, validarFiltrosBusca, TagController.listarTags);
router.get('/:id', validarToken, TagController.obterTagPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(tagUpdateSchema), TagController.atualizarTag);
router.delete('/:id', validarToken, TagController.excluirTag);

export default router;
