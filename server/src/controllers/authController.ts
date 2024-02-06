import { Request, Response } from 'express';
import { resource, logError, logInfo } from '../utils/commons';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Usuario from '../models/usuario';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

class AuthController {
    static async login(req: Request, res: Response) {
        try {
            // Detectar o idioma a partir do cabeçalho 'Accept-Language' ou usar 'pt-BR' como padrão
            console.log(req.headers)
            console.log(req.headers['accept-language'])
            const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';

            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ email });
            console.log(usuario)
            if (!usuario) {
                logInfo(resource('usuarioNaoEncontrado', { lang: idiomaRequisicao }));
                return res.status(401).json({ error: resource('usuarioNaoEncontrado', { lang: idiomaRequisicao }) });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                logInfo(resource('senhaIncorreta', { lang: usuario.idioma })); // Usar o idioma do usuário após autenticação
                return res.status(401).json({ error: resource('senhaIncorreta', { lang: usuario.idioma }) });
            }

            const token = jwt.sign({ userId: usuario._id }, jwtSecret || 'defaultSecret', { expiresIn: '2h' });
            res.cookie('token', token, { httpOnly: true });
            res.json({ message: resource('loginSucesso', { lang: usuario.idioma, usuario: usuario }) });
        } catch (error) {
            logError(resource('erroAoFazerLogin', { lang: 'pt-BR' }) + `: ${error}`); // Usar 'pt-BR' como idioma padrão para erros do servidor
            res.status(500).json({ error: resource('erroInternoNoServidor', { lang: 'pt-BR' }) });
        }
    }

    static logout(req: Request, res: Response) {
        res.clearCookie('token');
        res.json({ message: resource('logoutSucesso', { lang: 'pt-BR' }) }); // Considerar 'pt-BR' como idioma padrão para logout
    }
}

export default AuthController;
