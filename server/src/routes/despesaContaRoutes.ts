import express from 'express';
import DespesaContaController from '../controllers/despesaContaController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, DespesaContaController.criarDespesaConta);
router.get('/', validarToken, DespesaContaController.listarDespesasConta);
router.get('/:id', validarToken, DespesaContaController.obterDespesaContaPorId);
router.put('/:id', validarToken, DespesaContaController.atualizarDespesaConta);
router.delete('/:id', validarToken, DespesaContaController.excluirDespesaConta);

export default router;
