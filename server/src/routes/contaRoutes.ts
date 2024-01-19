import express from 'express';
import ContaController from '../controllers/contaController';

const router = express.Router();

router.post('/', ContaController.criarConta);
router.get('/', ContaController.listarContas);
router.get('/:id', ContaController.obterContaPorId);
router.put('/:id', ContaController.atualizarConta);
router.delete('/:id', ContaController.excluirConta);

export default router;
