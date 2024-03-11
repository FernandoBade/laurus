import CartaoCredito from '../models/cartaoCredito';
import DespesaCartaoCredito from '../models/despesaCartaoCredito';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class DespesaCartaoCreditoController {
    static async criarDespesaCartaoCredito(req: Request, res: Response, next: NextFunction) {
        const cartaoCreditoExiste = await CartaoCredito.findById(req.body.cartaoCredito);
        if (!cartaoCreditoExiste) return responderAPI(res, 404, "erro_encontrar");

        try {
            const novaDespesaCartaoCredito = await new DespesaCartaoCredito(req.body).save();

            await CartaoCredito.findByIdAndUpdate(
                req.body.cartaoCredito,
                { $push: { despesasCartaoCredito: novaDespesaCartaoCredito._id } },
                { new: true }
            );

            responderAPI(res, 201, "sucesso_cadastrar", novaDespesaCartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarDespesasCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const despesasCartaoCredito = await DespesaCartaoCredito.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", despesasCartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterDespesaCartaoCreditoPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCartaoCredito = await DespesaCartaoCredito.findById(req.params.id);
            if (!despesaCartaoCredito) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", despesaCartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }


    static async atualizarDespesaCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCartaoCreditoAtualizada = await DespesaCartaoCredito.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!despesaCartaoCreditoAtualizada) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", despesaCartaoCreditoAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirDespesaCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCartaoCredito = await DespesaCartaoCredito.findById(req.params.id);
            if (!despesaCartaoCredito) return responderAPI(res, 404, "erro_encontrar");

            await DespesaCartaoCredito.findByIdAndDelete(req.params.id);

            if (despesaCartaoCredito.cartaoCredito) {
                await CartaoCredito.findByIdAndUpdate(
                    despesaCartaoCredito.cartaoCredito,
                    { $pull: { despesasCartaoCredito: req.params.id } }
                );
            }

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default DespesaCartaoCreditoController;