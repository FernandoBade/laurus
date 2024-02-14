import express from 'express';
import DespesaSubcategoriaController from '../controllers/despesaSubcategoriaController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, DespesaSubcategoriaController.criarDespesaSubcategoria);
router.get('/', validarToken, DespesaSubcategoriaController.listarDespesaSubcategorias);
router.get('/:id', validarToken, DespesaSubcategoriaController.obterDespesaSubcategoriaPorId);
router.put('/:id', validarToken, DespesaSubcategoriaController.atualizarDespesaSubcategoria);
router.delete('/:id', validarToken, DespesaSubcategoriaController.excluirDespesaSubcategoria);

export default router;
