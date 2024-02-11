import { IUsuario } from '../interfaces/IUsuario';
import { resource, responderAPI } from '../utils/commons';
import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

class AuthController {
    /**
    * Método para autenticar um usuário. Valida as credenciais fornecidas e, se estiverem corretas,
    * gera e retorna um token JWT.
    * @param {Request} req - O objeto de requisição do Express.
    * @param {Response} res - O objeto de resposta do Express.
    */
    static async login(req: Request, res: Response) {

        const jwtSecreto = process.env.JWT_SECRETO;
        if (!jwtSecreto) {
            throw new Error(resource('erro.variavelAmbiente'));
        }

        try {
            const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';
            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ email }) as IUsuario | null;

            if (!usuario) {
                return responderAPI(res, 401, 'erro.encontrarUsuario', { idioma: idiomaRequisicao });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return responderAPI(res, 401, 'erro.senhaIncorreta', { idioma: usuario.idioma });
            }
            const token = jwt.sign({ id: usuario._id }, jwtSecreto, { expiresIn: '1m' });
            responderAPI(res, 200, 'sucesso.login', { usuario: usuario }, token);
        } catch (erro) {
            responderAPI(res, 500, 'erro.login', {}, erro);
        }
    }

    /**
    * Método para deslogar o usuário, limpando o cookie com o token JWT.
    * @param {Response} res - O objeto de resposta do Express.
    */
    static logout(req: Request, res: Response) {
        req.session.destroy((erro) => {
            if (erro) {
                console.error(erro);
            }
            responderAPI(res, 200, 'sucesso.logout', {});
        });
    }
}

export default AuthController;
