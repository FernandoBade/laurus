import Tag from '../models/tag';
import Usuario from '../models/usuario';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class TagController {
    static async criarTag(req: Request, res: Response, next: NextFunction) {
        const usuarioExistente = await Usuario.findById(req.body.usuario);
        if (!usuarioExistente) return responderAPI(res, 404, 'erro_encontrar');

        try {
            const novaTag = await new Tag(req.body).save();

            await Usuario.findByIdAndUpdate(
                req.body.usuario,
                { $push: { tags: novaTag._id } },
                { new: true }
            );

            responderAPI(res, 201, 'sucesso_cadastrar', novaTag);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarTags(req: Request, res: Response, next: NextFunction) {
        try {
            const tags = await Tag.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", tags);
        } catch (erro: any) {
            next(erro);
        }
    }

    static async obterTagPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const tags = await Tag.findById(req.params.id);
            if (!tags) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", tags);
        } catch (erro: any) {
            next(erro);
        }
    }

    static async atualizarTag(req: Request, res: Response, next: NextFunction) {
        try {
            const tagAtualizada = await Tag.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!tagAtualizada) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", tagAtualizada);
        } catch (erro) {
            next(erro);
        }
    }


    static async excluirTag(req: Request, res: Response, next: NextFunction) {
        try {
            const tag = await Tag.findById(req.params.id);
            if (!tag) return responderAPI(res, 404, "erro_encontrar");

            await Tag.findByIdAndDelete(req.params.id);

            if (tag.usuario)
                await Usuario.findByIdAndUpdate(
                    tag.usuario,
                    { $pull: { tags: tag._id } }
                );

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default TagController;
