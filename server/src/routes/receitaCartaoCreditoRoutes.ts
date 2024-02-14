import express from 'express';
import ReceitaCartaoCreditoController from '../controllers/receitaCartaoCreditoController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, ReceitaCartaoCreditoController.criarReceitaCartaoCredito);
router.get('/', validarToken, ReceitaCartaoCreditoController.listarReceitasCartaoCredito);
router.get('/:id', validarToken, ReceitaCartaoCreditoController.obterReceitaCartaoCreditoPorId);
router.put('/:id', validarToken, ReceitaCartaoCreditoController.atualizarReceitaCartaoCredito);
router.delete('/:id', validarToken, ReceitaCartaoCreditoController.excluirReceitaCartaoCredito);

export default router;
