import express from 'express';
import ContaController from '../controllers/tokenController';
import { validarCorpoDaRequisicao, validarFiltrosBusca, validarToken } from '../utils/commons';
import { tokenSchema, tokenUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(tokenSchema), ContaController.criarToken);
router.get('/', validarToken, validarFiltrosBusca, ContaController.listarTokens);
router.get('/:id', validarToken, ContaController.obterTokenPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(tokenUpdateSchema), ContaController.atualizarToken);
router.delete('/:id', validarToken, ContaController.excluirToken);

export default router;
