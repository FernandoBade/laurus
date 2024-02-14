import express from 'express';
import DespesaCategoriaController from '../controllers/despesaCategoriaController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, DespesaCategoriaController.criarDespesaCategoria);
router.get('/', validarToken, DespesaCategoriaController.listarDespesaCategorias);
router.get('/:id', validarToken, DespesaCategoriaController.obterDespesaCategoriaPorId);
router.put('/:id', validarToken, DespesaCategoriaController.atualizarDespesaCategoria);
router.delete('/:id', validarToken, DespesaCategoriaController.excluirDespesaCategoria);

export default router;
