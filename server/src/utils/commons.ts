//#region _importacoes
import { createLogger, format, transports, addColors } from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import i18n from '../utils/assets/resources';

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

/**
 * Formata uma data de acordo com o idioma e as configurações de localização atualmente configurados.
 *
 * @param {Date} data - A data a ser formatada.
 * @param {Object} [opcoes] - As opções de formatação.
 * @returns {string} A data formatada.
 */
export function formatarData(data: Date, opcoes?: Object): string {
    return i18n.t('formatDate', { val: data, format: opcoes });
    // Nota: Assim como na formatação de número, você precisa de uma custom formatter ou adicionar essa chave no seu resource.
}

//#endregion i18next


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

const logger = createLogger({
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

/**
 * Registra uma mensagem de log no nível de emergência, indicando uma situação crítica onde o sistema está inutilizável.
 * @param {string} message - A mensagem de log a ser registrada.
 */
export function logEmerg(message: string) {
    logger.emerg(message);
}

/**
 * Registra uma mensagem de log no nível de alerta, sugerindo que uma ação imediata é necessária.
 * @param {string} message - A mensagem de log a ser registrada.
 */
export function logAlert(message: string) {
    logger.alert(message);
}

/**
 * Registra uma mensagem de log no nível crítico, indicando condições críticas que podem tornar o serviço indisponível.
 * @param {string} message - A mensagem de log a ser registrada.
 */
export function logCrit(message: string) {
    logger.crit(message);
}

/**
 * Registra uma mensagem de log no nível de erro, indicando condições de erro sob as quais uma função falhou.
 * @param {string} message - A mensagem de log a ser registrada.
 */
export function logError(message: string) {
    logger.error(message);
}

/**
 * Registra uma mensagem de log no nível de aviso, indicando condições potencialmente prejudiciais.
 * @param {string} message - A mensagem de log a ser registrada.
 */
export function logWarning(message: string) {
    logger.warning(message);
}

/**
 * Registra uma mensagem de log no nível informativo e de sucesso, fornecendo informações sobre o estado operacional do sistema.
 * @param {string} message - A mensagem de log a ser registrada.
 */
export function logInfo(message: string) {
    logger.info(message);
}

/**
 * Registra uma mensagem de log no nível de aviso, indicando uma condição normal, mas significativa, que deve ser observada.
 * @param {string} message - A mensagem de log a ser registrada.
 */
export function logNotice(message: string) {
    logger.notice(message);
}

//#endregion _logger

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
//#endregion _gerais/tratamentos