import express from 'express';
import ReceitaContaController from '../controllers/receitaContaController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, ReceitaContaController.criarReceitaConta);
router.get('/', validarToken, ReceitaContaController.listarReceitasConta);
router.get('/:id', validarToken, ReceitaContaController.obterReceitaContaPorId);
router.put('/:id', validarToken, ReceitaContaController.atualizarReceitaConta);
router.delete('/:id', validarToken, ReceitaContaController.excluirReceitaConta);

export default router;
