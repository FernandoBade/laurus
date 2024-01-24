import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import DespesaConta from '../models/despesaConta';
import Conta from '../models/conta';

const despesaContaSchema = Joi.object({
    conta: Joi.string().required(),
    valor: Joi.number().required(),
    dataTransacao: Joi.date().iso().required(),
    despesaCategoria: Joi.string().required(),
    despesaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
});

const despesaContaUpdateSchema = Joi.object({
    conta: Joi.string().optional(),
    valor: Joi.number().optional(),
    dataTransacao: Joi.date().iso().optional(),
    despesaCategoria: Joi.string().optional(),
    despesaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
}).min(1);


class DespesaContaController {
    static async criarDespesaConta(req: Request, res: Response) {
        const { error, value } = despesaContaSchema.validate(req.body, { presence: 'required' });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const contaExiste = await Conta.findById(value.conta);
        if (!contaExiste) {
            return res.status(404).json({ error: 'Conta não encontrada.' });
        }

        try {
            const novaDespesaConta = new DespesaConta({
                ...value,
                conta: new mongoose.Types.ObjectId(value.conta),
                despesaCategoria: new mongoose.Types.ObjectId(value.despesaCategoria),
                despesaSubcategoria: value.despesaSubcategoria ? new mongoose.Types.ObjectId(value.despesaSubcategoria) : null,
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined
            });
            await novaDespesaConta.save();
            res.status(201).json(novaDespesaConta);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao criar despesa.`, error.message);
                console.error(error.stack);
                res.status(400).json({ error: 'Erro ao criar despesa.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }


    static async listarDespesasConta(req: Request, res: Response) {
        try {
            const despesasConta = await DespesaConta.find();
            res.json(despesasConta);
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


    static async obterDespesaContaPorId(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const despesaConta = await DespesaConta.findById(id);
            if (despesaConta) {
                res.json(despesaConta);
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


    static async atualizarDespesaConta(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = despesaContaUpdateSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const updateObj = {
                ...value,
                conta: value.conta ? new mongoose.Types.ObjectId(value.conta) : undefined,
                despesaCategoria: value.despesaCategoria ? new mongoose.Types.ObjectId(value.despesaCategoria) : undefined,
                despesaSubcategoria: value.despesaSubcategoria ? new mongoose.Types.ObjectId(value.despesaSubcategoria) : undefined,
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined
            };

            const despesaContaAtualizada = await DespesaConta.findByIdAndUpdate(id, updateObj, { new: true });
            if (despesaContaAtualizada) {
                res.json(despesaContaAtualizada);
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


    static async excluirDespesaConta(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const despesaContaExcluida = await DespesaConta.findByIdAndDelete(id);
            if (despesaContaExcluida) {
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

export default DespesaContaController;
