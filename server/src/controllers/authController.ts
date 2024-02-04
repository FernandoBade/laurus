import { Request, Response } from 'express';
import { resource, logError, logInfo } from '../utils/commons';
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

            if (!usuario) {
                logInfo(resource('usuarioNaoEncontrado'));
                return res.status(401).json({ error: resource('usuarioNaoEncontrado') });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                logInfo(resource('senhaIncorreta'));
                return res.status(401).json({ error: resource('senhaIncorreta') });
            }

            const token = jwt.sign({ userId: usuario._id }, jwtSecret || 'defaultSecret', { expiresIn: '2h' });
            res.cookie('token', token, { httpOnly: true });
            res.json({ message: resource('loginSucesso', { usuario: usuario }) });
        } catch (error) {
            logError(resource('erroAoFazerLogin') + `: ${error}`);
            res.status(500).json({ error: resource('erroInternoNoServidor') });
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
        res.json({ message: resource('logoutSucesso') });
    }
}

export default AuthController;