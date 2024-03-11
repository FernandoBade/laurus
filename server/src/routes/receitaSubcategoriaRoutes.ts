import express from 'express';
import ReceitaSubcategoriaController from '../controllers/receitaSubcategoriaController';
import { validarToken, validarCorpoDaRequisicao, validarFiltrosBusca } from '../utils/commons';
import { receitaSubcategoriaSchema, receitaSubcategoriaUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(receitaSubcategoriaSchema), ReceitaSubcategoriaController.criarReceitaSubcategoria);
router.get('/', validarToken, validarFiltrosBusca, ReceitaSubcategoriaController.listarReceitaSubcategorias);
router.get('/:id', validarToken, ReceitaSubcategoriaController.obterReceitaSubcategoriaPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(receitaSubcategoriaUpdateSchema), ReceitaSubcategoriaController.atualizarReceitaSubcategoria);
router.delete('/:id', validarToken, ReceitaSubcategoriaController.excluirReceitaSubcategoria);

export default router;
