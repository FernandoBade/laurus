import Usuario from '../models/usuario';
import ReceitaCategoria from '../models/receitaCategoria';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class ReceitaCategoriaController {
    static async criarReceitaCategoria(req: Request, res: Response, next: NextFunction) {
        const usuarioExistente = await Usuario.findById(req.body.usuario);
        if (!usuarioExistente) return responderAPI(res, 404, 'erro_encontrar');

        try {
            const novaReceitaCategoria = await new ReceitaCategoria(req.body).save();

            await Usuario.findByIdAndUpdate(
                req.body.usuario,
                { $push: { receitaCategorias: novaReceitaCategoria._id } },
                { new: true }
            );

            responderAPI(res, 201, 'sucesso_cadastrar', novaReceitaCategoria);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarReceitaCategorias(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaCategorias = await ReceitaCategoria.find(req.query);

            responderAPI(res, 200, 'sucesso_buscar', receitaCategorias);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterReceitaCategoriaPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaCategoria = await ReceitaCategoria.findById(req.params.id);
            if (!receitaCategoria) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_buscar', receitaCategoria);
        } catch (erro) {
            next(erro);
        }
    }


    static async atualizarReceitaCategoria(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaCategoriaAtualizada = await ReceitaCategoria.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!receitaCategoriaAtualizada) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_atualizar', receitaCategoriaAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirReceitaCategoria(req: Request, res: Response, next: NextFunction) {

        try {
            const receitaCategoria = await ReceitaCategoria.findById(req.params.id);
            if (!receitaCategoria) return responderAPI(res, 404, "erro_encontrar");

            await ReceitaCategoria.findByIdAndDelete(req.params.id);

            if (receitaCategoria.usuario) {
                await Usuario.findByIdAndUpdate(
                    receitaCategoria.usuario,
                    { $pull: { receitaCategorias: req.params.id } }
                );
            }

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default ReceitaCategoriaController;
