import express from 'express';
import ReceitaCategoriaController from '../controllers/receitaCategoriaController';
import { validarToken } from '../utils/commons';

const router = express.Router();

router.post('/', validarToken, ReceitaCategoriaController.criarReceitaCategoria);
router.get('/', validarToken, ReceitaCategoriaController.listarReceitaCategorias);
router.get('/:id', validarToken, ReceitaCategoriaController.obterReceitaCategoriaPorId);
router.put('/:id', validarToken, ReceitaCategoriaController.atualizarReceitaCategoria);
router.delete('/:id', validarToken, ReceitaCategoriaController.excluirReceitaCategoria);

export default router;
