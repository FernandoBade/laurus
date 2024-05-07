import express from 'express';
import ContaController from '../controllers/contaController';
import { validarCorpoDaRequisicao, validarFiltrosBusca, validarToken } from '../utils/commons';
import { contaSchema, contaUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(contaSchema),ContaController.criarConta);
router.get('/', validarToken, validarFiltrosBusca, ContaController.listarContas);
router.get('/:id', validarToken, ContaController.obterContaPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(contaUpdateSchema), ContaController.atualizarConta);
router.delete('/:id', validarToken, ContaController.excluirConta);

export default router;
