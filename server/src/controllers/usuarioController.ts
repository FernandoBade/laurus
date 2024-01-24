import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import Joi from 'joi';
import bcrypt from 'bcrypt';

const usuarioSchema = Joi.object({
    nome: Joi.string().required(),
    sobrenome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha: Joi.string().required(),
    dataNascimento: Joi.date().iso().required(),
    telefone: Joi.string().optional()
});

const usuarioUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    sobrenome: Joi.string().optional(),
    email: Joi.string().email().optional(),
    senha: Joi.string().optional(),
    dataNascimento: Joi.date().iso().optional(),
    telefone: Joi.string().optional()
}).or('nome', 'sobrenome', 'email', 'senha', 'dataNascimento', 'telefone');

class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response) {
        const { error, value } = usuarioSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(detail => detail.message) });
        }

        try {
            const { nome, sobrenome, email, senha, dataNascimento, telefone } = value;

            const usuarioExistente = await Usuario.findOne({ email });
            if (usuarioExistente) {
                return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
            }

            const novoUsuario = new Usuario({ nome, sobrenome, email, senha, dataNascimento, telefone });
            await novoUsuario.save();

            res.status(201).json({ mensagem: 'Usuário registrado com sucesso.' });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao registrar usuário.', erro: error });
        }
    }

    static async listarUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await Usuario.find();
            res.json(usuarios);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar os usuários' });
        }
    }

    static async obterUsuarioPorId(req: Request, res: Response) {
        try {
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }
            res.json(usuario);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar usuário.', erro: error });
        }
    }

    static async obterUsuarioPorNome(req: Request, res: Response) {
        try {
            const regex = new RegExp(req.params.nome, 'i');
            const usuarios = await Usuario.find({
                $or: [
                    { nome: regex },
                    { sobrenome: regex }
                ]
            }).sort({ nome: 1 });
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar usuários.', erro: error });
        }
    }

    static async obterUsuarioPorEmail(req: Request, res: Response) {
        try {
            const regex = new RegExp(req.params.email, 'i');
            const usuarios = await Usuario.find({ email: regex })
                        .sort({ email: 1 });
            if (!usuarios.length) {
                return res.status(404).json({ mensagem: 'Usuários não encontrados.' });
            }
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao buscar usuários.', erro: error });
        }
    }

    static async atualizarUsuario(req: Request, res: Response) {
        const { error, value } = usuarioUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details.map(detail => detail.message) });
        }

        try {
            if (value.senha) {
                const saltRounds = 10;
                value.senha = await bcrypt.hash(value.senha, saltRounds);
            }

            const atualizado = await Usuario.findByIdAndUpdate(req.params.id, value, { new: true });
            if (!atualizado) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }
            res.json({ mensagem: 'Usuário atualizado com sucesso.', usuario: atualizado });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao atualizar usuário.', erro: error });
        }
    }


    static async excluirUsuario(req: Request, res: Response) {
        try {
            const deletado = await Usuario.findByIdAndDelete(req.params.id);
            if (!deletado) {
                return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
            }
            res.json({ mensagem: 'Usuário excluído com sucesso.' });
        } catch (error) {
            res.status(500).json({ mensagem: 'Erro ao excluir usuário.', erro: error });
        }
    }
}

export default UsuarioController;