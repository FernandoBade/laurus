import { Request, Response } from 'express';
import { traduzir, logError, logInfo } from '../utils/commons';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Usuario from '../models/usuario';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

class AuthController {
    /**
     * Efetua o login do usuário.
     *
     * @param req - O objeto de requisição HTTP contendo as informações do usuário.
     * @param res - O objeto de resposta HTTP para enviar a resposta ao cliente.
     */
    static async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ email });
            const idioma = usuario ? usuario.idioma : 'pt-BR'; // Define o idioma padrão caso não encontre o usuário

            if (!usuario) {
                logInfo(traduzir('usuarioNaoEncontrado', idioma));
                return res.status(401).json({ error: traduzir('usuarioNaoEncontrado', idioma) });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                logInfo(traduzir('senhaIncorreta', idioma));
                return res.status(401).json({ error: traduzir('senhaIncorreta', idioma) });
            }

            const token = jwt.sign({ userId: usuario._id }, jwtSecret || 'defaultSecret', { expiresIn: '2h' });
            res.cookie('token', token, { httpOnly: true });
            res.json({ message: traduzir('loginSuccess', idioma) });
        } catch (error) {
            logError(traduzir('erroAoFazerLogin', 'pt-BR') + `: ${error}`);
            res.status(500).json({ error: traduzir('erroInternoNoServidor', 'pt-BR') });
        }
    }

    /**
     * Efetua o logout do usuário, removendo o token de autenticação.
     *
     * @param req - O objeto de requisição HTTP contendo as informações do usuário.
     * @param res - O objeto de resposta HTTP para enviar a resposta ao cliente.
     */
    static logout(req: Request, res: Response) {
        res.clearCookie('token');
        res.json({ message: traduzir('logoutSucesso', 'pt-BR') });
    }
}

export default AuthController;
