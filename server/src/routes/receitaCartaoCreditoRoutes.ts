import express from 'express';
import ReceitaCartaoCreditoController from '../controllers/receitaCartaoCreditoController';
import { validarToken, validarCorpoDaRequisicao, validarFiltrosBusca } from '../utils/commons';
import { receitaCartaoCreditoSchema, receitaCartaoCreditoUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(receitaCartaoCreditoSchema), ReceitaCartaoCreditoController.criarReceitaCartaoCredito);
router.get('/', validarToken, validarFiltrosBusca, ReceitaCartaoCreditoController.listarReceitasCartaoCredito);
router.get('/:id', validarToken, ReceitaCartaoCreditoController.obterReceitaCartaoCreditoPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(receitaCartaoCreditoUpdateSchema), ReceitaCartaoCreditoController.atualizarReceitaCartaoCredito);
router.delete('/:id', validarToken, ReceitaCartaoCreditoController.excluirReceitaCartaoCredito);

export default router;
