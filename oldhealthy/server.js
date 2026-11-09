// Servidor do OldHealthy: entrega o app e faz a ponte segura com a IA (Claude).
// A chave da API fica só aqui no servidor, nunca no navegador.
//
//   npm install
//   ANTHROPIC_API_KEY=sk-ant-... npm start      -> http://localhost:3000
//
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";

const here = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";
const hasKey = Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
const client = hasKey ? new Anthropic() : null;

const RULES = `Você é a assistente de saúde do aplicativo OldHealthy e conversa com uma pessoa idosa. Fale sempre em português do Brasil, com carinho e respeito, frases curtas e palavras simples. Responda em no máximo 120 palavras. Use listas curtas com "- " quando ajudar, e **negrito** só no essencial. Você não substitui o médico: para dose, troca, início ou suspensão de remédios, oriente a confirmar com o médico ou farmacêutico. Considere as alergias e os remédios da pessoa ao responder e avise se algo citado tiver relação com uma alergia cadastrada. Se a pessoa descrever sinal de emergência (dor ou aperto no peito, falta de ar forte, fraqueza ou formigamento de um lado do corpo, boca torta ou fala enrolada, desmaio, sangramento forte, queda com batida na cabeça, confusão de repente), diga logo no começo para ligar 192 (SAMU) ou apertar o botão SOS do aplicativo.`;

function cleanMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const msgs = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  return msgs;
}

async function chat(body) {
  const messages = cleanMessages(body.messages);
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return { status: 400, json: { error: "Mensagem vazia." } };
  }
  const context = typeof body.context === "string" ? body.context.slice(0, 2000) : "";
  // Fallback do lado do servidor: se o modelo recusar por engano, a API tenta outro modelo automaticamente.
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: `${RULES}\n\nDados da pessoa (informados por ela no app): ${context}`,
    messages,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });
  if (response.stop_reason === "refusal") {
    return { status: 200, json: { text: "Não consigo responder essa pergunta. O melhor é conversar com o seu médico." } };
  }
  const text = response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  return { status: 200, json: { text: text || "Desculpe, não consegui responder agora." } };
}

const TYPES = { ".html": "text/html; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".js": "text/javascript" };

const server = http.createServer(async (req, res) => {
  const send = (status, data, type = "application/json") => {
    res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
    res.end(type === "application/json" ? JSON.stringify(data) : data);
  };
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/api/health") return send(200, { ok: true, ai: hasKey });
    if (url.pathname === "/api/chat" && req.method === "POST") {
      if (!client) return send(503, { error: "Servidor sem ANTHROPIC_API_KEY." });
      let raw = "";
      for await (const chunk of req) { raw += chunk; if (raw.length > 100_000) return send(413, { error: "Mensagem grande demais." }); }
      const out = await chat(JSON.parse(raw || "{}"));
      return send(out.status, out.json);
    }
    // Arquivos estáticos (index.html, manifest, ícones)
    const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    if (file.includes("..") || file.startsWith("src/") || file === "server.js" || file.startsWith("node_modules")) return send(404, { error: "Não encontrado" });
    const data = await readFile(path.join(here, file));
    return send(200, data, TYPES[path.extname(file)] || "application/octet-stream");
  } catch (err) {
    if (err && err.code === "ENOENT") return send(404, { error: "Não encontrado" });
    if (err instanceof Anthropic.RateLimitError) return send(429, { error: "Muitas perguntas seguidas. Tente em instantes." });
    if (err instanceof Anthropic.AuthenticationError) return send(500, { error: "Chave da API inválida." });
    if (err instanceof Anthropic.APIError) { console.error("Erro da API:", err.status, err.message); return send(502, { error: "A IA está indisponível agora." }); }
    console.error(err);
    return send(500, { error: "Erro no servidor." });
  }
});

server.listen(PORT, () => {
  console.log(`OldHealthy rodando em http://localhost:${PORT}`);
  console.log(hasKey ? `IA ativa com o modelo ${MODEL}.` : "Sem ANTHROPIC_API_KEY: o chat funciona só no modo básico (offline).");
});
