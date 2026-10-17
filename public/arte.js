// Ilustrações do Once Upon a Time: o Biju, a turma, expressões, acessórios e cenários.
// Cada personagem é desenhado numa caixa de 200 x 120, com as rodas tocando o chão em y = 118.
(function (global) {
  const INK = "#2b2a3a";

  const TURMA = [
    { id: "tuco",   nome: "Tuco",       tipo: "carrinho",                 cor: "#3d7cff", jeito: "Pequenino e tímido. Chegou há pouco no bairro e está aprendendo a fazer amigos." },
    { id: "pipoca", nome: "Pipoca",     tipo: "motoquinha",               cor: "#ffd43b", jeito: "Rápida e agitada, fala sem parar e adora apostar corrida." , genero: "f" },
    { id: "tonho",  nome: "Vovô Tonho", tipo: "caminhãozinho",            cor: "#5fb36f", jeito: "Devagar e sábio. Conta histórias de antigamente e sempre tem um conselho." },
    { id: "vania",  nome: "Tia Vânia",  tipo: "van escolar",              cor: "#f4f1ea", jeito: "Cuidadosa e organizada, leva todo mundo para a escola e sempre tem uma piada." , genero: "f" },
    { id: "rubi",   nome: "Rubi",       tipo: "caminhonete de bombeiros", cor: "#e84855", jeito: "Corajosa, ajuda todo mundo e tem uma sirene que canta." , genero: "f" },
    { id: "lama",   nome: "Lama",       tipo: "jipe",                     cor: "#7d8f3c", jeito: "Aventureiro e bagunceiro, adora trilha, poça e barro." },
    { id: "ze",     nome: "Seu Zé",     tipo: "trator",                   cor: "#2a9d8f", jeito: "Calmo, cuida da horta e dos bichos do sítio." },
    { id: "lili",   nome: "Lili",       tipo: "escavadeira",              cor: "#ffb703", jeito: "Forte e delicada ao mesmo tempo. Adora cavar, construir e achar tesouros enterrados." , genero: "f" },
    { id: "matinto", nome: "Matinto",   tipo: "carrinho",                 cor: "#6a994e", jeito: "Pintado de verde-mato, é o campeão do esconde-esconde e vive rindo baixinho." },
    { id: "crocomilha", nome: "Crocomilha", tipo: "carro crocodilo",      cor: "#3a9d5d", jeito: "Comprido e dentuço, parece bravo, mas é um amorzinho que adora nadar no rio." },
    { id: "max",    nome: "Max",        tipo: "cachorro",                 cor: "#b07a4f", jeito: "Brincalhão e fiel, corre atrás de bola e late de alegria quando vê os amigos." },
    { id: "bilu",   nome: "ET Bilu",    tipo: "extraterrestre",           cor: "#8ee07a", jeito: "Veio de outro planeta para aprender coisas novas e vive dizendo: busquem conhecimento!" },
    { id: "gato",   nome: "Gato da Tia Lena", tipo: "gato",               cor: "#f4a261", jeito: "Preguiçoso e curioso, cochila no sol e aparece sempre na hora do lanche." },
  ];
  const CENAS = ["campo", "praia", "escola", "floresta", "festa", "cidade", "chuva", "noite"];
  const ROSTOS = ["feliz", "rindo", "surpreso", "pensativo", "corajoso", "sono"];
  const ACESSORIOS = ["nenhum", "palha", "gorro", "festa", "oculos", "cachecol", "flor"];

  // ---------- Rostos ----------
  function eye(x, y, r, expr) {
    if (expr === "sono") return `<path d="M${x - r * .75} ${y + 1} Q${x} ${y + r * .65} ${x + r * .75} ${y + 1}" stroke="${INK}" stroke-width="${r * .32}" fill="none" stroke-linecap="round"/>`;
    if (expr === "rindo") return `<path d="M${x - r * .75} ${y + 3} Q${x} ${y - r * .75} ${x + r * .75} ${y + 3}" stroke="${INK}" stroke-width="${r * .32}" fill="none" stroke-linecap="round"/>`;
    const R = expr === "surpreso" ? r * 1.15 : r;
    let px = x + r * .27, py = y + r * .1, pr = r * .5;
    if (expr === "surpreso") { px = x; py = y; pr = r * .32; }
    if (expr === "pensativo") { px = x - r * .2; py = y - r * .35; }
    return `<circle cx="${x}" cy="${y}" r="${R}" fill="#fff"/><circle cx="${px}" cy="${py}" r="${pr}" fill="${INK}"/><circle cx="${px + pr * .4}" cy="${py - pr * .4}" r="${pr * .33}" fill="#fff"/>`;
  }
  function brows(x1, x2, y, r, expr) {
    if (expr === "corajoso") return `<path d="M${x1 - r} ${y - r * 1.5} L${x1 + r * .8} ${y - r * 1.05}" stroke="${INK}" stroke-width="${r * .3}" stroke-linecap="round"/><path d="M${x2 + r} ${y - r * 1.5} L${x2 - r * .8} ${y - r * 1.05}" stroke="${INK}" stroke-width="${r * .3}" stroke-linecap="round"/>`;
    if (expr === "surpreso") return `<path d="M${x1 - r * .8} ${y - r * 1.65} Q${x1} ${y - r * 2.05} ${x1 + r * .8} ${y - r * 1.65}" stroke="${INK}" stroke-width="${r * .26}" fill="none" stroke-linecap="round"/><path d="M${x2 - r * .8} ${y - r * 1.65} Q${x2} ${y - r * 2.05} ${x2 + r * .8} ${y - r * 1.65}" stroke="${INK}" stroke-width="${r * .26}" fill="none" stroke-linecap="round"/>`;
    if (expr === "pensativo") return `<path d="M${x2 - r * .8} ${y - r * 1.5} L${x2 + r * .8} ${y - r * 1.8}" stroke="${INK}" stroke-width="${r * .26}" stroke-linecap="round"/>`;
    return "";
  }
  function mouth(x, y, w, expr) {
    if (expr === "rindo") return `<path d="M${x - w} ${y - 2} Q${x} ${y + w * 1.4} ${x + w} ${y - 2} Z" fill="${INK}"/><path d="M${x - w * .45} ${y + w * .55} Q${x} ${y + w * .2} ${x + w * .45} ${y + w * .55} Q${x} ${y + w * .95} ${x - w * .45} ${y + w * .55} Z" fill="#ff8fa3"/>`;
    if (expr === "surpreso") return `<ellipse cx="${x}" cy="${y + 2}" rx="${w * .38}" ry="${w * .5}" fill="${INK}"/>`;
    if (expr === "pensativo") return `<path d="M${x - w * .6} ${y + 3} Q${x} ${y} ${x + w * .6} ${y + 1}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (expr === "sono") return `<path d="M${x - w * .5} ${y} Q${x} ${y + w * .45} ${x + w * .5} ${y}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (expr === "corajoso") return `<path d="M${x - w} ${y - 1} Q${x} ${y + w * .9} ${x + w} ${y - 1} Z" fill="#fff" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/>`;
    return `<path d="M${x - w} ${y} Q${x} ${y + w * .85} ${x + w} ${y}" stroke="${INK}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  }
  function face(x1, x2, y, r, mx, my, mw, expr, extra) {
    extra = extra || {};
    let s = `<g class="olhos">` + eye(x1, y, r, expr) + eye(x2, y, r, expr) + `</g>` + brows(x1, x2, y, r, expr);
    if (extra.lashes && expr !== "sono" && expr !== "rindo") {
      s += `<path d="M${x1 - r * .7} ${y - r * .8} l-3 -4 M${x1} ${y - r * 1.05} l0 -5 M${x2} ${y - r * 1.05} l0 -5 M${x2 + r * .7} ${y - r * .8} l3 -4" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
    }
    if (extra.cheeks !== false) s += `<circle cx="${x1 - r * 1.1}" cy="${y + r * 1.15}" r="${r * .45}" fill="#ff9fb0" opacity=".7"/><circle cx="${x2 + r * 1.1}" cy="${y + r * 1.15}" r="${r * .45}" fill="#ff9fb0" opacity=".7"/>`;
    return s + mouth(mx, my, mw, expr);
  }
  function wheel(x, y, r) {
    const b = r * .2;
    return `<g class="roda"><circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x}" cy="${y}" r="${r * .4}" fill="#d9d4e6"/>` +
      `<circle cx="${x}" cy="${y - b}" r="${r * .09}" fill="${INK}"/><circle cx="${x}" cy="${y + b}" r="${r * .09}" fill="${INK}"/></g>`;
  }

  // ---------- Acessórios do Biju (sobre o teto, centro em x = 102) ----------
  function acessorio(a) {
    switch (a) {
      case "palha": return `<ellipse cx="102" cy="18" rx="42" ry="7" fill="#e9c46a"/><path d="M82 18 Q82 -6 102 -6 Q122 -6 122 18 Z" fill="#e9c46a"/><rect x="82" y="9" width="40" height="6" fill="#e84855"/><path d="M68 18 Q102 26 136 18" stroke="#c9a24d" stroke-width="2" fill="none"/>`;
      case "gorro": return `<path d="M76 20 Q90 -10 118 -14 Q138 -16 150 4 L134 20 Z" fill="#e84855"/><rect x="72" y="14" width="64" height="11" rx="5.5" fill="#fff"/><circle cx="151" cy="5" r="7" fill="#fff"/>`;
      case "festa": return `<path d="M88 20 L102 -24 L116 20 Z" fill="#9b5de5"/><path d="M93 6 L111 6 M97 -8 L107 -8" stroke="#ffd43b" stroke-width="3"/><circle cx="102" cy="-25" r="5" fill="#ffd43b"/>`;
      case "oculos": return `<rect x="71" y="34" width="28" height="17" rx="7" fill="${INK}"/><rect x="104" y="34" width="28" height="17" rx="7" fill="${INK}"/><path d="M99 40 L104 40" stroke="${INK}" stroke-width="3"/><path d="M76 38 L84 38" stroke="#fff" stroke-width="2" opacity=".6" stroke-linecap="round"/>`;
      case "cachecol": return `<rect x="44" y="52" width="114" height="10" rx="5" fill="#e84855"/><path d="M58 54 L58 62 M78 54 L78 62 M98 54 L98 62 M118 54 L118 62 M138 54 L138 62" stroke="#fff" stroke-width="3" opacity=".8"/><path d="M62 58 L56 82 L68 84 L72 60 Z" fill="#e84855"/>`;
      default: return "";
    }
  }

  // ---------- Personagens ----------
  function biju(cor, expr, acc) {
    const antena = acc === "flor"
      ? `<line x1="140" y1="22" x2="150" y2="2" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><circle cx="145" cy="-1" r="5" fill="#ff6fa3"/><circle cx="155" cy="-1" r="5" fill="#ff6fa3"/><circle cx="150" cy="-6" r="5" fill="#ff6fa3"/><circle cx="150" cy="4" r="5" fill="#ff6fa3"/><circle cx="150" cy="-1" r="4" fill="#ffd43b"/>`
      : `<line x1="140" y1="22" x2="150" y2="2" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M150 2 l12 4 -12 5z" fill="#f5b700"/>`;
    const rosto = acc === "oculos"
      ? `<circle cx="73" cy="56" r="5" fill="#ff9fb0" opacity=".7"/><circle cx="130" cy="56" r="5" fill="#ff9fb0" opacity=".7"/>` + mouth(102, 72, 12, expr === "corajoso" || expr === "pensativo" ? "feliz" : expr)
      : face(85, 118, 42, 11, 102, 72, 12, expr);
    return antena +
      `<path d="M48 60 Q58 16 102 16 Q144 16 156 60 Z" fill="${cor}"/>` +
      `<path d="M62 58 Q70 26 102 26 Q134 26 142 58 Z" fill="#cdeefc"/>` +
      `<rect x="14" y="56" width="174" height="44" rx="22" fill="${cor}"/>` +
      (acc === "cachecol" ? acessorio(acc) : "") +
      rosto +
      `<ellipse cx="181" cy="72" rx="6" ry="8" fill="${expr === "corajoso" ? "#fff6a8" : "#ffe680"}"/>` +
      (expr === "corajoso" ? `<path class="farol" d="M187 66 L214 58 L214 88 L187 80 Z" fill="#fff6a8" opacity=".55"/>` : "") +
      `<rect x="14" y="74" width="10" height="6" rx="3" fill="#e84855"/>` +
      wheel(56, 100, 18) + wheel(146, 100, 18) +
      (expr === "sono" ? `<g class="zzz" font-family="Patrick Hand, cursive" fill="#fff"><text x="158" y="4" font-size="16">z</text><text x="170" y="-10" font-size="22">Z</text></g>` : "") +
      (acc && acc !== "cachecol" && acc !== "flor" ? acessorio(acc) : "");
  }

  function tuco(expr) {
    return `<path d="M58 64 Q64 30 100 30 Q136 30 142 64 Z" fill="#3d7cff"/>` +
      `<path d="M70 62 Q76 40 100 40 Q124 40 130 62 Z" fill="#cdeefc"/>` +
      `<rect x="32" y="60" width="138" height="42" rx="21" fill="#3d7cff"/>` +
      `<path d="M96 30 Q92 18 102 16" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>` +
      face(88, 112, 51, 9, 100, 80, 8, expr) +
      `<ellipse cx="166" cy="78" rx="5" ry="7" fill="#ffe680"/>` +
      wheel(64, 100, 18) + wheel(138, 100, 18);
  }

  function pipoca(expr) {
    return wheel(42, 95, 23) + wheel(158, 95, 23) +
      `<path d="M42 95 L96 72 L158 95" stroke="${INK}" stroke-width="6" fill="none" stroke-linejoin="round"/>` +
      `<path d="M150 58 L158 95" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` +
      `<path d="M66 66 Q96 44 140 52 L148 74 Q108 86 66 78 Z" fill="#ffd43b"/>` +
      `<rect x="44" y="56" width="46" height="11" rx="5.5" fill="${INK}"/>` +
      `<path d="M138 26 L150 36" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><circle cx="137" cy="25" r="4" fill="${INK}"/>` +
      `<circle cx="156" cy="50" r="28" fill="#ffd43b"/>` +
      `<path d="M134 34 Q156 16 178 34" stroke="#e84855" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      face(146, 166, 48, 8, 156, 63, 8, expr, { lashes: true, cheeks: false }) +
      `<circle cx="140" cy="60" r="4" fill="#ff9fb0" opacity=".7"/><circle cx="172" cy="60" r="4" fill="#ff9fb0" opacity=".7"/>` +
      `<ellipse cx="185" cy="62" rx="4" ry="6" fill="#ffe680"/>`;
  }

  function tonho(expr) {
    const e = expr === "rindo" || expr === "sono" ? expr : "feliz";
    return `<rect x="8" y="44" width="102" height="52" rx="6" fill="#4f9a5e"/>` +
      `<path d="M14 58 L104 58 M14 72 L104 72" stroke="#3f7f4c" stroke-width="3"/>` +
      `<path d="M20 44 Q30 30 44 40 Q54 28 66 40 Q80 30 90 44 Z" fill="#e9c46a"/>` +
      `<path d="M110 96 L110 38 Q110 28 122 28 L172 28 Q188 28 190 44 L192 96 Z" fill="#5fb36f"/>` +
      `<rect x="118" y="36" width="64" height="30" rx="8" fill="#cdeefc"/>` +
      `<g class="olhos">` + eye(137, 50, 8, e) + eye(163, 50, 8, e) + `</g>` +
      `<circle cx="137" cy="50" r="11" fill="none" stroke="${INK}" stroke-width="2.5"/><circle cx="163" cy="50" r="11" fill="none" stroke="${INK}" stroke-width="2.5"/><path d="M148 50 L152 50" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M126 36 Q137 30 146 35 M154 35 Q163 30 174 36" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>` +
      `<path d="M150 74 Q140 70 134 78 Q142 84 150 78 Q158 84 166 78 Q160 70 150 74 Z" fill="#fff"/>` +
      mouth(150, 84, 7, e === "rindo" ? "rindo" : "feliz") +
      `<rect x="104" y="92" width="92" height="8" rx="4" fill="#9aa0a6"/>` +
      `<ellipse cx="190" cy="74" rx="4" ry="6" fill="#ffe680"/>` +
      wheel(42, 100, 18) + wheel(160, 100, 18);
  }

  function vania(expr) {
    return `<path d="M14 100 L14 34 Q14 18 30 18 L146 18 Q168 18 178 40 L190 64 L190 100 Z" fill="#f4f1ea" stroke="#d8d2c4" stroke-width="2"/>` +
      `<rect x="24" y="28" width="32" height="24" rx="5" fill="#cdeefc"/><rect x="62" y="28" width="32" height="24" rx="5" fill="#cdeefc"/><rect x="100" y="28" width="32" height="24" rx="5" fill="#cdeefc"/>` +
      `<path d="M140 28 L160 28 Q170 30 178 50 L140 50 Z" fill="#cdeefc"/>` +
      `<rect x="14" y="62" width="176" height="11" fill="#f5b700"/>` +
      `<circle cx="34" cy="40" r="6" fill="#ff9fb0"/><circle cx="78" cy="40" r="6" fill="#8ecae6"/><circle cx="116" cy="40" r="6" fill="#ffd43b"/>` +
      face(151, 168, 39, 7.5, 172, 84, 8, expr, { lashes: true, cheeks: false }) +
      `<ellipse cx="186" cy="80" rx="4" ry="6" fill="#ffe680"/>` +
      wheel(50, 100, 18) + wheel(154, 100, 18);
  }

  function rubi(expr) {
    return `<rect x="8" y="58" width="96" height="42" rx="6" fill="#c9303f"/>` +
      `<rect x="12" y="46" width="140" height="7" rx="3" fill="#d9d4e6"/><path d="M26 46 L26 53 M44 46 L44 53 M62 46 L62 53 M80 46 L80 53 M98 46 L98 53 M116 46 L116 53 M134 46 L134 53" stroke="#9aa0a6" stroke-width="3"/>` +
      `<path d="M100 100 L100 52 Q100 34 118 34 L150 34 Q166 34 172 52 L190 62 Q196 64 196 72 L196 100 Z" fill="#e84855"/>` +
      `<path d="M112 42 L148 42 Q158 42 164 58 L112 58 Z" fill="#cdeefc"/>` +
      `<rect x="122" y="22" width="22" height="12" rx="4" fill="#3d7cff"/><rect class="sirene" x="122" y="22" width="11" height="12" rx="4" fill="#e84855"/>` +
      face(126, 148, 50, 7, 182, 86, 8, expr, { cheeks: false }) +
      `<rect x="184" y="68" width="10" height="6" rx="3" fill="#ffe680"/>` +
      wheel(44, 100, 18) + wheel(160, 100, 18);
  }

  function lama(expr) {
    return `<circle cx="12" cy="72" r="14" fill="${INK}"/><circle cx="12" cy="72" r="6" fill="#9aa0a6"/>` +
      `<path d="M52 54 L60 22 L138 22 L148 54" stroke="${INK}" stroke-width="6" fill="none" stroke-linejoin="round"/>` +
      `<rect x="18" y="52" width="170" height="48" rx="8" fill="#7d8f3c"/>` +
      `<rect x="128" y="26" width="18" height="26" rx="3" fill="#cdeefc" stroke="${INK}" stroke-width="3"/>` +
      `<ellipse cx="60" cy="92" rx="10" ry="5" fill="#8a5a2b"/><ellipse cx="96" cy="96" rx="7" ry="4" fill="#8a5a2b"/><ellipse cx="122" cy="86" rx="5" ry="3" fill="#8a5a2b"/><circle cx="40" cy="80" r="3" fill="#8a5a2b"/>` +
      face(150, 172, 70, 8, 161, 88, 9, expr, { cheeks: false }) +
      wheel(54, 100, 20) + wheel(152, 100, 20);
  }

  function ze(expr) {
    return `<rect x="122" y="28" width="8" height="34" rx="3" fill="${INK}"/><g class="fumaca"><circle cx="130" cy="22" r="6" fill="#d9d4e6" opacity=".8"/><circle cx="140" cy="14" r="8" fill="#d9d4e6" opacity=".6"/></g>` +
      `<rect x="30" y="22" width="62" height="54" rx="6" fill="#2a9d8f"/>` +
      `<rect x="38" y="30" width="46" height="28" rx="4" fill="#cdeefc"/>` +
      `<ellipse cx="61" cy="22" rx="40" ry="6" fill="#e9c46a"/><path d="M44 22 Q44 4 61 4 Q78 4 78 22 Z" fill="#e9c46a"/><rect x="44" y="14" width="34" height="5" fill="#e84855"/>` +
      `<rect x="70" y="56" width="118" height="38" rx="8" fill="#2a9d8f"/>` +
      face(150, 172, 70, 8, 161, 86, 8, expr, { cheeks: false }) +
      `<g class="roda"><circle cx="60" cy="88" r="30" fill="${INK}"/><circle cx="60" cy="88" r="13" fill="#e9c46a"/>` +
      `<circle cx="60" cy="88" r="30" fill="none" stroke="#4a4858" stroke-width="5" stroke-dasharray="6 7"/><circle cx="60" cy="80" r="2.5" fill="${INK}"/></g>` +
      `<g class="roda"><circle cx="164" cy="104" r="14" fill="${INK}"/><circle cx="164" cy="104" r="6" fill="#e9c46a"/><circle cx="164" cy="101" r="1.6" fill="${INK}"/></g>`;
  }

  function lili(expr) {
    return `<rect x="16" y="96" width="132" height="22" rx="11" fill="${INK}"/>` +
      `<g class="roda"><circle cx="30" cy="107" r="7" fill="#9aa0a6"/><circle cx="30" cy="104" r="1.5" fill="${INK}"/></g><g class="roda"><circle cx="64" cy="107" r="7" fill="#9aa0a6"/><circle cx="64" cy="104" r="1.5" fill="${INK}"/></g><g class="roda"><circle cx="100" cy="107" r="7" fill="#9aa0a6"/><circle cx="100" cy="104" r="1.5" fill="${INK}"/></g><g class="roda"><circle cx="134" cy="107" r="7" fill="#9aa0a6"/><circle cx="134" cy="104" r="1.5" fill="${INK}"/></g>` +
      `<rect x="28" y="62" width="104" height="34" rx="8" fill="#ffb703"/>` +
      `<path d="M120 70 L150 26 L184 50" stroke="#e09a00" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M120 70 L150 26 L184 50" stroke="#ffb703" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M174 50 L198 50 L192 76 Q180 82 168 72 Z" fill="#6b6f76"/><path d="M172 74 L172 80 M180 77 L180 83 M188 74 L188 80" stroke="#6b6f76" stroke-width="3" stroke-linecap="round"/>` +
      `<rect x="40" y="26" width="62" height="40" rx="8" fill="#ffb703"/><rect x="48" y="33" width="46" height="26" rx="6" fill="#cdeefc"/>` +
      face(62, 80, 46, 7.5, 71, 82, 8, expr, { lashes: true, cheeks: false }) +
      `<path d="M58 26 L48 16 L48 32 Z M58 26 L68 16 L68 32 Z" fill="#ff6fa3"/><circle cx="58" cy="25" r="4" fill="#ff4f8b"/>`;
  }
  function matinto(expr) {
    return `<path d="M50 60 Q60 20 102 20 Q142 20 154 60 Z" fill="#6a994e"/>` +
      `<path d="M64 58 Q72 30 102 30 Q132 30 140 58 Z" fill="#cdeefc"/>` +
      `<rect x="14" y="56" width="174" height="44" rx="22" fill="#6a994e"/>` +
      `<ellipse cx="40" cy="74" rx="12" ry="7" fill="#4f772d"/><ellipse cx="150" cy="88" rx="14" ry="6" fill="#4f772d"/><ellipse cx="96" cy="94" rx="10" ry="4" fill="#90a955"/><ellipse cx="70" cy="40" rx="8" ry="4" fill="#4f772d"/>` +
      `<path d="M84 20 Q92 4 104 14 Q112 2 122 16" stroke="#4f772d" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="96" cy="10" rx="7" ry="4" fill="#90a955"/><ellipse cx="116" cy="8" rx="7" ry="4" fill="#90a955"/>` +
      face(87, 117, 44, 10, 102, 74, 11, expr) +
      `<ellipse cx="181" cy="72" rx="6" ry="8" fill="#ffe680"/>` +
      wheel(56, 100, 18) + wheel(146, 100, 18);
  }
  function crocomilha(expr) {
    return `<path d="M4 70 Q12 52 30 62" stroke="#2f8a4e" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<rect x="20" y="58" width="150" height="40" rx="16" fill="#3a9d5d"/>` +
      `<path d="M150 66 L198 72 Q200 90 186 94 L150 94 Z" fill="#3a9d5d"/>` +
      `<path d="M156 92 L196 86" stroke="#2f8a4e" stroke-width="3"/>` +
      `<path d="M162 86 l4 7 l4 -7 M174 85 l4 7 l4 -7 M186 83 l3 6 l3 -6" fill="#fff" stroke="#fff" stroke-width="1"/>` +
      `<path d="M40 58 l8 -10 l8 10 M64 58 l8 -10 l8 10 M88 58 l8 -10 l8 10 M112 58 l8 -10 l8 10" fill="#2f8a4e"/>` +
      `<circle cx="140" cy="52" r="14" fill="#3a9d5d"/><circle cx="164" cy="56" r="12" fill="#3a9d5d"/>` +
      `<g class="olhos">` + eye(140, 50, 8, expr) + eye(164, 54, 7, expr) + `</g>` + brows(140, 164, 52, 7, expr) +
      `<circle cx="192" cy="76" r="2" fill="${INK}"/>` +
      wheel(42, 104, 14) + wheel(82, 104, 14) + wheel(118, 104, 14) + wheel(152, 104, 14);
  }
  function max(expr) {
    return `<path class="rabo" d="M34 66 Q16 52 22 36" stroke="#8a5a36" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<rect x="40" y="96" width="12" height="22" rx="6" fill="#8a5a36"/><rect x="62" y="96" width="12" height="22" rx="6" fill="#b07a4f"/><rect x="108" y="96" width="12" height="22" rx="6" fill="#8a5a36"/><rect x="128" y="96" width="12" height="22" rx="6" fill="#b07a4f"/>` +
      `<ellipse cx="88" cy="84" rx="58" ry="24" fill="#b07a4f"/><ellipse cx="80" cy="92" rx="30" ry="12" fill="#e8c9a0"/>` +
      `<circle cx="148" cy="54" r="30" fill="#b07a4f"/>` +
      `<ellipse cx="124" cy="48" rx="10" ry="22" fill="#6e4426" transform="rotate(18 124 48)"/><ellipse cx="172" cy="48" rx="10" ry="22" fill="#6e4426" transform="rotate(-18 172 48)"/>` +
      `<ellipse cx="150" cy="70" rx="16" ry="11" fill="#e8c9a0"/><ellipse cx="150" cy="63" rx="6" ry="4.5" fill="${INK}"/>` +
      face(138, 160, 48, 7, 150, 72, 7, expr, { cheeks: false }) +
      `<path d="M122 76 Q148 90 174 76" stroke="#e84855" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="148" cy="86" r="5" fill="#ffd43b"/>`;
  }
  function bilu(expr) {
    return `<ellipse cx="100" cy="114" rx="34" ry="5" fill="#000" opacity=".12"/>` +
      `<rect x="82" y="94" width="10" height="22" rx="5" fill="#6cc35b"/><rect x="108" y="94" width="10" height="22" rx="5" fill="#6cc35b"/>` +
      `<ellipse cx="100" cy="88" rx="24" ry="20" fill="#8ee07a"/>` +
      `<path d="M78 82 Q62 76 60 62 M122 82 Q138 76 140 62" stroke="#8ee07a" stroke-width="7" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="46" rx="38" ry="32" fill="#8ee07a"/>` +
      `<path d="M84 18 Q78 2 70 -2 M116 18 Q122 2 130 -2" stroke="#6cc35b" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="70" cy="-3" r="5" fill="#ffd43b"/><circle cx="130" cy="-3" r="5" fill="#ffd43b"/>` +
      (expr === "sono" || expr === "rindo"
        ? `<g class="olhos">` + eye(84, 46, 11, expr) + eye(116, 46, 11, expr) + `</g>`
        : `<g class="olhos"><ellipse cx="84" cy="46" rx="11" ry="15" fill="${INK}" transform="rotate(-14 84 46)"/><ellipse cx="116" cy="46" rx="11" ry="15" fill="${INK}" transform="rotate(14 116 46)"/><circle cx="80" cy="40" r="4" fill="#fff"/><circle cx="112" cy="40" r="4" fill="#fff"/></g>`) +
      mouth(100, 66, 8, expr === "sono" ? "sono" : expr === "rindo" ? "rindo" : expr === "surpreso" ? "surpreso" : "feliz");
  }
  function gato(expr) {
    return `<path class="rabo" d="M124 106 Q170 110 162 74 Q158 60 170 54" stroke="#e08e45" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="94" rx="36" ry="26" fill="#f4a261"/>` +
      `<ellipse cx="86" cy="114" rx="11" ry="6" fill="#f4a261"/><ellipse cx="114" cy="114" rx="11" ry="6" fill="#f4a261"/>` +
      `<path d="M84 80 L96 86 M86 98 L100 102 M108 76 L118 84" stroke="#e08e45" stroke-width="4" stroke-linecap="round"/>` +
      `<circle cx="100" cy="50" r="28" fill="#f4a261"/>` +
      `<path d="M76 40 L74 12 L96 26 Z M124 40 L126 12 L104 26 Z" fill="#f4a261"/><path d="M79 34 L78 19 L90 27 Z M121 34 L122 19 L110 27 Z" fill="#ffb4c2"/>` +
      `<path d="M92 26 L94 34 M100 24 L100 33 M108 26 L106 34" stroke="#e08e45" stroke-width="3" stroke-linecap="round"/>` +
      face(89, 111, 50, 7, 100, 64, 6, expr, { cheeks: false }) +
      `<path d="M97 58 L103 58 L100 62 Z" fill="#ff8fa3"/>` +
      `<path d="M72 58 L86 60 M72 66 L86 64 M128 58 L114 60 M128 66 L114 64" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>` +
      `<path d="M78 78 Q100 88 122 78" stroke="#3d7cff" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="100" cy="84" r="4" fill="#ffd43b"/>`;
  }

  const DESENHO = { tuco, pipoca, tonho, vania, rubi, lama, ze, lili, matinto, crocomilha, max, bilu, gato };
  function personagem(id, expr, opts) {
    opts = opts || {};
    if (id === "biju") return biju(opts.cor || "#ff7a3d", expr || "feliz", opts.acc || "nenhum");
    const f = DESENHO[id];
    if (!f) return "";
    const e = expr === "corajoso" && id !== "rubi" ? "feliz" : (expr || "feliz");
    return f(e);
  }

  // ---------- Cenários (400 x 210, rua em y = 186) ----------
  let gid = 0;
  function estrelas() {
    let s = "", seed = 7;
    for (let i = 0; i < 28; i++) {
      seed = (seed * 9301 + 49297) % 233280; const x = seed % 400;
      seed = (seed * 9301 + 49297) % 233280; const y = seed % 110;
      s += `<circle class="brilho" style="animation-delay:-${(i * 0.37) % 3}s" cx="${x}" cy="${y + 6}" r="${i % 4 ? 1.3 : 2.2}" fill="#fff" opacity="${i % 3 ? .7 : 1}"/>`;
    }
    return s + `<g class="lua"><circle cx="320" cy="52" r="30" fill="#000" opacity="0"/><circle cx="320" cy="52" r="24" fill="#fff5cc"/><circle cx="331" cy="45" r="22" fill="var(--sky1)"/></g>` +
      `<g class="surpresa-estrela" opacity="0"><path d="M40 20 L110 48" stroke="#fff5cc" stroke-width="2.5" stroke-linecap="round" opacity=".6"/><circle cx="112" cy="49" r="3.5" fill="#fff"/></g>`;
  }
  function morros(c1, c2) {
    return `<path d="M0 150 Q80 110 170 140 T400 128 V210 H0Z" fill="${c1 || "var(--hill1)"}"/><path d="M0 168 Q120 140 240 160 T400 154 V210 H0Z" fill="${c2 || "var(--hill2)"}"/>`;
  }
  function arvore(x, y, s, cor) {
    return `<rect x="${x - 4 * s}" y="${y - 22 * s}" width="${8 * s}" height="${22 * s}" fill="#7a5230"/><circle cx="${x}" cy="${y - 34 * s}" r="${20 * s}" fill="${cor || "#4c9a50"}"/><circle cx="${x - 12 * s}" cy="${y - 24 * s}" r="${13 * s}" fill="${cor || "#4c9a50"}"/><circle cx="${x + 12 * s}" cy="${y - 24 * s}" r="${13 * s}" fill="${cor || "#4c9a50"}"/>`;
  }
  function pinheiro(x, y, s, cor) {
    return `<rect x="${x - 3 * s}" y="${y - 12 * s}" width="${6 * s}" height="${12 * s}" fill="#6b4a2b"/><path d="M${x - 22 * s} ${y - 10 * s} L${x} ${y - 70 * s} L${x + 22 * s} ${y - 10 * s} Z" fill="${cor || "#2f6f45"}"/>`;
  }
  function cenario(cena, p, estacao) {
    const noite = p === "dormir" || cena === "noite";
    const id = "ceu" + (gid++);
    let ceu1 = "var(--sky1)", ceu2 = "var(--sky2)";
    if (cena === "chuva") { ceu1 = noite ? "#2a3150" : "#8d99ae"; ceu2 = noite ? "#3d4766" : "#c9d1dc"; }
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ceu1}"/><stop offset="1" stop-color="${ceu2}"/></linearGradient></defs><rect width="400" height="210" fill="url(#${id})"/>`;
    if (noite && cena !== "chuva") s += estrelas();
    else if (cena !== "chuva") {
      const sx = p === "entardecer" ? 300 : p === "manha" ? 70 : 320, sy = p === "entardecer" ? 120 : p === "manha" ? 70 : 50;
      s += `<g class="surpresa-arco" opacity="0"><path d="M60 186 Q200 -40 340 186" stroke="#e84855" stroke-width="8" fill="none"/><path d="M70 186 Q200 -22 330 186" stroke="#ffd43b" stroke-width="8" fill="none"/><path d="M80 186 Q200 -4 320 186" stroke="#3d7cff" stroke-width="8" fill="none"/></g>`;
      s += `<g class="sol"><circle class="sol-brilho" cx="${sx}" cy="${sy}" r="38" fill="#ffd23f" opacity=".25"/><circle cx="${sx}" cy="${sy}" r="26" fill="#ffd23f"/></g>`;
      s += `<g class="nuvens" fill="#fff" opacity=".9"><ellipse cx="150" cy="50" rx="34" ry="12"/><ellipse cx="172" cy="42" rx="20" ry="12"/><ellipse cx="240" cy="78" rx="26" ry="9"/></g>`;
    }
    switch (cena) {
      case "praia":
        s += `<rect x="0" y="118" width="400" height="44" fill="#4cc3d9"/><path class="ondas" d="M-40 128 Q-20 122 0 128 T40 128 T80 128 T120 128 T160 128 T200 128 T240 128 T280 128 T320 128 T360 128 T400 128 T440 128" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>` +
          `<path d="M0 150 Q100 140 200 150 T400 148 V186 H0Z" fill="#f2d49b"/>` +
          `<path d="M34 150 Q30 110 40 84" stroke="#8a5a2b" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M40 84 Q20 76 6 90 M40 84 Q56 70 72 84 M40 84 Q34 64 18 62 M40 84 Q52 62 66 62" stroke="#3f9a52" stroke-width="7" fill="none" stroke-linecap="round"/>` +
          `<path d="M352 160 L352 110" stroke="${INK}" stroke-width="3"/><path d="M322 116 Q352 92 382 116 Z" fill="#e84855"/><path d="M342 116 Q352 96 362 116" fill="#fff"/>`;
        break;
      case "escola":
        s += morros() +
          `<rect x="248" y="88" width="124" height="98" fill="#f6c28b"/><path d="M240 92 L310 54 L380 92 Z" fill="#e76f51"/>` +
          `<rect x="296" y="60" width="28" height="20" fill="#f6c28b"/><circle cx="310" cy="70" r="5" fill="#f5b700"/>` +
          `<rect x="262" y="104" width="24" height="20" fill="#cdeefc"/><rect x="334" y="104" width="24" height="20" fill="#cdeefc"/><rect x="298" y="138" width="24" height="48" fill="#8a5a2b"/>` +
          `<path d="M310 54 L310 30" stroke="${INK}" stroke-width="2"/><path d="M310 30 L330 36 L310 42 Z" fill="#3d7cff"/>` + arvore(30, 186, 1.2);
        break;
      case "floresta":
        s += morros("#5c9e5a", "#3f8448") + pinheiro(24, 180, 1.4) + pinheiro(70, 176, 1.1, "#3a7d4f") + pinheiro(338, 178, 1.3) + pinheiro(384, 182, 1.5, "#3a7d4f") +
          arvore(300, 176, 1, "#5aa65a") +
          `<rect x="104" y="174" width="4" height="10" fill="#f4f1ea"/><path d="M98 176 Q106 162 114 176 Z" fill="#e84855"/><circle cx="103" cy="171" r="1.6" fill="#fff"/><circle cx="109" cy="172" r="1.6" fill="#fff"/>`;
        break;
      case "festa": {
        s += morros();
        const cores = ["#e84855", "#ffd43b", "#3d7cff", "#2a9d8f", "#9b5de5", "#ff7a3d"];
        s += `<g class="bandeiras"><path d="M0 22 Q200 52 400 22" stroke="${INK}" stroke-width="1.5" fill="none"/>`;
        for (let i = 0; i < 12; i++) {
          const x = 16 + i * 33, t = x / 400, y = 22 + 4 * 30 * t * (1 - t) * 1.02;
          s += `<path d="M${x - 10} ${y} L${x + 10} ${y} L${x} ${y + 18} Z" fill="${cores[i % 6]}"/>`;
        }
        s += `</g><g class="balao"><path d="M44 110 L44 150" stroke="${INK}" stroke-width="1.5"/><ellipse cx="44" cy="100" rx="11" ry="14" fill="#e84855"/></g>` +
          `<g class="balao" style="animation-delay:-1.4s"><path d="M362 104 L362 150" stroke="${INK}" stroke-width="1.5"/><ellipse cx="362" cy="94" rx="11" ry="14" fill="#3d7cff"/></g>`;
        break;
      }
      case "cidade": {
        const pr = [[0, 80, 54, "#b8c0ff"], [56, 60, 46, "#ffd6a5"], [104, 96, 40, "#caffbf"], [250, 70, 50, "#ffc6ff"], [302, 50, 44, "#9bf6ff"], [348, 86, 52, "#fdffb6"]];
        pr.forEach(([x, y, w, c]) => {
          s += `<rect x="${x}" y="${y}" width="${w}" height="${186 - y}" fill="${c}"/>`;
          for (let yy = y + 10; yy < 170; yy += 20) for (let xx = x + 8; xx < x + w - 10; xx += 16) s += `<rect x="${xx}" y="${yy}" width="8" height="10" fill="${noite ? "#ffe680" : "#fff"}" opacity=".85"/>`;
        });
        s += `<rect x="0" y="176" width="400" height="10" fill="#b9b4c7"/><path d="M224 176 L224 120 Q224 110 234 110" stroke="${INK}" stroke-width="3" fill="none"/><circle cx="236" cy="112" r="5" fill="#ffe680"/>`;
        break;
      }
      case "chuva": {
        s += morros("#7fae6e", "#5f9157");
        s += `<g fill="#6d7891"><ellipse cx="90" cy="40" rx="50" ry="18"/><ellipse cx="130" cy="30" rx="34" ry="18"/><ellipse cx="300" cy="46" rx="56" ry="18"/><ellipse cx="340" cy="34" rx="32" ry="16"/></g>`;
        if (!noite) s += `<path d="M150 186 Q260 -34 370 186" stroke="#e84855" stroke-width="7" fill="none" opacity=".7"/><path d="M158 186 Q260 -18 362 186" stroke="#ffd43b" stroke-width="7" fill="none" opacity=".7"/><path d="M166 186 Q260 -2 354 186" stroke="#3d7cff" stroke-width="7" fill="none" opacity=".7"/>`;
        let gotas = "";
        for (let i = 0; i < 40; i++) { const x = (i * 53) % 400, y = 60 + ((i * 37) % 110); gotas += `<path d="M${x} ${y} l-4 10" stroke="#e7f1ff" stroke-width="2" stroke-linecap="round" opacity=".8"/>`; }
        s += `<g class="gotas">${gotas}</g><g class="gotas" style="animation-delay:-.25s" transform="translate(26 -30)">${gotas}</g>`;
        break;
      }
      case "noite":
        s += morros() + `<rect x="300" y="110" width="84" height="76" fill="#6d5a8c"/><path d="M292 114 L342 82 L392 114 Z" fill="#4a3d66"/><rect x="316" y="132" width="52" height="54" fill="#3a3050"/><rect x="326" y="120" width="12" height="8" fill="#ffe680"/>`;
        break;
      default: {
        s += morros();
        if (estacao === "primavera" && !noite) [[30, 170], [70, 180], [300, 176], [350, 168], [380, 182]].forEach(([x, y], i) => { s += `<circle cx="${x}" cy="${y}" r="4" fill="${["#ff6fa3", "#ffd23f", "#fff", "#ff6fa3", "#c49bff"][i]}"/>`; });
      }
    }
    s += `<rect x="0" y="186" width="400" height="24" fill="var(--road)"/><line x1="0" y1="198" x2="400" y2="198" stroke="#fff" stroke-width="3" stroke-dasharray="18 16" opacity=".7"/>`;
    if (cena === "chuva") s += `<ellipse cx="90" cy="200" rx="26" ry="4" fill="#cdeefc" opacity=".55"/><ellipse cx="300" cy="196" rx="20" ry="3" fill="#cdeefc" opacity=".55"/>`;
    return s;
  }

  // Posiciona até 3 personagens sobre a rua. Os da direita olham para o Biju.
  function tocavel(id, svg) {
    return `<g class="pers p-${id}" data-p="${id}"><rect x="0" y="-10" width="200" height="130" fill="#000" opacity="0"/><g class="corpo">${svg}</g></g>`;
  }
  function colocar(svg, x, sc, virar, id) {
    const y = 186 - 118 * sc;
    const dentro = tocavel(id || "biju", svg);
    return virar
      ? `<g transform="translate(${x + 200 * sc} ${y}) scale(${-sc} ${sc})">${dentro}</g>`
      : `<g transform="translate(${x} ${y}) scale(${sc})">${dentro}</g>`;
  }

  // arte = { cena, rosto, acessorio, amigos: [] }
  function cena(arte, p, estacao, opts) {
    opts = opts || {};
    arte = arte || {};
    const sc = CENAS.includes(arte.cena) ? arte.cena : (p === "dormir" ? "noite" : "campo");
    const noite = p === "dormir" || sc === "noite";
    let rosto = ROSTOS.includes(arte.rosto) ? arte.rosto : "feliz";
    if (noite && rosto !== "rindo") rosto = "sono";
    const acc = ACESSORIOS.includes(arte.acessorio) ? arte.acessorio : "nenhum";
    const amigos = (arte.amigos || []).filter((a) => DESENHO[a]).slice(0, 2);
    const eu = biju(opts.cor || "#ff7a3d", rosto, acc);
    const rostoAmigo = noite ? "sono" : (rosto === "pensativo" || rosto === "corajoso" ? "feliz" : rosto);
    let g = "";
    if (arte.so && arte.so !== "biju" && DESENHO[arte.so]) g = colocar(personagem(arte.so, rostoAmigo), 110, .92, false, arte.so);
    else if (arte.prota && DESENHO[arte.prota]) g = colocar(personagem(arte.prota, noite ? "sono" : rosto), 30, .86, false, arte.prota) + colocar(biju(opts.cor || "#ff7a3d", noite ? "sono" : "feliz", "nenhum"), 228, .78, true, "biju");
    else if (amigos.length === 0) g = colocar(eu, 110, .92, false, "biju");
    else if (amigos.length === 1) g = colocar(eu, 36, .86, false, "biju") + colocar(personagem(amigos[0], rostoAmigo), 226, .8, true, amigos[0]);
    else g = colocar(personagem(amigos[0], rostoAmigo), 2, .6, false, amigos[0]) + colocar(eu, 116, .82, false, "biju") + colocar(personagem(amigos[1], rostoAmigo), 284, .58, true, amigos[1]);
    const attrs = opts.attrs || "";
    return `<svg class="s-${p}" viewBox="0 0 400 210" ${attrs} role="img" aria-label="${opts.label || "Ilustração da história"}">${cenario(sc, p, estacao)}${g}</svg>`;
  }

  // Retrato para a página da turma
  function retrato(id, opts) {
    opts = opts || {};
    const gidr = "rt" + (gid++);
    const fundo = `<defs><linearGradient id="${gidr}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6f8"/><stop offset="1" stop-color="#eef8ff"/></linearGradient></defs><rect width="240" height="150" fill="url(#${gidr})"/><path d="M0 120 Q120 100 240 118 V150 H0Z" fill="#9bd884"/>`;
    const desenho = personagem(id, "feliz", { cor: opts.cor });
    return `<svg viewBox="0 0 240 150" role="img" aria-label="${opts.label || id}">${fundo}<g transform="translate(26 ${140 - 118 * .94}) scale(.94)">${tocavel(id, desenho)}</g></svg>`;
  }

  // Lê a linha "ARTE: cena=...; rosto=...; acessorio=...; amigos=..." escrita pela IA
  function semAcento(s) { return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(); }
  function lerArte(linha) {
    const arte = {};
    String(linha || "").replace(/^\s*ARTE\s*:\s*/i, "").split(/[;|]/).forEach((par) => {
      const [k, v] = par.split("=").map(semAcento);
      if (!k || v === undefined) return;
      if (k === "cena" && CENAS.includes(v)) arte.cena = v;
      if (k === "rosto" && ROSTOS.includes(v)) arte.rosto = v;
      if ((k === "acessorio" || k === "acessorios") && ACESSORIOS.includes(v)) arte.acessorio = v;
      if (k === "amigos") {
        const APELIDOS = { "et": "bilu", "et bilu": "bilu", "bilu": "bilu", "gato": "gato", "gato da tia lena": "gato", "gatinho": "gato", "cachorro": "max", "escavadeira": "lili", "croco": "crocomilha" };
        arte.amigos = v.split(/,| e (?!a tia)/).map((n) => {
          const t = semAcento(n).replace(/^(o|a)\s+/, "").replace(/^(vovo|tia|seu)\s+/, "").trim();
          if (APELIDOS[t]) return APELIDOS[t];
          const m = TURMA.find((a) => semAcento(a.nome).replace(/^(vovo|tia|seu)\s+/, "") === t || a.id === t);
          return m && m.id;
        }).filter(Boolean).slice(0, 2);
      }
    });
    return arte;
  }

  global.ARTE = { TURMA, CENAS, ROSTOS, ACESSORIOS, cena, retrato, personagem, lerArte };
})(typeof window !== "undefined" ? window : globalThis);
