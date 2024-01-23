import { Request, Response } from 'express';
import Joi from 'joi';
import Conta from '../models/conta';
import Usuario from '../models/usuario';

const contaSchema = Joi.object({
    nome: Joi.string().required(),
    banco: Joi.string().required(),
    tipoConta: Joi.string().valid('Corrente', 'Salário', 'Poupança', 'Investimento').required(),
    observacao: Joi.string().optional(),
    usuario: Joi.string().required()
});

const contaUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    banco: Joi.string().optional(),
    tipoConta: Joi.string().valid('Corrente', 'Salário', 'Poupança', 'Investimento').optional(),
    observacao: Joi.string().optional()
}).min(1);

class ContaController {
    static async criarConta(req: Request, res: Response) {
        const { error, value } = contaSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const usuarioExistente = await Usuario.findById(value.usuario);
            if (!usuarioExistente) return res.status(404).json({ error: 'Usuário não encontrado' });

            const novaConta = new Conta(value);
            await novaConta.save();

            usuarioExistente.contas.push(novaConta._id);
            await usuarioExistente.save();

            res.status(201).json(novaConta);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static async listarContas(req: Request, res: Response) {
        try {
            const contas = await Conta.find();
            res.json(contas);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar contas' });
        }
    }

    static async obterContaPorId(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const conta = await Conta.findById(id);
            if (!conta) return res.status(404).json({ error: 'Conta não encontrada' });
            res.json(conta);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao obter conta' });
        }
    }

    static async atualizarConta(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = contaUpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const contaAtualizada = await Conta.findByIdAndUpdate(id, value, { new: true });
            if (!contaAtualizada) return res.status(404).json({ error: 'Conta não encontrada' });
            res.json(contaAtualizada);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar conta' });
        }
    }

    static async excluirConta(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const conta = await Conta.findById(id).populate('usuario', 'nome');
            if (!conta) return res.status(404).json({ error: 'Conta não encontrada' });

            const nomeUsuario = conta.usuario && 'nome' in conta.usuario ? conta.usuario['nome'] : 'Desconhecido';

            await Conta.findByIdAndDelete(id);

            if (conta.usuario && conta.usuario._id) {
                await Usuario.findByIdAndUpdate(conta.usuario._id, { $pull: { contas: conta._id } });
            }

            res.status(200).json({ message: `Conta excluída com sucesso, e vínculo com ${nomeUsuario} removido.` });
        } catch (e) {
            res.status(500).json({ error: 'Erro ao excluir conta' });
        }
    }
}

export default ContaController;
