import express from 'express';
import DespesaCategoriaController from '../controllers/despesaCategoriaController';
import { validarCorpoDaRequisicao, validarFiltrosBusca, validarToken } from '../utils/commons';
import { despesaCategoriaSchema, despesaCategoriaUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(despesaCategoriaSchema), DespesaCategoriaController.criarDespesaCategoria);
router.get('/', validarToken, validarFiltrosBusca, DespesaCategoriaController.listarDespesaCategorias);
router.get('/:id', validarToken, DespesaCategoriaController.obterDespesaCategoriaPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(despesaCategoriaUpdateSchema), DespesaCategoriaController.atualizarDespesaCategoria);
router.delete('/:id', validarToken, DespesaCategoriaController.excluirDespesaCategoria);

export default router;
