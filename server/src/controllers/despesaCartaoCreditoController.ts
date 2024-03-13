import mongoose from 'mongoose';
import CartaoCredito from '../models/cartaoCredito';
import DespesaCartaoCredito from '../models/despesaCartaoCredito';
import DespesaCategoria from '../models/despesaCategoria';
import DespesaSubcategoria from '../models/despesaSubcategoria';
import Tag from '../models/tag';
import { responderAPI } from '../utils/commons';
import { Request, Response, NextFunction } from 'express';

class DespesaCartaoCreditoController {

    static async criarDespesaCartaoCredito(req: Request, res: Response, next: NextFunction) {
        const idsValidos = [
            { nome: 'cartaoCredito', valido: mongoose.isValidObjectId(req.body.cartaoCredito) },
            { nome: 'despesaCategoria', valido: mongoose.isValidObjectId(req.body.despesaCategoria) },
            { nome: 'despesaSubcategoria', valido: req.body.despesaSubcategoria ? mongoose.isValidObjectId(req.body.despesaSubcategoria) : true },
            ...(req.body.tags || []).map((tag: string) => ({ nome: `tag: ${tag}`, valido: mongoose.isValidObjectId(tag) }))
        ];

        const idsInvalidos = idsValidos.filter(id => !id.valido);

        if (idsInvalidos.length > 0) {
            const idsInvalidosNomes = idsInvalidos.map(id => id.nome).join(', ');
            return responderAPI(res, 400, "erro_idInvalido", {}, { ids: idsInvalidosNomes });
        }

        const referencias = [
            CartaoCredito.findById(req.body.cartaoCredito),
            DespesaCategoria.findById(req.body.despesaCategoria),
            req.body.despesaSubcategoria ?
                DespesaSubcategoria.findById(req.body.despesaSubcategoria) :
                Promise.resolve(true),
            ...(req.body.tags || []).map((tag: string) => Tag.findById(tag))
        ];

        const resultados = await Promise.all(referencias);

        if (resultados.some(resultado => !resultado)) {
            return responderAPI(res, 404, "erro_referenciaNaoEncontrada");
        }

        try {
            const novaDespesaCartaoCredito = await new DespesaCartaoCredito(req.body).save();

            responderAPI(res, 201, "sucesso_cadastrar", novaDespesaCartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }

    static async listarDespesasCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const despesasCartaoCredito = await DespesaCartaoCredito.find(req.query);

            responderAPI(res, 200, "sucesso_buscar", despesasCartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }

    static async obterDespesaCartaoCreditoPorId(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCartaoCredito = await DespesaCartaoCredito.findById(req.params.id);
            if (!despesaCartaoCredito) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_buscar", despesaCartaoCredito);
        } catch (erro) {
            next(erro);
        }
    }


    static async atualizarDespesaCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCartaoCreditoAtualizada = await DespesaCartaoCredito.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );

            if (!despesaCartaoCreditoAtualizada) return responderAPI(res, 404, "erro_encontrar");

            responderAPI(res, 200, "sucesso_atualizar", despesaCartaoCreditoAtualizada);
        } catch (erro) {
            next(erro);
        }
    }

    static async excluirDespesaCartaoCredito(req: Request, res: Response, next: NextFunction) {
        try {
            const despesaCartaoCredito = await DespesaCartaoCredito.findById(req.params.id);
            if (!despesaCartaoCredito) return responderAPI(res, 404, "erro_encontrar");

            await DespesaCartaoCredito.findByIdAndDelete(req.params.id);

            if (despesaCartaoCredito.cartaoCredito) {
                await CartaoCredito.findByIdAndUpdate(
                    despesaCartaoCredito.cartaoCredito,
                    { $pull: { despesasCartaoCredito: req.params.id } }
                );
            }

            responderAPI(res, 200, "sucesso_excluir", { id: req.params.id });
        } catch (erro) {
            next(erro);
        }
    }
}

export default DespesaCartaoCreditoController;