import { Request, Response } from 'express';
import { responderAPI } from '../utils/commons';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Usuario from '../models/usuario';
import { IUsuario } from '../interfaces/IUsuario';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET || 'defaultSecret';

class AuthController {
    /**
     * Método para autenticar um usuário. Valida as credenciais fornecidas e, se estiverem corretas,
     * gera e retorna um token JWT.
     * @param {Request} req - O objeto de requisição do Express.
     * @param {Response} res - O objeto de resposta do Express.
     */
    static async login(req: Request, res: Response) {
        try {
            const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';
            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ email }) as IUsuario | null;

            if (!usuario) {
                return responderAPI(res, 401, 'erro.usuarioNaoEncontrado', { idioma: idiomaRequisicao });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return responderAPI(res, 401, 'erro.senhaIncorreta', { idioma: usuario.idioma });
            }

            const token = jwt.sign({ userId: usuario._id }, jwtSecret, { expiresIn: '2h' });
            res.cookie('token', token, { httpOnly: true });
            responderAPI(res, 200, 'sucesso.loginSucesso', { usuario: usuario.toObject(), idioma: usuario.idioma });
        } catch (error) {
            responderAPI(res, 500, 'erro.erroAoFazerLogin', { idioma: 'pt-BR', erro: error });
        }
    }

    /**
     * Método para deslogar o usuário, limpando o cookie com o token JWT.
     * @param {Response} res - O objeto de resposta do Express.
     */
    static logout(res: Response) {
        res.clearCookie('token');
        responderAPI(res, 200, 'sucesso.logoutSucesso', { idioma: 'pt-BR' });
    }
}

export default AuthController;
