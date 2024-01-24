import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import DespesaCartao from '../models/despesaCartaoCredito';
import CartaoCredito from '../models/cartaoCredito';

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
}).min(1);

class DespesaCartaoCreditoController {
    static async criarDespesaCartaoCredito(req: Request, res: Response) {
        const { error, value } = despesaCartaoCreditoSchema.validate(req.body, { presence: 'required' });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const cartaoCreditoExiste = await CartaoCredito.findById(value.cartaoCredito);
        if (!cartaoCreditoExiste) {
            return res.status(404).json({ error: 'Cartão de crédito não encontrado' });
        }

        try {
            const novaDespesaCartaoCredito = new DespesaCartao({
                ...value,
                cartaoCredito: new mongoose.Types.ObjectId(value.cartaoCredito),
                categoria: new mongoose.Types.ObjectId(value.categoria),
                subcategoria: value.subcategoria ? new mongoose.Types.ObjectId(value.subcategoria) : null,
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined
            });
            await novaDespesaCartaoCredito.save();
            res.status(201).json(novaDespesaCartaoCredito);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao criar despesa de cartão.`, error.message);
                res.status(400).json({ error: 'Erro ao criar despesa de cartão.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }


    static async listarDespesasCartaoCredito(req: Request, res: Response) {
        try {
            const despesasCartaoCredito = await DespesaCartao.find();
            res.json(despesasCartaoCredito);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao listar despesas:`, error.message);
                console.error(error.stack);
                res.status(400 | 401).json({ error: 'Erro ao listar despesas.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }


    static async obterDespesaCartaoCreditoPorId(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const despesaCartaoCredito = await DespesaCartao.findById(id);
            if (despesaCartaoCredito) {
                res.json(despesaCartaoCredito);
            } else {
                console.log(`Despesa com ID ${id} não encontrada.`);
                res.status(404).json({ error: 'Despesa não encontrada' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao obter despesa com o ID ${id}:`, error.message);
                console.error(error.stack);
                res.status(400 | 401).json({ error: 'Erro ao obter despesa.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }


    static async atualizarDespesaCartaoCredito(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = despesaCartaoCreditoUpdateSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const updateObj = {
                ...value,
                cartaoCredito: value.cartaoCredito ? new mongoose.Types.ObjectId(value.cartaoCredito) : undefined,
                despesaCategoria: value.despesaCategoria ? new mongoose.Types.ObjectId(value.despesaCategoria) : undefined,
                despesaSubcategoria: value.despesaSubcategoria ? new mongoose.Types.ObjectId(value.despesaSubcategoria) : undefined,
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined,
                parcelamento: value.parcelamento,
                numeroParcelaAtual: value.parcelamento ? value.numeroParcelaAtual : undefined,
                totalParcelas: value.parcelamento ? value.totalParcelas : undefined
            };

            const despesaCartaoCreditoAtualizada = await DespesaCartao.findByIdAndUpdate(id, updateObj, { new: true });
            if (despesaCartaoCreditoAtualizada) {
                res.json(despesaCartaoCreditoAtualizada);
            } else {
                res.status(404).json({ error: 'Despesa não encontrada.' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao atualizar despesa com o ID ${id}:`, error.message);
                console.error(error.stack);
                res.status(400 | 401).json({ error: 'Erro ao atualizar despesa.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }


    static async excluirDespesaCartaoCredito(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const despesaCartaoCreditoExcluida = await DespesaCartao.findByIdAndDelete(id);
            if (despesaCartaoCreditoExcluida) {
                res.status(200).json({ message: 'Despesa excluída com sucesso.' });
            } else {
                res.status(404).json({ error: 'Despesa não encontrada.' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao excluir despesa com o ID ${id}:`, error.message);
                console.error(error.stack);
                res.status(400 | 401).json({ error: 'Erro ao excluir despesa.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }
}

export default DespesaCartaoCreditoController;