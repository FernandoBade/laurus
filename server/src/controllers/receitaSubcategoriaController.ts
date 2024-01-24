import { Request, Response } from 'express';
import Joi from 'joi';
import ReceitaSubcategoria from '../models/receitaSubcategoria';
import ReceitaCategoria from '../models/receitaCategoria';

const receitaSubcategoriaSchema = Joi.object({
    nome: Joi.string().required(),
    categoria: Joi.string().required(),
    usuario: Joi.string().required()
});

const receitaSubcategoriaUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    categoria: Joi.string().optional(),
}).min(1);

class ReceitaSubcategoriaController {
    static async criarReceitaSubcategoria(req: Request, res: Response) {
        const { error, value } = receitaSubcategoriaSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const novaReceitaSubcategoria = new ReceitaSubcategoria(value);
            await novaReceitaSubcategoria.save();

            await ReceitaCategoria.findByIdAndUpdate(value.categoria, { $push: { receitaSubcategorias: novaReceitaSubcategoria._id } });

            res.status(201).json(novaReceitaSubcategoria);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static async listarReceitaSubcategorias(req: Request, res: Response) {
        try {
            const receitaSubcategorias = await ReceitaSubcategoria.find();
            res.json(receitaSubcategorias);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar subcategorias de receita' });
        }
    }

    static async obterReceitaSubcategoriaPorId(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const receitaSubcategoria = await ReceitaSubcategoria.findById(id);
            if (!receitaSubcategoria) return res.status(404).json({ error: 'Subcategoria de receita não encontrada' });
            res.json(receitaSubcategoria);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao obter subcategoria de receita' });
        }
    }

    static async atualizarReceitaSubcategoria(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = receitaSubcategoriaUpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const receitaSubcategoriaAtualizada = await ReceitaSubcategoria.findByIdAndUpdate(id, value, { new: true });
            if (!receitaSubcategoriaAtualizada) return res.status(404).json({ error: 'Subcategoria de receita não encontrada' });
            res.json(receitaSubcategoriaAtualizada);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar subcategoria de receita' });
        }
    }

    static async excluirReceitaSubcategoria(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const receitaSubcategoria = await ReceitaSubcategoria.findById(id).populate('categoria', 'nome');
            if (!receitaSubcategoria) return res.status(404).json({ error: 'Subcategoria de receita não encontrada' });

            const nomeCategoria = receitaSubcategoria.categoria && 'nome' in receitaSubcategoria.categoria ? receitaSubcategoria.categoria['nome'] : 'Desconhecida';

            await ReceitaSubcategoria.findByIdAndDelete(id);

            if (receitaSubcategoria.categoria) {
                await ReceitaCategoria.findByIdAndUpdate(receitaSubcategoria.categoria._id, { $pull: { receitaSubcategorias: id } });
            }

            res.status(200).json({ message: `Subcategoria de receita excluída com sucesso e vínculo removido com a categoria ${nomeCategoria}` });
        } catch (e) {
            res.status(500).json({ error: 'Erro ao excluir subcategoria de receita' });
        }
    }
}

export default ReceitaSubcategoriaController;
