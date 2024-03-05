import { Request, Response } from 'express';
import Joi from 'joi';
import CartaoCredito from '../models/cartaoCredito';
import Usuario from '../models/usuario';
import { logger, resource, responderAPI } from '../utils/commons';
import { EnumBandeiras } from '../utils/assets/enums';

const cartaoCreditoSchema = Joi.object({
    nome: Joi.string().required(),
    bandeira: Joi.string().valid(...Object.values(EnumBandeiras)).required(),
    diaFechamentoFatura: Joi.number().required(),
    diaVencimentoFatura: Joi.number().required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

const cartaoCreditoUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    bandeira: Joi.string().valid(...Object.values(EnumBandeiras)).optional(),
    diaFechamentoFatura: Joi.number().optional(),
    diaVencimentoFatura: Joi.number().optional(),
    ativo: Joi.boolean()
}).min(1);

class CartaoCreditoController {
    static async criarCartaoCredito(req: Request, res: Response) {
        const { error: erro, value: valor } = cartaoCreditoSchema.validate(req.body);
        if (erro) return responderAPI(res, 400, "erro_validacaoJoi", erro.details);

        const usuarioExistente = await Usuario.findById(valor.usuario);
        if (!usuarioExistente) return responderAPI(res, 404, "erro_naoEncontrado");

        try {
            const novoCartaoCredito = await new CartaoCredito(valor).save();

            usuarioExistente.cartoesDeCredito.push(novoCartaoCredito._id);
            await usuarioExistente.save();

            responderAPI(res, 201, "sucesso_cadastrar", novoCartaoCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async listarCartoesCredito(req: Request, res: Response) {
        try {
            const cartoesCredito = await CartaoCredito.find();

            responderAPI(res, 200, "sucesso_buscar", cartoesCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async obterCartaoCreditoPorId(req: Request, res: Response) {
        try {
            const cartaoCredito = await CartaoCredito.findById(req.params.id);
            if (!cartaoCredito) return responderAPI(res, 404, "erro_naoEncontrado");

            responderAPI(res, 200, "sucesso_buscar", cartaoCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async atualizarCartaoCredito(req: Request, res: Response) {
        const { error: erro, value: valor } = cartaoCreditoUpdateSchema.validate(req.body);
        if (erro) return responderAPI(res, 400, "erro_validacaoJoi", erro.details);

        try {
            const cartaoCreditoAtualizado = await CartaoCredito.findByIdAndUpdate(req.params.id, valor, { new: true });
            if (!cartaoCreditoAtualizado) return responderAPI(res, 404, "erro_naoEncontrado");

            responderAPI(res, 200, "sucesso_atualizar", cartaoCreditoAtualizado);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async excluirCartaoCredito(req: Request, res: Response) {
        try {
            const cartaoCredito = await CartaoCredito.findById(req.params.id);
            if (!cartaoCredito) return responderAPI(res, 404, "erro_naoEncontrado", { id: req.params.id });

            await CartaoCredito.findByIdAndDelete(req.params.id);

            if (cartaoCredito.usuario) await Usuario.findByIdAndUpdate(cartaoCredito.usuario, { $pull: { cartoesDeCredito: cartaoCredito._id } });

            responderAPI(res, 200, "sucesso_excluir", cartaoCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }
}

export default CartaoCreditoController;
