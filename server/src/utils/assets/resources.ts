import i18n from 'i18next';

const resources = {
    "pt-BR": {
        translation: {
            "erro_atualizarUsuario": "Erro ao atualizar o usuário.",
            "erro_buscarUsuario": "Erro ao buscar usuário.",
            "erro_emailJaCadastrado": "O e-mail já existe em nosso sistema. Gostaria de recuperar a senha?",
            "erro_encontrarUsuario": "Usuário não encontrado.",
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
            "erro_validacaoJoi": "Houve um erro na validação dos dados. Por favor, verifique os valores informados.",
            "erro_variavelAmbiente": "Erro ao obter uma variável de ambiente.",
            "log_erroCadastroUsuario": "Erro ao tentar cadastrar novo usuário.",
            "log_erroInternoServidor": "Erro interno do servidor: {{erro}}",
            "log_erroLogin": "Erro ao tentar realizar o login: {{email}}, {{erro}}",
            "log_erroLogout": "Erro ao tentar realizar o logout do usuario: {{email}}",
            "log_erroRenovarToken": "Erro ao tentar renovar o token de usuário. Usuário: {{email}}",
            "log_sucessoAtualizarCartaoCredito": "Cartão de crédito atualizado com sucesso: {{id}}",
            "log_sucessoAtualizarUsuario": "Usuário atualizado com sucesso {{id}}",
            "log_sucessoCadastroCartaoCredito": "Novo cartão de crédito registrado com sucesso: {{id}}",
            "log_sucessoCadastroUsuario": "Novo usuário registrado com sucesso: {{id}}",
            "log_sucessoExcluirCartaoCredito": "Cartão de crédito excluído com sucesso: {{id}}",
            "log_sucessoExcluirUsuario": "Usuário excluído com sucesso: {{id}}",
            "log_sucessoLogin": "Acesso realizado com sucesso: {{id}}",
            "log_sucessoLogout": "Logout e token removido com sucesso: {{id}}",
            "log_tentativaLoginEmailInexistente": "Tentativa de acesso com e-mail inexistente: {{email}}",
            "log_tentativaLoginSenhaIncorreta": "Tentativa de acesso com senha incorreta: {{email}}",
            "sucesso_atualizarUsuario": "Dados atualizados com sucesso, {{usuario.nome}}!",
            "sucesso_encontrarUsuario": "Usuário encontrado com sucesso.",
            "sucesso_excluirUsuario": "Usuário excluído com sucesso. Nos vemos por aí, {{usuario.nome}}!",
            "sucesso_listaUsuarios": "Sucesso ao recuperar a lista de usuários.",
            "sucesso_login": "Que bom ter você de volta, {{usuario.nome}}!",
            "sucesso_logout": "Até breve, {{usuario.nome}}!",
            "sucesso_registroNovoUsuario": "Usuário cadastrado com sucesso.",
            "sucesso_tokenRenovado": "Token renovado com sucesso.",
            "log_sucessoCadastroConta": "Nova conta cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarConta": "Conta atualizada com sucesso: {{id}}",
            "log_sucessoExcluirConta": "Conta excluída com sucesso: {{id}}",
            "log_sucessoCadastroDespesaCartaoCredito": "Nova despesa no cartão de crédito cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarDespesaCartaoCredito": "Despesa no cartão de crédito atualizada com sucesso: {{id}}",
            "log_sucessoExcluirDespesaCartaoCredito": "Despesa no cartão de crédito excluída com sucesso: {{id}}",
            "log_sucessoCadastroDespesaCategoria": "Nova categoria de despesa cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarDespesaCategoria": "Categoria de despesa atualizada com sucesso: {{id}}",
            "log_sucessoExcluirDespesaCategoria": "Categoria de despesa excluída com sucesso: {{id}}",
            "log_sucessoCadastroDespesaConta": "Nova despesa na conta cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarDespesaConta": "Despesa na conta atualizada com sucesso: {{id}}",
            "log_sucessoExcluirDespesaConta": "Despesa na conta excluída com sucesso: {{id}}",
            "log_sucessoCadastroDespesaSubcategoria": "Nova subcategoria de despesa cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarDespesaSubcategoria": "Subcategoria de despesa atualizada com sucesso: {{id}}",
            "log_sucessoExcluirDespesaSubcategoria": "Subcategoria de despesa excluída com sucesso: {{id}}",
            "log_sucessoCadastroReceitaCartaoCredito": "Nova receita no cartão de crédito cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarReceitaCartaoCredito": "Receita no cartão de crédito atualizada com sucesso: {{id}}",
            "log_sucessoExcluirReceitaCartaoCredito": "Receita no cartão de crédito excluída com sucesso: {{id}}",
            "log_sucessoCadastroReceitaCategoria": "Nova categoria de receita cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarReceitaCategoria": "Categoria de receita atualizada com sucesso: {{id}}",
            "log_sucessoExcluirReceitaCategoria": "Categoria de receita excluída com sucesso: {{id}}",
            "log_sucessoCadastroReceitaSubcategoria": "Nova subcategoria de receita cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarReceitaSubcategoria": "Subcategoria de receita atualizada com sucesso: {{id}}",
            "log_sucessoExcluirReceitaSubcategoria": "Subcategoria de receita excluída com sucesso: {{id}}",
            "log_sucessoCadastroReceitaConta": "Nova de receita de conta cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarReceitaConta": "Receita de conta atualizada com sucesso: {{id}}",
            "log_sucessoExcluirReceitaConta": "Receita de conta excluída com sucesso: {{id}}",
            "log_sucessoCadastroTag": "Nova tag cadastrada com sucesso: {{id}}",
            "log_sucessoAtualizarTag": "Tag atualizada com sucesso: {{id}}",
            "log_sucessoExcluirTag": "Tag excluída com sucesso: {{id}}",
            "erro_validacaoCartaoCredito": "Erro na validação dos dados do cartão de crédito.",
            "erro_usuarioNaoEncontrado": "Usuário não encontrado.",
            "sucesso_cartaoCreditoCriado": "Cartão de crédito criado com sucesso.",
            "sucesso_listaCartoesCredito": "Cartões de crédito listados com sucesso.",
            "erro_cartaoCreditoNaoEncontrado": "Cartão de crédito não encontrado.",
            "sucesso_cartaoCreditoEncontrado": "Cartão de crédito encontrado com sucesso.",
            "erro_validacaoAtualizacaoCartaoCredito": "Erro na validação para atualização do cartão de crédito.",
            "sucesso_cartaoCreditoAtualizado": "Cartão de crédito atualizado com sucesso.",
            "sucesso_excluirCartaoCredito": "Cartão de crédito excluído com sucesso."
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
