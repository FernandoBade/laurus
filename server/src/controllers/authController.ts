import logger, { resource, responderAPI } from '../utils/commons';
import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import usuario from '../models/usuario';

dotenv.config();

class AuthController {
    /**
    * Autentica um usuário com base em suas credenciais (e-mail e senha).
    * Se as credenciais forem válidas, dois tokens JWT são gerados:
    * - Um Access Token com curta duração para autenticação imediata.
    * - Um Refresh Token com longa duração para renovação do Access Token.
    *
    * @param {Request} req - O objeto de requisição do Express, contendo o e-mail e a senha no corpo.
    * @param {Response} res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
    *
    * Em caso de sucesso, retorna os tokens junto com os dados do usuário.
    * Em caso de falha (credenciais inválidas, variáveis de ambiente ausentes, etc.), retorna um erro apropriado.
    */
    static async login(req: Request, res: Response) {
        const jwtSecreto = process.env.JWT_SECRETO;
        const jwtSecretoRenovacao = process.env.JWT_SECRETO_RENOVACAO;
        if (!jwtSecreto || !jwtSecretoRenovacao) {
            throw new Error(resource('erro_variavelAmbiente'));
        }

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

            const token = jwt.sign({ id: usuario._id }, jwtSecreto, { expiresIn: '12h' });
            const tokenAtivo = jwt.sign({ id: usuario._id }, jwtSecretoRenovacao, { expiresIn: '7d' });

            await Usuario.findByIdAndUpdate(usuario._id, { tokenAtivo: tokenAtivo });

            logger.notice(resource('log_sucessoLogin', { id: usuario._id }));
            responderAPI(res, 200, 'sucesso_login', { token: token }, { usuario: usuario });
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    /**
    * Desloga um usuário invalidando seu Refresh Token atual.
    * Isso é feito removendo ou desassociando o Refresh Token do usuário no banco de dados.
    *
    * @param {Request} req - O objeto de requisição do Express, contendo o Refresh Token no corpo.
    * @param {Response} res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
    *
    * Em caso de sucesso, retorna uma mensagem indicando que o logout foi bem-sucedido.
    * Em caso de erro na operação de banco de dados, retorna um erro.
    */
    static async logout(req: Request, res: Response) {

        try {
            const usuario = await Usuario.findByIdAndUpdate(req.params.id, {
                $unset: { tokenAtivo: "" },
                $set: { ultimoAcesso: new Date() }
            }, {
                new: true
            }).exec();

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