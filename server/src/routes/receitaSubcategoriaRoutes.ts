import express from 'express';
import ReceitaaSubcategoriaController from '../controllers/receitaSubcategoriaController';

const router = express.Router();

router.post('/', ReceitaaSubcategoriaController.criarReceitaSubcategoria);
router.get('/', ReceitaaSubcategoriaController.listarReceitaSubcategorias);
router.get('/:id', ReceitaaSubcategoriaController.obterReceitaSubcategoriaPorId);
router.put('/:id', ReceitaaSubcategoriaController.atualizarReceitaSubcategoria);
router.delete('/:id', ReceitaaSubcategoriaController.excluirReceitaSubcategoria);

export default router;
