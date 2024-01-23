import express from 'express';
import DespesaSubcategoriaController from '../controllers/despesaSubcategoriaController';

const router = express.Router();

router.post('/', DespesaSubcategoriaController.criarDespesaSubcategoria);
router.get('/', DespesaSubcategoriaController.listarDespesaSubcategorias);
router.get('/:id', DespesaSubcategoriaController.obterDespesaSubcategoriaPorId);
router.put('/:id', DespesaSubcategoriaController.atualizarDespesaSubcategoria);
router.delete('/:id', DespesaSubcategoriaController.excluirDespesaSubcategoria);

export default router;
