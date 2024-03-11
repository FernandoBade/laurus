import express from 'express';
import ReceitaContaController from '../controllers/receitaContaController';
import { validarToken, validarCorpoDaRequisicao, validarFiltrosBusca } from '../utils/commons';
import { receitaContaSchema, receitaContaUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(receitaContaSchema), ReceitaContaController.criarReceitaConta);
router.get('/', validarToken, validarFiltrosBusca, ReceitaContaController.listarReceitasConta);
router.get('/:id', validarToken, ReceitaContaController.obterReceitaContaPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(receitaContaUpdateSchema), ReceitaContaController.atualizarReceitaConta);
router.delete('/:id', validarToken, ReceitaContaController.excluirReceitaConta);

export default router;
