import express from 'express';
import DespesaCartaoCreditoController from '../controllers/despesaCartaoCreditoController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, DespesaCartaoCreditoController.criarDespesaCartaoCredito);
router.get('/', validarToken, DespesaCartaoCreditoController.listarDespesasCartaoCredito);
router.get('/:id', validarToken, DespesaCartaoCreditoController.obterDespesaCartaoCreditoPorId);
router.put('/:id', validarToken, DespesaCartaoCreditoController.atualizarDespesaCartaoCredito);
router.delete('/:id', validarToken, DespesaCartaoCreditoController.excluirDespesaCartaoCredito);

export default router;
