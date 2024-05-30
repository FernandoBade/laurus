import Conta from '../models/conta';
import DespesaCategoria from '../models/despesaCategoria';
import DespesaConta from '../models/despesaConta';
import DespesaSubcategoria from '../models/despesaSubcategoria';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class DespesaContaController {
    static async criarDespesaConta(req: Request, res: Response, next: NextFunction) {
        const contaExiste = await Conta.findById(req.body.conta);
        if (!contaExiste) return responderAPI(res, 404, "erro_encontrar");

        const despesaCategoriaExiste = await DespesaCategoria.findById(req.body.categoria);
        if (!despesaCategoriaExiste) return responderAPI(res, 404, "erro_encontrar");

        const despesaSubcategoriaExiste = await DespesaSubcategoria.findById(req.body.subcategoria);
        if(!despesaSubcategoriaExiste) return responderAPI(res, 404, "erro_encontrar");

        try {
            const novaDespesaConta = await new DespesaConta(req.body).save();

            await Conta.findByIdAndUpdate(
                req.body.conta,
                { $push: { despesasConta: novaDespesaConta._id } },
                { new: true }
            );

            responderAPI(res, 201, "sucesso_cadastrar", novaDespesaConta);
        } catch (erro) {
            next(erro);
        }
    }


    static async listarDespesasConta(req: Request, res: Response, next: NextFunction) {
        try {
            const despesasConta = await DespesaConta.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", despesasConta);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterDespesaContaPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaConta = await DespesaConta.findById(req.params.id);
            if (!despesaConta) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", despesaConta);
        } catch (erro) {
            next(erro);
        }
    }


    static async atualizarDespesaConta(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaContaAtualizada = await DespesaConta.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!despesaContaAtualizada) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", despesaContaAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirDespesaConta(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaConta = await DespesaConta.findById(req.params.id);
            if (!despesaConta) return responderAPI(res, 404, "erro_encontrar");

            await DespesaConta.findByIdAndDelete(req.params.id);

            if (despesaConta.conta) {
                await Conta.findByIdAndUpdate(
                    despesaConta.conta,
                    { $pull: { despesasConta: req.params.id } }
                );
            }

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default DespesaContaController;
