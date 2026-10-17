# Historinhas do Biju

App de histórias infantis com o Biju, um carrinho curioso e corajoso. As sugestões mudam conforme a data, as datas comemorativas por perto, a época do ano e o horário. Na hora de dormir, as histórias ficam curtas e calmas. Cada história é escrita na hora pelo Claude Haiku, com proteções para aceitar só temas infantis.

## Como o projeto é organizado

| Arquivo | O que é |
|---|---|
| `public/index.html` | O aplicativo: tela, ilustrações, sugestões, leitura em voz alta |
| `src/worker.js` | O servidor: proteções, limite de uso e chamada à API da Anthropic |
| `wrangler.toml` | Configuração do Cloudflare Worker |
| `tests/teste-protecoes.mjs` | Testes das proteções, com a API simulada (não gasta nada) |
| `CHANGELOG.md` | O que mudou em cada versão |

## Publicar pela primeira vez

### 1. Chave da API (Anthropic)

1. Entre em **console.anthropic.com** e crie uma conta.
2. Em **Billing**, coloque um crédito pequeno. US$ 5 já rendem milhares de histórias.
3. Em **Limits**, defina um **limite de gasto mensal**, por exemplo US$ 5.
4. Em **API Keys**, crie uma chave chamada `historinhas` e copie o valor, que começa com `sk-ant-`.

### 2. Ligar o GitHub ao Cloudflare

1. Crie uma conta gratuita em **dash.cloudflare.com**.
2. Vá em **Workers & Pages**, clique em **Create** e escolha importar um repositório do GitHub.
3. Autorize o Cloudflare a ver este repositório e selecione-o. Deixe as opções de build como vierem, com o comando de deploy `npx wrangler deploy`, e clique em **Deploy**.

A partir daí, **cada mudança enviada para a branch `main` publica o app sozinha**.

### 3. Guardar a chave como segredo

Na página do Worker, abra **Settings** e depois **Variables and Secrets**. Clique em **Add**, escolha o tipo **Secret**, use o nome `ANTHROPIC_API_KEY` e cole a chave. A chave nunca entra no repositório.

### 4. Ligar o limite diário por pessoa

1. Vá em **Storage & Databases**, depois em **KV**, e crie um espaço chamado `historinhas-limites`.
2. Copie o **ID** dele.
3. No `wrangler.toml`, cole o ID e tire o `#` das três linhas do bloco `kv_namespaces`. Envie a mudança, e o Cloudflare publica de novo sozinho.

O app fica em `https://historinhas.SEU-NOME.workers.dev`.

## Proteções contra pedidos que não são histórias

1. **Só o próprio app pode pedir**, e o pedido é montado no servidor.
2. **Campos curtos e limpos**: os nomes aceitam só letras, e os textos têm tamanho máximo.
3. **Palavras proibidas**: a lista `BLOQUEADAS` fica no começo de `src/worker.js`.
4. **Filtro com IA**: avalia o tema e o jeitinho do carrinho antes de gerar. Na dúvida, bloqueia.
5. **Regras fixas para o modelo**: o que o usuário digita é tratado como dado, nunca como ordem.
6. **Conferência da resposta**: se não começar com "TÍTULO:", a resposta é cortada.
7. **Limites** de histórias por pessoa por dia (`LIMITE_POR_PESSOA_DIA`) e de tamanho por história.

Nenhum filtro é perfeito. Mantenha o limite de gasto na Anthropic e olhe os **Logs** do Worker de vez em quando.

## Testar as proteções

```bash
node tests/teste-protecoes.mjs
```

## Rodar no computador (opcional)

Crie um arquivo `.dev.vars` com `ANTHROPIC_API_KEY=sk-ant-...` (ele é ignorado pelo Git) e rode:

```bash
npx wrangler dev
```

## Versões

Cada mudança vira um commit com uma descrição clara. As versões estáveis recebem uma tag (`v1.0.0`, `v1.1.0`…) e ficam registradas no `CHANGELOG.md`. Para voltar a uma versão antiga, use o histórico de deploys do Cloudflare (**Deployments**), que tem botão de voltar, ou reverta o commit no GitHub.

## Custo aproximado

Com o Claude Haiku 5.5, cada história custa por volta de US$ 0,0003 a US$ 0,0007, o que dá menos de US$ 1 a cada mil histórias. O Worker, a hospedagem e o KV cabem no plano gratuito do Cloudflare, que no KV conta até cerca de 1.000 histórias por dia.
