import express from 'express';
import DespesaCartaoCreditoController from '../controllers/despesaCartaoCreditoController';
import { validarCorpoDaRequisicao, validarFiltrosBusca, validarToken } from '../utils/commons';
import { despesaCartaoCreditoSchema, despesaCartaoCreditoUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(despesaCartaoCreditoSchema), DespesaCartaoCreditoController.criarDespesaCartaoCredito);
router.get('/', validarToken, validarFiltrosBusca, DespesaCartaoCreditoController.listarDespesasCartaoCredito);
router.get('/:id', validarToken, DespesaCartaoCreditoController.obterDespesaCartaoCreditoPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(despesaCartaoCreditoUpdateSchema), DespesaCartaoCreditoController.atualizarDespesaCartaoCredito);
router.delete('/:id', validarToken, DespesaCartaoCreditoController.excluirDespesaCartaoCredito);

export default router;
