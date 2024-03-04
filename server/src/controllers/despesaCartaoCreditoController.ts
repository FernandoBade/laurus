import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import DespesaCartaoCredito from '../models/despesaCartaoCredito';
import CartaoCredito from '../models/cartaoCredito';
import logger, { resource, responderAPI } from '../utils/commons';

const despesaCartaoCreditoSchema = Joi.object({
    cartaoCredito: Joi.string().required(),
    valor: Joi.number().required(),
    dataTransacao: Joi.date().iso().required(),
    despesaCategoria: Joi.string().required(),
    despesaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    parcelamento: Joi.boolean().optional(),
    numeroParcelaAtual: Joi.when('parcelamento', {
        is: true,
        then: Joi.number().required(),
        otherwise: Joi.forbidden()
    }),
    totalParcelas: Joi.when('parcelamento', {
        is: true,
        then: Joi.number().required(),
        otherwise: Joi.forbidden()
    }),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
});

const despesaCartaoCreditoUpdateSchema = Joi.object({
    cartaoCredito: Joi.string().optional(),
    valor: Joi.number().optional(),
    dataTransacao: Joi.date().iso().optional(),
    despesaCategoria: Joi.string().optional(),
    despesaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    parcelamento: Joi.boolean().optional(),
    numeroParcelaAtual: Joi.when('parcelamento', {
        is: true,
        then: Joi.number().required(),
        otherwise: Joi.forbidden()
    }),
    totalParcelas: Joi.when('parcelamento', {
        is: true,
        then: Joi.number().required(),
        otherwise: Joi.forbidden()
    }),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
}).min(1);

class DespesaCartaoCreditoController {
    /**
    * Método de criação de novas despesas de cartão de crédito.
    * @param {Request} req - Objeto de requisição.
    * @param {Response} res - Objeto de resposta.
    */
    static async criarDespesaCartaoCredito(req: Request, res: Response) {
        const { error: erro, value: valor } = despesaCartaoCreditoSchema.validate(req.body);
        if (erro) {
            return responderAPI(res, 400, "erro_validacaoJoi", erro.details);
        }

        const cartaoCreditoExiste = await CartaoCredito.findById(valor.cartaoCredito);
        if (!cartaoCreditoExiste) {
            return res.status(404).json({ error: 'Cartão de crédito não encontrado' });
        }

        try {
            const novaDespesaCartaoCredito = new DespesaCartaoCredito({
                ...valor,
                cartaoCredito: new mongoose.Types.ObjectId(valor.cartaoCredito),
                categoria: new mongoose.Types.ObjectId(valor.categoria),
                subcategoria: valor.subcategoria ? new mongoose.Types.ObjectId(valor.subcategoria) : null,
                tags: valor.tags ? valor.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined
            });
            await novaDespesaCartaoCredito.save();
            await CartaoCredito.findByIdAndUpdate(valor.cartaoCredito, { $push: { despesasCartaoCredito: novaDespesaCartaoCredito._id } });

            responderAPI(res, 201, "sucesso_despesaCartaoCreditoCriada", novaDespesaCartaoCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    /**
     * Obtém a lista de despesas de cartão de crédito.
     * @param {Request} req - Objeto de requisição.
     * @param {Response} res - Objeto de resposta.
     */
    static async listarDespesasCartaoCredito(req: Request, res: Response) {
        try {
            const despesasCartaoCredito = await DespesaCartaoCredito.find();
            responderAPI(res, 200, "sucesso_listaDespesasCartaoCredito", despesasCartaoCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async obterDespesaCartaoCreditoPorId(req: Request, res: Response) {

        try {
            const despesaCartaoCredito = await DespesaCartaoCredito.findById(req.params.id);
            if (!despesaCartaoCredito) {
                return responderAPI(res, 404, "erro_despesaCartaoCreditoNaoEncontrada");
            }
            responderAPI(res, 200, "sucesso_despesaCartaoCreditoEncontrada", despesaCartaoCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async atualizarDespesaCartaoCredito(req: Request, res: Response) {
        const { error: erro, value: valor } = despesaCartaoCreditoUpdateSchema.validate(req.body);
        if (erro) {
            return responderAPI(res, 400, "erro_validacaoJoi", erro.details);
        }

        try {
            const despesaCartaoCreditoAtualizada = await DespesaCartaoCredito.findByIdAndUpdate(req.params.id, valor, { new: true });
            if (!despesaCartaoCreditoAtualizada) {
                return responderAPI(res, 404, "erro_despesaCartaoCredito");
            }

            responderAPI(res, 200, "sucesso_despesaCartaoCreditoAtualizada", despesaCartaoCreditoAtualizada);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async excluirDespesaCartaoCredito(req: Request, res: Response) {
        try {
            const despesaCartaoCredito = await DespesaCartaoCredito.findById(req.params.id);
            if (!despesaCartaoCredito) {
                return responderAPI(res, 404, "erro_despesaCartaoCreditoNaoEncontrada");
            }

            await DespesaCartaoCredito.findByIdAndDelete(req.params.id);

            if (despesaCartaoCredito.cartaoCredito) {
                await CartaoCredito.findByIdAndUpdate(despesaCartaoCredito.cartaoCredito._id, { $pull: { despesasCartaoCredito: despesaCartaoCredito._id } });
            }

            responderAPI(res, 200, "sucesso_excluirDespesaCartaoCredito", { conta: despesaCartaoCredito });
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }
}

export default DespesaCartaoCreditoController;
