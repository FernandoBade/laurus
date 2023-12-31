import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();


const despesaCreateSchema = Joi.object({
    valor: Joi.number().required(),
    dataTransacao: Joi.date().iso().required(),
    tipoTransacaoId: Joi.number().integer().required(),
    categoriaId: Joi.number().integer().required(),
    subCategoriaId: Joi.number().integer().optional(),
    observacao: Joi.string().optional(),
    contaId: Joi.number().integer().required()
});

const despesaUpdateSchema = Joi.object({
    valor: Joi.number().optional(),
    dataTransacao: Joi.date().iso().optional(),
    tipoTransacaoId: Joi.number().integer().optional(),
    categoriaId: Joi.number().integer().optional(),
    subCategoriaId: Joi.number().integer().optional(),
    observacao: Joi.string().optional(),
    contaId: Joi.number().integer().optional()
}).min(1);


class DespesaController {
    static async criarDespesa(req: Request, res: Response) {
        const { error, value } = despesaCreateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const novaDespesa = await prisma.despesa.create({ data: value });
            console.log('Despesa criada:', novaDespesa);
            res.status(201).json(novaDespesa);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Erro ao criar despesa:', error.message, error);
            res.status(400).json({ error: 'Erro ao criar despesa', errorMessage: error.message });
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
        const { error, value } = despesaUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        try {
            const despesaAtualizada = await prisma.despesa.update({
                where: { id: Number(id) },
                data: value,
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
