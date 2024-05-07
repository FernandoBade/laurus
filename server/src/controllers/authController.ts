import logger, { resource, responderAPI } from '../utils/commons';
import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Token from '../models/token';
import { EnumTipoToken } from '../utils/assets/enums';

dotenv.config();

class AuthController {
    static async login(req: Request, res: Response) {
        const jwtSecreto = process.env.JWT_SECRETO;
        const jwtSecretoRenovacao = process.env.JWT_SECRETO_RENOVACAO;
        if (!jwtSecreto || !jwtSecretoRenovacao) throw new Error(resource('erro_variavelAmbiente'));

        try {
            const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';
            const { email, senha } = req.body;

            const usuario = await Usuario.findOne({ email });

            if (!usuario) {
                logger.warning(resource('log_tentativaLoginEmailInexistente', { email }));
                return responderAPI(res, 401, 'erro_encontrarUsuario', { idioma: idiomaRequisicao });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                logger.warning(resource('log_tentativaLoginSenhaIncorreta', { email: usuario.email }));
                return responderAPI(res, 401, 'erro_senhaIncorreta', { idioma: usuario.idioma });
            }

            const tokenAcesso = jwt.sign({ id: usuario._id }, jwtSecreto, { expiresIn: '24h' });
            const tokenRenovacao = jwt.sign({ id: usuario._id }, jwtSecretoRenovacao, { expiresIn: '30d' });

            // Armazene os tokens no banco de dados
            await new Token({
                usuario: usuario._id,
                valor: tokenAcesso,
                tipo: EnumTipoToken.ACESSO,
                expiraEm: new Date(Date.now() + 3 * 24 * 3600 * 1000)
            }).save();

            await new Token({
                usuario: usuario._id,
                valor: tokenRenovacao,
                tipo: EnumTipoToken.RENOVACAO,
                expiraEm: new Date(Date.now() + 30 * 24 * 3600 * 1000)
            }).save();

            logger.notice(resource('log_sucessoLogin', { id: usuario._id }));
            responderAPI(res, 200, 'sucesso_login', { tokenAcesso }, { usuario });
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async logout(req: Request, res: Response) {

        try {
            const usuario = await Usuario.findByIdAndUpdate(
                req.params.id,
                { $unset: { tokenAtivo: "" } },
                { new: true }
            ).exec();

            if (!usuario) {
                return responderAPI(res, 404, 'erro_usuarioNaoEncontrado');
            }

            logger.notice(resource('log_sucessoLogout', { id: req.params.id }));
            responderAPI(res, 200, 'sucesso_logout', {}, { usuario: usuario });
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }
}

export default AuthController;