import express from 'express';
import ReceitaCartaoCreditoController from '../controllers/receitaCartaoCreditoController';

const router = express.Router();

router.post('/', ReceitaCartaoCreditoController.criarReceitaCartaoCredito);
router.get('/', ReceitaCartaoCreditoController.listarReceitasCartaoCredito);
router.get('/:id', ReceitaCartaoCreditoController.obterReceitaCartaoCreditoPorId);
router.put('/:id', ReceitaCartaoCreditoController.atualizarReceitaCartaoCredito);
router.delete('/:id', ReceitaCartaoCreditoController.excluirReceitaCartaoCredito);

export default router;
