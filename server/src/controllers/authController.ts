import { Request, Response } from 'express';
import logger, { loggerResource, resource } from '../utils/commons'; // Ajuste de acordo com suas importações
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Usuario from '../models/usuario';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';

            const { email, senha } = req.body;
            const usuario = await Usuario.findOne({ email });

            if (!usuario) {
                loggerResource(res, 401, logger, 'usuarioNaoEncontrado', { lang: idiomaRequisicao });
                return;
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                loggerResource(res, 401, logger, 'senhaIncorreta', { lang: usuario.idioma });
                return;
            }

            const token = jwt.sign({ userId: usuario._id }, jwtSecret || 'defaultSecret', { expiresIn: '2h' });
            res.cookie('token', token, { httpOnly: true });
            loggerResource(res, 200, logger, 'loginSucesso', { usuario: usuario });
        } catch (error) {
            loggerResource(res, 500, logger, 'erroAoFazerLogin', { lang: 'pt-BR', error: error });
        }
    }

    static logout(res: Response) {
        res.clearCookie('token');
        loggerResource(res, 200, logger, 'logoutSucesso', { lang: 'pt-BR' });
    }
}

export default AuthController;
