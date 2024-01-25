import { Request, Response } from 'express';
import Joi from 'joi';
import mongoose from 'mongoose';
import ReceitaConta from '../models/receitaConta';
import Conta from '../models/conta';

const receitaContaSchema = Joi.object({
    conta: Joi.string().required(),
    valor: Joi.number().required(),
    dataTransacao: Joi.date().iso().required(),
    receitaCategoria: Joi.string().required(),
    receitaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
});

const receitaContaUpdateSchema = Joi.object({
    conta: Joi.string().optional(),
    valor: Joi.number().optional(),
    dataTransacao: Joi.date().iso().optional(),
    receitaCategoria: Joi.string().optional(),
    receitaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
}).min(1);

class ReceitaContaController {
    static async criarReceitaConta(req: Request, res: Response) {
        const { error, value } = receitaContaSchema.validate(req.body, { presence: 'required' });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const contaExiste = await Conta.findById(value.conta);
        if (!contaExiste) {
            return res.status(404).json({ error: 'Conta não encontrada' });
        }

        try {
            const novaReceitaConta = new ReceitaConta({
                ...value,
                conta: new mongoose.Types.ObjectId(value.conta),
                receitaCategoria: new mongoose.Types.ObjectId(value.receitaCategoria),
                receitaSubcategoria: value.receitaSubcategoria ? new mongoose.Types.ObjectId(value.receitaSubcategoria) : null,
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined,
                observacao: Joi.string().allow('').optional(),
            });
            await novaReceitaConta.save();
            await Conta.findByIdAndUpdate(value.conta, { $push: { receitasConta: novaReceitaConta._id } });


            res.status(201).json(novaReceitaConta);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao criar receita.`, error.message);
                res.status(400).json({ error: 'Erro ao criar receita.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }

    static async listarReceitasConta(req: Request, res: Response) {
        try {
            const receitasConta = await ReceitaConta.find();
            res.json(receitasConta);
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao listar receitas:`, error.message);
                res.status(400 | 401).json({ error: 'Erro ao listar receitas.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }

    static async obterReceitaContaPorId(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const receitaConta = await ReceitaConta.findById(id);
            if (receitaConta) {
                res.json(receitaConta);
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

    static async atualizarReceitaConta(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = receitaContaUpdateSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const updateObj = {
                ...value,
                conta: value.conta ? new mongoose.Types.ObjectId(value.conta) : undefined,
                receitaCategoria: value.receitaCategoria ? new mongoose.Types.ObjectId(value.receitaCategoria) : undefined,
                receitaSubcategoria: value.receitaSubcategoria ? new mongoose.Types.ObjectId(value.receitaSubcategoria) : undefined,
                tags: value.tags ? value.tags.map((tag: string) => new mongoose.Types.ObjectId(tag)) : undefined
            };

            const receitaContaAtualizada = await ReceitaConta.findByIdAndUpdate(id, updateObj, { new: true });
            if (receitaContaAtualizada) {
                res.json(receitaContaAtualizada);
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

    static async excluirReceitaConta(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const receitaConta = await ReceitaConta.findById(id).populate('conta', 'nome');
            if (!receitaConta) {
                return res.status(404).json({ error: 'Receita não encontrada.' });
            }

            const nomeConta = receitaConta.conta && 'nome' in receitaConta.conta ? receitaConta.conta['nome'] : 'Desconhecida';

            await ReceitaConta.findByIdAndDelete(id);

            if (receitaConta.conta && receitaConta.conta._id) {
                await Conta.findByIdAndUpdate(receitaConta.conta._id, { $pull: { receitasConta: id } });
            }

            res.status(200).json({ message: `Receita excluída com sucesso e vínculo removido da conta ${nomeConta}.` });
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

export default ReceitaContaController;
