import express from 'express';
import DespesaCategoriaController from '../controllers/despesaCategoriaController';

const router = express.Router();

router.post('/', DespesaCategoriaController.criarDespesaCategoria);
router.get('/', DespesaCategoriaController.listarDespesaCategorias);
router.get('/:id', DespesaCategoriaController.obterDespesaCategoriaPorId);
router.put('/:id', DespesaCategoriaController.atualizarDespesaCategoria);
router.delete('/:id', DespesaCategoriaController.excluirDespesaCategoria);

export default router;
