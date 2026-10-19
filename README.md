# Once Upon a Time

Diário de histórias infantis com o Biju, um carrinho curioso e corajoso. Cada dia ganha uma página com a sua história, e dá para folhear o diário para reler as anteriores. As sugestões mudam conforme a data, as datas comemorativas por perto, a época do ano e o horário. Na hora de dormir, as histórias ficam curtas e calmas. Cada história é escrita na hora pelo Claude Haiku, com proteções para aceitar só temas infantis.

## Como o projeto é organizado

| Arquivo | O que é |
|---|---|
| `public/index.html` | O aplicativo: diário, sugestões, sumário, leitura em voz alta |
| `public/arte.js` | Os desenhos: o Biju, a turma, expressões, acessórios e cenários |
| `public/manifest.webmanifest`, `public/sw.js`, `public/icons/` | O que permite instalar o app e abrir sem internet |
| `src/worker.js` | O servidor: proteções, limite de uso e chamada à API da Anthropic |
| `wrangler.toml` | Configuração do Cloudflare Worker |
| `src/conta.js` | Login com Google, sessões e diário salvo na conta |
| `public/privacidade.html` | Política de privacidade |
| `tests/teste-protecoes.mjs` | Testes das proteções, com a API simulada (não gasta nada) |
| `tests/teste-conta.mjs` | Testes do login e do diário na conta, com Google e banco simulados |
| `CHANGELOG.md` | O que mudou em cada versão |

## Publicar pela primeira vez

### 1. Chave da API (Anthropic)

1. Entre em **console.anthropic.com** e crie uma conta.
2. Em **Billing**, coloque um crédito pequeno. US$ 5 já rendem milhares de histórias.
3. Em **Limits**, defina um **limite de gasto mensal**, por exemplo US$ 5.
4. Em **API Keys**, crie uma chave chamada `once-upon-a-time` e copie o valor, que começa com `sk-ant-`.

### 2. Ligar o GitHub ao Cloudflare

1. Crie uma conta gratuita em **dash.cloudflare.com**.
2. Vá em **Workers & Pages**, clique em **Create** e escolha importar um repositório do GitHub.
3. Autorize o Cloudflare a ver este repositório e selecione-o. Deixe as opções de build como vierem, com o comando de deploy `npx wrangler deploy`, e clique em **Deploy**.

A partir daí, **cada mudança enviada para a branch `main` publica o app sozinha**.

### 3. Guardar a chave como segredo

Na página do Worker, abra **Settings** e depois **Variables and Secrets**. Clique em **Add**, escolha o tipo **Secret**, use o nome `ANTHROPIC_API_KEY` e cole a chave. A chave nunca entra no repositório.

### 4. Ligar o limite diário por pessoa

1. Vá em **Storage & Databases**, depois em **KV**, e crie um espaço chamado `once-upon-a-time-limites`.
2. Copie o **ID** dele.
3. No `wrangler.toml`, cole o ID e tire o `#` das três linhas do bloco `kv_namespaces`. Envie a mudança, e o Cloudflare publica de novo sozinho.

O app fica em `https://once-upon-a-time.SEU-NOME.workers.dev`.

## Login com Google (opcional)

Com o login, o diário fica salvo na conta da família e aparece em qualquer aparelho. Enquanto ele não estiver configurado, o botão do Google fica escondido e o app guarda tudo só no aparelho.

### 1. Google Cloud: criar o ID do cliente

1. Entre em **console.cloud.google.com** com a sua conta Google e crie um projeto chamado `Once Upon a Time`.
2. No menu, abra **APIs e serviços → Tela de consentimento OAuth** (ou **Google Auth Platform**) e clique em **Começar**:
   - **Nome do app:** Once Upon a Time
   - **E-mail de suporte do usuário:** o seu e-mail
   - **Público:** Externo
   - **Dados de contato:** o seu e-mail
3. Em **Branding** (Marca), preencha:
   - **Página inicial do app:** `https://once-upon-a-time.paulorec.workers.dev`
   - **Política de privacidade:** `https://once-upon-a-time.paulorec.workers.dev/privacidade.html`
   - **Domínios autorizados:** `paulorec.workers.dev`
   - **Logotipo (opcional):** o arquivo `public/icons/icon-512.png`
4. Em **Clientes**, clique em **Criar cliente**:
   - **Tipo de aplicativo:** Aplicativo da Web
   - **Nome:** Once Upon a Time
   - **Origens JavaScript autorizadas:** `https://once-upon-a-time.paulorec.workers.dev`
   - **URIs de redirecionamento:** deixe em branco
5. Copie o **ID do cliente** (termina em `.apps.googleusercontent.com`). Ele é público. A "chave secreta do cliente" não é usada; não a compartilhe.
6. Em **Público**, o app começa em modo de **teste**: só as contas adicionadas em "Usuários de teste" conseguem entrar (até 100). Quando quiser abrir para todos, clique em **Publicar app**. Como o app só pede nome e e-mail, normalmente não há verificação demorada.

### 2. Cloudflare: criar o banco

1. No painel do Cloudflare, vá em **Storage & Databases → D1** e clique em **Create**.
2. Dê o nome `once-upon-a-time-db` e crie.
3. Copie o **Database ID**.

### 3. Ligar tudo

No `wrangler.toml`, tire o `#` das linhas de `[vars]` e de `[[d1_databases]]`, cole o ID do cliente e o ID do banco e envie a mudança. O Cloudflare publica sozinho, e as tabelas são criadas no primeiro uso.

### Como funciona

- O botão do Google aparece nos **Ajustes** e na apresentação inicial.
- O servidor confere o comprovante do Google (assinatura, app de destino, emissor e validade) e cria uma sessão num cookie protegido, que vale 60 dias.
- Ao entrar, o diário do aparelho e o da conta são juntados: as histórias são somadas sem repetir, as apagadas não voltam e as preferências mais recentes valem.
- Depois disso, cada mudança é salva na conta automaticamente.
- Com login, o limite diário de histórias passa a ser por conta.
- Nos **Ajustes** há "Sair" e "Apagar conta e diário salvo", que apaga tudo do servidor na hora.

## Instalar no celular

- **Android (Chrome)**: abra o app e toque em **Instalar** no topo da página. Se o botão não aparecer, use o menu ⋮ e depois **Instalar app** (ou **Adicionar à tela inicial**).
- **iPhone (Safari)**: toque em **Compartilhar** e depois em **Adicionar à Tela de Início**.

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
node tests/teste-conta.mjs
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
