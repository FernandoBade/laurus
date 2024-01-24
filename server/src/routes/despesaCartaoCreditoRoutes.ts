import express from 'express';
import DespesaCartaoCreditoController from '../controllers/despesaCartaoCreditoController';

const router = express.Router();

router.post('/', DespesaCartaoCreditoController.criarDespesaCartaoCredito);
router.get('/', DespesaCartaoCreditoController.listarDespesasCartaoCredito);
router.get('/:id', DespesaCartaoCreditoController.obterDespesaCartaoCreditoPorId);
router.put('/:id', DespesaCartaoCreditoController.atualizarDespesaCartaoCredito);
router.delete('/:id', DespesaCartaoCreditoController.excluirDespesaCartaoCredito);

export default router;
