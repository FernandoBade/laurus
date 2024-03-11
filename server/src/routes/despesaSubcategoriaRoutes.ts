import express from 'express';
import DespesaSubcategoriaController from '../controllers/despesaSubcategoriaController';
import { validarCorpoDaRequisicao, validarFiltrosBusca, validarToken } from '../utils/commons';
import { despesaSubcategoriaSchema, despesaSubcategoriaUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(despesaSubcategoriaSchema), DespesaSubcategoriaController.criarDespesaSubcategoria);
router.get('/', validarToken, validarFiltrosBusca, DespesaSubcategoriaController.listarDespesaSubcategorias);
router.get('/:id', validarToken, DespesaSubcategoriaController.obterDespesaSubcategoriaPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(despesaSubcategoriaUpdateSchema), DespesaSubcategoriaController.atualizarDespesaSubcategoria);
router.delete('/:id', validarToken, DespesaSubcategoriaController.excluirDespesaSubcategoria);

export default router;
