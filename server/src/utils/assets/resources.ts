import i18n from 'i18next';

const resources = {
    "pt-BR": {
        translation: {
            "erro.atualizarUsuario": "Erro ao atualizar o usuário.",
            "erro.buscarUsuario": "Erro ao buscar usuário.",
            "erro.emailJaCadastrado": "O e-mail já existe em nosso sistema. Gostaria de recuperar a senha?",
            "erro.encontrarUsuario": "Não encontramos nenhum usuário com os dados informados. Por favor, revise as informações e tente novamente.",
            "erro.excluirUsuario": "Erro ao excluir o usuário.",
            "erro.listarUsuarios": "Erro ao recuperar a lista de usuários.",
            "erro.login": "Erro ao realizar o login.",
            "erro.senhaIncorreta": "Senha inválida. Por favor, tente novamente.",
            "erro.sessaoExpirada": "Sessão expirada. Para navegar, por favor faça o login novamente.",
            "erro.registrarUsuario": "Erro ao registrar novo usuário.",
            "erro.tokenNaoFornecido": "Token não enviado na requisição",
            "erro.tokenRenovacaoInvalido": "Token de renovação inválido. Acesso negado!",
            "erro.validacaoDadosUsuario": "Houve um erro na validação dos dados. Por favor, verifique os valores informados.",
            "erro.variavelAmbiente": "Erro ao obter uma variável de ambiente.",
            "log.erroCadastroUsuario": "Erro ao tentar cadastrar novo usuário.",
            "log.erroLogin": "Erro ao tentar realizar o login. suario",
            "log.erroLogout": "Erro ao tentar realizar o logout do usuario. Usuário: {{usuario.email}}",
            "log.erroRenovarToken": "Erro ao tentar renovar o token de usuário. Usuário: {{usuario.email}}",
            "log.erroExcluirUsuario": "Erro ao excluir um usuário. ID enviado: {{usuarioId}}",
            "log.sucessoAtualizarUsuario": "Alteração de dados realizada com sucesso. Usuario: {{usuarioId}}. Dados alterados: {{alteracoes}}",
            "log.sucessoCadastroUsuario": "Novo usuário registrado com sucesso. Usuário: {{usuario.email}}",
            "log.sucessoExcluirUsuario": "Usuário excluído com sucesso. Usuário: {{usuario.email}}",
            "log.sucessoLogin": "Login realizado com sucesso: Usuario: {{usuario.email}}",
            "log.sucessoLogout": "Logout e token removido com sucesso. Usuário: {{usuario.email}}",
            "log.tentativaLoginEmailInexistente": "Tentativa de acesso com e-mail inexistente. E-mail: {{email}}",
            "log.tentativaLoginSenhaIncorreta": "Tentativa de acesso com senha incorreta. Usuário: {{usuario.email}}",
            "sucesso.atualizarUsuario": "Dados atualizados com sucesso, {{usuario.nome}}!",
            "sucesso.encontrarUsuario": "Usuário encontrado com sucesso!",
            "sucesso.excluirUsuario": "Usuário excluído com sucesso. Nos vemos por aí, {{usuario.nome}}!",
            "sucesso.listaUsuarios": "Sucesso ao recuperar a lista de usuários. Total: {{quantidade}}",
            "sucesso.login": "Que bom ter você de volta, {{usuario.nome}}!",
            "sucesso.logout": "Até breve, {{usuario.nome}}!",
            "sucesso.registroNovoUsuario": "Usuário cadastrado com sucesso! É bom ter você com a gente, {{usuario.nome}}!",
            "sucesso.tokenRenovado": "Token renovado com sucesso!"
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
