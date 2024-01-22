import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Usuario from '../models/usuario';
import dotenv from 'dotenv';

dotenv.config();
const jwtSecret = process.env.JWT_SECRET

class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, senha } = req.body;

            const usuario = await Usuario.findOne({ email });
            if (!usuario) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ error: 'Senha incorreta' });
            }

            const token = jwt.sign({ userId: usuario._id }, process.env.JWT_SECRET || 'defaultSecret', {
                expiresIn: '2h',
            });

            res.cookie('token', token, { httpOnly: true });

            res.json({ token });
        } catch (error: any) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({ error: 'Erro interno no servidor' });
        }
    }

    static logout(req: Request, res: Response) {
        res.clearCookie('token');
        res.json({ message: 'Logout realizado com sucesso.' });
    }
}

export default AuthController;
