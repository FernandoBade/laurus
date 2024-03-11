import ReceitaCategoria from '../models/receitaCategoria';
import ReceitaSubcategoria from '../models/receitaSubcategoria';
import { responderAPI } from '../utils/commons';
import { NextFunction, Request, Response } from 'express';

class ReceitaSubcategoriaController {
    static async criarReceitaSubcategoria(req: Request, res: Response, next: NextFunction) {
        const receitaCategoriaExiste = await ReceitaCategoria.findById(req.body.categoria);
        if (!receitaCategoriaExiste) return responderAPI(res, 404, 'erro_encontrar');

        try {
            const novaReceitaSubcategoria = await new ReceitaSubcategoria(req.body).save();

            await ReceitaCategoria.findByIdAndUpdate(
                req.body.categoria,
                { $push: { receitaSubcategorias: novaReceitaSubcategoria._id } },
                { new: true }
            );

            responderAPI(res, 201, 'sucesso_cadastrar', novaReceitaSubcategoria);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarReceitaSubcategorias(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaaSubcategorias = await ReceitaSubcategoria.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", receitaaSubcategorias);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterReceitaSubcategoriaPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaaSubcategoria = await ReceitaSubcategoria.findById(req.params.id);
            if (!receitaaSubcategoria) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", receitaaSubcategoria);
        } catch (erro) {
            next(erro);
        }
    }

    static async atualizarReceitaSubcategoria(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaSubcategoriaAtualizada = await ReceitaSubcategoria.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!receitaSubcategoriaAtualizada) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", receitaSubcategoriaAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirReceitaSubcategoria(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaSubcategoria = await ReceitaSubcategoria.findById(req.params.id);
            if (!receitaSubcategoria) return responderAPI(res, 404, "erro_encontrar");

            await ReceitaSubcategoria.findByIdAndDelete(req.params.id);

            if (receitaSubcategoria.categoria) {
                await ReceitaCategoria.findByIdAndUpdate(
                    receitaSubcategoria.categoria,
                    { $pull: { receitaaSubcategorias: req.params.id } }
                );
            }

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default ReceitaSubcategoriaController;
