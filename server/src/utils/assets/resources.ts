import i18n from 'i18next';

const resources = {
    "pt-BR": {
        translation: {
            "erro.atualizarUsuario": "Erro ao atualizar o usuário.",
            "erro.buscarUsuario": "Erro ao buscar usuários.",
            "erro.emailJaCadastrado": "O e-mail já existe em nosso sistema. Gostaria de recuperar a senha?",
            "erro.encontrarUsuario": "Não encontramos nenhum usuário com os dados informados. Por favor, revise as informações e tente novamente.",
            "erro.excluirUsuario": "Erro ao atualizar o usuário.",
            "erro.listarUsuarios": "Erro ao recuperar a lista de usuários.",
            "erro.login": "Erro ao realizar o login.",
            "erro.senhaIncorreta": "Senha inválida. Por favor, tente novamente.",
            "erro.registrarUsuario": "Erro ao registrar novo usuário.",
            "erro.validacaoDadosUsuario": "Houve um erro na validação dos dados. Por favor, verifique os valores informados.",
            "erro.variavelAmbiente": "Erro ao obter uma variável de ambiente.",
            "sucesso.atualizarUsuario": "Dados atualizados com sucesso, {{usuario.nome}}!",
            "sucesso.encontrarUsuario": "Usuário(s) encontrado(s) com sucesso!",
            "sucesso.excluirUsuario": "Usuário excluído com sucesso. Nos vemos por aí, {{usuario.nome}}!",
            "sucesso.listaUsuarios": "Sucesso ao recuperar a lista de usuários.",
            "sucesso.login": "Que bom ter você de volta, {{usuario.nome}}!",
            "sucesso.logout": "Até breve!",
            "sucesso.registroNovoUsuario": "Usuário cadastrado com sucesso! É bom ter você com a gente, {{usuario.nome}}!",
        }
    },
    "en-US": {
        translation: {

        }
    },
    "es-ES": {
        translation: {

        }
    }
};

i18n
    .init({
        resources,
        fallbackLng: "pt-BR", // Idioma de fallback caso o idioma do usuário não esteja disponível
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
