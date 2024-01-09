import express from 'express';
import DespesaContaController from '../controllers/despesaContaController';

const router = express.Router();

router.post('/', DespesaContaController.criarDespesaConta);
router.get('/', DespesaContaController.listarTodasDespesasConta);
router.get('/:id', DespesaContaController.obterDespesaContaPorId);
router.put('/:id', DespesaContaController.atualizarDespesaConta);
router.delete('/:id', DespesaContaController.excluirDespesaConta);

export default router;
