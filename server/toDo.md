## Próximos passos

#### Integrações

- [x] Setup inicial e criação do banco MySQL via Prisma;
- [x] Criação dos modelos base;
    - [x] Criação dos models/controllers de conta;
    - [x] Criação dos models/controllers de despesa;
    - [x] Criação dos models/controllers de cartão;
    - [x] Criação dos models/controllers de categoria, subcategoria e tags;
    - [x] Criação das variáveis de receita para os models/controllers existentes;
- [x] Aprimoramento no banco e criação das primeiras despesas de teste;
- [x] Alteração completa de MySQL para MongoDB;
- [x] Ajuste de todas as rotas da API e configuração completa do Insomnia;
- [x] Criação dos métodos para usuários;
    - [x] Criação do endpoint para cadastro de novos usuários;
    - [x] Criação da autenticação de login;
- [x] Configuração de token jwt e variáveis de ambiente para validar o login;
- [x] Criação da primeira massa de dados aleatórios no banco;
- [x] Criação de métodos para massa de dados de usuários, contas e despesas;
- [x] Adição da obrigatoriedade de envio do ID do usuário;
- [x] Remoção do tipoTransação tanto das despesas quanto das receitas;\
- [x] Ajustar os vínculos e interdependências;
    - [x] Vincular as subcategorias às categorias e não ao usuários;
    - [x] Vincular as despesas e receitas de conta às contas;
    - [x] Vincular as despesas e receitas de cartão de crédito aos cartões;
    - [x] Ajustar os métodos de criação e exclusão para adicionarem/removerem os vínculos;
- [ ] Refatorar os métodos de criação;
- [ ] Criar um padrão de erros, logs, catch, etc;
- [ ] Verificar a implantação de um sitema I18N;
- [ ] Limpar o banco e criar uma nova base sólida;
- [ ] Retestar as conexões via Insomnia;
- [ ] Instalar os pacotes para o front-end;
