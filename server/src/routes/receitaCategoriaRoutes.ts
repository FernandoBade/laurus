import express from 'express';
import ReceitaCategoriaController from '../controllers/receitaCategoriaController';
import { validarToken, validarCorpoDaRequisicao, validarFiltrosBusca } from '../utils/commons';
import { receitaCategoriaSchema, receitaCategoriaUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(receitaCategoriaSchema), ReceitaCategoriaController.criarReceitaCategoria);
router.get('/', validarToken, validarFiltrosBusca, ReceitaCategoriaController.listarReceitaCategorias);
router.get('/:id', validarToken, ReceitaCategoriaController.obterReceitaCategoriaPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(receitaCategoriaUpdateSchema), ReceitaCategoriaController.atualizarReceitaCategoria);
router.delete('/:id', validarToken, ReceitaCategoriaController.excluirReceitaCategoria);

export default router;
