import { NextFunction, Request, Response } from 'express';
import ReceitaConta from '../models/receitaConta';
import Conta from '../models/conta';
import mongoose from 'mongoose';
import { receitaContaUpdateSchema } from '../utils/assets/schemasJoi';
import { responderAPI } from '../utils/commons';
import ReceitaCategoria from '../models/receitaCategoria';
import ReceitaSubcategoria from '../models/receitaSubcategoria';

class ReceitaContaController {
    static async criarReceitaConta(req: Request, res: Response, next: NextFunction) {
        const contaExiste = await Conta.findById(req.body.conta);
        if (!contaExiste) return responderAPI(res, 404, "erro_encontrar");

        const receitaCategoriaExiste = await ReceitaCategoria.findById(req.body.categoria);
        if (!receitaCategoriaExiste) return responderAPI(res, 404, "erro_encontrar");

        const receitaSubcategoriaExiste = await ReceitaSubcategoria.findById(req.body.subcategoria);
        if(!receitaSubcategoriaExiste) return responderAPI(res, 404, "erro_encontrar");

        try {
            const novaReceitaConta = await new ReceitaConta(req.body).save();

            await Conta.findByIdAndUpdate(
                req.body.conta,
                { $push: { receitasConta: novaReceitaConta._id } },
                { new: true }
            );

            responderAPI(res, 201, "sucesso_cadastrar", novaReceitaConta);
        } catch (error) {
            next(error);
        }
    }

    static async listarReceitasConta(req: Request, res: Response, next: NextFunction) {
        try {
            const receitasConta = await ReceitaConta.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", receitasConta);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterReceitaContaPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaConta = await ReceitaConta.findById(req.params.id);
            if (!receitaConta) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", receitaConta);
        } catch (erro) {
            next(erro);
        }
    }


    static async atualizarReceitaConta(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaContaAtualizada = await ReceitaConta.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!receitaContaAtualizada) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_atualizar', receitaContaAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirReceitaConta(req: Request, res: Response, next: NextFunction) {

        try {
            const receitaConta = await ReceitaConta.findById(req.params.id);
            if (!receitaConta) return responderAPI(res, 404, "erro_encontrar");

            await ReceitaConta.findByIdAndDelete(req.params.id);

            if (receitaConta.conta) {
                await Conta.findByIdAndUpdate(
                    receitaConta.conta,
                    { $pull: { receitasConta: req.params.id } }
                );
            }

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default ReceitaContaController;
