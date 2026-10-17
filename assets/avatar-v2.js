/* Avatar montável V2 — estilo anime com sombreamento cel-shading.
   Peças: corpo proporcional (sexo, altura, peso), 3 rostos, 5 cabelos, cor de pele e cabelo,
   roupa por classe e evolução por rank (E → S). Também desenha a Sombra do Antigo Eu.
   As ilustrações em imagem (assets/art-manifest.js) passam a ser "cartas de evolução" da classe.
   Carregar depois de assets/art-v1.js e assets/dev-v1.js. */
(() => {
  'use strict';
  if (window.__AVATAR_V2__) return;
  window.__AVATAR_V2__ = true;

  const F = n => (+n).toFixed(1);
  let seq = 0; const uid = () => 'v2' + (seq++).toString(36) + Math.random().toString(36).slice(2, 5);
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const mix = (a, b, t) => { // mistura duas cores hex
    const p = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
  };
  const dark = (c, t = .35) => mix(c, '#05060a', t), light = (c, t = .25) => mix(c, '#ffffff', t);
  const LINE = '#07090d';

  /* --------------------------- opções públicas --------------------------- */
  const FACES = ['Determinado', 'Sereno', 'Marcado'];
  const HAIRSTYLES = ['Bagunçado', 'Undercut', 'Longo', 'Rabo de cavalo', 'Coque'];
  window.AV_FACES = FACES; window.AV_HAIRSTYLES = HAIRSTYLES;
  // novas cores de cabelo (prata e azul) entram no fim da lista existente
  if (typeof HAIRS !== 'undefined' && HAIRS.indexOf('#eef1f6') < 0) HAIRS.push('#eef1f6', '#2c4a86', '#5b3d8a');

  /* ------------------------------ classes ------------------------------ */
  const CLASS_LOOK = {
    guerreiro: { acc: '#ffb347', top: '#3a2a24', top2: '#4b362d', pants: '#1d1a1c', trim: '#8a5a3a' },
    assassino: { acc: '#a46bff', top: '#14161c', top2: '#1f222b', pants: '#101217', trim: '#4a4f5c' },
    mago: { acc: '#4ea8ff', top: '#16233d', top2: '#1e3052', pants: '#121827', trim: '#3a5a8a' },
    guardiao: { acc: '#7fe0a0', top: '#1f2a24', top2: '#2a3830', pants: '#161b18', trim: '#5c7a66' },
    xama: { acc: '#5fe3c0', top: '#2a1f30', top2: '#382a40', pants: '#1a151d', trim: '#7a5a6a' },
    neutro: { acc: '#4ea8ff', top: '#18212b', top2: '#222e3a', pants: '#121820', trim: '#3a4a5a' }
  };
  const RANKS6 = ['E', 'D', 'C', 'B', 'A', 'S'];
  const GOLD = '#d9b45a', STEEL = '#7d8a98', STEEL_HI = '#c9d4df';

  /* ------------------------------ esqueleto ------------------------------ */
  function skeleton(p) {
    const f = p.sex === 'f';
    const h = clamp(+p.height || 170, 140, 210), kg = clamp(+p.weight || 70, 40, 160);
    const bmi = kg / Math.pow(h / 100, 2);
    const w = clamp(.8 + (bmi - 18) * .045, .78, 1.6);             // largura geral (contínua)
    const belly = clamp((bmi - 26) * .045, 0, .45);                 // barriga a partir de IMC ~26
    const G = 202, H = 160 + (h - 140) / 70 * 44;                   // altura no desenho: 160 a 204
    const hh = H / 6.7;                                             // altura da cabeça (proporção anime)
    const top = G - H;
    const L = {
      f, w, belly, G, H, hh, top,
      headCy: top + hh * .5, chin: top + hh,
      sh: top + hh * 1.38, chest: top + hh * 2.0, waist: top + hh * 2.85, hip: top + hh * 3.35,
      crotch: top + hh * 3.75, knee: top + hh * 5.35, ankle: G - 6
    };
    const ws = 1 + (w - 1) * .6, ww = 1 + (w - 1) * 1.35 + belly, wh = 1 + (w - 1) * 1.0, wl = 1 + (w - 1) * 1.1;
    L.shW = hh * (f ? .74 : .9) * ws;
    L.chestW = hh * (f ? .62 : .74) * (1 + (w - 1) * .9);
    L.waistW = hh * (f ? .42 : .5) * ww;
    L.hipW = hh * (f ? .68 : .55) * wh;
    L.thigh = hh * (f ? .26 : .23) * (1 + (w - 1) * 1.25);
    L.calf = hh * .15 * (1 + (w - 1) * 1.1);
    L.ankleW = hh * .09 * (1 + (w - 1) * .4);
    L.arm = hh * .15 * (1 + (w - 1) * .9);
    L.fore = hh * .12 * (1 + (w - 1) * .75);
    L.headRx = hh * .4 * (1 + (w - 1) * .18);
    L.headRy = hh * .5;
    L.neckW = hh * (f ? .14 : .18) * (1 + (w - 1) * .5);
    L.legGap = hh * .05;
    return L;
  }

  /* ------------------------------ helpers ------------------------------ */
  // gradiente "cel": luz vinda da esquerda, sombra dura à direita
  function celSkin(defs, color) {
    const id = uid(); const sh = mix(color, '#7a3a3a', .22);
    defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2=".15"><stop offset="0" stop-color="${light(color, .06)}"/><stop offset=".7" stop-color="${color}"/><stop offset=".7" stop-color="${sh}"/><stop offset="1" stop-color="${sh}"/></linearGradient>`);
    return `url(#${id})`;
  }
  function cel(defs, color, angle = 0) {
    const id = uid(); const sh = dark(color, .42), hi = light(color, .08);
    defs.push(`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="${angle}"><stop offset="0" stop-color="${hi}"/><stop offset=".56" stop-color="${color}"/><stop offset=".56" stop-color="${sh}"/><stop offset="1" stop-color="${dark(sh, .15)}"/></linearGradient>`);
    return `url(#${id})`;
  }
  const P = (pts, close = true) => 'M' + pts.map(([x, y]) => `${F(x)} ${F(y)}`).join(' L') + (close ? ' Z' : '');
  // membro afunilado entre dois pontos (para braços e pernas)
  function limb(a, b, wa, wb) {
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    return `M${F(a[0] + nx * wa)} ${F(a[1] + ny * wa)} L${F(b[0] + nx * wb)} ${F(b[1] + ny * wb)} Q${F(b[0] + dx / len * wb)} ${F(b[1] + dy / len * wb)} ${F(b[0] - nx * wb)} ${F(b[1] - ny * wb)} L${F(a[0] - nx * wa)} ${F(a[1] - ny * wa)} Q${F(a[0] - dx / len * wa)} ${F(a[1] - dy / len * wa)} ${F(a[0] + nx * wa)} ${F(a[1] + ny * wa)} Z`;
  }

  /* -------------------------------- rosto -------------------------------- */
  function face(L, face, skin, eyeC, ri, f, shadow) {
    const cx = 60, cy = L.headCy, rx = L.headRx, ry = L.headRy;
    const ey = cy + ry * .16, ex = rx * .44, ew = rx * .34, eh = ry * (face === 1 ? .2 : face === 2 ? .12 : .15);
    const glow = ri >= 3 || shadow;
    const lid = shadow ? '#1a0508' : LINE;
    let s = '';
    const eye = side => {
      const x = cx + side * ex, inner = x - side * ew * .9, outer = x + side * ew;
      const slant = face === 0 ? 2.2 : face === 2 ? 2.6 : .6;
      // branco do olho, íris e brilho
      s += `<path d="M${F(inner)} ${F(ey)} Q${F(x)} ${F(ey - eh * 1.6)} ${F(outer)} ${F(ey - slant)} Q${F(x)} ${F(ey + eh * 1.3)} ${F(inner)} ${F(ey)} Z" fill="${shadow ? '#2a0d12' : '#f4f7fb'}"/>`;
      const ir = eh * (face === 1 ? 1.15 : 1.05);
      s += `<g class="eyes">${glow ? `<circle cx="${F(x + side * .3)}" cy="${F(ey - .2)}" r="${F(ir * 1.6)}" fill="${eyeC}" opacity=".55" filter="url(#__blur)"/>` : ''}
        <circle cx="${F(x + side * .3)}" cy="${F(ey - .2)}" r="${F(ir)}" fill="${eyeC}"/>
        <circle cx="${F(x + side * .3)}" cy="${F(ey - .2)}" r="${F(ir * .45)}" fill="${dark(eyeC, .6)}"/>
        <circle cx="${F(x + side * .3 - ir * .35)}" cy="${F(ey - ir * .45)}" r="${F(ir * .3)}" fill="#fff"/></g>`;
      // pálpebra superior (traço grosso) — "Marcado" tem pálpebra mais baixa
      const lidY = face === 2 ? ey - eh * .45 : ey - eh * 1.05;
      s += `<path d="M${F(inner - side * .4)} ${F(ey + .2)} Q${F(x)} ${F(lidY - eh * .5)} ${F(outer + side * .6)} ${F(ey - slant - .3)}" fill="none" stroke="${lid}" stroke-width="${F(f ? 1.25 : 1.05)}" stroke-linecap="round"/>`;
      if (face === 2) s += `<path d="M${F(inner)} ${F(ey - eh * .2)} Q${F(x)} ${F(ey - eh * .9)} ${F(outer)} ${F(ey - slant)} L${F(outer)} ${F(ey - eh * 2)} L${F(inner)} ${F(ey - eh * 2)} Z" fill="${skin}"/>`;
      if (f) s += `<path d="M${F(outer + side * .4)} ${F(ey - slant - .2)} l${F(side * 1.6)} ${F(-1.2)}" stroke="${lid}" stroke-width=".8" stroke-linecap="round"/>`;
      // sobrancelha
      const by = ey - eh * 2.4 - (face === 1 ? 1.2 : 0);
      const bIn = face === 1 ? by + .2 : by + 1.6, bOut = face === 1 ? by - .4 : by - .6;
      s += `<path d="M${F(x - side * ew * 1.05)} ${F(bIn)} Q${F(x)} ${F(by - (face === 1 ? 1.1 : .3))} ${F(x + side * ew * 1.15)} ${F(bOut)}" fill="none" stroke="${shadow ? '#1a0508' : dark(skin, .72)}" stroke-width="${face === 1 ? .75 : 1}" stroke-linecap="round"/>`;
    };
    eye(-1); eye(1);
    // nariz e boca
    s += `<path d="M${F(cx + .4)} ${F(cy + ry * .42)} l${F(-1)} ${F(1.4)} l1.4 .1" fill="none" stroke="${dark(skin, .45)}" stroke-width=".7" stroke-linecap="round"/>`;
    if (face === 1) s += `<path d="M${F(cx - 2.4)} ${F(cy + ry * .64)} Q${F(cx)} ${F(cy + ry * .72)} ${F(cx + 2.6)} ${F(cy + ry * .62)}" fill="none" stroke="${dark(skin, .55)}" stroke-width=".75" stroke-linecap="round"/>`;
    else s += `<path d="M${F(cx - 2.2)} ${F(cy + ry * .66)} L${F(cx + 2.2)} ${F(cy + ry * .65)}" stroke="${dark(skin, .55)}" stroke-width=".75" stroke-linecap="round"/>`;
    if (f && !shadow) s += `<path d="M${F(cx - 1.6)} ${F(cy + ry * .69)} Q${F(cx)} ${F(cy + ry * .74)} ${F(cx + 1.6)} ${F(cy + ry * .69)}" fill="none" stroke="#c46a6a" stroke-width=".6" opacity=".7"/>`;
    // cicatriz do rosto "Marcado"
    if (face === 2) s += `<path d="M${F(cx + ex - 3)} ${F(ey - eh * 3.6)} L${F(cx + ex + 2.6)} ${F(ey + eh * 3.4)}" stroke="${shadow ? '#5a1020' : dark(skin, .3)}" stroke-width="1" stroke-linecap="round"/><path d="M${F(cx + ex - 1.2)} ${F(ey - eh * 2)} l2 -.6 M${F(cx + ex + .6)} ${F(ey + eh * 1.6)} l2 -.6" stroke="${shadow ? '#5a1020' : dark(skin, .3)}" stroke-width=".5"/>`;
    // blush leve
    if (!shadow) s += `<ellipse cx="${F(cx - rx * .55)}" cy="${F(cy + ry * .42)}" rx="2.2" ry="1" fill="#e08080" opacity=".18"/><ellipse cx="${F(cx + rx * .55)}" cy="${F(cy + ry * .42)}" rx="2.2" ry="1" fill="#e08080" opacity=".18"/>`;
    return s;
  }

  /* -------------------------------- cabelo -------------------------------- */
  function hair(L, style, color, defs) {
    const cx = 60, cy = L.headCy, rx = L.headRx, ry = L.headRy, top = cy - ry;
    const fill = cel(defs, color, .25), dk = dark(color, .45), hl = light(color, .45);
    const outl = `stroke="${dark(color, .7)}" stroke-width=".8" stroke-linejoin="round"`;
    let back = '', front = '';
    const crown = (puff = 1.12) => `M${F(cx - rx * 1.08)} ${F(cy + ry * .05)} C${F(cx - rx * 1.2)} ${F(top - ry * .2 * puff)} ${F(cx + rx * 1.2)} ${F(top - ry * .2 * puff)} ${F(cx + rx * 1.08)} ${F(cy + ry * .05)}`;
    const shine = `<path d="M${F(cx - rx * .55)} ${F(top + ry * .28)} Q${F(cx)} ${F(top + ry * .05)} ${F(cx + rx * .45)} ${F(top + ry * .3)}" fill="none" stroke="${hl}" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`;
    // franja com pontas: n pontas entre xa e xb, descendo até yb
    const bangs = (xa, xb, yb, n, jitter = 1) => {
      let d = `M${F(cx - rx * 1.06)} ${F(cy - ry * .05)} C${F(cx - rx * 1.15)} ${F(top - ry * .25)} ${F(cx + rx * 1.15)} ${F(top - ry * .25)} ${F(cx + rx * 1.06)} ${F(cy - ry * .05)}`;
      for (let k = 0; k <= n; k++) {
        const t = k / n, x = xb + (xa - xb) * t;
        const tipY = yb + (k % 2 ? -ry * .32 * jitter : 0) + Math.sin(k * 1.7) * 1.2;
        d += ` L${F(x + (k % 2 ? 0 : (k < n / 2 ? -1.6 : 1.6)))} ${F(k % 2 ? tipY : tipY)}`;
      }
      return d + ' Z';
    };
    switch (style) {
      case 0: // Bagunçado
        back = `<path d="${crown(1.2)} L${F(cx + rx * 1.12)} ${F(cy + ry * .55)} L${F(cx + rx * .7)} ${F(cy + ry * .3)} L${F(cx - rx * .7)} ${F(cy + ry * .3)} L${F(cx - rx * 1.12)} ${F(cy + ry * .55)} Z" fill="${dk}"/>`;
        front = `<path d="${bangs(cx - rx * 1.02, cx + rx * 1.02, cy - ry * .02, 9, 1.3)}" fill="${fill}" ${outl}/>
          <g fill="${fill}" ${outl}><path d="M${F(cx - rx * .8)} ${F(top + ry * .15)} Q${F(cx - rx * 1.05)} ${F(top + ry * .02)} ${F(cx - rx * 1.22)} ${F(top + ry * .14)} Q${F(cx - rx * .75)} ${F(top - ry * .1)} ${F(cx - rx * .25)} ${F(top + ry * .02)} Z"/><path d="M${F(cx - rx * .3)} ${F(top + ry * .02)} Q${F(cx - rx * .05)} ${F(top - ry * .22)} ${F(cx + rx * .42)} ${F(top - ry * .16)} Q${F(cx + rx * .22)} ${F(top - ry * .05)} ${F(cx + rx * .35)} ${F(top + ry * .05)} Z"/><path d="M${F(cx + rx * .3)} ${F(top + ry * .05)} Q${F(cx + rx * .9)} ${F(top - ry * .08)} ${F(cx + rx * 1.24)} ${F(top + ry * .16)} Q${F(cx + rx * 1.05)} ${F(top + ry * .2)} ${F(cx + rx * .95)} ${F(top + ry * .4)} Z"/></g>
          <path d="M${F(cx + rx * .98)} ${F(cy - ry * .15)} L${F(cx + rx * 1.18)} ${F(cy + ry * .45)} L${F(cx + rx * .9)} ${F(cy + ry * .2)} Z M${F(cx - rx * .98)} ${F(cy - ry * .15)} L${F(cx - rx * 1.18)} ${F(cy + ry * .45)} L${F(cx - rx * .9)} ${F(cy + ry * .2)} Z" fill="${fill}" ${outl}/>${shine}`;
        break;
      case 1: // Undercut: laterais curtas e topete jogado para o lado
        back = `<path d="${crown(1)} Z" fill="${dk}"/>`;
        front = `<path d="M${F(cx - rx * 1.02)} ${F(cy + ry * .12)} C${F(cx - rx * 1.06)} ${F(cy - ry * .5)} ${F(cx + rx * 1.06)} ${F(cy - ry * .5)} ${F(cx + rx * 1.02)} ${F(cy + ry * .12)} L${F(cx + rx * .96)} ${F(cy - ry * .2)} L${F(cx - rx * .96)} ${F(cy - ry * .2)} Z" fill="${dark(color, .25)}" opacity=".9"/>
          <path d="M${F(cx - rx * .95)} ${F(cy - ry * .25)} C${F(cx - rx * 1.1)} ${F(top - ry * .55)} ${F(cx + rx * 1.3)} ${F(top - ry * .6)} ${F(cx + rx * 1.15)} ${F(top + ry * .2)} Q${F(cx + rx * .9)} ${F(top + ry * .15)} ${F(cx + rx * .7)} ${F(cy - ry * .35)} Q${F(cx + rx * .2)} ${F(top + ry * .35)} ${F(cx - rx * .3)} ${F(cy - ry * .42)} Q${F(cx - rx * .6)} ${F(top + ry * .45)} ${F(cx - rx * .95)} ${F(cy - ry * .25)} Z" fill="${fill}" ${outl}/>
          <path d="M${F(cx + rx * .6)} ${F(top - ry * .1)} Q${F(cx + rx * 1.4)} ${F(top + ry * .05)} ${F(cx + rx * 1.05)} ${F(cy - ry * .25)}" fill="none" stroke="${fill}" stroke-width="2.4" stroke-linecap="round"/>${shine}`;
        break;
      case 2: // Longo liso com risca no meio
        back = `<path d="${crown(1.08)} L${F(cx + rx * 1.25)} ${F(L.chest + 4)} Q${F(cx + rx * .6)} ${F(L.chest + 10)} ${F(cx)} ${F(L.chest + 6)} Q${F(cx - rx * .6)} ${F(L.chest + 10)} ${F(cx - rx * 1.25)} ${F(L.chest + 4)} Z" fill="${cel(defs, dark(color, .2), .1)}" ${outl}/>`;
        front = `<path d="M${F(cx)} ${F(top + 1)} C${F(cx - rx * .6)} ${F(top + ry * .1)} ${F(cx - rx * 1.05)} ${F(cy - ry * .4)} ${F(cx - rx * 1.08)} ${F(cy + ry * .5)} L${F(cx - rx * 1.15)} ${F(L.sh + 6)} L${F(cx - rx * .82)} ${F(L.sh)} L${F(cx - rx * .78)} ${F(cy + ry * .2)} Q${F(cx - rx * .55)} ${F(cy - ry * .45)} ${F(cx - rx * .05)} ${F(cy - ry * .6)} Z" fill="${fill}" ${outl}/>
          <path d="M${F(cx)} ${F(top + 1)} C${F(cx + rx * .6)} ${F(top + ry * .1)} ${F(cx + rx * 1.05)} ${F(cy - ry * .4)} ${F(cx + rx * 1.08)} ${F(cy + ry * .5)} L${F(cx + rx * 1.15)} ${F(L.sh + 6)} L${F(cx + rx * .82)} ${F(L.sh)} L${F(cx + rx * .78)} ${F(cy + ry * .2)} Q${F(cx + rx * .55)} ${F(cy - ry * .45)} ${F(cx + rx * .05)} ${F(cy - ry * .6)} Z" fill="${fill}" ${outl}/>
          <path d="M${F(cx - rx * .1)} ${F(top + 2)} Q${F(cx - rx * .35)} ${F(cy - ry * .35)} ${F(cx - rx * .55)} ${F(cy - ry * .05)} L${F(cx - rx * .3)} ${F(cy - ry * .38)} Z" fill="${fill}"/>${shine}`;
        break;
      case 3: // Rabo de cavalo alto
        back = `<path d="M${F(cx + rx * .3)} ${F(top + ry * .15)} C${F(cx + rx * 1.9)} ${F(top - ry * .1)} ${F(cx + rx * 2.0)} ${F(cy + ry * 1.2)} ${F(cx + rx * 1.3)} ${F(L.chest)} Q${F(cx + rx * 1.5)} ${F(cy + ry * 1.1)} ${F(cx + rx * .9)} ${F(top + ry * .5)} Z" fill="${cel(defs, color, .2)}" ${outl}/>
          <path d="${crown(1.02)} Z" fill="${dk}"/>`;
        front = `<path d="${crown(1.02)} L${F(cx + rx * .95)} ${F(cy - ry * .25)} Q${F(cx + rx * .2)} ${F(cy - ry * .55)} ${F(cx - rx * .55)} ${F(cy - ry * .05)} L${F(cx - rx * .9)} ${F(cy + ry * .35)} L${F(cx - rx * 1.0)} ${F(cy)} Z" fill="${fill}" ${outl}/>
          <path d="M${F(cx - rx * .55)} ${F(cy - ry * .25)} L${F(cx - rx * .75)} ${F(cy + ry * .5)} L${F(cx - rx * .4)} ${F(cy - ry * .1)} Z" fill="${fill}" ${outl}/>
          <rect x="${F(cx + rx * .7)} " y="${F(top + ry * .2)}" width="4" height="3" rx="1" fill="${dark(color, .6)}" transform="rotate(-30 ${F(cx + rx * .7)} ${F(top + ry * .2)})"/>${shine}`;
        break;
      case 4: // Coque no alto
        back = `<path d="${crown(1)} Z" fill="${dk}"/>`;
        front = `<circle cx="${F(cx)}" cy="${F(top - ry * .22)}" r="${F(rx * .42)}" fill="${fill}" ${outl}/>
          <path d="M${F(cx - rx * .38)} ${F(top - ry * .08)} Q${F(cx)} ${F(top + ry * .05)} ${F(cx + rx * .38)} ${F(top - ry * .08)}" stroke="${dark(color, .6)}" stroke-width="1.6" fill="none"/>
          <path d="${crown(1)} L${F(cx + rx * 1.0)} ${F(cy - ry * .1)} Q${F(cx + rx * .6)} ${F(cy - ry * .48)} ${F(cx)} ${F(cy - ry * .5)} Q${F(cx - rx * .6)} ${F(cy - ry * .48)} ${F(cx - rx * 1.0)} ${F(cy - ry * .1)} Z" fill="${fill}" ${outl}/>
          <path d="M${F(cx - rx * .85)} ${F(cy - ry * .3)} Q${F(cx - rx * 1.05)} ${F(cy + ry * .3)} ${F(cx - rx * .8)} ${F(cy + ry * .75)}" stroke="${fill}" stroke-width="1.6" fill="none" stroke-linecap="round"/>${shine}`;
        break;
    }
    return { back, front };
  }

  /* ------------------------------ corpo/roupa ------------------------------ */
  function build(p, rk, shadow) {
    const L = skeleton(p), defs = [];
    const rank = RANKS6.includes(rk) ? rk : 'E', ri = RANKS6.indexOf(rank);
    const cls = CLASS_LOOK[p.cls] ? p.cls : 'neutro';
    let C = Object.assign({}, CLASS_LOOK[cls]);
    let skin = SKINS[p.skin] || SKINS[1], hairC = HAIRS[p.hair] || HAIRS[0];
    if (shadow) { C = { acc: '#ff2a3d', top: '#0d0a10', top2: '#151018', pants: '#0a080c', trim: '#3a1018' }; skin = '#18121a'; hairC = '#0c0a0f'; }
    const acc = C.acc, glowOn = ri >= 3 || shadow, goldOn = ri >= 4 && !shadow;
    const trimC = ri >= 2 ? acc : C.trim;
    const faceI = clamp(+p.face || 0, 0, 2), hsI = clamp(p.hs == null ? (L.f ? 2 : 0) : +p.hs, 0, 4);
    const out = []; // camadas na ordem de desenho

    const x0 = 60;
    const shL = [x0 - L.shW, L.sh + 2], shR = [x0 + L.shW, L.sh + 2];
    const armLen = L.hh * 2.85;
    const elbowL = [x0 - L.shW - L.hh * .18, L.sh + armLen * .5], elbowR = [x0 + L.shW + L.hh * .18, L.sh + armLen * .5];
    const handL = [x0 - L.shW - L.hh * .22 - (L.w - 1) * 3, L.sh + armLen], handR = [x0 + L.shW + L.hh * .22 + (L.w - 1) * 3, L.sh + armLen];
    const legX = L.hipW * .48;
    const hipLp = [x0 - legX, L.crotch - 2], hipRp = [x0 + legX, L.crotch - 2];
    const kneeL = [x0 - legX * .92, L.knee], kneeR = [x0 + legX * .92, L.knee];
    const ankL = [x0 - legX * .86, L.ankle], ankR = [x0 + legX * .86, L.ankle];

    // ---- aura do rank
    const auraO = shadow ? .38 : [.1, .16, .24, .34, .44, .55][ri];
    const auraId = uid();
    defs.push(`<radialGradient id="${auraId}" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="${acc}" stop-opacity="${auraO}"/><stop offset="1" stop-color="${acc}" stop-opacity="0"/></radialGradient>`);
    out.push(`<ellipse cx="60" cy="${F((L.top + L.G) / 2 + 4)}" rx="58" ry="${F(L.H * .56)}" fill="url(#${auraId})"/>`);
    out.push(`<ellipse cx="60" cy="${F(L.G + 1)}" rx="${F(24 + L.w * 8)}" ry="3.6" fill="#000" opacity=".55"/>`);

    // ---- capa/casaco longo atrás (C+), formato por classe
    if (ri >= 2 || shadow || cls === 'mago') {
      const capeC = cls === 'mago' ? C.top : dark(C.top2, .1);
      const hemY = Math.min(L.G - 4, L.knee + (L.G - L.knee) * (.35 + ri * .1));
      const spread = L.hh * (.35 + ri * .08);
      let d = `M${F(x0 - L.shW + 2)} ${F(L.sh + 2)} L${F(x0 + L.shW - 2)} ${F(L.sh + 2)} L${F(x0 + L.hipW + spread)} ${F(hemY)}`;
      const n = 8;
      for (let k = 0; k <= n; k++) {
        const x = x0 + L.hipW + spread - (2 * (L.hipW + spread)) * k / n;
        const torn = (cls === 'assassino' || shadow) && k % 2 ? 8 + (k * 5) % 6 : cls === 'guerreiro' && k % 2 ? 3 : 0;
        d += ` L${F(x)} ${F(hemY - torn)}`;
      }
      out.push(`<path d="${d} Z" fill="${cel(defs, capeC)}" stroke="${LINE}" stroke-width=".8"/>`);
      if (glowOn) out.push(`<path d="M${F(x0 + L.hipW + spread)} ${F(hemY)} L${F(x0 + L.shW - 2)} ${F(L.sh + 2)} M${F(x0 - L.hipW - spread)} ${F(hemY)} L${F(x0 - L.shW + 2)} ${F(L.sh + 2)}" stroke="${acc}" stroke-width=".8" opacity=".7"/>`);
    }

    // ---- arma de costas do guerreiro
    if (cls === 'guerreiro' && !shadow) {
      const bl = ri >= 2 ? L.hh * 3.3 : L.hh * 2.8;
      out.push(`<g transform="rotate(-28 ${F(x0)} ${F(L.chest)})"><rect x="${F(x0 - 2.6)}" y="${F(L.chest - bl * .55)}" width="5.2" height="${F(bl)}" fill="${cel(defs, STEEL)}" stroke="${LINE}" stroke-width=".7"/>
        ${glowOn ? `<rect x="${F(x0 - 3.4)}" y="${F(L.chest - bl * .55)}" width="6.8" height="${F(bl)}" fill="none" stroke="${acc}" stroke-width="1.6" opacity=".6" filter="url(#__blur)"/>` : ''}
        <rect x="${F(x0 - 6)}" y="${F(L.chest + bl * .45)}" width="12" height="2.6" fill="${goldOn ? GOLD : '#4a3a2a'}" stroke="${LINE}" stroke-width=".5"/><rect x="${F(x0 - 1.4)}" y="${F(L.chest + bl * .45 + 2.6)}" width="2.8" height="8" fill="#3a2a1a"/></g>`);
    }

    // ---- cabelo de trás
    const hr = hair(L, hsI, hairC, defs);
    out.push(hr.back);

    // ---- pernas (calça) e botas
    const pantsF = cel(defs, C.pants);
    out.push(`<path d="${P([[x0 - L.hipW, L.hip], [x0 + L.hipW, L.hip], [hipRp[0] + L.thigh, L.crotch], [kneeR[0] + L.calf * 1.05, kneeR[1]], [ankR[0] + L.ankleW * 1.3, ankR[1] - 8], [ankR[0] - L.ankleW * 1.3, ankR[1] - 8], [kneeR[0] - L.calf * .9, kneeR[1]], [x0 + L.legGap, L.crotch + 2], [x0 - L.legGap, L.crotch + 2], [kneeL[0] + L.calf * .9, kneeL[1]], [ankL[0] + L.ankleW * 1.3, ankL[1] - 8], [ankL[0] - L.ankleW * 1.3, ankL[1] - 8], [kneeL[0] - L.calf * 1.05, kneeL[1]], [hipLp[0] - L.thigh, L.crotch]])}" fill="${pantsF}" stroke="${LINE}" stroke-width=".8" stroke-linejoin="round"/>`);
    out.push(`<path d="M${F(x0)} ${F(L.hip + 2)} L${F(x0)} ${F(L.crotch + 1)}" stroke="${LINE}" stroke-width=".6" opacity=".7"/>`);
    // dobras de tecido
    out.push(`<path d="M${F(kneeL[0] - L.calf * .6)} ${F(L.knee - 2)} q3 2 6 0 M${F(kneeR[0] - L.calf * .4)} ${F(L.knee - 1)} q3 2 6 0" stroke="${dark(C.pants, .5)}" stroke-width=".6" fill="none"/>`);
    // coldre na coxa (assassino) / placas nas pernas (guardião)
    if (cls === 'assassino') out.push(`<rect x="${F(hipRp[0] - L.thigh * .7)}" y="${F(L.crotch + 4)}" width="${F(L.thigh * 1.3)}" height="10" rx="1" fill="#2b2522" stroke="${LINE}" stroke-width=".5"/><path d="M${F(hipRp[0] - L.thigh - 1)} ${F(L.crotch + 6)} l${F(L.thigh * 2 + 2)} 1 M${F(hipRp[0] - L.thigh - 1)} ${F(L.crotch + 12)} l${F(L.thigh * 2 + 2)} 1" stroke="#3a3330" stroke-width="1.6"/>`);
    if ((cls === 'guardiao' && ri >= 1) || (cls === 'guerreiro' && ri >= 3)) out.push(`<path d="M${F(kneeL[0] - L.calf)} ${F(L.knee - 5)} h${F(L.calf * 2)} l-1 9 h${F(-L.calf * 2 + 2)} Z M${F(kneeR[0] - L.calf)} ${F(L.knee - 5)} h${F(L.calf * 2)} l-1 9 h${F(-L.calf * 2 + 2)} Z" fill="${cel(defs, STEEL)}" stroke="${goldOn ? GOLD : LINE}" stroke-width=".6"/>`);
    // botas
    const boot = (a, s) => {
      const bw = L.ankleW * 1.6 + 1.2, toe = s * 2.2;
      return `<path d="M${F(a[0] - bw)} ${F(a[1] - 14)} L${F(a[0] + bw)} ${F(a[1] - 14)} L${F(a[0] + bw + .4)} ${F(a[1] + 1)} Q${F(a[0] + bw + toe + 2)} ${F(a[1] + 2)} ${F(a[0] + bw + toe + 2)} ${F(a[1] + 5)} L${F(a[0] - bw - 1)} ${F(a[1] + 5)} Z" fill="${cel(defs, shadow ? '#0a080c' : '#15171c')}" stroke="${LINE}" stroke-width=".8"/>
        <rect x="${F(a[0] - bw - 1.2)}" y="${F(a[1] + 3.6)}" width="${F(bw * 2 + toe + 3.6)}" height="2.4" fill="#050608"/>
        <path d="M${F(a[0] - bw + 1)} ${F(a[1] - 10)} h${F(bw * 2 - 2)} M${F(a[0] - bw + 1)} ${F(a[1] - 6)} h${F(bw * 2 - 2)}" stroke="${ri >= 2 ? acc : STEEL}" stroke-width=".6" opacity=".9"/>`;
    };
    out.push(boot(ankL, -1), boot(ankR, 1));

    // ---- braço de trás (esquerdo) desenhado antes do tronco
    const sleeve = cel(defs, C.top2);
    const armSeg = (sh, el, hd, side) => `
      <path d="${limb(sh, el, L.arm, L.arm * .82)}" fill="${sleeve}" stroke="${LINE}" stroke-width=".8"/>
      <path d="${limb(el, hd, L.fore, L.fore * .78)}" fill="${cel(defs, cls === 'assassino' ? '#121418' : dark(C.top2, .12))}" stroke="${LINE}" stroke-width=".8"/>
      ${ri >= 1 || cls === 'assassino' ? `<path d="${limb([el[0] + (hd[0] - el[0]) * .55, el[1] + (hd[1] - el[1]) * .55], [el[0] + (hd[0] - el[0]) * .88, el[1] + (hd[1] - el[1]) * .88], L.fore * 1.1, L.fore * .95)}" fill="${cel(defs, ri >= 1 ? STEEL : '#2b2522')}" stroke="${goldOn ? GOLD : LINE}" stroke-width=".6"/>` : ''}
      ${glowOn ? `<path d="M${F(el[0] + (hd[0] - el[0]) * .6)} ${F(el[1] + (hd[1] - el[1]) * .6)} l${F(side * .5)} 4" stroke="${acc}" stroke-width="1" filter="url(#__blur)"/>` : ''}
      <ellipse cx="${F(hd[0])}" cy="${F(hd[1] + 1.5)}" rx="${F(L.fore * .95)}" ry="${F(L.fore * 1.2)}" fill="${cls === 'assassino' || cls === 'guardiao' ? '#1a1d22' : skin}" stroke="${LINE}" stroke-width=".7"/>
      ${cls === 'assassino' ? `<path d="M${F(hd[0] - L.fore * .8)} ${F(hd[1] + 2.5)} Q${F(hd[0])} ${F(hd[1] + L.fore * 1.6)} ${F(hd[0] + L.fore * .8)} ${F(hd[1] + 2.5)}" fill="${skin}"/>` : ''}`;

    // ---- tronco
    const torso = [[x0 - L.shW, L.sh], [x0 + L.shW, L.sh], [x0 + L.chestW, L.chest], [x0 + L.waistW, L.waist], [x0 + L.hipW, L.hip + 1], [x0 - L.hipW, L.hip + 1], [x0 - L.waistW, L.waist], [x0 - L.chestW, L.chest]];
    // pescoço
    out.push(`<path d="M${F(x0 - L.neckW)} ${F(L.chin - 3)} L${F(x0 + L.neckW)} ${F(L.chin - 3)} L${F(x0 + L.neckW * 1.15)} ${F(L.sh + 2)} L${F(x0 - L.neckW * 1.15)} ${F(L.sh + 2)} Z" fill="${celSkin(defs, skin)}" stroke="${LINE}" stroke-width=".7"/>`);
    out.push(`<path d="M${F(x0 - L.neckW)} ${F(L.chin - 1)} Q${F(x0)} ${F(L.chin + 3)} ${F(x0 + L.neckW)} ${F(L.chin - 1)}" fill="${dark(skin, .35)}" opacity=".6"/>`);
    // camiseta/base
    out.push(`<path d="${P(torso)}" fill="${cel(defs, shadow ? '#0a080c' : cls === 'mago' ? '#101a2c' : '#0e1015')}" stroke="${LINE}" stroke-width=".8" stroke-linejoin="round"/>`);
    // peito feminino (sombra sutil)
    if (L.f) out.push(`<path d="M${F(x0 - L.chestW * .75)} ${F(L.chest + 2)} Q${F(x0 - L.chestW * .35)} ${F(L.chest + 6)} ${F(x0 - 1)} ${F(L.chest + 2)} M${F(x0 + 1)} ${F(L.chest + 2)} Q${F(x0 + L.chestW * .35)} ${F(L.chest + 6)} ${F(x0 + L.chestW * .75)} ${F(L.chest + 2)}" fill="none" stroke="${LINE}" stroke-width=".6" opacity=".6"/>`);
    // barriga (peso alto)
    if (L.belly > .05) out.push(`<path d="M${F(x0 - L.waistW * .7)} ${F(L.waist + 4)} Q${F(x0)} ${F(L.waist + 8 + L.belly * 10)} ${F(x0 + L.waistW * .7)} ${F(L.waist + 4)}" fill="none" stroke="${LINE}" stroke-width=".6" opacity=".55"/>`);

    // ---- roupa de cima por classe
    const jacket = cel(defs, C.top);
    if (cls === 'guardiao' || (cls === 'guerreiro' && ri >= 1)) {
      // peitoral de armadura
      out.push(`<path d="${P([[x0 - L.shW + 2, L.sh + 1], [x0 + L.shW - 2, L.sh + 1], [x0 + L.chestW, L.chest + 2], [x0 + L.waistW, L.waist], [x0 - L.waistW, L.waist], [x0 - L.chestW, L.chest + 2]])}" fill="${cel(defs, cls === 'guardiao' ? '#5c6b78' : '#5a5050')}" stroke="${goldOn ? GOLD : LINE}" stroke-width=".9"/>`);
      out.push(`<path d="M${F(x0)} ${F(L.sh + 3)} L${F(x0)} ${F(L.waist - 2)} M${F(x0 - L.chestW * .8)} ${F(L.chest + 6)} Q${F(x0)} ${F(L.chest + 12)} ${F(x0 + L.chestW * .8)} ${F(L.chest + 6)}" stroke="${LINE}" stroke-width=".6" fill="none" opacity=".7"/>`);
      out.push(`<path d="${P([[x0 - L.waistW, L.waist], [x0 + L.waistW, L.waist], [x0 + L.hipW + 2, L.hip + 6], [x0 - L.hipW - 2, L.hip + 6]])}" fill="${cel(defs, C.top2)}" stroke="${LINE}" stroke-width=".7"/>`);
    } else {
      // jaqueta aberta (assassino), túnica (guerreiro E), sobretudo (mago), manto com faixa (xamã)
      const long = cls === 'mago' ? L.knee + 4 : cls === 'xama' ? L.crotch + 10 : L.hip + 4;
      const open = cls === 'mago' || cls === 'xama' ? L.chestW * .2 : L.chestW * .36;
      const left = [[x0 - L.shW, L.sh], [x0 - open, L.sh], [x0 - open * .8, L.waist], [x0 - L.hipW * .55, long], [x0 - L.hipW - 3 - (cls === 'mago' ? L.hh * .4 : 0), long + 1], [x0 - L.waistW - 1, L.waist], [x0 - L.chestW - .5, L.chest]];
      const right = left.map(([x, y]) => [120 - x, y]);
      out.push(`<path d="${P(left)}" fill="${jacket}" stroke="${LINE}" stroke-width=".85" stroke-linejoin="round"/><path d="${P(right)}" fill="${jacket}" stroke="${LINE}" stroke-width=".85" stroke-linejoin="round"/>`);
      out.push(`<path d="M${F(x0 - open)} ${F(L.sh + 1)} L${F(x0 - open * .8)} ${F(L.waist)} L${F(x0 - L.hipW * .55)} ${F(long)} M${F(x0 + open)} ${F(L.sh + 1)} L${F(x0 + open * .8)} ${F(L.waist)} L${F(x0 + L.hipW * .55)} ${F(long)}" stroke="${trimC}" stroke-width="${ri >= 2 ? .9 : .6}" fill="none"/>`);
      if (goldOn) out.push(`<path d="M${F(x0 - L.hipW * .55)} ${F(long)} L${F(x0 - L.hipW - 3)} ${F(long + 1)} M${F(x0 + L.hipW * .55)} ${F(long)} L${F(x0 + L.hipW + 3)} ${F(long + 1)}" stroke="${GOLD}" stroke-width="1"/>`);
      // gola alta
      out.push(`<path d="M${F(x0 - L.neckW * 1.6)} ${F(L.chin + 1)} L${F(x0 - open - .5)} ${F(L.sh + 4)} L${F(x0 - L.shW * .55)} ${F(L.sh + 1)} Z M${F(x0 + L.neckW * 1.6)} ${F(L.chin + 1)} L${F(x0 + open + .5)} ${F(L.sh + 4)} L${F(x0 + L.shW * .55)} ${F(L.sh + 1)} Z" fill="${cel(defs, C.top2)}" stroke="${LINE}" stroke-width=".7"/>`);
      if (cls === 'xama') out.push(`<path d="M${F(x0 - L.waistW - 1)} ${F(L.waist - 1)} L${F(x0 + L.waistW + 1)} ${F(L.waist + 3)} L${F(x0 + L.waistW + 1)} ${F(L.waist + 7)} L${F(x0 - L.waistW - 1)} ${F(L.waist + 3)} Z" fill="${acc}" opacity=".85"/><path d="M${F(x0 + L.waistW * .6)} ${F(L.waist + 5)} l2 14 l3 -1 l-2 -13" fill="${acc}" opacity=".85"/>`);
    }
    // alças cruzadas (assassino) / faixa diagonal (guerreiro)
    if (cls === 'assassino' || cls === 'guerreiro') {
      out.push(`<path d="M${F(x0 - L.shW * .7)} ${F(L.sh + 2)} L${F(x0 + L.waistW)} ${F(L.waist + 2)}${cls === 'assassino' ? ` M${F(x0 + L.shW * .7)} ${F(L.sh + 2)} L${F(x0 - L.waistW)} ${F(L.waist + 2)}` : ''}" stroke="#3a3330" stroke-width="2.4"/>`);
      out.push(`<circle cx="${F(x0)}" cy="${F(L.sh + (L.waist - L.sh) * .48)}" r="2" fill="none" stroke="${goldOn ? GOLD : STEEL_HI}" stroke-width="1"/>`);
    }
    // cintos
    out.push(`<path d="M${F(x0 - L.hipW - .5)} ${F(L.hip - 2.5)} L${F(x0 + L.hipW + .5)} ${F(L.hip - 1.5)} L${F(x0 + L.hipW + .5)} ${F(L.hip + 1.5)} L${F(x0 - L.hipW - .5)} ${F(L.hip + .5)} Z" fill="#2b2522" stroke="${LINE}" stroke-width=".5"/>`);
    if (cls === 'assassino') out.push(`<path d="M${F(x0 - L.hipW)} ${F(L.hip + 3.5)} L${F(x0 + L.hipW)} ${F(L.hip + 1.5)} L${F(x0 + L.hipW)} ${F(L.hip + 4)} L${F(x0 - L.hipW)} ${F(L.hip + 6)} Z" fill="#3a3330"/>`);
    out.push(`<g fill="none" stroke="${goldOn ? GOLD : ri >= 2 ? acc : STEEL_HI}" stroke-width=".9"><path d="M60 ${F(L.hip - 4)} L60 ${F(L.hip + 3)}"/><path d="M60 ${F(L.hip - 3)} Q57.4 ${F(L.hip - 1.5)} 56.6 ${F(L.hip + 1.5)}"/><path d="M60 ${F(L.hip - 3)} Q62.6 ${F(L.hip - 1.5)} 63.4 ${F(L.hip + 1.5)}"/></g>`);
    // emblema no peito (B+)
    if (ri >= 3 || shadow) out.push(`<path d="M60 ${F(L.chest - 3)} l3.4 3.4 -3.4 3.4 -3.4 -3.4 Z" fill="#0b0d12" stroke="${acc}" stroke-width=".9"/>${glowOn ? `<circle cx="60" cy="${F(L.chest + .4)}" r="3" fill="${acc}" opacity=".5" filter="url(#__blur)"/>` : ''}`);

    // ---- braços
    out.push(armSeg(shL, elbowL, handL, -1));
    out.push(armSeg(shR, elbowR, handR, 1));

    // ---- ombreiras (D+) e detalhes de rank
    if (ri >= 1 || cls === 'guardiao') {
      const pad = (s, big) => {
        const x = x0 + s * L.shW, y = L.sh + 1, r = L.arm * (big ? 1.45 : 1.25);
        return `<path d="M${F(x - s * r * .9)} ${F(y + 3)} Q${F(x - s * r * .2)} ${F(y - r)} ${F(x + s * r * 1.05)} ${F(y + r * .2)} Q${F(x + s * r * .7)} ${F(y + r * .8)} ${F(x - s * r * .2)} ${F(y + r * .55)} Z" fill="${cel(defs, cls === 'mago' || cls === 'xama' ? C.top2 : STEEL)}" stroke="${goldOn ? GOLD : LINE}" stroke-width=".8"/>
          ${ri >= 3 ? `<circle cx="${F(x + s * r * .1)}" cy="${F(y - r * .15)}" r="1.1" fill="${acc}"/>` : ''}`;
      };
      out.push(pad(-1, true));
      if (ri >= 4 || cls === 'guardiao' || cls === 'guerreiro') out.push(pad(1, false));
    }

    // ---- armas e itens de classe
    if (!shadow || true) {
      if (cls === 'assassino' || shadow) {
        const dagger = (hd, s) => {
          const len = L.hh * (1.15 + ri * .05), tx = hd[0] + s * (6 + ri * .4), ty = hd[1] + len;
          const blade = `M${F(hd[0] - s * 1.2)} ${F(hd[1] + 4)} Q${F(hd[0] + s * 8)} ${F(hd[1] + len * .45)} ${F(tx)} ${F(ty)} Q${F(hd[0] + s * 1.6)} ${F(hd[1] + len * .55)} ${F(hd[0] + s * 2.4)} ${F(hd[1] + 4)} Z`;
          return `${glowOn ? `<path d="${blade}" fill="none" stroke="${acc}" stroke-width="3" opacity=".85" filter="url(#__blur)"/>` : ''}
            <path d="${blade}" fill="${cel(defs, '#c9d4df', .6)}" stroke="${LINE}" stroke-width=".6"/>
            <path d="M${F(hd[0] - 4)} ${F(hd[1] + 3)} L${F(hd[0] + 4)} ${F(hd[1] + 3)}" stroke="${goldOn ? GOLD : STEEL}" stroke-width="2"/>`;
        };
        out.push(dagger(handL, -1), dagger(handR, 1));
      } else if (cls === 'guerreiro' && ri >= 3) {
        // segunda arma na mão a partir do B
        const hd = handR, len = L.hh * 1.6;
        out.push(`<path d="M${F(hd[0] - 1.6)} ${F(hd[1] + 3)} L${F(hd[0] + 3)} ${F(hd[1] + len)} L${F(hd[0] + 4.4)} ${F(hd[1] + 3)} Z" fill="${cel(defs, STEEL_HI)}" stroke="${glowOn ? acc : LINE}" stroke-width=".6"/>`);
      } else if (cls === 'mago') {
        const hd = handR, topY = L.sh - L.hh * (.4 + ri * .08);
        out.push(`<line x1="${F(hd[0] + 1)}" y1="${F(topY)}" x2="${F(hd[0] + 1)}" y2="${F(L.G - 1)}" stroke="#5a3e24" stroke-width="2.6"/><line x1="${F(hd[0] + .4)}" y1="${F(topY)}" x2="${F(hd[0] + .4)}" y2="${F(L.G - 1)}" stroke="#7a5a3a" stroke-width=".8"/>`);
        out.push(`<circle cx="${F(hd[0] + 1)}" cy="${F(topY - 4)}" r="${F(3.4 + ri * .5)}" fill="${acc}" opacity=".55" filter="url(#__blur)"/><path d="M${F(hd[0] + 1)} ${F(topY - 9 - ri * .6)} l3 5 -3 5 -3 -5 Z" fill="${light(acc, .4)}" stroke="${LINE}" stroke-width=".5"/>`);
        if (ri >= 3) out.push(`<g class="spectral" fill="none" stroke="${acc}" stroke-width=".7" opacity=".7"><circle cx="18" cy="${F(L.chest)}" r="5"/><path d="M15 ${F(L.chest)} h6 M18 ${F(L.chest - 3)} v6"/><circle cx="102" cy="${F(L.waist)}" r="4"/></g>`);
      } else if (cls === 'guardiao') {
        const hd = handL, sw = L.hh * (.62 + ri * .03), sh = L.hh * (.95 + ri * .04);
        out.push(`<path d="M${F(hd[0] - sw)} ${F(hd[1] - sh * .55)} L${F(hd[0] + sw)} ${F(hd[1] - sh * .55)} L${F(hd[0] + sw)} ${F(hd[1] + sh * .1)} Q${F(hd[0] + sw * .8)} ${F(hd[1] + sh * .5)} ${F(hd[0])} ${F(hd[1] + sh * .6)} Q${F(hd[0] - sw * .8)} ${F(hd[1] + sh * .5)} ${F(hd[0] - sw)} ${F(hd[1] + sh * .1)} Z" fill="${cel(defs, '#2a4a3a')}" stroke="${goldOn ? GOLD : STEEL_HI}" stroke-width="1.2"/>
          <path d="M${F(hd[0])} ${F(hd[1] - sh * .45)} L${F(hd[0])} ${F(hd[1] + sh * .48)} M${F(hd[0] - sw * .7)} ${F(hd[1] - sh * .12)} L${F(hd[0] + sw * .7)} ${F(hd[1] - sh * .12)}" stroke="${ri >= 2 ? acc : STEEL_HI}" stroke-width="1.2"/>
          ${glowOn ? `<circle cx="${F(hd[0])}" cy="${F(hd[1] - sh * .12)}" r="3" fill="${acc}" opacity=".6" filter="url(#__blur)"/>` : ''}`);
      } else if (cls === 'xama') {
        const hd = handR;
        out.push(`<circle cx="${F(hd[0] + 6)}" cy="${F(hd[1] - 8)}" r="${F(4 + ri * .5)}" fill="${acc}" opacity=".5" filter="url(#__blur)"/><circle cx="${F(hd[0] + 6)}" cy="${F(hd[1] - 8)}" r="${F(2.4 + ri * .3)}" fill="${light(acc, .5)}"/>`);
        out.push(`<path d="M${F(x0 - L.neckW * 2)} ${F(L.sh + 1)} Q${F(x0)} ${F(L.chest + 6)} ${F(x0 + L.neckW * 2)} ${F(L.sh + 1)}" fill="none" stroke="#c9a24a" stroke-width=".9"/>${[-.6, -.3, 0, .3, .6].map(t => `<circle cx="${F(x0 + t * L.neckW * 3)}" cy="${F(L.sh + 4 + (1 - Math.abs(t)) * 7)}" r="1.3" fill="${t === 0 ? acc : '#c9a24a'}"/>`).join('')}`);
      }
    }

    // ---- cabeça
    const cx = 60, cy = L.headCy, rx = L.headRx, ry = L.headRy;
    out.push(`<ellipse cx="${F(cx - rx * .98)}" cy="${F(cy + ry * .12)}" rx="1.8" ry="3" fill="${dark(skin, .12)}" stroke="${LINE}" stroke-width=".6"/><ellipse cx="${F(cx + rx * .98)}" cy="${F(cy + ry * .12)}" rx="1.8" ry="3" fill="${dark(skin, .25)}" stroke="${LINE}" stroke-width=".6"/>`);
    out.push(`<path d="M${F(cx - rx)} ${F(cy - ry * .1)} C${F(cx - rx)} ${F(cy - ry * 1.05)} ${F(cx + rx)} ${F(cy - ry * 1.05)} ${F(cx + rx)} ${F(cy - ry * .1)} C${F(cx + rx)} ${F(cy + ry * .42)} ${F(cx + rx * .38)} ${F(cy + ry * .9)} ${F(cx)} ${F(cy + ry)} C${F(cx - rx * .38)} ${F(cy + ry * .9)} ${F(cx - rx)} ${F(cy + ry * .42)} ${F(cx - rx)} ${F(cy - ry * .1)} Z" fill="${celSkin(defs, skin)}" stroke="${LINE}" stroke-width=".9"/>`);
    out.push(face(L, faceI, skin, shadow ? '#ff2a3d' : acc, ri, L.f, shadow));
    out.push(hr.front);

    // ---- efeitos de rank
    if (ri >= 3 && !shadow) out.push(`<g class="rank-pulse rank-${rank}"><circle cx="60" cy="${F((L.top + L.G) / 2 + 4)}" r="51" fill="none" stroke="${acc}" stroke-width="1" opacity=".45"/><circle cx="60" cy="${F((L.top + L.G) / 2 + 4)}" r="43" fill="none" stroke="${goldOn ? GOLD : acc}" stroke-width=".6" opacity=".3"/></g>`);
    if (ri >= 5 && !shadow) {
      out.push(`<g class="spectral" opacity=".8">${[[14, 70, -24], [106, 64, 24], [10, 134, -10], [110, 140, 12]].map(([x, y, a]) => `<g transform="rotate(${a} ${x} ${y})"><path d="M${x} ${y - 14} L${x + 2.6} ${y + 5} L${x} ${y + 9} L${x - 2.6} ${y + 5} Z" fill="${acc}" opacity=".35" filter="url(#__blur)"/><path d="M${x} ${y - 14} L${x + 1.8} ${y + 5} L${x} ${y + 8} L${x - 1.8} ${y + 5} Z" fill="none" stroke="${light(acc, .4)}" stroke-width=".7"/></g>`).join('')}</g>`);
      out.push(`<g class="rank-particles">${[[15, 44], [99, 35], [22, 99], [103, 122], [18, 154], [98, 174], [31, 190], [88, 60], [26, 68], [95, 196], [12, 126], [109, 88]].map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="${k % 3 === 0 ? 1.6 : .9}" fill="${k % 2 ? acc : GOLD}"/>`).join('')}</g>`);
    }

    const blurId = uid();
    const svgBody = out.join('\n').replace(/url\(#__blur\)/g, `url(#${blurId})`);
    defs.push(`<filter id="${blurId}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.5"/></filter>`);
    const label = shadow ? 'Sombra do Antigo Eu' : `Avatar do jogador, Rank ${rank}`;
    return `<svg class="immersive-avatar avatar-v2 rank-${rank}" viewBox="0 0 120 210" role="img" aria-label="${label}" style="overflow:visible"><defs>${defs.join('')}</defs>${svgBody}</svg>`;
  }

  /* ------------------------------ ligação ------------------------------ */
  avatar = function (p, rk, shadow) { return build(p || {}, rk, shadow); };
  window.__AV2__ = { build, skeleton };

  /* Carta de evolução da classe: ilustração do rank atual (quando existe) */
  function classCard(p, rank) {
    const art = window.AVATAR_ART || {};
    return art[`${p.cls}/${p.sex === 'f' ? 'f' : 'm'}/${rank}`] || null;
  }
  window.classCard = classCard;

  /* ---------------- carta de evolução + editar aparência no app ---------------- */
  const css = document.createElement('style');
  css.textContent = `
  .class-card .cc{display:grid;grid-template-columns:minmax(120px,42%) 1fr;gap:14px;align-items:center}
  .class-card img{display:block;width:100%;height:auto;max-height:340px;object-fit:contain;filter:drop-shadow(0 10px 18px rgba(0,0,0,.6))}
  .class-card .ccr{font-family:var(--f-display);letter-spacing:.18em;color:var(--gold);font-weight:700}
  .class-card .cc p{font-size:13px;color:var(--muted)}
  .cc-gal{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .cc-gal figure{margin:0;background:var(--deep);border:1px solid var(--rule);padding:4px;text-align:center}
  .cc-gal figure.lock img{filter:brightness(.15) grayscale(1)}
  .cc-gal figcaption{font:600 11px var(--f-display);letter-spacing:.1em;color:var(--gold);padding-top:4px}
  .look-btn{margin-top:10px;background:none;border:1px solid var(--edge);color:var(--muted);font:600 11px var(--f-display);letter-spacing:.1em;padding:6px 10px;cursor:pointer;text-transform:uppercase}
  .look-btn:hover{color:#fff;border-color:var(--glow)}
  #lookPanel{position:fixed;inset:0;z-index:46;background:rgba(3,5,10,.96);overflow:auto;display:grid;place-items:center;
    padding:calc(16px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) calc(16px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
  #lookPanel .win{width:100%;max-width:460px;display:flex;flex-direction:column;gap:14px}
  @media(max-width:430px){.class-card .cc{grid-template-columns:120px 1fr}.cc-gal{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
  document.head.appendChild(css);

  const RN = ['E', 'D', 'C', 'B', 'A', 'S'];
  function ensureCard() {
    if (typeof S === 'undefined' || !S || !S.p) return;
    const app = document.getElementById('app'); if (!app) return;
    const statusWin = app.querySelector('.win');
    // botão "Editar aparência" dentro do status
    if (statusWin && !document.getElementById('lookBtn')) {
      const b = document.createElement('button'); b.id = 'lookBtn'; b.className = 'look-btn'; b.textContent = 'Editar aparência';
      statusWin.appendChild(b);
    }
    const rank = rankOf(S.lv), src = classCard(S.p, rank);
    let card = document.getElementById('classCard');
    if (!src) { if (card) card.remove(); return; }
    if (!card) { card = document.createElement('section'); card.id = 'classCard'; card.className = 'win class-card'; statusWin.insertAdjacentElement('afterend', card); }
    const nm = CLASSES[S.p.cls].n[S.p.sex === 'f' ? 1 : 0];
    card.innerHTML = `<div class="tag">Forma da classe</div><div class="cc"><img src="${src}" alt="${nm}, Rank ${rank}">
      <div style="display:flex;flex-direction:column;gap:8px"><div class="ccr">RANK ${rank}</div><h2 style="font-size:18px">${nm}</h2>
      <p>A forma que o Sistema reconhece em você neste rank. Cada novo rank revela a próxima.</p>
      <button class="btn" id="ccGal">Ver evolução</button></div></div>`;
  }
  function gallery() {
    const p = S.p, cur = RN.indexOf(rankOf(S.lv));
    const items = RN.map((r, i) => { const src = classCard(p, r); if (!src) return ''; const lock = i > cur; return `<figure class="${lock ? 'lock' : ''}"><img src="${src}" alt="Rank ${r}" loading="lazy"><figcaption>${lock ? 'RANK ' + r + ' · BLOQUEADO' : 'RANK ' + r}</figcaption></figure>`; }).join('');
    showModal({ kind: 'gold story', tag: 'Evolução da classe', title: CLASSES[p.cls].n[p.sex === 'f' ? 1 : 0], body: `<div class="cc-gal">${items}</div>`, btn: 'Fechar' });
  }

  // painel de aparência (usa uma cópia do jogador até salvar)
  let LP = null;
  function lookDraw() {
    const el = document.getElementById('lookPanel'); if (!el) return;
    const hsSel = LP.hs == null ? (LP.sex === 'f' ? 2 : 0) : +LP.hs;
    el.innerHTML = `<div class="win">
      <div class="tag">Aparência</div>
      <div class="bodygrid"><div id="lookPrev">${avatar(LP, rankOf(S.lv))}</div><div class="ctrls">
        <div><div class="lbl">Altura <b id="lkHV">${LP.height} cm</b></div><input type="range" id="lkH" min="140" max="210" value="${LP.height}"></div>
        <div><div class="lbl">Peso <b id="lkWV">${LP.weight} kg</b></div><input type="range" id="lkW" min="40" max="160" value="${LP.weight}"></div>
      </div></div>
      <div><div class="lbl">Rosto</div><div class="optrow">${FACES.map((n, i) => `<button class="opt ${(+LP.face || 0) === i ? 'sel' : ''}" data-lk-face="${i}">${n}</button>`).join('')}</div></div>
      <div><div class="lbl">Cabelo</div><div class="optrow">${HAIRSTYLES.map((n, i) => `<button class="opt ${hsSel === i ? 'sel' : ''}" data-lk-hs="${i}">${n}</button>`).join('')}</div></div>
      <div><div class="lbl">Cor do cabelo</div><div class="swatches">${HAIRS.map((c, i) => `<button class="sw ${LP.hair === i ? 'sel' : ''}" data-lk-hair="${i}" style="background:${c}" aria-label="Cor ${i + 1}"></button>`).join('')}</div></div>
      <div><div class="lbl">Tom de pele</div><div class="swatches">${SKINS.map((c, i) => `<button class="sw ${LP.skin === i ? 'sel' : ''}" data-lk-skin="${i}" style="background:${c}" aria-label="Tom ${i + 1}"></button>`).join('')}</div></div>
      <div class="nav"><button class="btn" data-lk="cancel">Cancelar</button><button class="btn solid" data-lk="save">Salvar</button></div></div>`;
    const h = document.getElementById('lkH'), w = document.getElementById('lkW');
    const up = () => { LP.height = +h.value; LP.weight = +w.value; document.getElementById('lkHV').textContent = LP.height + ' cm'; document.getElementById('lkWV').textContent = LP.weight + ' kg'; document.getElementById('lookPrev').innerHTML = avatar(LP, rankOf(S.lv)); };
    h.oninput = up; w.oninput = up;
  }
  function lookOpen() {
    LP = JSON.parse(JSON.stringify(S.p));
    const el = document.createElement('div'); el.id = 'lookPanel'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Editar aparência');
    document.body.appendChild(el); lookDraw();
  }
  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.id === 'lookBtn') return lookOpen();
    if (t.id === 'ccGal') return gallery();
    if (!t.closest('#lookPanel')) return;
    const d = t.dataset;
    if (d.lk === 'cancel') { document.getElementById('lookPanel').remove(); return; }
    if (d.lk === 'save') { S.p = Object.assign(S.p, LP); save(); render(); document.getElementById('lookPanel').remove(); toast('Aparência atualizada.'); return; }
    if (d.lkFace != null) LP.face = +d.lkFace;
    else if (d.lkHs != null) LP.hs = +d.lkHs;
    else if (d.lkHair != null) LP.hair = +d.lkHair;
    else if (d.lkSkin != null) LP.skin = +d.lkSkin;
    else return;
    lookDraw();
  });

  const prevRender = render;
  render = function () { prevRender(); ensureCard(); };
})();
