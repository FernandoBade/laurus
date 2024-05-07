import Token from '../models/token';
import Usuario from '../models/usuario';
import { EnumTipoToken } from '../utils/assets/enums';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class TokenController {
    static async criarToken(req: Request, res: Response, next: NextFunction) {
        const usuarioExistente = await Usuario.findById(req.body.usuario);
        if (!usuarioExistente) return responderAPI(res, 404, "erro_encontrar");

        try {
            const novoToken = new Token({
                ...req.body,
                expiraEm:
                    req.body.tipo === EnumTipoToken.ACESSO ?
                        12 * 3600 * 1000 :
                        7 * 24 * 3600 * 1000
            });

            await Usuario.findByIdAndUpdate(
                req.body.usuario,
                { $push: { tokens: novoToken._id } },
                {
                    new: true,
                    timestamps: { updatedAt: false }
                }
            );

            responderAPI(res, 201, "sucesso_cadastrar", novoToken);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarTokens(req: Request, res: Response, next: NextFunction) {
        try {
            const tokens = await Token.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", tokens);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterTokenPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const token = await Token.findById(req.params.id).populate('usuario');
            if (!token) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", token);
        } catch (erro) {
            next(erro);
        }
    }

    static async atualizarToken(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenAtualizado = await Token.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!tokenAtualizado) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", tokenAtualizado);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirToken(req: Request, res: Response, next: NextFunction) {
        try {
            const token = await Token.findById(req.params.id);
            if (!token) return responderAPI(res, 404, "erro_encontrar");

            await Token.findByIdAndDelete(req.params.id);

            if (token.usuario)
                await Usuario.findByIdAndUpdate(
                    token.usuario,
                    { $pull: { tokens: token._id } }
                );

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default TokenController;