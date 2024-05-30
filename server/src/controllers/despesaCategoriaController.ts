import DespesaCategoria from '../models/despesaCategoria';
import Usuario from '../models/usuario';
import { Request, Response, NextFunction } from 'express';
import { responderAPI } from '../utils/commons';

class DespesaCategoriaController {
    static async criarDespesaCategoria(req: Request, res: Response, next: NextFunction) {
        const usuarioExistente = await Usuario.findById(req.body.usuario);
        if (!usuarioExistente) return responderAPI(res, 404, "erro_encontrar");

        try {
            const novaDespesaCategoria = await new DespesaCategoria(req.body).save();

            await Usuario.findByIdAndUpdate(
                req.body.usuario,
                { $push: { despesaCategorias: novaDespesaCategoria._id } },
                { new: true }
            );

            responderAPI(res, 201, "sucesso_cadastrar", novaDespesaCategoria);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarDespesaCategorias(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCategorias = await DespesaCategoria.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", despesaCategorias);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterDespesaCategoriaPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCategoria = await DespesaCategoria.findById(req.params.id);
            if (!despesaCategoria) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", despesaCategoria);
        } catch (erro) {
            next(erro);
        }
    }


    static async atualizarDespesaCategoria(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCategoriaAtualizada = await DespesaCategoria.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!despesaCategoriaAtualizada) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", despesaCategoriaAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirDespesaCategoria(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCategoria = await DespesaCategoria.findById(req.params.id);
            if (!despesaCategoria) return responderAPI(res, 404, "erro_encontrar");

            await DespesaCategoria.findByIdAndDelete(req.params.id);

            if (despesaCategoria.usuario) {
                await Usuario.findByIdAndUpdate(
                    despesaCategoria.usuario,
                    { $pull: { despesaCategorias: req.params.id } }
                );
            }

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default DespesaCategoriaController;
