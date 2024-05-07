import Joi from "joi";
import PasswordComplexity from "joi-password-complexity";

import {
    EnumAparencias,
    EnumBandeiras,
    EnumFormatoData,
    EnumIdiomas,
    EnumMoedas,
    EnumTipoConta,
    EnumTipoToken
} from "./enums";

export const cartaoCreditoSchema = Joi.object({
    nome: Joi.string().min(2).max(50).required(),
    bandeira: Joi.string().valid(...Object.values(EnumBandeiras)).required(),
    diaFechamentoFatura: Joi.number().min(1).max(31).required(),
    diaVencimentoFatura: Joi.number().min(1).max(31).required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

export const cartaoCreditoUpdateSchema = Joi.object({
    nome: Joi.string().min(2).max(50).optional(),
    bandeira: Joi.string().valid(...Object.values(EnumBandeiras)).optional(),
    diaFechamentoFatura: Joi.number().min(1).max(31).optional(),
    diaVencimentoFatura: Joi.number().min(1).max(31).optional(),
    ativo: Joi.boolean()
}).min(1);

export const contaSchema = Joi.object({
    nome: Joi.string().min(2).max(50).required(),
    banco: Joi.string().required(),
    tipoConta: Joi.string().valid(...Object.values(EnumTipoConta)).required(),
    observacao: Joi.string().optional(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

export const contaUpdateSchema = Joi.object({
    nome: Joi.string().min(2).max(50).optional(),
    banco: Joi.string().optional(),
    tipoConta: Joi.string().valid(...Object.values(EnumTipoConta)).optional(),
    observacao: Joi.string().optional(),
    ativo: Joi.boolean()
}).min(1);

export const despesaCartaoCreditoSchema = Joi.object({
    cartaoCredito: Joi.string().required(),
    valor: Joi.number().min(0.01).max(999999999).required(),
    dataTransacao: Joi.date().iso().required(),
    despesaCategoria: Joi.string().required(),
    despesaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    parcelamento: Joi.boolean().optional(),
    numeroParcelaAtual: Joi.when('parcelamento', {
        is: true,
        then: Joi.number().min(1).required(),
        otherwise: Joi.forbidden()
    }),
    totalParcelas: Joi.when('parcelamento', {
        is: true,
        then: Joi.number().min(2).max(24).required(),
        otherwise: Joi.forbidden()
    }),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
});

export const despesaCartaoCreditoUpdateSchema = Joi.object({
    cartaoCredito: Joi.string().optional(),
    valor: Joi.number().min(0.01).max(999999999).optional(),
    dataTransacao: Joi.date().iso().optional(),
    despesaCategoria: Joi.string().optional(),
    despesaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    parcelamento: Joi.boolean().optional(),
    numeroParcelaAtual: Joi.when('parcelamento', {
        is: true,
        then: Joi.number().min(1).required(),
        otherwise: Joi.forbidden()
    }),
    totalParcelas: Joi.when('parcelamento', {
        is: true,
        then: Joi.number().min(2).max(24).required(),
        otherwise: Joi.forbidden()
    }),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
}).min(1);

export const despesaCategoriaSchema = Joi.object({
    nome: Joi.string().min(2).max(50).required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

export const despesaCategoriaUpdateSchema = Joi.object({
    nome: Joi.string().min(2).max(50).optional(),
    ativo: Joi.boolean()
}).min(1);

export const despesaContaSchema = Joi.object({
    conta: Joi.string().required(),
    valor: Joi.number().min(0.01).max(999999999).required(),
    dataTransacao: Joi.date().iso().required(),
    despesaCategoria: Joi.string().required(),
    despesaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
});

export const despesaContaUpdateSchema = Joi.object({
    conta: Joi.string().optional(),
    valor: Joi.number().min(0.01).max(999999999).optional(),
    dataTransacao: Joi.date().iso().optional(),
    despesaCategoria: Joi.string().optional(),
    despesaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
}).min(1);

export const despesaSubcategoriaSchema = Joi.object({
    nome: Joi.string().min(2).max(50).required(),
    categoria: Joi.string().required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

export const despesaSubcategoriaUpdateSchema = Joi.object({
    nome: Joi.string().min(2).max(50).optional(),
    categoria: Joi.string().required(),
    ativo: Joi.boolean()
}).min(1);

export const filtroBuscaSchema = Joi.object({
    ativo: Joi.boolean().optional(),
    cartaoCredito: Joi.string().alphanum().length(24).optional(),
    conta: Joi.string().alphanum().length(24).optional(),
    despesaCategoria: Joi.string().alphanum().length(24).optional(),
    email: Joi.string().min(2).max(50).lowercase().optional(),
    nome: Joi.string().min(2).max(50).optional(),
    receitaCategoria: Joi.string().alphanum().length(24).optional(),
    usuario: Joi.string().alphanum().length(24).optional()
});

export const receitaCartaoCreditoSchema = Joi.object({
    cartaoCredito: Joi.string().required(),
    valor: Joi.number().min(0.01).max(999999999).required(),
    dataTransacao: Joi.date().iso().required(),
    receitaCategoria: Joi.string().required(),
    receitaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
});

export const receitaCartaoCreditoUpdateSchema = Joi.object({
    cartaoCredito: Joi.string().optional(),
    valor: Joi.number().min(0.01).max(999999999).optional(),
    dataTransacao: Joi.date().iso().optional(),
    receitaCategoria: Joi.string().optional(),
    receitaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
}).min(1);

export const receitaCategoriaSchema = Joi.object({
    nome: Joi.string().min(2).max(50).required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

export const receitaCategoriaUpdateSchema = Joi.object({
    nome: Joi.string().min(2).max(50).optional(),
    ativo: Joi.boolean()
}).min(1);

export const receitaContaSchema = Joi.object({
    conta: Joi.string().required(),
    valor: Joi.number().required(),
    dataTransacao: Joi.date().iso().required(),
    receitaCategoria: Joi.string().required(),
    receitaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
});

export const receitaContaUpdateSchema = Joi.object({
    conta: Joi.string().optional(),
    valor: Joi.number().optional(),
    dataTransacao: Joi.date().iso().optional(),
    receitaCategoria: Joi.string().optional(),
    receitaSubcategoria: Joi.string().allow(null).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    observacao: Joi.string().allow('').optional(),
    ativo: Joi.boolean()
}).min(1);

export const receitaSubcategoriaSchema = Joi.object({
    nome: Joi.string().min(2).max(50).required(),
    categoria: Joi.string().required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

export const receitaSubcategoriaUpdateSchema = Joi.object({
    nome: Joi.string().min(2).max(50).optional(),
    categoria: Joi.string().optional(),
    ativo: Joi.boolean()
}).min(1);

export const tagSchema = Joi.object({
    nome: Joi.string().min(2).max(50).required(),
    usuario: Joi.string().required(),
    ativo: Joi.boolean()
});

export const tagUpdateSchema = Joi.object({
    nome: Joi.string().min(2).max(50).optional(),
    ativo: Joi.boolean()
}).min(1);

export const tokenSchema = Joi.object({
    usuario: Joi.string().required(),
    valor: Joi.string().required(),
    tipo: Joi.string().valid(...Object.values(EnumTipoToken)).required(),
    expiraEm: Joi.date().iso().min('now').required(),
    ativo: Joi.boolean().default(true).optional()
});

export const tokenUpdateSchema = Joi.object({
    usuario: Joi.string().optional(),
    valor: Joi.string().optional(),
    tipo: Joi.string().valid(...Object.values(EnumTipoToken)).optional(),
    expiraEm: Joi.date().iso().min('now').optional(),
    ativo: Joi.boolean().optional()
}).min(1);

const dataMinima = new Date();
dataMinima.setFullYear(dataMinima.getFullYear() - 16);

export const usuarioSchema = Joi.object({
    nome: Joi.string().min(3).max(50).required(),
    sobrenome: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().lowercase().required(),
    senha: PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
    }).required(),
    dataNascimento: Joi.date().iso().max(dataMinima).required(),
    telefone: Joi.string().optional(),
    ultimoAcesso: Joi.date().iso().optional(),
    ativo: Joi.boolean().optional(),
    aparencia: Joi.string().valid(...Object.values(EnumAparencias)).default(EnumAparencias.DARK_MODE).optional(),
    idioma: Joi.string().valid(...Object.values(EnumIdiomas)).default(EnumIdiomas.PT_BR).required(),
    moeda: Joi.string().valid(...Object.values(EnumMoedas)).default(EnumMoedas.BRL).required(),
    formatoData: Joi.string().valid(...Object.values(EnumFormatoData)).default(EnumFormatoData.DD_MM_YYYY).required()
});

export const usuarioUpdateSchema = Joi.object({
    nome: Joi.string().min(3).max(50).optional(),
    sobrenome: Joi.string().min(3).max(10).optional(),
    email: Joi.string().email().lowercase().optional(),
    senha: PasswordComplexity({
        min: 8,
        max: 25,
        lowerCase: 1,
        upperCase: 1,
        numeric: 1,
        symbol: 1,
        requirementCount: 4,
    }).required(),
    dataNascimento: Joi.date().iso().max(dataMinima).optional(),
    telefone: Joi.string().optional(),
    ultimoAcesso: Joi.date().iso().optional(),
    ativo: Joi.boolean().optional(),
    aparencia: Joi.string().valid(...Object.values(EnumAparencias)).optional(),
    idioma: Joi.string().valid(...Object.values(EnumIdiomas)).optional(),
    moeda: Joi.string().valid(...Object.values(EnumMoedas)).optional(),
    formatoData: Joi.string().valid(...Object.values(EnumFormatoData)).optional(),
}).min(1);