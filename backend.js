import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORTA = 3000;
const diretorioAtual = path.dirname(fileURLToPath(import.meta.url));
const arquivoFrontend = path.join(diretorioAtual, "frontend.html");

const tarefas = [
  { id: 1, titulo: "Estudar API REST", concluida: false },
  { id: 2, titulo: "Fazer os exercícios", concluida: true },
  { id: 3, titulo: "Revisar o código", concluida: false },
];

const servidor = http.createServer((requisicao, resposta) => {
  const url = new URL(requisicao.url, `http://${requisicao.headers.host}`);

  if (requisicao.method === "GET" && url.pathname === "/") {
    fs.readFile(arquivoFrontend, (erro, conteudo) => {
      if (erro) {
        console.error("Não foi possível ler frontend.html:", erro);
        resposta.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        resposta.end("Erro ao carregar a página.");
        return;
      }

      resposta.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      resposta.end(conteudo);
    });
    return;
  }

  if (requisicao.method === "GET" && url.pathname === "/api/tarefas") {
    resposta.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
    });
    resposta.end(JSON.stringify(tarefas));
    return;
  }

  resposta.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  resposta.end(JSON.stringify({ erro: "Rota não encontrada." }));
});

servidor.listen(PORTA, () => {
  console.log(`Aplicação disponível em http://localhost:${PORTA}`);
  console.log(`API de tarefas: http://localhost:${PORTA}/api/tarefas`);
});
