import CartaoCredito from '../models/cartaoCredito';
import ReceitaCartaoCredito from '../models/receitaCartaoCredito';
import ReceitaCategoria from '../models/receitaCategoria';
import ReceitaSubcategoria from '../models/receitaSubcategoria';
import { responderAPI } from '../utils/commons';
import { NextFunction, Request, Response } from 'express';

class ReceitaCartaoCreditoController {
    static async criarReceitaCartaoCredito(req: Request, res: Response, next: NextFunction) {
        const cartaoCreditoExiste = await CartaoCredito.findById(req.body.cartaoCredito);
        if (!cartaoCreditoExiste) return responderAPI(res, 404, "erro_encontrar");

        const receitaCategoriaExiste = await ReceitaCategoria.findById(req.body.categoria);
        if (!receitaCategoriaExiste) return responderAPI(res, 404, "erro_encontrar");

        const receitaSubcategoriaExiste = await ReceitaSubcategoria.findById(req.body.subcategoria);
        if(!receitaSubcategoriaExiste) return responderAPI(res, 404, "erro_encontrar");

        try {
            const novaReceitaCartaoCredito = await new ReceitaCartaoCredito(req.body).save();

            await CartaoCredito.findByIdAndUpdate(
                req.body.cartaoCredito,
                { $push: { receitasCartaoCredito: novaReceitaCartaoCredito._id } },
                { new: true }
            );

            responderAPI(res, 201, "sucesso_cadastrar", novaReceitaCartaoCredito);
        } catch (error) {
            next(error);
        }
    }

    static async listarReceitasCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const receitasCartaoCredito = await ReceitaCartaoCredito.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", receitasCartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterReceitaCartaoCreditoPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaCartaoCredito = await ReceitaCartaoCredito.findById(req.params.id);
            if (!receitaCartaoCredito) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", receitaCartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }


    static async atualizarReceitaCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaCartaoCreditoAtualizada = await ReceitaCartaoCredito.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!receitaCartaoCreditoAtualizada) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", receitaCartaoCreditoAtualizada);
        } catch (erro) {
            next(erro);
        }
    }


    static async excluirReceitaCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const receitaCartaoCredito = await ReceitaCartaoCredito.findById(req.params.id);
            if (!receitaCartaoCredito) return responderAPI(res, 404, "erro_encontrar");

            await ReceitaCartaoCredito.findByIdAndDelete(req.params.id);

            if (receitaCartaoCredito.cartaoCredito) {
                await CartaoCredito.findByIdAndUpdate(
                    receitaCartaoCredito.cartaoCredito,
                    { $pull: { receitasCartaoCredito: req.params.id } }
                );
            }

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default ReceitaCartaoCreditoController;
