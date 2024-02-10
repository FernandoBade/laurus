import { EnumMoedas, EnumIdiomas, EnumFormatoData } from '../utils/assets/enums';
import { IUsuario } from '../interfaces/IUsuario';
import { responderAPI } from '../utils/commons';
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
    telefone: Joi.string().optional(),
    idioma: Joi.string().valid(...Object.values(EnumIdiomas)).optional(),
    moeda: Joi.string().valid(...Object.values(EnumMoedas)).optional(),
    formatoData: Joi.string().valid(...Object.values(EnumFormatoData)).optional()
}).or('nome', 'sobrenome', 'email', 'senha', 'dataNascimento', 'telefone', 'idioma', 'moeda', 'formatoData');

class UsuarioController {
    /**
    * Cadastra um novo usuário no sistema.
    * @param req Objeto da requisição, contendo os dados do novo usuário.
    * @param res Objeto da resposta, utilizado para enviar o feedback da operação.
    * Valida os dados do usuário utilizando um schema Joi e, se válido, verifica a existência do e-mail.
    * Se o e-mail não estiver registrado, cria um novo usuário e o salva no banco de dados.
    */
    static async cadastrarUsuario(req: Request, res: Response) {
        const { error, value } = usuarioSchema.validate(req.body);
        if (error) {
            return responderAPI(res, 400, 'erro.validacaoDadosUsuario', { detalhes: error.details.map((detalhe) => detalhe.message) });
        }

        try {
            const usuarioExistente = await Usuario.findOne({ email: value.email });
            if (usuarioExistente) {
                return responderAPI(res, 400, 'erro.emailJaCadastrado');
            }

            const novoUsuarioDocument = await new Usuario(value).save();
            const novoUsuario = novoUsuarioDocument.toObject();

            responderAPI(res, 201, 'sucesso.registroComSucesso', { usuario: novoUsuario });
        } catch (error) {
            responderAPI(res, 500, 'erro.registrarUsuario', { erro: error });
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
            responderAPI(res, 200, 'sucesso.listaUsuarios', {}, usuarios);
        } catch (e) {
            responderAPI(res, 500, 'erro.listarUsuarios');
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
                return responderAPI(res, 404, 'erro.usuarioNaoEncontrado');
            }
            responderAPI(res, 200, 'sucesso.usuarioEncontrado', {}, usuario);
        } catch (error) {
            responderAPI(res, 500, 'erro.buscarUsuario');
        }
    }

    /**
    * Busca usuários por nome ou sobrenome.
    * @param req Objeto da requisição, contendo o nome ou sobrenome como parâmetro de rota.
    * @param res Objeto da resposta, utilizado para enviar a lista de usuários encontrados ou uma mensagem de erro.
    * Utiliza uma expressão regular para encontrar usuários que correspondam ao nome ou sobrenome fornecido.
    */
    static async obterUsuarioPorNome(req: Request, res: Response) {
        try {
            const regex = new RegExp(req.params.nome, 'i');
            const usuarios = await Usuario.find({ $or: [{ nome: regex }, { sobrenome: regex }] }).sort({ nome: 1 });
            responderAPI(res, 200, 'sucesso.usuariosEncontrados', {}, usuarios);
        } catch (error) {
            responderAPI(res, 500, 'erro.buscarUsuarios');
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
            const usuarios = await Usuario.find({ email: regex }).sort({ email: 1 });
            if (!usuarios.length) {
                return responderAPI(res, 404, 'erro.usuariosNaoEncontrados');
            }
            responderAPI(res, 200, 'sucesso.usuariosEncontrados', {}, usuarios);
        } catch (error) {
            responderAPI(res, 500, 'erro.buscarUsuarios');
        }
    }

    /**
    * Atualiza os dados de um usuário existente.
    * @param req Objeto da requisição, contendo os dados atualizados do usuário e o ID como parâmetro de rota.
    * @param res Objeto da resposta, utilizado para enviar a confirmação da atualização ou uma mensagem de erro.
    * Valida os dados fornecidos e, se válidos, atualiza o usuário correspondente ao ID fornecido.
    */
    static async atualizarUsuario(req: Request, res: Response) {
        const { error, value } = usuarioUpdateSchema.validate(req.body);
        if (error) {
            return responderAPI(res, 400, 'erro.validacaoDadosUsuario', { detalhes: error.details.map(detalhe => detalhe.message) });
        }

        try {
            if (value.senha) {
                value.senha = await bcrypt.hash(value.senha, 10);
            }

            const atualizado = await Usuario.findByIdAndUpdate(req.params.id, value, { new: true });
            if (!atualizado) {
                return responderAPI(res, 404, 'erro.usuarioNaoEncontrado');
            }
            responderAPI(res, 200, 'sucesso.usuarioAtualizado', {}, atualizado);
        } catch (error) {
            responderAPI(res, 500, 'erro.atualizarUsuario');
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
            const deletado = await Usuario.findByIdAndDelete(req.params.id);
            if (!deletado) {
                return responderAPI(res, 404, 'erro.usuarioNaoEncontrado');
            }
            responderAPI(res, 200, 'sucesso.usuarioExcluido');
        } catch (error) {
            responderAPI(res, 500, 'erro.excluirUsuario');
        }
    }
}

export default UsuarioController;
