import Conta from '../models/conta';
import Usuario from '../models/usuario';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class ContaController {
    static async criarConta(req: Request, res: Response, next: NextFunction) {
        const usuarioExistente = await Usuario.findById(req.body.usuario);
        if (!usuarioExistente) return responderAPI(res, 404, "erro_encontrar");

        try {
            const novaConta = await new Conta(req.body).save();

            await Usuario.findByIdAndUpdate(
                req.body.usuario,
                { $push: { contas: novaConta._id } },
                { new: true }
            );

            responderAPI(res, 201, "sucesso_cadastrar", novaConta);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarContas(req: Request, res: Response, next: NextFunction) {
        try {
            const contas = await Conta.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", contas);
        } catch (erro: any) {
            next(erro);
        }
    }

    static async obterContaPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const conta = await Conta.findById(req.params.id);
            if (!conta) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", conta);
        } catch (erro: any) {
            next(erro);
        }
    }

    static async atualizarConta(req: Request, res: Response, next: NextFunction) {
        try {
            const contaAtualizada = await Conta.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!contaAtualizada) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", contaAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirConta(req: Request, res: Response, next: NextFunction) {
        try {
            const conta = await Conta.findById(req.params.id);
            if (!conta) return responderAPI(res, 404, "erro_encontrar");

            await Conta.findByIdAndDelete(req.params.id);

            if (conta.usuario)
                await Usuario.findByIdAndUpdate(
                    conta.usuario,
                    { $pull: { contas: conta._id } }
                );

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default ContaController;
