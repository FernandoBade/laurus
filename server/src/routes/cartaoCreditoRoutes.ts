import express from 'express';
import CartaoCreditoController from '../controllers/cartaoCreditoController'
import { validarToken } from '../utils/commons';


const router = express.Router();

router.post('/', validarToken, CartaoCreditoController.criarCartaoCredito);
router.get('/', validarToken, CartaoCreditoController.listarCartoesCredito);
router.get('/:id', validarToken, CartaoCreditoController.obterCartaoCreditoPorId);
router.put('/:id', validarToken, CartaoCreditoController.atualizarCartaoCredito);
router.delete('/:id', validarToken, CartaoCreditoController.excluirCartaoCredito);

export default router;
