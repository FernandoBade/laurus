import express from 'express';
import DespesaCartaoController from '../controllers/despesaCartaoController';

const router = express.Router();

router.post('/', DespesaCartaoController.criarDespesaCartao);
router.get('/', DespesaCartaoController.listarTodasDespesasCartao);
router.get('/:id', DespesaCartaoController.obterDespesaCartaoPorId);
router.put('/:id', DespesaCartaoController.atualizarDespesaCartao);
router.delete('/:id', DespesaCartaoController.excluirDespesaCartao);

export default router;
