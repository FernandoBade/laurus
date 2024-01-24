import express from 'express';
import TagController from '../controllers/tagController';

const router = express.Router();

router.post('/', TagController.criarTag);
router.get('/', TagController.listarTags);
router.get('/:id', TagController.obterTagPorId);
router.put('/:id', TagController.atualizarTag);
router.delete('/:id', TagController.excluirTag);

export default router;
