import { Request, Response } from 'express';
import Usuario from '../models/usuario';

class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response) {
        try {
            const { nomeCompleto, email, senha, dataNascimento, telefone } = req.body;

            const usuarioExistente = await Usuario.findOne({ email });
            if (usuarioExistente) {
                return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
            }

            const novoUsuario = new Usuario({ nomeCompleto, email, senha, dataNascimento, telefone });
            await novoUsuario.save();

            res.status(201).json({ mensagem: 'Usuário registrado com sucesso.' });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao registrar usuário.', erro: error });
        }
    }
}

export default UsuarioController;
