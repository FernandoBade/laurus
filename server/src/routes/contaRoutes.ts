import express from 'express';
import ContaController from '../controllers/contaController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, ContaController.criarConta);
router.get('/', validarToken, ContaController.listarContas);
router.get('/:id', validarToken, ContaController.obterContaPorId);
router.put('/:id', validarToken, ContaController.atualizarConta);
router.delete('/:id', validarToken, ContaController.excluirConta);

export default router;
