import { Request, Response } from 'express';
import Joi from 'joi';
import Conta from '../models/conta';
import Usuario from '../models/usuario';
import { logger, resource, responderAPI } from '../utils/commons';
import { EnumTipoConta } from '../utils/assets/enums';

const contaSchema = Joi.object({
    nome: Joi.string().required(),
    banco: Joi.string().required(),
    tipoConta: Joi.string().valid(...Object.values(EnumTipoConta)).required(),
    observacao: Joi.string().optional(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

const contaUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    banco: Joi.string().optional(),
    tipoConta: Joi.string().valid(...Object.values(EnumTipoConta)).optional(),
    observacao: Joi.string().optional(),
    ativo: Joi.boolean()
}).min(1);

class ContaController {
    static async criarConta(req: Request, res: Response) {
        const { error: erro, value: valor } = contaSchema.validate(req.body);
        if (erro) return responderAPI(res, 400, "erro_validacaoJoi", erro.details);

        const usuarioExistente = await Usuario.findById(valor.usuario);
        if (!usuarioExistente) return responderAPI(res, 404, "erro_naoEncontrado");

        try {
            const novaConta = await new Conta(valor).save();

            usuarioExistente.contas.push(novaConta._id);
            await usuarioExistente.save();

            responderAPI(res, 201, "sucesso_cadastrar", novaConta);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async listarContas(req: Request, res: Response) {
        try {
            const contas = await Conta.find();

            responderAPI(res, 200, "sucesso_buscar", contas);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async obterContaPorId(req: Request, res: Response) {
        try {
            const conta = await Conta.findById(req.params.id);
            if (!conta) return responderAPI(res, 404, "erro_naoEncontrado");

            responderAPI(res, 200, "sucesso_buscar", conta);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async atualizarConta(req: Request, res: Response) {
        const { error: erro, value: valor } = contaUpdateSchema.validate(req.body);
        if (erro) return responderAPI(res, 400, "erro_validacaoJoi", erro.details);

        try {
            const contaAtualizada = await Conta.findByIdAndUpdate(req.params.id, valor, { new: true });
            if (!contaAtualizada) return responderAPI(res, 404, "erro_naoEncontrado");

            responderAPI(res, 200, "sucesso_atualizar", contaAtualizada);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }

    static async excluirConta(req: Request, res: Response) {
        try {
            const conta = await Conta.findById(req.params.id);
            if (!conta) return responderAPI(res, 404, "erro_naoEncontrado");

            await Conta.findByIdAndDelete(req.params.id);

            if (conta.usuario) await Usuario.findByIdAndUpdate(conta.usuario, { $pull: { contas: conta._id } });

            responderAPI(res, 200, "sucesso_excluir", conta);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { stack: erro.stack }));
            responderAPI(res, 500, "erro_internoServidor", { stack: erro.stack });
        }
    }
}

export default ContaController;
