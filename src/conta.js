// Login com Google e diário salvo na conta (banco Cloudflare D1).
//
// Como funciona:
//  1. O app mostra o botão do Google. O Google devolve um "comprovante" assinado (ID token).
//  2. Aqui no servidor conferimos a assinatura com as chaves públicas do Google, o app de
//     destino (GOOGLE_CLIENT_ID), quem emitiu e a validade.
//  3. Criamos uma sessão com um código aleatório guardado num cookie seguro (HttpOnly).
//  4. O diário (preferências e histórias) fica na tabela "contas", ligado à conta Google.
//
// Precisa de: variável GOOGLE_CLIENT_ID e banco D1 ligado como "DB" (ver wrangler.toml).

const COOKIE = "oua_sessao";
const DIAS_SESSAO = 60;
const MAX_DADOS = 1_500_000; // ~1,5 MB por diário

function json(obj, status = 200, headers = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

function b64uParaBytes(s) {
  s = String(s).replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}
function b64uParaJSON(s) {
  return JSON.parse(new TextDecoder().decode(b64uParaBytes(s)));
}

// Chaves públicas do Google, guardadas por 1 hora
let jwks = null, jwksEm = 0;
async function chavesGoogle(forcar = false) {
  if (!forcar && jwks && Date.now() - jwksEm < 3600e3) return jwks;
  const r = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  if (!r.ok) throw new Error("não consegui buscar as chaves do Google");
  jwks = (await r.json()).keys || [];
  jwksEm = Date.now();
  return jwks;
}

export async function verificarTokenGoogle(token, clientId, agora = Date.now()) {
  const partes = String(token).split(".");
  if (partes.length !== 3) throw new Error("token mal formado");
  const [h, p, assinatura] = partes;
  const header = b64uParaJSON(h);
  const dados = b64uParaJSON(p);
  if (header.alg !== "RS256") throw new Error("algoritmo inesperado");

  let jwk = (await chavesGoogle()).find((k) => k.kid === header.kid);
  if (!jwk) jwk = (await chavesGoogle(true)).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error("chave desconhecida");

  const chave = await crypto.subtle.importKey(
    "jwk", { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"],
  );
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", chave, b64uParaBytes(assinatura), new TextEncoder().encode(h + "." + p));
  if (!ok) throw new Error("assinatura inválida");
  if (dados.aud !== clientId) throw new Error("token de outro app");
  if (dados.iss !== "accounts.google.com" && dados.iss !== "https://accounts.google.com") throw new Error("emissor inválido");
  if (!dados.exp || dados.exp * 1000 < agora) throw new Error("token vencido");
  if (!dados.sub) throw new Error("token sem conta");
  if (dados.email && dados.email_verified === false) throw new Error("e-mail não verificado");
  return dados;
}

let tabelasProntas = false;
async function prepararBanco(db) {
  if (tabelasProntas) return;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS contas (sub TEXT PRIMARY KEY, email TEXT, nome TEXT, dados TEXT, criado INTEGER, atualizado INTEGER)"),
    db.prepare("CREATE TABLE IF NOT EXISTS sessoes (token TEXT PRIMARY KEY, sub TEXT NOT NULL, expira INTEGER NOT NULL)"),
  ]);
  tabelasProntas = true;
}

function lerCookie(req, nome) {
  const c = req.headers.get("cookie") || "";
  const m = c.match(new RegExp("(?:^|;\\s*)" + nome + "=([^;]+)"));
  return m ? m[1] : "";
}
function novoToken() {
  const b = new Uint8Array(32);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function cookieSessao(token, maxAge) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export async function sessaoAtual(req, env) {
  if (!env.DB) return null;
  const token = lerCookie(req, COOKIE);
  if (!/^[0-9a-f]{64}$/.test(token)) return null;
  await prepararBanco(env.DB);
  const s = await env.DB
    .prepare("SELECT s.sub, c.email, c.nome FROM sessoes s JOIN contas c ON c.sub = s.sub WHERE s.token = ? AND s.expira > ?")
    .bind(token, Date.now()).first();
  return s ? { ...s, token } : null;
}

function limparDados(b) {
  const prefs = b && typeof b.prefs === "object" && b.prefs ? b.prefs : {};
  const stories = (Array.isArray(b && b.stories) ? b.stories : [])
    .filter((s) => s && typeof s.id === "string" && Array.isArray(s.paras))
    .slice(-1000);
  const apagadas = (Array.isArray(b && b.apagadas) ? b.apagadas : []).filter((x) => typeof x === "string").slice(-2000);
  return { prefs, stories, apagadas };
}

// Devolve uma resposta se a rota for de conta; senão, null.
export async function rotasConta(req, env, url) {
  const p = url.pathname;
  if (p === "/api/config" && req.method === "GET") {
    return json({ google: env.GOOGLE_CLIENT_ID || null, sync: !!env.DB });
  }
  if (p !== "/api/login" && p !== "/api/logout" && p !== "/api/conta") return null;

  if (req.method !== "GET") {
    const origem = req.headers.get("origin");
    if (origem && origem !== url.origin) return json({ erro: "Pedido não permitido." }, 403);
  }
  if (!env.DB || !env.GOOGLE_CLIENT_ID) return json({ erro: "O login ainda não foi configurado." }, 503);
  await prepararBanco(env.DB);

  if (p === "/api/login" && req.method === "POST") {
    let b;
    try { b = await req.json(); } catch { return json({ erro: "Pedido inválido." }, 400); }
    let info;
    try {
      info = await verificarTokenGoogle(String((b && b.credential) || ""), env.GOOGLE_CLIENT_ID);
    } catch (e) {
      console.log("Login recusado:", e.message);
      return json({ erro: "Não foi possível confirmar a conta Google." }, 401);
    }
    const agora = Date.now();
    await env.DB
      .prepare("INSERT INTO contas (sub, email, nome, dados, criado, atualizado) VALUES (?, ?, ?, NULL, ?, ?) ON CONFLICT(sub) DO UPDATE SET email = excluded.email, nome = excluded.nome")
      .bind(info.sub, info.email || "", info.name || "", agora, agora).run();
    const token = novoToken();
    await env.DB.batch([
      env.DB.prepare("DELETE FROM sessoes WHERE expira < ?").bind(agora),
      env.DB.prepare("INSERT INTO sessoes (token, sub, expira) VALUES (?, ?, ?)").bind(token, info.sub, agora + DIAS_SESSAO * 864e5),
    ]);
    return json({ logado: true, email: info.email || "", nome: info.name || "" }, 200, { "set-cookie": cookieSessao(token, DIAS_SESSAO * 86400) });
  }

  const sessao = await sessaoAtual(req, env);

  if (p === "/api/logout" && req.method === "POST") {
    if (sessao) await env.DB.prepare("DELETE FROM sessoes WHERE token = ?").bind(sessao.token).run();
    return json({ logado: false }, 200, { "set-cookie": cookieSessao("", 0) });
  }

  if (!sessao) return json({ logado: false }, req.method === "GET" ? 200 : 401);

  if (req.method === "GET") {
    const c = await env.DB.prepare("SELECT dados, atualizado FROM contas WHERE sub = ?").bind(sessao.sub).first();
    let dados = null;
    try { dados = c && c.dados ? JSON.parse(c.dados) : null; } catch {}
    return json({ logado: true, email: sessao.email, nome: sessao.nome, dados, atualizado: c ? c.atualizado : 0 });
  }

  if (req.method === "PUT") {
    const texto = await req.text();
    if (texto.length > MAX_DADOS) return json({ erro: "O diário ficou grande demais para salvar na conta." }, 413);
    let b;
    try { b = JSON.parse(texto); } catch { return json({ erro: "Pedido inválido." }, 400); }
    const agora = Date.now();
    await env.DB.prepare("UPDATE contas SET dados = ?, atualizado = ? WHERE sub = ?")
      .bind(JSON.stringify(limparDados(b)), agora, sessao.sub).run();
    return json({ ok: true, atualizado: agora });
  }

  if (req.method === "DELETE") {
    await env.DB.batch([
      env.DB.prepare("DELETE FROM sessoes WHERE sub = ?").bind(sessao.sub),
      env.DB.prepare("DELETE FROM contas WHERE sub = ?").bind(sessao.sub),
    ]);
    return json({ apagado: true }, 200, { "set-cookie": cookieSessao("", 0) });
  }

  return json({ erro: "Rota não encontrada." }, 404);
}
