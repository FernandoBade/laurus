/**
 * Bem-vindo ao arquivo de mensagens do nosso aplicativo! Aqui, mapeamos mensagens em diferentes idiomas
 * para tornar a experiência do usuário mais amigável. É como o Laurus funciona quando se trata de mensagens.
 *
 * Como usar:
 *
 * 1. Importe o arquivo de mensagens onde você precisar usá-lo:
 *
 *    import mensagens from './mensagens';
 *
 * 2. Escolha o idioma que você deseja usar (por exemplo, 'pt-BR' para português brasileiro).
 *    Altere a constante 'idioma' para o idioma desejado:
 *
 *    const idioma = 'pt-BR'; // Altere para o idioma desejado
 *
 * 3. Agora você pode acessar mensagens específicas para o idioma e cenário desejado.
 *    Por exemplo, para obter a mensagem de "Usuário não encontrado", você pode fazer o seguinte:
 *
 *    const mensagem = mensagens[idioma]['usuarioNaoEncontrado'];
 *
 * Lembre-se de que isso torna a localização do nosso aplicativo mais fácil, permitindo que forneçamos
 * mensagens personalizadas em diferentes idiomas.
 */

type Resources = Record<string, Record<string, string>>;

const resources: Resources = {
    "pt-BR": {
        "usuarioNaoEncontrado": "Usuário não encontrado",
        "senhaIncorreta": "Senha incorreta",
        "erroAoFazerLogin": "Erro ao fazer login",
        "erroInternoNoServidor": "Erro interno no servidor",
        "logoutSucesso": "Logout realizado com sucesso.",
        "loginSucesso": "Login realizado com sucesso!"
    },
    "en-US": {
        "usuarioNaoEncontrado": "User not found",
        "senhaIncorreta": "Incorrect password",
        "erroAoFazerLogin": "Login error",
        "erroInternoNoServidor": "Internal server error",
        "logoutSucesso": "Logout successful.",
        "loginSucesso": "Login successful!"
    },
    "es-ES": {
        "usuarioNaoEncontrado": "Usuario no encontrado",
        "senhaIncorreta": "Contraseña incorrecta",
        "erroAoFazerLogin": "Error de inicio de sesión",
        "erroInternoNoServidor": "Error interno del servidor",
        "logoutSucesso": "Cierre de sesión exitoso.",
        "loginSucesso": "Login realizado con éxito!"
    }
};

export default resources;
