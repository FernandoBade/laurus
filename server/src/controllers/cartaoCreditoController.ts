import { Request, Response } from 'express';
import Joi from 'joi';
import CartaoCredito from '../models/cartaoCredito';
import Usuario from '../models/usuario';
import { logger, resource, responderAPI } from '../utils/commons';

const cartaoCreditoSchema = Joi.object({
    nome: Joi.string().required(),
    bandeira: Joi.string().required(),
    diaFechamentoFatura: Joi.number().required(),
    diaVencimentoFatura: Joi.number().required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

const cartaoCreditoUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    bandeira: Joi.string().optional(),
    diaFechamentoFatura: Joi.number().optional(),
    diaVencimentoFatura: Joi.number().optional(),
    ativo: Joi.boolean()
}).min(1);

class CartaoCreditoController {
    static async criarCartaoCredito(req: Request, res: Response) {
        const { error, value } = cartaoCreditoSchema.validate(req.body);
        if (error) {
            return responderAPI(res, 400, 'erro_validacaoCartaoCredito', {}, error.details);
        }

        try {
            const usuarioExistente = await Usuario.findById(value.usuario);
            if (!usuarioExistente) {
                return responderAPI(res, 404, 'erro_usuarioNaoEncontrado');
            }

            const novoCartaoCredito = await new CartaoCredito(value).save();
            usuarioExistente.cartoesDeCredito.push(novoCartaoCredito._id);
            await usuarioExistente.save();

            logger.info(resource('log_sucessoCriacaoCartaoCredito', { cartaoId: novoCartaoCredito._id }));
            responderAPI(res, 201, 'sucesso_cartaoCreditoCriado', novoCartaoCredito);
        } catch (erro: any) {
            logger.error(resource('erro_internoServidor', { erro: erro.message }));
            responderAPI(res, 500, 'erro_internoServidor', erro);
        }
    }

    static async listarCartoesCredito(req: Request, res: Response) {
        try {
            const cartoesCredito = await CartaoCredito.find();
            logger.info(resource('log_sucessoListagemCartoesCredito'));
            responderAPI(res, 200, 'sucesso_cartoesCreditoListados', cartoesCredito);
        } catch (erro: any) {
            logger.error(resource('erro_internoServidor', { erro: erro }));
            responderAPI(res, 500, 'erro_internoServidor', erro);
        }
    }

    static async obterCartaoCreditoPorId(req: Request, res: Response) {
        try {
            const cartaoCredito = await CartaoCredito.findById(req.params.id);
            if (!cartaoCredito) {
                return responderAPI(res, 404, 'erro_cartaoCreditoNaoEncontrado');
            }
            responderAPI(res, 200, 'sucesso_cartaoCreditoEncontrado', cartaoCredito);
        } catch (erro: any) {
            logger.error(resource('erro_internoServidor', { erro: erro }));
            responderAPI(res, 500, 'erro_internoServidor', erro);
        }
    }

    static async atualizarCartaoCredito(req: Request, res: Response) {
        const { error, value } = cartaoCreditoUpdateSchema.validate(req.body);
        if (error) {
            return responderAPI(res, 400, 'erro_validacaoAtualizacaoCartaoCredito', {}, error.details);
        }

        try {
            const cartaoCreditoAtualizado = await CartaoCredito.findByIdAndUpdate(req.params.id, value, { new: true });
            if (!cartaoCreditoAtualizado) {
                return responderAPI(res, 404, 'erro_cartaoCreditoNaoEncontrado');
            }
            logger.info(resource('log_sucessoAtualizacaoCartaoCredito', { cartaoId: cartaoCreditoAtualizado._id }));
            responderAPI(res, 200, 'sucesso_cartaoCreditoAtualizado', cartaoCreditoAtualizado);
        } catch (erro: any) {
            logger.error(resource('erro_internoServidor', { erro: erro }));
            responderAPI(res, 500, 'erro_internoServidor', erro);
        }
    }

    static async excluirCartaoCredito(req: Request, res: Response) {
        try {
            const cartaoCredito = await CartaoCredito.findByIdAndDelete(req.params.id);
            if (!cartaoCredito) {
                return responderAPI(res, 404, 'erro_cartaoCreditoNaoEncontrado');
            }
            logger.info(resource('log_sucessoExclusaoCartaoCredito', { cartaoId: req.params.id }));
            responderAPI(res, 200, 'sucesso_cartaoCreditoExcluido');
        } catch (erro: any) {
            logger.error(resource('erro_internoServidor', { erro: erro }));
            responderAPI(res, 500, 'erro_internoServidor', erro);
        }
    }
}

export default CartaoCreditoController;
