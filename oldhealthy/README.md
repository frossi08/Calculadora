# OldHealthy — Tecnologia que cuida

App de saúde para pessoas idosas, feito para celular (funciona no navegador e pode ser instalado na tela inicial).

## Funcionalidades

- **Boas-vindas** e **Login / Cadastro** (conta demo: `maria@oldhealthy.app` / `Maria@123`), com tela de "Continuar com Google" (demonstração).
- **Início**: saudação, botão **SOS** (contagem de 5s e números do contato, SAMU 192 e Bombeiros 193), check-in diário, "Hoje no seu dia", atalhos e acesso ao chat.
- **Medicamentos**: horários, marcar como tomado (zera a cada dia), adicionar, apagar e aviso quando o remédio bate com uma alergia cadastrada.
- **Consultas**: próximas e anteriores, adicionar e apagar.
- **Lembretes**: ligar/desligar, adicionar e apagar. Com o app aberto, mostra um aviso na hora certa (e notificação do aparelho, se permitida).
- **Check-in diário**: humor, sono, dor e remédios.
- **Bem-estar**: últimos 7 ou 30 dias, humor médio, % de check-ins, gráfico de humor e dias com dor.
- **Agenda**: o dia hora a hora e as próximas consultas.
- **Dúvidas (chat de IA)**: assistente em português, com cuidado para idosos e alerta de emergência.
- **Perfil**: contato de emergência com "Ligar agora", tipo sanguíneo e alergias, editar perfil.
- **Configurações** (engrenagem azul): tamanho do texto, tema claro/escuro, notificações, apagar conversa e sair.

Os dados ficam salvos no próprio aparelho (localStorage).

## Rodar com a IA funcionando

O chat usa a API do Claude, que **é paga**: você precisa de uma chave em https://console.anthropic.com (créditos pré-pagos).

```bash
cd oldhealthy
npm install
ANTHROPIC_API_KEY=sk-ant-sua-chave npm start
# abra http://localhost:3000
```

- A chave fica só no servidor (`server.js`), nunca no navegador.
- Modelo padrão: `claude-opus-5-5`. Para trocar, defina `ANTHROPIC_MODEL` (ex.: `claude-haiku-5-5`, bem mais barato).
- Sem chave, o app funciona normalmente e o chat responde no modo básico (respostas prontas sobre pressão, sono, diabetes e remédios).

Para publicar na internet, use qualquer serviço que rode Node 18+ (Render, Railway, Fly.io, uma VPS…) e configure a variável `ANTHROPIC_API_KEY` no painel do serviço.

## Editar o app

O código fica em `src/app.html`. Depois de editar, rode `python3 build.py` para gerar o `index.html` (que embute a ilustração de `assets/`).
