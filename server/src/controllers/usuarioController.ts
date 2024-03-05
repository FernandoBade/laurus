import { EnumMoedas, EnumIdiomas, EnumFormatoData, EnumAparencias } from '../utils/assets/enums';
import logger, { resource, responderAPI } from '../utils/commons';
import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import usuario from '../models/usuario';

const usuarioSchema = Joi.object({
    nome: Joi.string().required(),
    sobrenome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha: Joi.string().required(),
    dataNascimento: Joi.date().iso().required(),
    telefone: Joi.string().optional(),
    ultimoAcesso: Joi.date().iso().optional(),
    ativo: Joi.boolean(),
    aparencia: Joi.string().valid(...Object.values(EnumAparencias)).required(),
    idioma: Joi.string().valid(...Object.values(EnumIdiomas)).required(),
    moeda: Joi.string().valid(...Object.values(EnumMoedas)).required(),
    formatoData: Joi.string().valid(...Object.values(EnumFormatoData)).required()
});

const usuarioUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    sobrenome: Joi.string().optional(),
    email: Joi.string().email().optional(),
    senha: Joi.string().optional(),
    dataNascimento: Joi.date().iso().optional(),
    ultimoAcesso: Joi.date().iso().optional(),
    telefone: Joi.string().optional(),
    ativo: Joi.boolean(),
    aparencia: Joi.string().valid(...Object.values(EnumAparencias)).optional(),
    idioma: Joi.string().valid(...Object.values(EnumIdiomas)).optional(),
    moeda: Joi.string().valid(...Object.values(EnumMoedas)).optional(),
    formatoData: Joi.string().valid(...Object.values(EnumFormatoData)).optional()
}).or('nome', 'sobrenome', 'email', 'senha', 'dataNascimento', 'telefone', 'ultimoAcesso', 'aparencia', 'idioma', 'moeda', 'formatoData');

class UsuarioController {
    static async cadastrarUsuario(req: Request, res: Response) {
        const { error: erro, value: valor } = usuarioSchema.validate(req.body);
        if (erro) return responderAPI(res, 400, "erro_validacaoJoi", erro.details);

        const usuarioExistente = await Usuario.findOne({ email: valor.email });
        if (usuarioExistente) return responderAPI(res, 400, 'erro_emailJaCadastrado');

        try {
            const novoUsuarioDocument = await new Usuario(valor).save();
            const novoUsuario = novoUsuarioDocument.toObject();

            responderAPI(res, 201, 'sucesso_cadastrar', novoUsuario);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async listarUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await Usuario.find();

            responderAPI(res, 200, 'sucesso_buscar', usuarios);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async obterUsuarioPorId(req: Request, res: Response) {
        try {
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario) return responderAPI(res, 404, 'erro_encontrarUsuario');

            responderAPI(res, 200, 'sucesso_buscar', usuario);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async obterUsuariosPorNome(req: Request, res: Response) {
        try {
            const regex = new RegExp(req.params.nome, 'i');

            const usuarios = await Usuario.find({ $or: [{ nome: regex }, { sobrenome: regex }] }).sort({ nome: 1 });
            if (!usuarios.length) return responderAPI(res, 404, 'erro_encontrarUsuario');

            responderAPI(res, 200, 'sucesso_buscar', usuarios);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async obterUsuarioPorEmail(req: Request, res: Response) {
        try {
            const regex = new RegExp(req.params.email, 'i');

            const usuario = await Usuario.find({ email: regex }).sort({ email: 1 });
            if (!usuario.length) return responderAPI(res, 404, 'erro_encontrarUsuario');

            responderAPI(res, 200, 'sucesso_buscar', usuario);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async atualizarUsuario(req: Request, res: Response) {
        const { error: erro, value: valor } = usuarioUpdateSchema.validate(req.body);
        if (erro) return responderAPI(res, 400, "erro_validacaoJoi", erro.details);

        try {
            if (valor.senha) valor.senha = await bcrypt.hash(valor.senha, 10);

            const usuarioParaAtualizar = await Usuario.findByIdAndUpdate(req.params.id, valor, { new: true });
            if (!usuarioParaAtualizar) return responderAPI(res, 404, 'erro_naoEncontrado');

            responderAPI(res, 200, 'sucesso_atualizar', usuarioParaAtualizar);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async excluirUsuario(req: Request, res: Response) {
        try {
            const usuarioExistente = await Usuario.findById(req.params.id);
            if (!usuarioExistente) return responderAPI(res, 404, 'erro_naoEncontrado', { id: req.params.id });

            await Usuario.findByIdAndDelete(req.params.id);

            responderAPI(res, 200, 'sucesso_excluir', usuarioExistente);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }
}

export default UsuarioController;
