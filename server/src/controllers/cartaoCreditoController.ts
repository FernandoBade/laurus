import { Request, Response } from 'express';
import Joi from 'joi';
import CartaoCredito from '../models/cartaoCredito';
import Usuario from '../models/usuario';
import { logger, resource, responderAPI } from '../utils/commons';
import { EnumBandeiras } from '../utils/assets/enums';

const cartaoCreditoSchema = Joi.object({
    nome: Joi.string().required(),
    bandeira: Joi.string().valid(...Object.values(EnumBandeiras)).required(),
    diaFechamentoFatura: Joi.number().required(),
    diaVencimentoFatura: Joi.number().required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

const cartaoCreditoUpdateSchema = Joi.object({
    nome: Joi.string().optional(),
    bandeira: Joi.string().valid(...Object.values(EnumBandeiras)).optional(),
    diaFechamentoFatura: Joi.number().optional(),
    diaVencimentoFatura: Joi.number().optional(),
    ativo: Joi.boolean()
}).min(1);

class CartaoCreditoController {
    /**
     * Cria um novo cartão de crédito no sistema.
     * @param req Objeto da requisição, contendo os dados do novo cartão de crédito.
     * @param res Objeto da resposta, utilizado para enviar o feedback da operação.
     */
    static async criarCartaoCredito(req: Request, res: Response) {
        const { error, value } = cartaoCreditoSchema.validate(req.body);
        if (error) {
            return responderAPI(res, 400, "erro_validacaoCartaoCredito", {}, error.details);
        }

        try {
            const usuarioExistente = await Usuario.findById(value.usuario);
            if (!usuarioExistente) {
                return responderAPI(res, 404, "erro_usuarioNaoEncontrado");
            }

            const novoCartaoCredito = await new CartaoCredito(value).save();
            usuarioExistente.cartoesDeCredito.push(novoCartaoCredito._id);
            await usuarioExistente.save();

            responderAPI(res, 201, "sucesso_cartaoCreditoCriado", novoCartaoCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { erro: erro.message }));
            responderAPI(res, 500, "erro_internoServidor", {}, erro.message);
        }
    }

    /**
     * Lista todos os cartões de crédito cadastrados no sistema.
     * @param req Objeto da requisição.
     * @param res Objeto da resposta, utilizado para enviar a lista de cartões de crédito.
     */
    static async listarCartoesCredito(req: Request, res: Response) {
        try {
            const cartoesCredito = await CartaoCredito.find();
            responderAPI(res, 200, "sucesso_listaCartoesCredito", cartoesCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { erro: erro }));
            responderAPI(res, 500, "erro_internoServidor", {}, erro);
        }
    }

    /**
     * Obtém detalhes de um cartão de crédito específico pelo seu ID.
     * @param req Objeto da requisição, contendo o ID do cartão de crédito como parâmetro de rota.
     * @param res Objeto da resposta, utilizado para enviar os detalhes do cartão de crédito ou uma mensagem de erro.
     */
    static async obterCartaoCreditoPorId(req: Request, res: Response) {
        try {
            const cartaoCredito = await CartaoCredito.findById(req.params.id);
            if (!cartaoCredito) {
                return responderAPI(res, 404, "erro_cartaoCreditoNaoEncontrado");
            }
            responderAPI(res, 200, "sucesso_cartaoCreditoEncontrado", cartaoCredito);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { erro: erro }));
            responderAPI(res, 500, "erro_internoServidor", {}, erro);
        }
    }

    /**
     * Atualiza os dados de um cartão de crédito existente.
     * @param req Objeto da requisição, contendo os dados atualizados do cartão de crédito e o ID como parâmetro de rota.
     * @param res Objeto da resposta, utilizado para enviar a confirmação da atualização ou uma mensagem de erro.
     */
    static async atualizarCartaoCredito(req: Request, res: Response) {
        const { error, value } = cartaoCreditoUpdateSchema.validate(req.body);
        if (error) {
            return responderAPI(res, 400, "erro_validacaoAtualizacaoCartaoCredito", {}, error.details);
        }

        try {
            const cartaoCreditoAtualizado = await CartaoCredito.findByIdAndUpdate(req.params.id, value, { new: true });
            if (!cartaoCreditoAtualizado) {
                return responderAPI(res, 404, "erro_cartaoCreditoNaoEncontrado");
            }
            responderAPI(res, 200, "sucesso_cartaoCreditoAtualizado", cartaoCreditoAtualizado);
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", { erro: erro }));
            responderAPI(res, 500, "erro_internoServidor", {}, erro);
        }
    }

    /**
     * Exclui um cartão de crédito do sistema pelo seu ID.
     * @param req Objeto da requisição, contendo o ID do cartão de crédito como parâmetro de rota.
     * @param res Objeto da resposta, utilizado para enviar a confirmação da exclusão ou uma mensagem de erro.
     */
    static async excluirCartaoCredito(req: Request, res: Response) {
        try {
            const cartaoCredito = await CartaoCredito.findById(req.params.id);

            if (!cartaoCredito) {
                return responderAPI(
                    res,
                    404,
                    "erro_cartaoCreditoNaoEncontrado",
                    { id: req.params.id }
                );
            }

            await CartaoCredito.findByIdAndDelete(req.params.id);

            if (cartaoCredito.usuario) {
                await Usuario.findByIdAndUpdate(cartaoCredito.usuario, { $pull: { cartoesDeCredito: cartaoCredito._id } });
            }

            responderAPI(res, 200, "sucesso_excluirCartaoCredito", { cartaoCredito: cartaoCredito });
        } catch (erro: any) {
            logger.error(resource("log_erroInternoServidor", {
                erro: erro.toString(),
                stack: erro.stack
            }));
            responderAPI(res, 500, "erro_internoServidor", { erro: erro.toString() });
        }
    }
}

export default CartaoCreditoController;
