// src/controllers/DespesaController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

// Definição do esquema de validação
const despesaSchema = Joi.object({
    valor: Joi.number().required(),
    dataTransacao: Joi.date().iso().required(),
    tipoTransacao: Joi.string().valid('Débito', 'Crédito', 'Dinheiro').required(),
    categoriaId: Joi.number().integer().required(),
    subCategoriaId: Joi.number().integer().optional(),
    observacao: Joi.string().optional()
});

const prisma = new PrismaClient();

class DespesaController {
    static async criarDespesa(req: Request, res: Response) {
        try {
            // Validando os dados de entrada
            const { error, value } = despesaSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const novaDespesa = await prisma.despesa.create({ data: value });
            console.log('Despesa criada:', novaDespesa);
            res.status(201).json(novaDespesa);
        } catch (error) {
            console.error('Erro ao criar despesa:', error);
            res.status(400).json({ error: 'Erro ao criar despesa' });
        }
    }

    static async listarTodasDespesas(req: Request, res: Response) {
        try {
            const despesas = await prisma.despesa.findMany();
            console.log(`${despesas.length} despesas encontradas`);
            res.json(despesas);
        } catch (error) {
            console.error('Erro ao listar despesas:', error);
            res.status(400).json({ error: 'Erro ao listar despesas' });
        }
    }

    static async obterDespesaPorId(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const despesa = await prisma.despesa.findUnique({ where: { id: Number(id) } });
            if (despesa) {
                console.log('Despesa encontrada:', despesa);
                res.json(despesa);
            } else {
                console.log('Despesa não encontrada para o ID:', id);
                res.status(404).json({ error: 'Despesa não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao obter despesa:', error);
            res.status(400).json({ error: 'Erro ao obter despesa' });
        }
    }

    static async atualizarDespesa(req: Request, res: Response) {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        try {
            const despesaAtualizada = await prisma.despesa.update({
                where: { id: Number(id) },
                data: dadosAtualizados,
            });
            console.log('Despesa atualizada:', despesaAtualizada);
            res.json(despesaAtualizada);
        } catch (error) {
            console.error('Erro ao atualizar despesa:', error);
            res.status(400).json({ error: 'Erro ao atualizar despesa' });
        }
    }

    static async excluirDespesa(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await prisma.despesa.delete({ where: { id: Number(id) } });
            console.log('Despesa excluída com o ID:', id);
            res.status(200).json({ message: 'Despesa excluída com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir despesa:', error);
            res.status(400).json({ error: 'Erro ao excluir despesa' });
        }
    }
}

export default DespesaController;
