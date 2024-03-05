import { Request, Response } from 'express';
import Joi from 'joi';
import DespesaCategoria from '../models/despesaCategoria';
import Usuario from '../models/usuario';
import logger, { resource, responderAPI } from '../utils/commons';

const despesaCategoriaSchema = Joi.object({
    nome: Joi.string().required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

const despesaCategoriaUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    ativo: Joi.boolean()
}).min(1);

class DespesaCategoriaController {
    static async criarDespesaCategoria(req: Request, res: Response) {
        const { error: erro, value: valor } = despesaCategoriaSchema.validate(req.body);
        if (erro) return responderAPI(res, 400, "erro_validacaoJoi", erro.details);

        const usuarioExistente = await Usuario.findById(valor.usuario);
        if (!usuarioExistente) return responderAPI(res, 404, "erro_naoEncontrado");

        try {
            const novaDespesaCategoria = await new DespesaCategoria(valor).save();

            usuarioExistente.despesaCategorias.push(novaDespesaCategoria._id);
            await usuarioExistente.save();

            responderAPI(res, 201, "sucesso_cadastrar", novaDespesaCategoria);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async listarDespesaCategorias(req: Request, res: Response) {
        try {
            const despesaCategorias = await DespesaCategoria.find();

            responderAPI(res, 200, "sucesso_buscar", despesaCategorias);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async obterDespesaCategoriaPorId(req: Request, res: Response) {
        try {
            const despesaCategoria = await DespesaCategoria.findById(req.params.id);
            if (!despesaCategoria) return responderAPI(res, 404, "erro_naoEncontrado");

            responderAPI(res, 200, "sucesso_buscar", despesaCategoria);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async atualizarDespesaCategoria(req: Request, res: Response) {
        const { error: erro, value: valor } = despesaCategoriaUpdateSchema.validate(req.body);
        if (erro) return responderAPI(res, 400, "erro_validacaoJoi", erro.details);

        try {
            const despesaCategoriaAtualizada = await DespesaCategoria.findByIdAndUpdate(req.params.id, valor, { new: true });
            if (!despesaCategoriaAtualizada) return responderAPI(res, 404, "erro_naoEncontrado");

            responderAPI(res, 200, "sucesso_atualizar", despesaCategoriaAtualizada);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async excluirDespesaCategoria(req: Request, res: Response) {
        try {
            const despesaCategoria = await DespesaCategoria.findById(req.params.id);
            if (!despesaCategoria) return responderAPI(res, 404, "erro_naoEncontrado");

            await DespesaCategoria.findByIdAndDelete(req.params.id);

            if (despesaCategoria.usuario) await Usuario.findByIdAndUpdate(despesaCategoria.usuario, { $pull: { despesaCategorias: despesaCategoria._id } });

            responderAPI(res, 200, "sucesso_excluir", despesaCategoria );
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }
}

export default DespesaCategoriaController;
