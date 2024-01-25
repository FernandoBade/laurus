import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import ReceitaCartaoCredito from '../models/receitaCartaoCredito';
import CartaoCredito from '../models/cartaoCredito';

const receitaCartaoCreditoSchema = Joi.object({
    cartaoCredito: Joi.string().required(),
    valor: Joi.number().required(),
    dataTransacao: Joi.date().iso().required(),
    receitaCategoria: Joi.string().required(),
    receitaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
});

const receitaCartaoCreditoUpdateSchema = Joi.object({
    cartaoCredito: Joi.string().optional(),
    valor: Joi.number().optional(),
    dataTransacao: Joi.date().iso().optional(),
    receitaCategoria: Joi.string().optional(),
    receitaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
}).min(1);

class ReceitaCartaoCreditoController {
    static async criarReceitaCartaoCredito(req: Request, res: Response) {
        const { error, value } = receitaCartaoCreditoSchema.validate(req.body, { presence: 'required' });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const cartaoCreditoExiste = await CartaoCredito.findById(value.cartaoCredito);
        if (!cartaoCreditoExiste) {
            return res.status(404).json({ error: 'Cartão de crédito não encontrado' });
        }

        try {
            const novaReceitaCartaoCredito = new ReceitaCartaoCredito({
                ...value,
                cartaoCredito: new mongoose.Types.ObjectId(value.cartaoCredito),
                receitaCategoria: new mongoose.Types.ObjectId(value.receitaCategoria),
                receitaSubcategoria: value.receitaSubcategoria ? new mongoose.Types.ObjectId(value.receitaSubcategoria) : null,
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined,
                observacao: value.observacao
            });
            await novaReceitaCartaoCredito.save();
            await CartaoCredito.findByIdAndUpdate(value.cartaoCredito, { $push: { receitasCartaoCredito: novaReceitaCartaoCredito } });

            res.status(201).json(novaReceitaCartaoCredito);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao criar receita de cartão.`, error.message);
                res.status(400).json({ error: 'Erro ao criar receita de cartão.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }

    static async listarReceitasCartaoCredito(req: Request, res: Response) {
        try {
            const receitasCartaoCredito = await ReceitaCartaoCredito.find();
            res.json(receitasCartaoCredito);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao listar receitas:`, error.message);
                res.status(400 | 401).json({ error: 'Erro ao listar receitas.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }

    static async obterReceitaCartaoCreditoPorId(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const receitaCartaoCredito = await ReceitaCartaoCredito.findById(id);
            if (receitaCartaoCredito) {
                res.json(receitaCartaoCredito);
            } else {
                console.log(`Receita com ID ${id} não encontrada.`);
                res.status(404).json({ error: 'Receita não encontrada' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao obter receita com o ID ${id}:`, error.message);
                res.status(400 | 401).json({ error: 'Erro ao obter receita.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }

    static async atualizarReceitaCartaoCredito(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = receitaCartaoCreditoUpdateSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const updateObj = {
                ...value,
                cartaoCredito: value.cartaoCredito ? new mongoose.Types.ObjectId(value.cartaoCredito) : undefined,
                receitaCategoria: value.receitaCategoria ? new mongoose.Types.ObjectId(value.receitaCategoria) : undefined,
                receitaSubcategoria: value.receitaSubcategoria ? new mongoose.Types.ObjectId(value.receitaSubcategoria) : undefined,
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined,
                observacao: value.observacao
            };

            const receitaCartaoCreditoAtualizada = await ReceitaCartaoCredito.findByIdAndUpdate(id, updateObj, { new: true });
            if (receitaCartaoCreditoAtualizada) {
                res.json(receitaCartaoCreditoAtualizada);
            } else {
                res.status(404).json({ error: 'Receita não encontrada.' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao atualizar receita com o ID ${id}:`, error.message);
                res.status(400 | 401).json({ error: 'Erro ao atualizar receita.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }

    static async excluirReceitaCartaoCredito(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const receitaCartaoCredito = await ReceitaCartaoCredito.findById(id).populate('cartaoCredito', 'nome');
            if (!receitaCartaoCredito) {
                return res.status(404).json({ error: 'Receita de cartão de crédito não encontrada.' });
            }

            const nomeCartaoCredito = receitaCartaoCredito.cartaoCredito && 'nome' in receitaCartaoCredito.cartaoCredito ? receitaCartaoCredito.cartaoCredito['nome'] : 'Desconhecido';

            await ReceitaCartaoCredito.findByIdAndDelete(id);

            if (receitaCartaoCredito.cartaoCredito && receitaCartaoCredito.cartaoCredito._id) {
                await CartaoCredito.findByIdAndUpdate(receitaCartaoCredito.cartaoCredito._id, { $pull: { receitasCartaoCredito: id } });
            }

            res.status(200).json({ message: `Receita de cartão de crédito excluída com sucesso do cartão ${nomeCartaoCredito}.` });
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao excluir receita com o ID ${id}:`, error.message);
                res.status(400 | 401).json({ error: 'Erro ao excluir receita.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }
}

export default ReceitaCartaoCreditoController;
