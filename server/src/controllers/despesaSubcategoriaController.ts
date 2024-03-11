import DespesaSubcategoria from '../models/despesaSubcategoria';
import DespesaCategoria from '../models/despesaCategoria';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class DespesaSubcategoriaController {
    static async criarDespesaSubcategoria(req: Request, res: Response, next: NextFunction) {
        const despesaCategoriaExiste = await DespesaCategoria.findById(req.body.categoria);
        if (!despesaCategoriaExiste) return responderAPI(res, 404, "erro_encontrar");

        try {
            const novaDespesaSubcategoria = await new DespesaSubcategoria(req.body).save();

            await DespesaCategoria.findByIdAndUpdate(
                req.body.categoria,
                { $push: { despesaSubcategorias: novaDespesaSubcategoria._id } },
                { new: true }
            );

            responderAPI(res, 201, "sucesso_cadastrar", novaDespesaSubcategoria);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarDespesaSubcategorias(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaSubcategorias = await DespesaSubcategoria.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", despesaSubcategorias);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterDespesaSubcategoriaPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaSubcategoria = await DespesaSubcategoria.findById(req.params.id);
            if (!despesaSubcategoria) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", despesaSubcategoria);
        } catch (erro) {
            next(erro);
        }
    }

    static async atualizarDespesaSubcategoria(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaSubcategoriaAtualizada = await DespesaSubcategoria.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!despesaSubcategoriaAtualizada) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", despesaSubcategoriaAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirDespesaSubcategoria(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaSubcategoria = await DespesaSubcategoria.findById(req.params.id);
            if (!despesaSubcategoria) return responderAPI(res, 404, "erro_encontrar");

            await DespesaSubcategoria.findByIdAndDelete(req.params.id);

            if (despesaSubcategoria.categoria) {
                await DespesaCategoria.findByIdAndUpdate(
                    despesaSubcategoria.categoria,
                    { $pull: { despesaSubcategorias: req.params.id } }
                );
            }

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default DespesaSubcategoriaController;
