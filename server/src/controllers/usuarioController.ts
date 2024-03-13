import bcrypt from 'bcrypt';
import Usuario from '../models/usuario';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const emailNormalizado = req.body.email.trim().toLowerCase();
            const usuarioExistente = await Usuario.findOne({ email: emailNormalizado });
            if (usuarioExistente) return responderAPI(res, 400, 'erro_emailJaCadastrado');

            const dadosUsuario = { ...req.body, email: emailNormalizado };

            const novoUsuario = await new Usuario(req.body).save();

            responderAPI(res, 201, 'sucesso_cadastrar', novoUsuario);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarUsuarios(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarios = await Usuario.find();

            responderAPI(res, 200, 'sucesso_buscar', usuarios);
        } catch (erro: any) {
            next(erro);
        }
    }

    static async obterUsuarioPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const usuario = await Usuario.findById(req.params.id)
                .populate({
                    path: 'despesaCategorias',
                    populate: { path: 'despesaSubcategorias' }
                })
                .populate({
                    path: 'receitaCategorias',
                    populate: { path: 'receitaSubcategorias' }
                })
                .populate({
                    path: 'cartoesDeCredito',
                    populate: [
                        {
                            path: 'despesasCartaoCredito',
                            populate: { path: 'tags' }
                        },
                        {
                            path: 'receitasCartaoCredito',
                            populate: { path: 'tags' }
                        }
                    ]
                })
                .populate({
                    path: 'contas',
                    populate: [
                        {
                            path: 'despesasConta',
                            populate: { path: 'tags' }
                        },
                        {
                            path: 'receitasConta',
                            populate: { path: 'tags' }
                        }
                    ]
                })
                .populate('tags');

            if (!usuario) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_buscar', usuario);
        } catch (erro: any) {
            next(erro);
        }
    }

    static async obterUsuariosPorNome(req: Request, res: Response, next: NextFunction) {
        try {
            const regex = new RegExp(req.params.nome, 'i');

            const usuarios = await Usuario.find({ $or: [{ nome: regex }, { sobrenome: regex }] }).sort({ nome: 1 });
            if (!usuarios.length) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_buscar', usuarios);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterUsuarioPorEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const regex = new RegExp(req.params.email, 'i');

            const usuario = await Usuario.find({ email: regex }).sort({ email: 1 });
            if (!usuario.length) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_buscar', usuario);
        } catch (erro) {
            next(erro);
        }
    }

    static async atualizarUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.body.senha) {
                const senhaHashed = await bcrypt.hash(req.body.senha, 10);
                req.body = { ...req.body, senha: senhaHashed };
            }

            const usuarioParaAtualizar = await Usuario.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!usuarioParaAtualizar) return responderAPI(res, 404, 'erro_encontrar');

            responderAPI(res, 200, 'sucesso_atualizar', usuarioParaAtualizar);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const usuarioExistente = await Usuario.findById(req.params.id);
            if (!usuarioExistente) return responderAPI(res, 404, 'erro_encontrar');

            await Usuario.findByIdAndDelete(req.params.id);

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default UsuarioController;
