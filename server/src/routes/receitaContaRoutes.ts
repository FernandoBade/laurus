import express from 'express';
import ReceitaContaController from '../controllers/receitaContaController';

const router = express.Router();

router.post('/', ReceitaContaController.criarReceitaConta);
router.get('/', ReceitaContaController.listarReceitasConta);
router.get('/:id', ReceitaContaController.obterReceitaContaPorId);
router.put('/:id', ReceitaContaController.atualizarReceitaConta);
router.delete('/:id', ReceitaContaController.excluirReceitaConta);

export default router;
