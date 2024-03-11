import Usuario from '../models/usuario';
import CartaoCredito from '../models/cartaoCredito';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class CartaoCreditoController {
    static async criarCartaoCredito(req: Request, res: Response, next: NextFunction) {
        const usuarioExistente = await Usuario.findById(req.body.usuario);
        if (!usuarioExistente) return responderAPI(res, 404, "erro_encontrar");

        try {
            const novoCartaoCredito = await new CartaoCredito(req.body).save();

            await Usuario.findByIdAndUpdate(
                req.body.usuario,
                { $push: { cartoesDeCredito: novoCartaoCredito._id } },
                { new: true }
            );

            responderAPI(res, 201, "sucesso_cadastrar", novoCartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarCartoesCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const cartoesCredito = await CartaoCredito.find(req.query)

            responderAPI(res, 200, "sucesso_buscar", cartoesCredito);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterCartaoCreditoPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const cartaoCredito = await CartaoCredito.findById(req.params.id)
            if (!cartaoCredito) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", cartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }

    static async atualizarCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const cartaoCreditoAtualizado = await CartaoCredito.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!cartaoCreditoAtualizado) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", cartaoCreditoAtualizado);
        } catch (erro: any) {
            next(erro);
        }
    }

    static async excluirCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const cartaoCredito = await CartaoCredito.findById(req.params.id);
            if (!cartaoCredito) return responderAPI(res, 404, "erro_encontrar");

            await CartaoCredito.findByIdAndDelete(req.params.id);

            if (cartaoCredito.usuario)
                await Usuario.findByIdAndUpdate(
                    cartaoCredito.usuario,
                    { $pull: { cartoesDeCredito: cartaoCredito._id } }
                );

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default CartaoCreditoController;
