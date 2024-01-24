import express from 'express';
import ReceitaCategoriaController from '../controllers/receitaCategoriaController';

const router = express.Router();

router.post('/', ReceitaCategoriaController.criarReceitaCategoria);
router.get('/', ReceitaCategoriaController.listarReceitaCategorias);
router.get('/:id', ReceitaCategoriaController.obterReceitaCategoriaPorId);
router.put('/:id', ReceitaCategoriaController.atualizarReceitaCategoria);
router.delete('/:id', ReceitaCategoriaController.excluirReceitaCategoria);

export default router;
