import { Request, Response } from 'express';
import Joi from 'joi';
import { DespesaConta } from '../models/despesa';

const despesaSchema = Joi.object({
    valor: Joi.number().optional(),
    dataTransacao: Joi.date().iso().optional(),
    tipoTransacao: Joi.string().optional(),
    categoria: Joi.string().optional(),
    conta: Joi.string().optional(),
    observacao: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional()
}).min(1);

class DespesaController {
    static async criarDespesa(req: Request, res: Response) {
        const { error, value } = despesaSchema.validate(req.body, { presence: 'required' });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const novaDespesa = new DespesaConta(value);
            await novaDespesa.save();
            res.status(201).json(novaDespesa);
        } catch (error: unknown) {
            res.status(400).json({ error: 'Erro ao criar despesa', errorMessage: error });
        }
    }

    static async listarTodasDespesas(req: Request, res: Response) {
        try {
            const despesas = await DespesaConta.find();
            res.json(despesas);
        } catch (error) {
            res.status(400).json({ error: 'Erro ao listar despesas' });
        }
    }

    static async obterDespesaPorId(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const despesa = await DespesaConta.findById(id);
            if (despesa) {
                res.json(despesa);
            } else {
                console.log(`Despesa com ID ${id} não encontrada.`);
                res.status(404).json({ error: 'Despesa não encontrada' });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao obter despesa com ID ${id}:`, error.message);
                console.error(error.stack); // O stack trace ainda será acessível aqui
                res.status(400).json({ error: 'Erro ao obter despesa', errorMessage: error.message });
            } else {
                // Se o erro não for uma instância de Error, lidar de forma genérica
                res.status(500).json({ error: 'Erro interno do servidor' });
            }
        }
    }

    static async atualizarDespesa(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = despesaSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const despesaAtualizada = await DespesaConta.findByIdAndUpdate(id, value, { new: true });
            if (despesaAtualizada) {
                res.json(despesaAtualizada);
            } else {
                res.status(404).json({ error: 'Despesa não encontrada' });
            }
        } catch (error) {
            res.status(400).json({ error: 'Erro ao atualizar despesa' });
        }
    }

    static async excluirDespesa(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const despesaExcluida = await DespesaConta.findByIdAndDelete(id);
            if (despesaExcluida) {
                res.status(200).json({ message: 'Despesa excluída com sucesso' });
            } else {
                res.status(404).json({ error: 'Despesa não encontrada' });
            }
        } catch (error) {
            res.status(400).json({ error: 'Erro ao excluir despesa' });
        }
    }
}

export default DespesaController;
