import { Request, Response } from 'express';
import Joi from 'joi';
import ReceitaCategoria from '../models/receitaCategoria';
import Usuario from '../models/usuario';

const receitaCategoriaSchema = Joi.object({
    nome: Joi.string().required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

const receitaCategoriaUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    ativo: Joi.boolean()
}).min(1);

class ReceitaCategoriaController {
    static async criarReceitaCategoria(req: Request, res: Response) {
        const { error, value } = receitaCategoriaSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const usuarioExistente = await Usuario.findById(value.usuario);
            if (!usuarioExistente) return res.status(404).json({ error: 'Usuário não encontrado' });

            const novaReceitaCategoria = new ReceitaCategoria(value);
            await novaReceitaCategoria.save();

            usuarioExistente.receitaCategorias.push(novaReceitaCategoria._id);
            await usuarioExistente.save();

            res.status(201).json(novaReceitaCategoria);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static async listarReceitaCategorias(req: Request, res: Response) {
        try {
            const receitaCategorias = await ReceitaCategoria.find();
            res.json(receitaCategorias);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar categorias de receita' });
        }
    }

    static async obterReceitaCategoriaPorId(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const receitaCategoria = await ReceitaCategoria.findById(id);
            if (!receitaCategoria) return res.status(404).json({ error: 'Categoria de receita não encontrada' });
            res.json(receitaCategoria);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao obter categoria de receita' });
        }
    }

    static async atualizarReceitaCategoria(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = receitaCategoriaUpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const receitaCategoriaAtualizada = await ReceitaCategoria.findByIdAndUpdate(id, value, { new: true });
            if (!receitaCategoriaAtualizada) return res.status(404).json({ error: 'Categoria de receita não encontrada' });
            res.json(receitaCategoriaAtualizada);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar categoria de receita' });
        }
    }

    static async excluirReceitaCategoria(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const receitaCategoria = await ReceitaCategoria.findById(id).populate('usuario', 'nome');
            if (!receitaCategoria) return res.status(404).json({ error: 'Categoria de receita não encontrada' });

            const nomeUsuario = receitaCategoria.usuario && 'nome' in receitaCategoria.usuario ? receitaCategoria.usuario['nome'] : 'Desconhecido';

            await ReceitaCategoria.findByIdAndDelete(id);

            if (receitaCategoria.usuario && receitaCategoria.usuario._id) {
                await Usuario.findByIdAndUpdate(receitaCategoria.usuario._id, { $pull: { receitaCategorias: receitaCategoria._id } });
            }

            res.status(200).json({ message: `Categoria de receita excluída com sucesso e vínculo com ${nomeUsuario} removido.` });
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

export default ReceitaCategoriaController;
