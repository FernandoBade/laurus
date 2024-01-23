import { Request, Response } from 'express';
import Joi from 'joi';
import CartaoCredito from '../models/cartaoCredito';
import Usuario from '../models/usuario';

const cartaoCreditoSchema = Joi.object({
    nome: Joi.string().required(),
    bandeira: Joi.string().required(),
    diaFechamentoFatura: Joi.number().required(),
    diaVencimentoFatura: Joi.number().required(),
    usuario: Joi.string().required()
});

const cartaoCreditoUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    bandeira: Joi.string().optional(),
    diaFechamentoFatura: Joi.number().optional(),
    diaVencimentoFatura: Joi.number().optional()
}).min(1);

class CartaoCreditoController {
    static async criarCartaoCredito(req: Request, res: Response) {
        const { error, value } = cartaoCreditoSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const usuarioExistente = await Usuario.findById(value.usuario);
            if (!usuarioExistente) return res.status(404).json({ error: 'Usuário não encontrado' });

            const novoCartaoCredito = new CartaoCredito(value);
            await novoCartaoCredito.save();

            usuarioExistente.cartoesDeCredito.push(novoCartaoCredito._id);
            await usuarioExistente.save();

            res.status(201).json(novoCartaoCredito);
        } catch (e: any) {
            res.status(500).json({ error: e.message });
        }
    }

    static async listarCartoesCredito(req: Request, res: Response) {
        try {
            const cartoesCredito = await CartaoCredito.find();
            res.json(cartoesCredito);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao listar cartões de crédito' });
        }
    }

    static async obterCartaoCreditoPorId(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const cartaoCredito = await CartaoCredito.findById(id);
            if (!cartaoCredito) return res.status(404).json({ error: 'Cartão de crédito não encontrado' });
            res.json(cartaoCredito);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao obter cartão de crédito' });
        }
    }

    static async atualizarCartaoCredito(req: Request, res: Response) {
        const { id } = req.params;
        const { error, value } = cartaoCreditoUpdateSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        try {
            const cartaoCreditoAtualizado = await CartaoCredito.findByIdAndUpdate(id, value, { new: true });
            if (!cartaoCreditoAtualizado) return res.status(404).json({ error: 'Cartão de crédito não encontrado' });
            res.json(cartaoCreditoAtualizado);
        } catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar cartão de crédito' });
        }
    }

    static async excluirCartaoCredito(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const cartaoCredito = await CartaoCredito.findById(id).populate('usuario', 'nome');
            if (!cartaoCredito) return res.status(404).json({ error: 'Cartão de crédito não encontrado' });

            const nomeUsuario = cartaoCredito.usuario && 'nome' in cartaoCredito.usuario ? cartaoCredito.usuario['nome'] : 'Desconhecido';

            await CartaoCredito.findByIdAndDelete(id);

            if (cartaoCredito.usuario && cartaoCredito.usuario._id) {
                await Usuario.findByIdAndUpdate(cartaoCredito.usuario._id, { $pull: { cartoesDeCredito: cartaoCredito._id } });
            }

            res.status(200).json({ message: `Cartão de crédito excluído com sucesso, e vínculo com ${nomeUsuario} removido.` });
        } catch (e) {
            res.status(500).json({ error: 'Erro ao excluir cartão de crédito' });
        }
    }
}

export default CartaoCreditoController;
