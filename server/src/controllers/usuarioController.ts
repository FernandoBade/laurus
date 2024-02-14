import { EnumMoedas, EnumIdiomas, EnumFormatoData, EnumAparencia } from '../utils/assets/enums';
import logger, { resource, responderAPI } from '../utils/commons';
import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const usuarioSchema = Joi.object({
    nome: Joi.string().required(),
    sobrenome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha: Joi.string().required(),
    dataNascimento: Joi.date().iso().required(),
    telefone: Joi.string().optional(),
    ultimoAcesso: Joi.date().iso().optional(),
    ativo: Joi.boolean(),
    aparencia: Joi.string().valid(...Object.values(EnumAparencia)).required(),
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
    aparencia: Joi.string().valid(...Object.values(EnumAparencia)).optional(),
    idioma: Joi.string().valid(...Object.values(EnumIdiomas)).optional(),
    moeda: Joi.string().valid(...Object.values(EnumMoedas)).optional(),
    formatoData: Joi.string().valid(...Object.values(EnumFormatoData)).optional()
}).or('nome', 'sobrenome', 'email', 'senha', 'dataNascimento', 'telefone', 'ultimoAcesso', 'aparencia', 'idioma', 'moeda', 'formatoData');

class UsuarioController {
    static findByIdAndUpdate(id: any) {
        throw new Error('Method not implemented.');
    }
    static findById(id: any) {
        throw new Error('Method not implemented.');
    }
    /**
    * Cadastra um novo usuário no sistema.
    * @param req Objeto da requisição, contendo os dados do novo usuário.
    * @param res Objeto da resposta, utilizado para enviar o feedback da operação.
    * Valida os dados do usuário utilizando um schema Joi e, se válido, verifica a existência do e-mail.
    * Se o e-mail não estiver registrado, cria um novo usuário e o salva no banco de dados.
    */
    static async cadastrarUsuario(req: Request, res: Response) {
        const { error: erro, value: valor } = usuarioSchema.validate(req.body);
        if (erro) {
            return responderAPI(res, 400, 'erro_validacaoDadosUsuario', {}, erro.details.map((detalhe) => detalhe.message));
        }

        try {
            const usuarioExistente = await Usuario.findOne({ email: valor.email });
            if (usuarioExistente) {
                return responderAPI(res, 400, 'erro_emailJaCadastrado');
            }

            const novoUsuarioDocument = await new Usuario(valor).save();
            const novoUsuario = novoUsuarioDocument.toObject();

            responderAPI(res, 201, 'sucesso_registroNovoUsuario', { usuario: novoUsuario });
        } catch (erro: any) {
            logger.error(resource('log_erroInternoServidor', { erro: erro.toString() }));
            responderAPI(res, 500, 'erro_registrarUsuario', {}, erro.toString());
        }
    }

    /**
    * Lista todos os usuários cadastrados no sistema.
    * @param req Objeto da requisição.
    * @param res Objeto da resposta, utilizado para enviar a lista de usuários.
    * Recupera todos os usuários do banco de dados e os retorna em formato JSON.
    */
    static async listarUsuarios(req: Request, res: Response) {
        try {
            const usuarios = await Usuario.find();

            responderAPI(res, 200, 'sucesso_listaUsuarios', { quantidade: usuarios.length }, usuarios);
        } catch (erro: any) {
            logger.error(resource('log_erroInternoServidor', { erro: erro.toString() }));
            responderAPI(res, 500, 'erro_listarUsuarios', {}, erro.toString());
        }
    }

    /**
    * Obtém detalhes de um usuário específico pelo seu ID.
    * @param req Objeto da requisição, contendo o ID do usuário como parâmetro de rota.
    * @param res Objeto da resposta, utilizado para enviar os detalhes do usuário ou uma mensagem de erro.
    * Busca um usuário pelo ID fornecido. Se encontrado, retorna os detalhes do usuário.
    */
    static async obterUsuarioPorId(req: Request, res: Response) {
        try {
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario) {
                return responderAPI(res, 404, 'erro_encontrarUsuario');
            }

            responderAPI(res, 200, 'sucesso_encontrarUsuario', {}, usuario);
        } catch (erro: any) {
            logger.error(resource('log_erroInternoServidor', { erro: erro.toString() }));
            responderAPI(res, 500, 'erro_buscarUsuario', {}, erro.toString());
        }
    }

    /**
    * Busca usuários por nome ou sobrenome.
    * @param req Objeto da requisição, contendo o nome ou sobrenome como parâmetro de rota.
    * @param res Objeto da resposta, utilizado para enviar a lista de usuários encontrados ou uma mensagem de erro.
    * Utiliza uma expressão regular para encontrar usuários que correspondam ao nome ou sobrenome fornecido.
    */
    static async obterUsuariosPorNome(req: Request, res: Response) {
        try {
            const regex = new RegExp(req.params.nome, 'i');
            const usuarios = await Usuario.find({ $or: [{ nome: regex }, { sobrenome: regex }] }).sort({ nome: 1 });
            if (!usuarios.length) {
                return responderAPI(res, 404, 'erro_encontrarUsuario');
            }

            responderAPI(res, 200, 'sucesso_listaUsuarios', { quantidade: usuarios.length }, usuarios);
        } catch (erro: any) {
            logger.error(resource('log_erroInternoServidor', { erro: erro.toString() }));
            responderAPI(res, 500, 'erro_listarUsuarios', {}, erro.toString());
        }
    }

    /**
    * Busca usuários pelo endereço de e-mail.
    * @param req Objeto da requisição, contendo o e-mail como parâmetro de rota.
    * @param res Objeto da resposta, utilizado para enviar a lista de usuários encontrados ou uma mensagem de erro.
    * Utiliza uma expressão regular para encontrar usuários que correspondam ao e-mail fornecido.
    */
    static async obterUsuarioPorEmail(req: Request, res: Response) {
        try {
            const regex = new RegExp(req.params.email, 'i');
            const usuario = await Usuario.find({ email: regex }).sort({ email: 1 });
            if (!usuario.length) {
                return responderAPI(res, 404, 'erro_encontrarUsuario');
            }

            responderAPI(res, 200, 'sucesso_encontrarUsuario', {}, usuario);
        } catch (erro: any) {
            logger.error(resource('log_erroInternoServidor', { erro: erro.toString() }));
            responderAPI(res, 500, 'erro_buscarUsuario', {}, erro.toString());
        }
    }

    /**
    * Atualiza os dados de um usuário existente.
    * @param req Objeto da requisição, contendo os dados atualizados do usuário e o ID como parâmetro de rota.
    * @param res Objeto da resposta, utilizado para enviar a confirmação da atualização ou uma mensagem de erro.
    * Valida os dados fornecidos e, se válidos, atualiza o usuário correspondente ao ID fornecido.
    */
    static async atualizarUsuario(req: Request, res: Response) {
        const { error: erro, value } = usuarioUpdateSchema.validate(req.body);
        if (erro) {
            return responderAPI(res, 400, 'erro_validacaoDadosUsuario', {}, erro.details.map(detalhe => detalhe.message));
        }

        try {
            if (value.senha) {
                value.senha = await bcrypt.hash(value.senha, 10);
            }

            const usuarioParaAtualizar = await Usuario.findByIdAndUpdate(req.params.id, value, { new: true });
            if (!usuarioParaAtualizar) {
                return responderAPI(res, 404, 'erro_encontrarUsuario');
            }

            responderAPI(res, 200, 'sucesso_atualizarUsuario', { usuario: usuarioParaAtualizar }, usuarioParaAtualizar);
        } catch (erro: any) {
            logger.error(resource('log_erroInternoServidor', { erro: erro.toString() }));
            responderAPI(res, 500, 'erro_atualizarUsuario', {}, erro.toString());
        }
    }

    /**
    * Exclui um usuário do sistema pelo seu ID.
    * @param req Objeto da requisição, contendo o ID do usuário como parâmetro de rota.
    * @param res Objeto da resposta, utilizado para enviar a confirmação da exclusão ou uma mensagem de erro.
    * Busca e exclui o usuário correspondente ao ID fornecido.
    */
    static async excluirUsuario(req: Request, res: Response) {
        try {
            const usuarioDeletado = await Usuario.findByIdAndDelete(req.params.id);
            if (!usuarioDeletado) {
                return responderAPI(res, 404, 'erro_encontrarUsuario');
            }

            responderAPI(res, 200, 'sucesso_excluirUsuario', { usuario: usuarioDeletado });
        } catch (erro: any) {
            logger.error(resource('log_erroInternoServidor', { erro: erro.toString() }));
            responderAPI(res, 500, 'erro_excluirUsuario', {}, erro.toString());
        }
    }
}

export default UsuarioController;
