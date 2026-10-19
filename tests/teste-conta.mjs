// Testa o login com Google e o diário salvo na conta, sem internet:
// as chaves do Google e o banco D1 são simulados.
// Rode com: node tests/teste-conta.mjs   (Node 18 ou mais novo)
import worker from "../src/worker.js";

const CLIENT_ID = "123-teste.apps.googleusercontent.com";
const ORIGEM = "https://once-upon-a-time.exemplo.workers.dev";

// ---------- chaves do "Google" ----------
const par = await crypto.subtle.generateKey(
  { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
const jwkPublica = { ...(await crypto.subtle.exportKey("jwk", par.publicKey)), kid: "chave1", alg: "RS256", use: "sig" };
const outroPar = await crypto.subtle.generateKey(
  { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);

const b64u = (bytes) => Buffer.from(bytes).toString("base64url");
async function token(dados, chave = par.privateKey, kid = "chave1") {
  const h = b64u(JSON.stringify({ alg: "RS256", kid, typ: "JWT" }));
  const p = b64u(JSON.stringify(dados));
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", chave, new TextEncoder().encode(h + "." + p));
  return h + "." + p + "." + b64u(new Uint8Array(sig));
}
const agora = Math.floor(Date.now() / 1000);
const valido = { iss: "https://accounts.google.com", aud: CLIENT_ID, sub: "1001", email: "mae@exemplo.com", email_verified: true, name: "Ana", exp: agora + 3600, iat: agora };

globalThis.fetch = async (u) => {
  if (String(u).includes("googleapis.com/oauth2/v3/certs")) return new Response(JSON.stringify({ keys: [jwkPublica] }));
  throw new Error("fetch inesperado: " + u);
};

// ---------- banco D1 de mentira ----------
class FakeD1 {
  constructor() { this.contas = new Map(); this.sessoes = new Map(); }
  prepare(sql) {
    const db = this;
    return { sql, args: [], bind(...a) { this.args = a; return this; }, async run() { return db.exec(this.sql, this.args); }, async first() { return db.exec(this.sql, this.args); } };
  }
  async batch(st) { for (const s of st) await this.exec(s.sql, s.args); }
  exec(sql, a) {
    if (sql.startsWith("CREATE")) return null;
    if (sql.startsWith("INSERT INTO contas")) { const [sub, email, nome, criado, at] = a; const c = this.contas.get(sub); if (c) { c.email = email; c.nome = nome; } else this.contas.set(sub, { sub, email, nome, dados: null, criado, atualizado: at }); return null; }
    if (sql.startsWith("DELETE FROM sessoes WHERE expira")) { for (const [k, v] of this.sessoes) if (v.expira < a[0]) this.sessoes.delete(k); return null; }
    if (sql.startsWith("INSERT INTO sessoes")) { this.sessoes.set(a[0], { sub: a[1], expira: a[2] }); return null; }
    if (sql.startsWith("SELECT s.sub")) { const s = this.sessoes.get(a[0]); if (!s || s.expira <= a[1]) return null; const c = this.contas.get(s.sub); return c ? { sub: s.sub, email: c.email, nome: c.nome } : null; }
    if (sql.startsWith("DELETE FROM sessoes WHERE token")) { this.sessoes.delete(a[0]); return null; }
    if (sql.startsWith("SELECT dados")) { const c = this.contas.get(a[0]); return c ? { dados: c.dados, atualizado: c.atualizado } : null; }
    if (sql.startsWith("UPDATE contas")) { const c = this.contas.get(a[2]); c.dados = a[0]; c.atualizado = a[1]; return null; }
    if (sql.startsWith("DELETE FROM sessoes WHERE sub")) { for (const [k, v] of this.sessoes) if (v.sub === a[0]) this.sessoes.delete(k); return null; }
    if (sql.startsWith("DELETE FROM contas")) { this.contas.delete(a[0]); return null; }
    throw new Error("SQL não previsto: " + sql);
  }
}
const env = { GOOGLE_CLIENT_ID: CLIENT_ID, DB: new FakeD1() };

async function chamar(caminho, { metodo = "GET", corpo, cookie, origem = ORIGEM } = {}) {
  const headers = {};
  if (corpo !== undefined) headers["content-type"] = "application/json";
  if (cookie) headers.cookie = cookie;
  if (metodo !== "GET" && origem) headers.origin = origem;
  const r = await worker.fetch(new Request(ORIGEM + caminho, { method: metodo, headers, body: corpo === undefined ? undefined : JSON.stringify(corpo) }), env);
  return { status: r.status, cookie: r.headers.get("set-cookie") || "", dados: await r.json().catch(() => null) };
}

let falhas = 0;
function confere(nome, ok) { console.log((ok ? "ok    " : "FALHOU") + "  " + nome); if (!ok) falhas++; }

let r = await chamar("/api/config");
confere("config informa o login ligado", r.dados.google === CLIENT_ID && r.dados.sync === true);

r = await chamar("/api/login", { metodo: "POST", corpo: { credential: await token(valido) } });
const cookie = (r.cookie.match(/oua_sessao=([0-9a-f]{64})/) || [])[0];
confere("login com token válido cria sessão", r.status === 200 && !!cookie && /HttpOnly/.test(r.cookie) && /Secure/.test(r.cookie));

r = await chamar("/api/login", { metodo: "POST", corpo: { credential: await token({ ...valido, aud: "outro-app" }) } });
confere("token de outro app é recusado", r.status === 401);

r = await chamar("/api/login", { metodo: "POST", corpo: { credential: await token({ ...valido, exp: agora - 10 }) } });
confere("token vencido é recusado", r.status === 401);

r = await chamar("/api/login", { metodo: "POST", corpo: { credential: await token(valido, outroPar.privateKey) } });
confere("token com assinatura falsa é recusado", r.status === 401);

r = await chamar("/api/login", { metodo: "POST", corpo: { credential: await token({ ...valido, iss: "https://falso.com" }) } });
confere("token de outro emissor é recusado", r.status === 401);

r = await chamar("/api/login", { metodo: "POST", corpo: { credential: await token(valido) }, origem: "https://outro-site.com" });
confere("login vindo de outro site é recusado", r.status === 403);

r = await chamar("/api/conta");
confere("sem cookie, ninguém está logado", r.status === 200 && r.dados.logado === false);

r = await chamar("/api/conta", { cookie });
confere("com cookie, a conta aparece", r.dados.logado === true && r.dados.email === "mae@exemplo.com");

const diario = { prefs: { kid: "Lia", car: "Biju", prefsAt: 5 }, stories: [{ id: "h1", title: "Biju e a lua", paras: ["Era uma vez"], at: 1 }], apagadas: ["h0"] };
r = await chamar("/api/conta", { metodo: "PUT", corpo: diario, cookie });
confere("o diário é salvo na conta", r.status === 200 && r.dados.ok);

r = await chamar("/api/conta", { cookie });
confere("o diário volta igual", r.dados.dados && r.dados.dados.prefs.kid === "Lia" && r.dados.dados.stories[0].title === "Biju e a lua" && r.dados.dados.apagadas[0] === "h0");

r = await chamar("/api/conta", { metodo: "PUT", corpo: diario });
confere("sem login não dá para salvar", r.status === 401);

r = await chamar("/api/logout", { metodo: "POST", cookie });
r = await chamar("/api/conta", { cookie });
confere("depois de sair, a sessão acaba", r.dados.logado === false);

r = await chamar("/api/login", { metodo: "POST", corpo: { credential: await token(valido) } });
const cookie2 = (r.cookie.match(/oua_sessao=([0-9a-f]{64})/) || [])[0];
r = await chamar("/api/conta", { cookie: cookie2 });
confere("ao entrar de novo, o diário continua lá", r.dados.dados && r.dados.dados.stories.length === 1);

r = await chamar("/api/conta", { metodo: "DELETE", cookie: cookie2 });
confere("apagar a conta remove tudo", r.status === 200 && env.DB.contas.size === 0 && env.DB.sessoes.size === 0);

const semConfig = await worker.fetch(new Request(ORIGEM + "/api/conta"), {});
confere("sem configuração, o login fica desligado", semConfig.status === 503);

console.log(falhas ? `\n${falhas} teste(s) falharam.` : "\nO login funcionou em todos os testes.");
process.exit(falhas ? 1 : 0);
