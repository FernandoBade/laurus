/**
 * Aqui é nosso arquivo de configuração do i18next. Este arquivo define as traduções
 * em diferentes idiomas para tornar a experiência do usuário mais amigável e globalizada.
 *
 * Como usar:
 *
 * 1. Importe o i18n configurado onde você precisar de traduções:
 *
 *    import i18n from './i18nConfig';
 *
 * 2. Utilize a função `i18n.t` para obter as mensagens traduzidas. Você pode especificar o idioma
 *    diretamente nas configurações do i18next ou deixar que o `LanguageDetector` escolha o idioma
 *    baseado nas preferências do navegador do usuário:
 *
 *    const message = i18n.t('usuarioNaoEncontrado');
 *
 * 3. O i18next automaticamente escolherá o idioma baseado na detecção do idioma do navegador do usuário
 *    ou usará o idioma de fallback definido ('pt-BR' neste caso) se o idioma do usuário não estiver disponível.
 *
 * Este arquivo centraliza a configuração do i18next e as traduções, facilitando a gestão das mensagens
 * multilíngues em nosso aplicativo.
 */


import i18n from 'i18next';

const resources = {
    "pt-BR": {
        translation: {
            "usuarioNaoEncontrado": "Usuário não encontrado.",
            "senhaIncorreta": "Senha incorreta. Tente novamente, por favor.",
            "erroAoFazerLogin": "Erro ao fazer login. Por favor, revise os dados e tente novamente.",
            "erroInternoNoServidor": "Erro interno no servidor. Por favor, tente novamente dentro de alguns segundos ou entre em contato com o nosso suporte.",
            "logoutSucesso": "Login realizado com sucesso, {{usuario.nome}}.",
            "loginSucesso": "Login realizado com sucesso, {{usuario.nome}}.",
        }
    },
    "en-US": {
        translation: {
            "usuarioNaoEncontrado": "User not found",
            "senhaIncorreta": "Incorrect password",
            "erroAoFazerLogin": "Login error",
            "erroInternoNoServidor": "Internal server error",
            "logoutSucesso": "Logout successful, {{usuario.nome}}!",
            "loginSucesso": "Login successful. Welcome, {{usuario.nome}}!"
        }
    },
    "es-ES": {
        translation: {
            "usuarioNaoEncontrado": "Usuario no encontrado",
            "senhaIncorreta": "Contraseña incorrecta",
            "erroAoFazerLogin": "Error de inicio de sesión",
            "erroInternoNoServidor": "Error interno del servidor",
            "logoutSucesso": "Cierre de sesión exitoso, {{usuario.nome}}!",
            "loginSucesso": "Login realizado con éxito. Bien venido(a), {{usuario.nome}}!"
        }
    }
};

i18n
    .init({
        resources,
        fallbackLng: "pt-BR", // Idioma de fallback caso o idioma do usuário não esteja disponível
        interpolation: {
            escapeValue: false, // Evita o escape de HTML nas traduções
        }
    });

export default i18n;
