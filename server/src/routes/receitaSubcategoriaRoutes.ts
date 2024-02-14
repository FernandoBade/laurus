import express from 'express';
import ReceitaaSubcategoriaController from '../controllers/receitaSubcategoriaController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, ReceitaaSubcategoriaController.criarReceitaSubcategoria);
router.get('/', validarToken, ReceitaaSubcategoriaController.listarReceitaSubcategorias);
router.get('/:id', validarToken, ReceitaaSubcategoriaController.obterReceitaSubcategoriaPorId);
router.put('/:id', validarToken, ReceitaaSubcategoriaController.atualizarReceitaSubcategoria);
router.delete('/:id', validarToken, ReceitaaSubcategoriaController.excluirReceitaSubcategoria);

export default router;
