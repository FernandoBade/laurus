import express from 'express';
import DespesaContaController from '../controllers/despesaContaController';
import { validarCorpoDaRequisicao, validarFiltrosBusca, validarToken } from '../utils/commons';
import { despesaContaSchema, despesaContaUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(despesaContaSchema), DespesaContaController.criarDespesaConta);
router.get('/', validarToken, validarFiltrosBusca, DespesaContaController.listarDespesasConta);
router.get('/:id', validarToken, DespesaContaController.obterDespesaContaPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(despesaContaUpdateSchema), DespesaContaController.atualizarDespesaConta);
router.delete('/:id', validarToken, DespesaContaController.excluirDespesaConta);

export default router;
