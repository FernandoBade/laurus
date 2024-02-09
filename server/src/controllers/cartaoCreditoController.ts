import { Request, Response } from 'express';
import Joi from 'joi';
import CartaoCredito from '../models/cartaoCredito';
import Usuario from '../models/usuario';
import { logger , resource } from '../utils/commons';

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
        // Define o idioma da requisição para uso nos recursos e logs
        const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';

        const { error, value } = cartaoCreditoSchema.validate(req.body);
        if (error) {
            // Registra e responde com um log de aviso em caso de erro de validação
            logger.warning(resource('erroValidacaoCartaoCredito', { lang: idiomaRequisicao }));
            return res.status(400).json({ error: resource('erroValidacaoCartaoCredito', { lang: idiomaRequisicao }) });
        }

        try {
            const usuarioExistente = await Usuario.findById(value.usuario);
            if (!usuarioExistente) {
                // Registra e responde com um log de aviso se o usuário não for encontrado
                logger.warning(resource('usuarioNaoEncontrado', { lang: idiomaRequisicao }));
                return res.status(404).json({ error: resource('usuarioNaoEncontrado', { lang: idiomaRequisicao }) });
            }

            const novoCartaoCredito = new CartaoCredito(value);
            await novoCartaoCredito.save();

            usuarioExistente.cartoesDeCredito.push(novoCartaoCredito._id);
            await usuarioExistente.save();

            // Registra um log de informação sobre a criação bem-sucedida do cartão de crédito
            logger.info(resource('cartaoCreditoCriadoSucesso', { lang: idiomaRequisicao }));
            res.status(201).json({ message: resource('cartaoCreditoCriadoSucesso', { lang: idiomaRequisicao }), cartao: novoCartaoCredito });
        } catch (e: any) {
            // Registra um log de erro em caso de falha na operação
            logger.error(resource('erroCriarCartaoCredito', { lang: idiomaRequisicao }) + `: ${e.message}`);
            res.status(500).json({ error: resource('erroInternoNoServidor', { lang: idiomaRequisicao }) });
        }
    }

    static async listarCartoesCredito(req: Request, res: Response) {
        const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';

        try {
            const cartoesCredito = await CartaoCredito.find();
            // Registra um log de informação sobre a listagem bem-sucedida dos cartões
            logger.info(resource('cartoesCreditoListadosSucesso', { lang: idiomaRequisicao }));
            res.json(cartoesCredito);
        } catch (e) {
            // Registra um log de erro em caso de falha na operação
            logger.error(resource('erroListarCartoesCredito', { lang: idiomaRequisicao }) + `: ${e}`);
            res.status(500).json({ error: resource('erroInternoNoServidor', { lang: idiomaRequisicao }) });
        }
    }

    static async obterCartaoCreditoPorId(req: Request, res: Response) {
        const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';

        try {
            const cartaoCredito = await CartaoCredito.findById(req.params.id);
            if (!cartaoCredito) {
                // Registra e responde com um log de aviso se o cartão de crédito não for encontrado
                logger.warning(resource('cartaoCreditoNaoEncontrado', { lang: idiomaRequisicao }));
                return res.status(404).json({ error: resource('cartaoCreditoNaoEncontrado', { lang: idiomaRequisicao }) });
            }
            res.json(cartaoCredito);
        } catch (e) {
            // Registra um log de erro em caso de falha na operação
            logger.error(resource('erroObterCartaoCredito', { lang: idiomaRequisicao }) + `: ${e}`);
            res.status(500).json({ error: resource('erroInternoNoServidor', { lang: idiomaRequisicao }) });
        }
    }

    static async atualizarCartaoCredito(req: Request, res: Response) {
        const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';

        const { error, value } = cartaoCreditoUpdateSchema.validate(req.body);
        if (error) {
            // Registra e responde com um log de aviso em caso de erro de validação
            logger.warning(resource('erroValidacaoAtualizacaoCartaoCredito', { lang: idiomaRequisicao }));
            return res.status(400).json({ error: resource('erroValidacaoAtualizacaoCartaoCredito', { lang: idiomaRequisicao }) });
        }

        try {
            const cartaoCreditoAtualizado = await CartaoCredito.findByIdAndUpdate(req.params.id, value, { new: true });
            if (!cartaoCreditoAtualizado) {
                // Registra e responde com um log de aviso se o cartão de crédito não for encontrado
                logger.warning(resource('cartaoCreditoNaoEncontrado', { lang: idiomaRequisicao }));
                return res.status(404).json({ error: resource('cartaoCreditoNaoEncontrado', { lang: idiomaRequisicao }) });
            }
            // Registra um log de informação sobre a atualização bem-sucedida do cartão de crédito
            logger.info(resource('cartaoCreditoAtualizadoSucesso', { lang: idiomaRequisicao }));
            res.json({ message: resource('cartaoCreditoAtualizadoSucesso', { lang: idiomaRequisicao }), cartao: cartaoCreditoAtualizado });
        } catch (e) {
            // Registra um log de erro em caso de falha na operação
            logger.error(resource('erroAtualizarCartaoCredito', { lang: idiomaRequisicao }) + `: ${e}`);
            res.status(500).json({ error: resource('erroInternoNoServidor', { lang: idiomaRequisicao }) });
        }
    }

    static async excluirCartaoCredito(req: Request, res: Response) {
        const idiomaRequisicao = req.headers['accept-language']?.split(',')[0] || 'pt-BR';

        try {
            const cartaoCredito = await CartaoCredito.findById(req.params.id).populate('usuario', 'nome');
            if (!cartaoCredito) {
                // Registra e responde com um log de aviso se o cartão de crédito não for encontrado
                logger.warning(resource('cartaoCreditoNaoEncontrado', { lang: idiomaRequisicao }));
                return res.status(404).json({ error: resource('cartaoCreditoNaoEncontrado', { lang: idiomaRequisicao }) });
            }

            await CartaoCredito.findByIdAndDelete(req.params.id);

            if (cartaoCredito.usuario && cartaoCredito.usuario._id) {
                await Usuario.findByIdAndUpdate(cartaoCredito.usuario._id, { $pull: { cartoesDeCredito: cartaoCredito._id } });
            }

            // Registra um log de informação sobre a exclusão bem-sucedida do cartão de crédito
            logger.info(resource('cartaoCreditoExcluidoSucesso', { lang: idiomaRequisicao }));
            res.status(200).json({ message: resource('cartaoCreditoExcluidoSucesso', { lang: idiomaRequisicao }) });
        } catch (error) {
            // Registra um log de erro em caso de falha na operação
            logger.error(resource('erroExcluirCartaoCredito', { lang: idiomaRequisicao }) + `: ${error instanceof Error ? error.message : ''}`);
            res.status(500).json({ error: resource('erroInternoNoServidor', { lang: idiomaRequisicao }) });
        }
    }
}

export default CartaoCreditoController;
