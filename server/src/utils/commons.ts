//#region _importacoes
import 'winston-daily-rotate-file';
import path from 'path';
import i18n from '../utils/assets/resources';
import Joi from 'joi';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import mongoose, { Model } from 'mongoose';
import { filtroBuscaSchema } from '../utils/assets/schemasJoi';
import { Request, Response, NextFunction } from 'express';
import { createLogger, format, transports, addColors } from 'winston';
import { addDays, format as formatDate, isAfter, isBefore, isEqual, parse, parseISO, subDays } from 'date-fns';

require('dotenv').config();
//#endregion _importacoes

//#region _i18next
/**
* Traduz uma chave para o idioma atualmente configurado, com suporte a parâmetros dinâmicos.
*
* @param {string} chave - A chave da mensagem a ser traduzida.
* @param {Object} [parametros] - Os parâmetros opcionais para a mensagem traduzida.
* @returns {string} A mensagem traduzida.
*/
export function resource(chave: string, parametros?: Record<string, any>): string {
    return i18n.t(chave, parametros);
}


/**
* Altera o idioma atualmente configurado no i18next.
*
* @param {string} idioma - O código do idioma para o qual mudar.
*/
export function alterarIdioma(idioma: string): void {
    i18n.changeLanguage(idioma);
}

/**
* Formata um número de acordo com o idioma e as configurações de localização atualmente configurados.
*
* @param {number} numero - O número a ser formatado.
* @param {Object} [opcoes] - As opções de formatação.
* @returns {string} O número formatado.
*/
export function formatarNumero(numero: number, opcoes?: Object): string {
    return i18n.t('formatNumber', { val: numero, format: opcoes });
    // Nota: Você precisa configurar um custom formatter ou adicionar essa chave no seu resource com uma função de formatação adequada.
}
//#endregion _i18next

//#region _logger
const logPath = path.join(__dirname, './logs/');

const customLevels = {
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        success: 5,
        info: 6,
        notice: 7,
    },
    colors: {
        emerg: 'magenta',
        alert: 'grey bold',
        crit: 'red',
        error: 'red bold',
        warning: 'yellow bold',
        success: 'green bold',
        info: 'green bold',
        notice: 'grey',
    },
};

addColors(customLevels.colors);

export const logger = createLogger({
    levels: customLevels.levels,
    format: format.combine(
        format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        format.json(),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console({
            level: 'notice',
            format: format.combine(
                format.colorize({ all: true }),
                format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
            )
        }),
        new transports.DailyRotateFile({
            filename: `${logPath}/laurus-%DATE%.log`,
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'notice',
            format: format.combine(
                format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
                format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
            ),
        }),
    ],
});

export default logger;
//#endregion _logger

//#region _date-fns
export function formatarDataPadraoUsuario(data: string | Date, formato: string = 'dd/MM/yyyy'): string {
    const dataObj = typeof data === 'string' ? parseISO(data) : data;
    return formatDate(dataObj, formato);
}

export function analisarData(dataString: string, formato: string = 'dd/MM/yyyy', referencia: Date = new Date()): Date {
    return parse(dataString, formato, referencia);
}

export function datasSaoIguais(data1: Date, data2: Date): boolean {
    return isEqual(data1, data2);
}

export function dataEhAnterior(data1: Date, data2: Date): boolean {
    return isBefore(data1, data2);
}

export function dataEhPosterior(data1: Date, data2: Date): boolean {
    return isAfter(data1, data2);
}

export function adicionarDias(data: Date, quantidade: number): Date {
    return addDays(data, quantidade);
}

export function subtrairDias(data: Date, quantidade: number): Date {
    return subDays(data, quantidade);
}
//#endregion _date-fns

//#region _gerais
/**
* Seleciona um número aleatório de tags de uma lista fornecida.
*
* @param {string[] | any[]} tags - A lista de tags.
* @param {number} maxTags - O número máximo de tags a serem selecionadas.
* @returns {string[] | any[]} Um subconjunto aleatório das tags fornecidas.
*/
export function selecionarTagsAleatorias(tags: string | any[], maxTags: number) {
    const numeroDeTags = Math.floor(Math.random() * (maxTags + 1));
    const tagsSelecionadas: string | any[] = [];

    for (let i = 0; i < numeroDeTags; i++) {
        const tagAleatoria = tags[Math.floor(Math.random() * tags.length)];
        if (!tagsSelecionadas.includes(tagAleatoria._id)) {
            tagsSelecionadas.push(tagAleatoria._id);
        }
    }

    return tagsSelecionadas;
}

/**
* Gera um número aleatório dentro de um intervalo especificado.
*
* @param {number} min - O valor mínimo do intervalo.
* @param {number} max - O valor máximo do intervalo.
* @returns {number} Um número aleatório dentro do intervalo especificado.
*/
export function gerarNumeroAleatorio(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
* Gera uma data aleatória, podendo ser no passado ou no futuro, a partir da data atual.
*
* @param {number} dias - O número de dias a partir de hoje para gerar a data.
* @param {number | boolean} passadoOuFuturo - Indica se a data deve ser no passado (-1) ou no futuro (1).
* @returns {Date} A data aleatória gerada.
*/
export function gerarDataAleatoria(dias: number, passadoOuFuturo: number | boolean) {
    const dataAtual = new Date();
    const diasAleatorios = Math.floor(Math.random() * dias);

    if (passadoOuFuturo === -1) {
        dataAtual.setDate(dataAtual.getDate() - diasAleatorios);
    } else if (passadoOuFuturo === 1) {
        dataAtual.setDate(dataAtual.getDate() + diasAleatorios);
    }

    return dataAtual;
}

/**
* Responde a uma requisição API de forma padrão e com uma mensagem internacionalizada.
* @param res Objeto de resposta do Express.
* @param status Código de status HTTP para a resposta.
* @param chave Chave de internacionalização para a mensagem de resposta.
* @param payload Dados de retorno da requisição, opcional.
* @param dados Valores e mensagens adicionais que serão adicionadas ao retorno, opcional.
*/
export function responderAPI(
    res: Response,
    status: number,
    chave: string,
    payload: any = null,
    dados: Record<string, any> = {} // Agora opcional e no final
) {
    const idioma = dados.idioma || 'pt-BR';
    const mensagem = i18n.t(chave, { lng: idioma, ...dados });

    let resposta: any = { mensagem };

    if (Array.isArray(payload)) {
        resposta = { ...resposta, total: payload.length, resultados: payload };
    } else if (payload !== null) {
        resposta = { ...resposta, dados: payload };
    }

    if (Object.keys(dados).length > 0) {
        resposta.dadosAdicionais = dados;
    }
    res.status(status).json(resposta);
}

import Token from '../models/token';
import { EnumTipoToken } from './assets/enums';

export const validarToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const jwtSecreto = process.env.JWT_SECRETO;
    const jwtSecretoRenovacao = process.env.JWT_SECRETO_RENOVACAO;

    if (!jwtSecreto || !jwtSecretoRenovacao) {
        throw new Error(resource('erro.variavelAmbiente'));
    }

    if (!token) {
        return responderAPI(res, 401, 'erro_tokenNaoFornecido');
    }

    jwt.verify(token, jwtSecreto, async (erro: VerifyErrors | null, decoded: any) => {
        if (erro) {
            // Se o token de acesso estiver vencido, tente renovar usando o token de renovação
            if (erro.name === 'TokenExpiredError') {
                const tokenRenovacao = await Token.findOne({ valor: token, tipo: EnumTipoToken.RENOVACAO });

                if (!tokenRenovacao || new Date() > tokenRenovacao.expiraEm) {
                    return responderAPI(res, 401, 'erro_tokenVencido');
                }

                const novoTokenAcesso = jwt.sign({ id: tokenRenovacao.usuario }, jwtSecreto, { expiresIn: '24h' });

                await new Token({
                    usuario: tokenRenovacao.usuario,
                    valor: novoTokenAcesso,
                    tipo: EnumTipoToken.ACESSO,
                    expiraEm: new Date(Date.now() + 24 * 3600 * 1000)
                }).save();

                req.headers['authorization'] = `Bearer ${novoTokenAcesso}`;
                next();
            } else {
                return responderAPI(res, 401, 'erro_sessaoExpirada', erro.message, {});
            }
        } else if (decoded && typeof decoded === 'object' && 'id' in decoded) {
            const usuario = await mongoose.model('Usuario').findById(decoded.id);

            if (!usuario) {
                return responderAPI(res, 404, 'erro_encontrarUsuario');
            }

            next();
        } else {
            return responderAPI(res, 401, 'erro_sessaoExpirada');
        }
    });
};

/**
 * Realiza a validação do token enviado nas requisições
 * @param req Objeto de requisição do Express.
 * @param res Objeto de resposta do Express.
 * @param joiSchema Schema que será validado pelo Joi
 */
export function validarCorpoDaRequisicao(joiSchema: Joi.Schema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error: erro, value: valor } = joiSchema.validate(req.body);
        if (erro) {
            responderAPI(res, 400, "erro_validacaoJoi", erro.details);
        } else {
            req.body = valor;
            next();
        }
    };
}

export const validarFiltrosBusca = (req: Request, res: Response, next: NextFunction) => {
    const { error: erro } = filtroBuscaSchema.validate(req.query);
    if (erro) return responderAPI(res, 400, "erro_validacaoJoi", erro.details);

    next();
};


//#endregion _gerais
