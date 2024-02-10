//#region _importacoes
import { createLogger, format, transports, addColors } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import i18n from '../utils/assets/resources';
import { Response } from 'express';
import { IUsuario } from '../interfaces/IUsuario';

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
            filename: `${logPath}/application-%DATE%.log`,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '30d',
            level: 'info',
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
import { addDays, format as formatDate, isAfter, isBefore, isEqual, parse, parseISO, subDays } from 'date-fns';

// Certifique-se de que esta função seja única no módulo e não tenha conflitos de nomeação
export function formatarDataPadraoUsuario(data: string | Date, formato: string = 'dd/MM/yyyy'): string {
    const dataObj = typeof data === 'string' ? parseISO(data) : data;
    return formatDate(dataObj, formato);
}

// Analisa uma string de data no formato especificado para um objeto Date
export function analisarData(dataString: string, formato: string = 'dd/MM/yyyy', referencia: Date = new Date()): Date {
    return parse(dataString, formato, referencia);
}

// Verifica se duas datas são iguais
export function datasSaoIguais(data1: Date, data2: Date): boolean {
    return isEqual(data1, data2);
}

// Verifica se a primeira data é anterior à segunda
export function dataEhAnterior(data1: Date, data2: Date): boolean {
    return isBefore(data1, data2);
}

// Verifica se a primeira data é posterior à segunda
export function dataEhPosterior(data1: Date, data2: Date): boolean {
    return isAfter(data1, data2);
}

// Adiciona uma quantidade de dias a uma data
export function adicionarDias(data: Date, quantidade: number): Date {
    return addDays(data, quantidade);
}

// Subtrai uma quantidade de dias de uma data
export function subtrairDias(data: Date, quantidade: number): Date {
    return subDays(data, quantidade);
}
//#endregion _date-fns

//#region _gerais/tratamentos
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
* Responde a uma requisição API com uma mensagem internacionalizada.
* @param res Objeto de resposta do Express.
* @param status Código de status HTTP para a resposta.
* @param chave Chave de internacionalização para a mensagem de resposta.
* @param usuario Objeto do usuário para interpolação e idioma.
* @param dados Opcionais dados adicionais para interpolação na mensagem.
*/

export function responderAPI(
    res: Response,
    status: number,
    chave: string,
    dados: Record<string, any> = {},
    payload: any = null  // Adicione um parâmetro adicional para dados de payload
) {
    const idioma = dados.idioma || 'pt-BR'; // Assume 'pt-BR' como padrão se o idioma não for especificado
    const mensagem = i18n.t(chave, { lng: idioma, ...dados });

    // Se houver payload, inclua-o na resposta junto com a mensagem internacionalizada
    if (payload !== null) {
        res.status(status).json({ mensagem, dados: payload });
    } else {
        res.status(status).json(status >= 400 ? { erro: mensagem } : { mensagem });
    }
}



//#endregion _gerais/tratamentos