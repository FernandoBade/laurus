import { Request, Response } from 'express';
import Joi from 'joi';
import DespesaCategoria from '../models/despesaCategoria';
import Usuario from '../models/usuario';

const despesaCategoriaSchema = Joi.object({
    nome: Joi.string().required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

const despesaCategoriaUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    ativo: Joi.boolean()
}).min(1);

class DespesaCategoriaController {
    static async criarDespesaCategoria(req: Request, res: Response) {
        const { error, value } = despesaCategoriaSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const usuarioExistente = await Usuario.findById(value.usuario);
            if (!usuarioExistente) return res.status(404).json({ error: 'Usuário não encontrado' });

            const novaDespesaCategoria = new DespesaCategoria(value);
            await novaDespesaCategoria.save();

            usuarioExistente.despesaCategorias.push(novaDespesaCategoria._id);
            await usuarioExistente.save();

            res.status(201).json(novaDespesaCategoria);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static async listarDespesaCategorias(req: Request, res: Response) {
        try {
            const despesaCategorias = await DespesaCategoria.find();
            res.json(despesaCategorias);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar categorias de despesa' });
        }
    }

    static async obterDespesaCategoriaPorId(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const despesaCategoria = await DespesaCategoria.findById(id);
            if (!despesaCategoria) return res.status(404).json({ error: 'Categoria de despesa não encontrada' });
            res.json(despesaCategoria);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao obter categoria de despesa' });
        }
    }

    static async atualizarDespesaCategoria(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = despesaCategoriaUpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const despesaCategoriaAtualizada = await DespesaCategoria.findByIdAndUpdate(id, value, { new: true });
            if (!despesaCategoriaAtualizada) return res.status(404).json({ error: 'Categoria de despesa não encontrada' });
            res.json(despesaCategoriaAtualizada);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar categoria de despesa' });
        }
    }

    static async excluirDespesaCategoria(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const despesaCategoria = await DespesaCategoria.findById(id).populate('usuario', 'nome');
            if (!despesaCategoria) return res.status(404).json({ error: 'Categoria de despesa não encontrada' });

            const nomeUsuario = despesaCategoria.usuario && 'nome' in despesaCategoria.usuario ? despesaCategoria.usuario['nome'] : 'Desconhecido';

            await DespesaCategoria.findByIdAndDelete(id);

            if (despesaCategoria.usuario && despesaCategoria.usuario._id) {
                await Usuario.findByIdAndUpdate(despesaCategoria.usuario._id, { $pull: { despesaCategorias: despesaCategoria._id } });
            }

            res.status(200).json({ message: `Categoria de despesa excluída com sucesso e vínculo com ${nomeUsuario} removido.` });
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao excluir categoria com o ID ${id}:`, error.message);
                res.status(400 | 401).json({ error: 'Erro ao excluir categoria.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }
}

export default DespesaCategoriaController;
