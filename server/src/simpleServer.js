import { createServer } from 'http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Funcionando');
});

server.listen(2024, () => {
  console.log('Servidor rodando na porta 2024');
});
