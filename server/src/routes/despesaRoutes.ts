import express from 'express';
import DespesaController from '../controllers/despesaController';

const router = express.Router();

router.post('/', DespesaController.criarDespesa);
router.get('/', DespesaController.listarTodasDespesas);
router.get('/:id', DespesaController.obterDespesaPorId);
router.put('/:id', DespesaController.atualizarDespesa);
router.delete('/:id', DespesaController.excluirDespesa);

export default router;
