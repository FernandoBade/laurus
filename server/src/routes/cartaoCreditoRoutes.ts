import express from 'express';
import CartaoCreditoController from '../controllers/cartaoCreditoController'

const router = express.Router();

router.post('/', CartaoCreditoController.criarCartaoCredito);
router.get('/', CartaoCreditoController.listarCartoesCredito);
router.get('/:id', CartaoCreditoController.obterCartaoCreditoPorId);
router.put('/:id', CartaoCreditoController.atualizarCartaoCredito);
router.delete('/:id', CartaoCreditoController.excluirCartaoCredito);

export default router;
