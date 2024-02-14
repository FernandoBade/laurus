import i18n from 'i18next';

const resources = {
    "pt-BR": {
        translation: {
            "erro_atualizarUsuario": "Erro ao atualizar o usuário.",
            "erro_buscarUsuario": "Erro ao buscar usuário.",
            "erro_emailJaCadastrado": "O e-mail já existe em nosso sistema. Gostaria de recuperar a senha?",
            "erro_encontrarUsuario": "Não encontramos nenhum usuário com os dados informados.",
            "erro_excluirUsuario": "Erro ao excluir o usuário.",
            "erro_internoServidor": "Erro interno do servidor.",
            "erro_listarUsuarios": "Erro ao recuperar a lista de usuários.",
            "erro_login": "Erro ao realizar o login.",
            "erro_logout": "Erro ao realizar o logout.",
            "erro_senhaIncorreta": "Senha inválida. Por favor, tente novamente.",
            "erro_sessaoExpirada": "Sessão expirada. Para navegar, por favor faça o login novamente.",
            "erro_registrarUsuario": "Erro ao registrar novo usuário.",
            "erro_tokenNaoFornecido": "Token não enviado na requisição",
            "erro_tokenRenovacaoInvalido": "Token de renovação inválido. Acesso negado!",
            "erro_tokenVencido": "Token vencido. Faça login novamente para continuar",
            "erro_validacaoDadosUsuario": "Houve um erro na validação dos dados. Por favor, verifique os valores informados.",
            "erro_variavelAmbiente": "Erro ao obter uma variável de ambiente.",
            "log_erroCadastroUsuario": "Erro ao tentar cadastrar novo usuário.",
            "log_erroInternoServidor": "Erro interno do servidor: {{erro}}",
            "log_erroLogin": "Erro ao tentar realizar o login: {{email}}, {{erro}}",
            "log_erroLogout": "Erro ao tentar realizar o logout do usuario: {{email}}",
            "log_erroRenovarToken": "Erro ao tentar renovar o token de usuário. Usuário: {{email}}",
            "log_sucessoAtualizarUsuario": "Usuário atualizado: {{id}}",
            "log_sucessoCadastroUsuario": "Novo usuário registrado: {{id}}",
            "log_sucessoExcluirUsuario": "Usuário excluído: {{id}}",
            "log_sucessoLogin": "Acesso realizado: {{id}}",
            "log_sucessoLogout": "Logout e token removido: {{id}}",
            "log_tentativaLoginEmailInexistente": "Tentativa de acesso com e-mail inexistente: {{email}}",
            "log_tentativaLoginSenhaIncorreta": "Tentativa de acesso com senha incorreta: {{email}}",
            "sucesso_atualizarUsuario": "Dados atualizados com sucesso, {{usuario.nome}}!",
            "sucesso_encontrarUsuario": "Usuário encontrado com sucesso!",
            "sucesso_excluirUsuario": "Usuário excluído com sucesso. Nos vemos por aí, {{usuario.nome}}!",
            "sucesso_listaUsuarios": "Sucesso ao recuperar a lista de usuários. Total: {{quantidade}}",
            "sucesso_login": "Que bom ter você de volta, {{usuario.nome}}!",
            "sucesso_logout": "Até breve, {{usuario.nome}}!",
            "sucesso_registroNovoUsuario": "Usuário cadastrado com sucesso! É bom ter você com a gente, {{usuario.nome}}!",
            "sucesso_tokenRenovado": "Token renovado com sucesso!"
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
