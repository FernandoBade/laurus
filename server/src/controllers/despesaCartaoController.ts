import { Request, Response } from 'express';
import Joi from 'joi';
import DespesaCartao from '../models/despesaCartao';
import mongoose from 'mongoose';

const despesaCartaoSchema = Joi.object({
    cartaoCredito: Joi.string().required(),
    valor: Joi.number().required(),
    dataTransacao: Joi.date().iso().required(),
    categoria: Joi.string().required(),
    subcategoria: Joi.string().allow(null).optional(),
    tipoTransacao: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
});

const despesaCartaoUpdateSchema = Joi.object({
    cartaoCredito: Joi.string().optional(),
    valor: Joi.number().optional(),
    dataTransacao: Joi.date().iso().optional(),
    categoria: Joi.string().optional(),
    subcategoria: Joi.string().allow(null).optional(),
    tipoTransacao: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
}).min(1);

class DespesaCartaoController {
    static async criarDespesaCartao(req: Request, res: Response) {
        const { error, value } = despesaCartaoSchema.validate(req.body, { presence: 'required' });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const novaDespesaCartao = new DespesaCartao({
                ...value,
                cartaoCredito: new mongoose.Types.ObjectId(value.cartaoCredito),
                categoria: new mongoose.Types.ObjectId(value.categoria),
                subcategoria: value.subcategoria ? new mongoose.Types.ObjectId(value.subcategoria) : null,
                tipoTransacao: new mongoose.Types.ObjectId(value.tipoTransacao),
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined
            });
            await novaDespesaCartao.save();
            res.status(201).json(novaDespesaCartao);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao criar despesa de cartão.`, error.message);
                res.status(400).json({ error: 'Erro ao criar despesa de cartão.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }


    static async listarTodasDespesasCartao(req: Request, res: Response) {
        try {
            const despesasCartao = await DespesaCartao.find();
            res.json(despesasCartao);
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


    static async obterDespesaCartaoPorId(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const despesaCartao = await DespesaCartao.findById(id);
            if (despesaCartao) {
                res.json(despesaCartao);
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


    static async atualizarDespesaCartao(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = despesaCartaoUpdateSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const updateObj = {
                ...value,
                cartao: value.cartao ? new mongoose.Types.ObjectId(value.cartao) : undefined,
                despesaCategoria: value.despesaCategoria ? new mongoose.Types.ObjectId(value.despesaCategoria) : undefined,
                despesaSubcategoria: value.despesaSubcategoria ? new mongoose.Types.ObjectId(value.despesaSubcategoria) : undefined,
                despesaTipoTransacao: value.despesaTipoTransacao ? new mongoose.Types.ObjectId(value.despesaTipoTransacao) : undefined,
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined
            };

            const despesaCartaoAtualizada = await DespesaCartao.findByIdAndUpdate(id, updateObj, { new: true });
            if (despesaCartaoAtualizada) {
                res.json(despesaCartaoAtualizada);
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


    static async excluirDespesaCartao(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const despesaCartaoExcluida = await DespesaCartao.findByIdAndDelete(id);
            if (despesaCartaoExcluida) {
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

export default DespesaCartaoController;
