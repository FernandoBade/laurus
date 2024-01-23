import { Request, Response } from 'express';
import Joi from 'joi';
import DespesaSubcategoria from '../models/despesaSubcategoria';
import DespesaCategoria from '../models/despesaCategoria';
import Usuario from '../models/usuario';

const despesaSubcategoriaSchema = Joi.object({
    nome: Joi.string().required(),
    categoria: Joi.string().required(),
    usuario: Joi.string().required()
});

const despesaSubcategoriaUpdateSchema = Joi.object({
    nome: Joi.string().optional()
}).min(1);

class DespesaSubcategoriaController {
    static async criarDespesaSubcategoria(req: Request, res: Response) {
        const { error, value } = despesaSubcategoriaSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const novaDespesaSubcategoria = new DespesaSubcategoria(value);
            await novaDespesaSubcategoria.save();

            await DespesaCategoria.findByIdAndUpdate(value.categoria, { $push: { despesaSubcategorias: novaDespesaSubcategoria._id } });

            res.status(201).json(novaDespesaSubcategoria);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static async listarDespesaSubcategorias(req: Request, res: Response) {
        try {
            const despesaSubcategorias = await DespesaSubcategoria.find();
            res.json(despesaSubcategorias);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar subcategorias de despesa' });
        }
    }

    static async obterDespesaSubcategoriaPorId(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const despesaSubcategoria = await DespesaSubcategoria.findById(id);
            if (!despesaSubcategoria) return res.status(404).json({ error: 'Subcategoria de despesa não encontrada' });
            res.json(despesaSubcategoria);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao obter subcategoria de despesa' });
        }
    }

    static async atualizarDespesaSubcategoria(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = despesaSubcategoriaUpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const despesaSubcategoriaAtualizada = await DespesaSubcategoria.findByIdAndUpdate(id, value, { new: true });
            if (!despesaSubcategoriaAtualizada) return res.status(404).json({ error: 'Subcategoria de despesa não encontrada' });
            res.json(despesaSubcategoriaAtualizada);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar subcategoria de despesa' });
        }
    }


    static async excluirDespesaSubcategoria(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const despesaSubcategoria = await DespesaSubcategoria.findById(id).populate('categoria', 'nome');
            if (!despesaSubcategoria) return res.status(404).json({ error: 'Subcategoria de despesa não encontrada' });

            const nomeCategoria = despesaSubcategoria.categoria && 'nome' in despesaSubcategoria.categoria ? despesaSubcategoria.categoria['nome'] : 'Desconhecida';

            await DespesaSubcategoria.findByIdAndDelete(id);

            if (despesaSubcategoria.categoria) {
                await DespesaCategoria.findByIdAndUpdate(despesaSubcategoria.categoria._id, { $pull: { despesaSubcategorias: id } });
            }

            res.status(200).json({ message: `Subcategoria de despesa excluída com sucesso. Vínculo removido com a categoria ${nomeCategoria}` });
        } catch (e) {
            res.status(500).json({ error: 'Erro ao excluir subcategoria de despesa' });
        }
    }
}

export default DespesaSubcategoriaController;
