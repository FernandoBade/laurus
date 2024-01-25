import { Request, Response } from 'express';
import Joi from 'joi';
import Tag from '../models/tag';
import Usuario from '../models/usuario';

const tagSchema = Joi.object({
    nome: Joi.string().required(),
    usuario: Joi.string().required()
});

const tagUpdateSchema = Joi.object({
    nome: Joi.string().optional()
}).min(1);

class TagController {
    static async criarTag(req: Request, res: Response) {
        const { error, value } = tagSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const usuarioExistente = await Usuario.findById(value.usuario);
            if (!usuarioExistente) return res.status(404).json({ error: 'Usuário não encontrado' });

            const novaTag = new Tag(value);
            await novaTag.save();

            usuarioExistente.tags.push(novaTag._id);
            await usuarioExistente.save();

            res.status(201).json(novaTag);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static async listarTags(req: Request, res: Response) {
        try {
            const tags = await Tag.find();
            res.json(tags);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar tags' });
        }
    }

    static async obterTagPorId(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const tag = await Tag.findById(id);
            if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });
            res.json(tag);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao obter tag' });
        }
    }

    static async atualizarTag(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = tagUpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const tagAtualizada = await Tag.findByIdAndUpdate(id, value, { new: true });
            if (!tagAtualizada) return res.status(404).json({ error: 'Tag não encontrada' });
            res.json(tagAtualizada);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar tag' });
        }
    }

    static async excluirTag(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const tag = await Tag.findById(id).populate('usuario', 'nome');
            if (!tag) return res.status(404).json({ error: 'Tag não encontrada' });

            const nomeUsuario = tag.usuario && 'nome' in tag.usuario ? tag.usuario['nome'] : 'Desconhecido';

            await Tag.findByIdAndDelete(id);

            if (tag.usuario && tag.usuario._id) {
                await Usuario.findByIdAndUpdate(tag.usuario._id, { $pull: { tags: tag._id } });
            }

            res.status(200).json({ message: `Tag excluída com sucesso e vínculo com ${nomeUsuario} removido.` });
        } catch (error) {
            if (error instanceof Error) {
                console.error(`Erro ao excluir tag com o ID ${id}:`, error.message);
                res.status(400 | 401).json({ error: 'Erro ao excluir tag.', errorMessage: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }
}

export default TagController;
