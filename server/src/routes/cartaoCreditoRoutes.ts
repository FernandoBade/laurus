import express from 'express';
import CartaoCreditoController from '../controllers/cartaoCreditoController'
import { validarToken, validarCorpoDaRequisicao, validarFiltrosBusca } from '../utils/commons';
import { cartaoCreditoSchema, cartaoCreditoUpdateSchema } from '../utils/assets/schemasJoi';

const router = express.Router();

router.post('/', validarToken, validarCorpoDaRequisicao(cartaoCreditoSchema), CartaoCreditoController.criarCartaoCredito);
router.get('/', validarToken, validarFiltrosBusca, CartaoCreditoController.listarCartoesCredito);
router.get('/:id', validarToken, CartaoCreditoController.obterCartaoCreditoPorId);
router.put('/:id', validarToken, validarCorpoDaRequisicao(cartaoCreditoUpdateSchema), CartaoCreditoController.atualizarCartaoCredito);
router.delete('/:id', validarToken, CartaoCreditoController.excluirCartaoCredito);

export default router;
