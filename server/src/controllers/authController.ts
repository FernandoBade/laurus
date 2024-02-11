import { IUsuario } from '../interfaces/IUsuario';
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
            throw new Error(resource('erro.variavelAmbiente'));
        }

        try {
            const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';
            const { email, senha } = req.body;

            const usuario = await Usuario.findOne({ email }) as IUsuario | null;

            if (!usuario) {
                logger.warning(resource('log.tentativaLoginEmailInexistente', { email }));
                return responderAPI(res, 401, 'erro.encontrarUsuario', { idioma: idiomaRequisicao });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                logger.warning(resource('log.tentativaLoginSenhaIncorreta', { usuario: usuario }));
                return responderAPI(res, 401, 'erro.senhaIncorreta', { idioma: usuario.idioma });
            }

            const token = jwt.sign({ id: usuario._id }, jwtSecreto, { expiresIn: '1h' });
            const tokenAtivo = jwt.sign({ id: usuario._id }, jwtSecretoRenovacao, { expiresIn: '7d' });

            await Usuario.findByIdAndUpdate(usuario._id, { tokenAtivo: tokenAtivo });

            logger.info(resource('log.sucessoLogin', { usuario: usuario }));
            responderAPI(res, 200, 'sucesso.login', { usuario: usuario }, { token: token, tokenAtivo: tokenAtivo });
        } catch (erro: any) {
            logger.error(resource('log.erroLogin', {
                email: usuario && 'email' in usuario ? usuario.email : "Desconhecido",
                erro: erro.message || erro.toString()
            }));

            responderAPI(res, 500, 'erro.login', {}, erro);
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
        const { tokenAtivo } = req.body;

        try {
            const usuario = await Usuario.findOneAndUpdate({ tokenAtivo }, { $unset: { tokenAtivo: "" } });
            logger.notice(resource('log.sucessoLogout', { usuario: usuario }));

            responderAPI(res, 200, 'sucesso.logout', { usuario });
        } catch (erro: any) {
            logger.error(resource('log.erroLogout', {
                email: usuario && 'email' in usuario ? usuario.email : "Desconhecido",
                erro: erro.message || erro.toString()
            }));
            responderAPI(res, 500, 'erro.logout', {}, erro);
        }
    }

    /**
    * Renova o Access Token de um usuário quando o atual expira.
    * Isso é feito verificando a validade do Refresh Token fornecido.
    * Se o Refresh Token for válido e estiver associado a um usuário, novos Access e Refresh Tokens são gerados.
    *
    * @param {Request} req - O objeto de requisição do Express, contendo o Refresh Token atual no corpo.
    * @param {Response} res - O objeto de resposta do Express, usado para enviar a resposta ao cliente.
    *
    * Em caso de sucesso, retorna os novos tokens.
    * Se o Refresh Token for inválido, expirado ou não estiver associado a um usuário, retorna um erro.
    */
    static async renovarToken(req: Request, res: Response) {
        const { tokenAtivo } = req.body;

        if (!tokenAtivo) {
            return responderAPI(res, 401, 'erro.tokenRenovacaoInvalido');
        }

        const jwtSecreto = process.env.JWT_SECRETO;
        const jwtSecretoRenovacao = process.env.JWT_SECRETO_RENOVACAO;

        if (!jwtSecreto || !jwtSecretoRenovacao) {
            throw new Error(resource('erro.variavelAmbiente'));
        }

        try {
            const decoded = jwt.verify(tokenAtivo, jwtSecretoRenovacao);

            if (typeof decoded === 'object' && 'id' in decoded) {
                const usuario = await Usuario.findOne({ _id: decoded.id, tokenAtivo: tokenAtivo });

                if (!usuario) {
                    return responderAPI(res, 401, 'erro.tokenRenovacaoInvalido');
                }

                const novoToken = jwt.sign({ id: usuario._id }, jwtSecreto, { expiresIn: '1h' });
                const novoRenovaToken = jwt.sign({ id: usuario._id }, jwtSecretoRenovacao, { expiresIn: '7d' });

                await Usuario.findByIdAndUpdate(usuario._id, { tokenAtivo: novoRenovaToken });
                responderAPI(res, 200, 'sucesso.tokenRenovado', { token: novoToken, renovaToken: novoRenovaToken });
            } else {
                return responderAPI(res, 401, 'erro.tokenRenovacaoInvalido');
            }
        } catch (erro: any) {
            logger.error(resource('log.erroRenovarToken', {
                email: usuario && 'email' in usuario ? usuario.email : "Desconhecido",
                erro: erro.message || erro.toString()
            }));
            responderAPI(res, 401, 'erro.tokenRenovacaoInvalido');
        }
    }
}

export default AuthController;