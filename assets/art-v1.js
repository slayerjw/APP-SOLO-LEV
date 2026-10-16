/* Art V1 — artes desenhadas em SVG para o app.
   - Titã da Preguiça (chefe), seguindo o conceito da ART_BIBLE.md
   - Assassino das Sombras: avatar original com evolução visual do Rank E ao S
   Carregue depois de assets/immersive-v1.js. Não altera o save. */
(() => {
  'use strict';
  if (window.__ART_V1__) return;
  window.__ART_V1__ = true;

  const F = n => (+n).toFixed(1);
  let n = 0; const uidA = p => `${p}${(n++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

  /* ---------- correntes: elos ao longo de uma curva quadrática ---------- */
  function chain(x0, y0, cx, cy, x1, y1, opt = {}) {
    const step = opt.step || 7, rx = opt.rx || 4.2, ry = opt.ry || 2.4;
    const col = opt.col || '#5b5866', hi = opt.hi || '#8d8a99';
    const P = t => [(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1];
    let len = 0, prev = P(0); const S = 60;
    for (let i = 1; i <= S; i++) { const q = P(i / S); len += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
    const count = Math.max(2, Math.round(len / step)); let out = '';
    for (let i = 0; i <= count; i++) {
      const t = i / count, [x, y] = P(t), [x2, y2] = P(Math.min(1, t + .01)), [x3, y3] = P(Math.max(0, t - .01));
      const ang = Math.atan2(y2 - y3, x2 - x3) * 180 / Math.PI;
      const flat = i % 2 === 0;
      out += `<ellipse cx="${F(x)}" cy="${F(y)}" rx="${F(rx)}" ry="${F(flat ? ry : ry * .45)}" transform="rotate(${F(ang)} ${F(x)} ${F(y)})" fill="none" stroke="${flat ? col : hi}" stroke-width="${flat ? 1.8 : 1.4}"/>`;
    }
    return `<g class="chain">${out}</g>`;
  }

  /* ---------------------------- TITÃ DA PREGUIÇA ----------------------------
     Segue o conceito "Titã da Preguiça": gigante de pedra em pé, coroa de espinhos,
     máscara com olhos vermelhos, braçadeiras de ferro com runas, correntes enroladas,
     núcleo roxo espinhoso no peito, tanga rasgada com o emblema e cidade gótica em ruínas. */
  function titan() {
    const i = uidA('ti');
    const V = { deep: '#0b0a0f', stone: '#2c2932', stone2: '#3d3945', stoneHi: '#5a5563', iron: '#4a4550', ironHi: '#8e8796', vio: '#6a4fc0', vio2: '#a98bff', vio3: '#d9caff' };
    const crack = (d, w = 1) => `<path d="${d}" fill="none" stroke="${V.vio2}" stroke-width="${4.5 * w}" filter="url(#${i}b)" opacity=".75"/><path d="${d}" fill="none" stroke="${V.vio3}" stroke-width="${1.1 * w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    // placas de pedra: linhas de junção num retângulo
    const cobble = (x, y, w, h, rows, seed) => {
      let d = ''; for (let r = 1; r < rows; r++) { const yy = y + h * r / rows; d += `M${F(x)} ${F(yy + ((r + seed) % 2 ? 1.5 : -1.5))} L${F(x + w)} ${F(yy)} `; }
      for (let r = 0; r < rows; r++) { const yy = y + h * r / rows, xx = x + w * (((r * 7 + seed * 3) % 5) + 1) / 6; d += `M${F(xx)} ${F(yy)} L${F(xx + 1.5)} ${F(yy + h / rows)} `; }
      return `<path d="${d}" stroke="${V.deep}" stroke-width="1.3" fill="none" opacity=".9"/>`;
    };
    // faixa de ferro com runas em volta do antebraço
    const band = (x, y, w, h) => `<rect x="${F(x)}" y="${F(y)}" width="${F(w)}" height="${F(h)}" rx="2" fill="${V.iron}" stroke="${V.ironHi}" stroke-width="1"/>
      <path d="M${F(x + 2)} ${F(y + 2)} H${F(x + w - 2)} M${F(x + 2)} ${F(y + h - 2)} H${F(x + w - 2)}" stroke="#2a2730" stroke-width="1"/>
      <g stroke="${V.ironHi}" stroke-width="1" fill="none" opacity=".85">${[0.25, 0.5, 0.75].map(t => { const cx = x + w * t, cy = y + h / 2; return `<path d="M${F(cx)} ${F(cy - h * .28)} V${F(cy + h * .28)} M${F(cx - 2.5)} ${F(cy - h * .12)} L${F(cx + 2.5)} ${F(cy + h * .12)}"/>`; }).join('')}</g>
      <g fill="${V.ironHi}">${[0.08, 0.92].map(t => `<circle cx="${F(x + w * t)}" cy="${F(y + h / 2)}" r="1.2"/>`).join('')}</g>`;
    const spire = (x, base, h, wd) => `<path d="M${F(x - wd)} ${base} V${F(base - h * .6)} L${F(x - wd * .6)} ${F(base - h * .75)} L${F(x)} ${F(base - h)} L${F(x + wd * .6)} ${F(base - h * .75)} L${F(x + wd)} ${F(base - h * .6)} V${base} Z"/>`;
    const tatters = (x0, x1, y0, y1) => { let d = `M${F(x0)} ${F(y0)}`; const n = 9; for (let k = 0; k <= n; k++) { const x = x0 + (x1 - x0) * k / n; d += ` L${F(x)} ${F(y1 - (k % 2 ? 14 + (k * 5) % 9 : 0))}`; } return d + ` L${F(x1)} ${F(y0)} Z`; };

    return `<svg class="monster-art monster-golem titan" viewBox="0 0 320 260" role="img" aria-label="${MON.golem.n}">
<defs>
  <linearGradient id="${i}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1428"/><stop offset=".6" stop-color="#0e0b16"/><stop offset="1" stop-color="#07060b"/></linearGradient>
  <radialGradient id="${i}moon" cx="78%" cy="10%" r="40%"><stop offset="0" stop-color="#b9a8e8" stop-opacity=".35"/><stop offset="1" stop-color="#b9a8e8" stop-opacity="0"/></radialGradient>
  <radialGradient id="${i}aura" cx="50%" cy="55%" r="55%"><stop offset="0" stop-color="${V.vio}" stop-opacity=".35"/><stop offset="1" stop-color="${V.vio}" stop-opacity="0"/></radialGradient>
  <linearGradient id="${i}st" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${V.stone2}"/><stop offset=".5" stop-color="${V.stone}"/><stop offset="1" stop-color="#16141b"/></linearGradient>
  <linearGradient id="${i}cl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c1824"/><stop offset="1" stop-color="#0d0b12"/></linearGradient>
  <linearGradient id="${i}gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#15111f"/><stop offset="1" stop-color="#050408"/></linearGradient>
  <radialGradient id="${i}core" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f1e9ff"/><stop offset=".35" stop-color="${V.vio2}"/><stop offset="1" stop-color="${V.vio}" stop-opacity="0"/></radialGradient>
  <filter id="${i}b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="${i}mist" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="${i}s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity=".8"/></filter>
</defs>
<!-- céu e cidade gótica em ruínas -->
<rect width="320" height="260" fill="url(#${i}sky)"/>
<rect width="320" height="260" fill="url(#${i}moon)"/>
<circle cx="252" cy="22" r="9" fill="#cfc4ef" opacity=".25"/>
<g fill="#16121f">${spire(22, 236, 150, 9)}${spire(44, 236, 110, 7)}${spire(64, 236, 170, 6)}${spire(270, 236, 160, 8)}${spire(292, 236, 120, 9)}${spire(310, 236, 180, 6)}${spire(246, 236, 95, 6)}</g>
<g fill="#0e0b15">${spire(8, 236, 90, 8)}${spire(36, 236, 70, 10)}${spire(284, 236, 80, 10)}${spire(316, 236, 60, 8)}</g>
<g fill="none" stroke="#211b2e" stroke-width="2"><path d="M232 236 V200 Q246 184 260 200 V236"/><path d="M262 236 V206 Q272 194 282 206 V236"/></g>
<g fill="${V.vio2}" opacity=".5"><rect x="58" y="96" width="2" height="4"/><rect x="288" y="110" width="2" height="4"/><rect x="18" y="140" width="2" height="3"/></g>
<g fill="#2a2338">${[[96, 30, 4], [228, 52, 3], [120, 16, 2.5], [210, 20, 3.5], [84, 70, 2.2]].map(([x, y, r]) => `<path d="M${x} ${y - r} L${x + r} ${y} L${x} ${y + r * .8} L${x - r} ${y} Z"/>`).join('')}</g>
<ellipse cx="160" cy="140" rx="150" ry="120" fill="url(#${i}aura)"/>
<!-- chão molhado -->
<path d="M0 232 H320 V260 H0 Z" fill="url(#${i}gr)"/>
<g stroke="${V.vio}" opacity=".35" fill="none"><path d="M40 244 H120 M190 248 H290 M70 254 H150"/></g>
<g class="titan-body" filter="url(#${i}s)">
  <!-- corrente arrastada (atrás) -->
  ${chain(270, 214, 300, 242, 318, 236, { step: 7.2, col: '#3e3a45', hi: '#7c7684' })}
  ${chain(52, 220, 26, 246, 0, 238, { step: 7.2, col: '#3e3a45', hi: '#7c7684' })}
  <!-- pernas -->
  <path d="M112 176 L106 236 L148 236 L152 182 Z" fill="url(#${i}st)" stroke="#3a3644"/>
  <path d="M208 176 L214 236 L172 236 L168 182 Z" fill="url(#${i}st)" stroke="#3a3644"/>
  ${cobble(108, 186, 40, 48, 4, 1)}${cobble(172, 186, 40, 48, 4, 2)}
  <!-- tronco largo -->
  <path d="M82 92 Q90 72 120 66 L200 66 Q230 72 238 92 L226 160 Q206 176 160 178 Q114 176 94 160 Z" fill="url(#${i}st)" stroke="#45404f" stroke-width="1.3"/>
  ${cobble(100, 74, 120, 90, 5, 3)}
  <!-- ombros -->
  <path d="M60 104 Q56 72 86 64 Q116 60 124 84 Q118 108 92 114 Q66 116 60 104 Z" fill="url(#${i}st)" stroke="#4d4858" stroke-width="1.3"/>
  <path d="M260 104 Q264 72 234 64 Q204 60 196 84 Q202 108 228 114 Q254 116 260 104 Z" fill="url(#${i}st)" stroke="#4d4858" stroke-width="1.3"/>
  <!-- braços -->
  <path d="M66 108 Q52 140 48 176 L44 206 L82 210 L86 178 Q92 144 104 118 Z" fill="url(#${i}st)" stroke="#45404f" stroke-width="1.2"/>
  <path d="M254 108 Q268 140 272 176 L276 206 L238 210 L234 178 Q228 144 216 118 Z" fill="url(#${i}st)" stroke="#45404f" stroke-width="1.2"/>
  ${cobble(52, 120, 46, 50, 4, 4)}${cobble(222, 120, 46, 50, 4, 5)}
  <!-- braçadeiras de ferro com runas -->
  ${band(42, 160, 46, 15)}${band(44, 180, 42, 11)}
  ${band(232, 160, 46, 15)}${band(234, 180, 42, 11)}
  <!-- punhos -->
  <path d="M38 214 Q36 200 50 198 L80 200 Q90 204 88 218 Q86 232 70 232 L48 232 Q38 230 38 214 Z" fill="url(#${i}st)" stroke="#4d4858" stroke-width="1.2"/>
  <path d="M282 214 Q284 200 270 198 L240 200 Q230 204 232 218 Q234 232 250 232 L272 232 Q282 230 282 214 Z" fill="url(#${i}st)" stroke="#4d4858" stroke-width="1.2"/>
  <g stroke="${V.deep}" stroke-width="1.3" fill="none"><path d="M52 206 L53 230 M63 204 L64 231 M74 204 L74 231"/><path d="M268 206 L267 230 M257 204 L256 231 M246 204 L246 231"/></g>
  <!-- corrente enrolada no antebraço esquerdo -->
  ${chain(40, 150, 64, 158, 90, 146, { step: 6.5, col: '#4a4552', hi: '#9a93a3' })}
  ${chain(40, 196, 64, 204, 90, 192, { step: 6.5, col: '#4a4552', hi: '#9a93a3' })}
  ${chain(56, 210, 50, 222, 52, 232, { step: 6 })}
  <!-- cinto e tanga rasgada com o emblema -->
  <path d="${tatters(118, 202, 156, 232)}" fill="url(#${i}cl)" stroke="#2a2433" stroke-width="1"/>
  <g fill="none" stroke="#8b80a3" stroke-width="1.6" opacity=".85"><path d="M160 176 L160 206"/><path d="M160 178 Q150 186 146 200"/><path d="M160 178 Q170 186 174 200"/><path d="M154 172 L160 166 L166 172"/></g>
  <rect x="96" y="150" width="128" height="12" rx="3" fill="${V.iron}" stroke="${V.ironHi}" stroke-width="1"/>
  ${chain(98, 156, 160, 166, 222, 156, { step: 6.5, col: '#4a4552', hi: '#9a93a3' })}
  <!-- corrente diagonal no peito -->
  ${chain(84, 80, 140, 110, 214, 154, { step: 7.4, rx: 4.8, ry: 2.8, col: '#4f4a57', hi: '#a39cac' })}
  ${chain(236, 82, 212, 112, 190, 148, { step: 7.4, rx: 4.8, ry: 2.8, col: '#4f4a57', hi: '#a39cac' })}
  <!-- núcleo espinhoso no peito -->
  <g transform="translate(184 104)">
    <circle r="26" fill="url(#${i}core)" opacity=".55" filter="url(#${i}b)"/>
    <g fill="${V.iron}" stroke="${V.ironHi}" stroke-width=".8">${Array.from({ length: 10 }, (_, k) => { const a = k * 36 * Math.PI / 180; const r1 = 12, r2 = 19; return `<path d="M${F(Math.cos(a - .16) * r1)} ${F(Math.sin(a - .16) * r1)} L${F(Math.cos(a) * r2)} ${F(Math.sin(a) * r2)} L${F(Math.cos(a + .16) * r1)} ${F(Math.sin(a + .16) * r1)} Z"/>`; }).join('')}</g>
    <circle r="12.5" fill="none" stroke="${V.ironHi}" stroke-width="2.4"/>
    <circle r="9" fill="url(#${i}core)"/>
    <circle r="3.2" fill="#fbf7ff" class="eyes"/>
  </g>
  <!-- cabeça: máscara pontuda com coroa de espinhos -->
  <path d="M142 70 Q140 44 160 36 Q180 44 178 70 Q170 84 160 90 Q150 84 142 70 Z" fill="#1d1a23" stroke="#4d4858" stroke-width="1.2"/>
  <path d="M160 40 L160 88" stroke="#0b0a0f" stroke-width="1.4"/>
  <path d="M146 58 Q160 52 174 58 L172 64 Q160 59 148 64 Z" fill="#0a090d"/>
  <g class="eyes"><g filter="url(#${i}b)" fill="#ff3b4a"><ellipse cx="152" cy="61" rx="5" ry="2.2"/><ellipse cx="168" cy="61" rx="5" ry="2.2"/></g>
    <g fill="#ffd6da"><ellipse cx="152" cy="61" rx="2.4" ry=".9"/><ellipse cx="168" cy="61" rx="2.4" ry=".9"/></g></g>
  <g fill="${V.iron}" stroke="${V.ironHi}" stroke-width=".9">
    <path d="M138 44 L134 14 L145 38 Z"/><path d="M146 38 L146 6 L154 34 Z"/><path d="M155 34 L160 0 L165 34 Z"/><path d="M166 34 L174 6 L174 38 Z"/><path d="M175 38 L186 14 L182 44 Z"/>
    <path d="M136 46 Q160 32 184 46 L182 52 Q160 40 138 52 Z"/>
  </g>
  <path d="M136 30 L132 22 M188 28 L193 20" stroke="${V.ironHi}" stroke-width="1.2"/>
  <!-- fissuras de energia -->
  ${crack('M110 90 Q118 100 114 110 Q112 120 120 128', .75)}
  ${crack('M114 110 L104 114', .45)}
  ${crack('M206 130 Q200 140 204 150', .6)}
  ${crack('M140 120 Q146 130 142 142', .55)}
  ${crack('M70 84 Q80 92 76 102', .55)}
  ${crack('M250 84 Q240 92 244 102', .55)}
  ${crack('M58 136 Q64 146 60 156', .5)}
  ${crack('M262 136 Q256 146 260 156', .5)}
  ${crack('M124 196 Q130 206 126 216', .5)}
  ${crack('M196 196 Q190 206 194 216', .5)}
  <!-- fumaça roxa -->
  <g filter="url(#${i}mist)" fill="${V.vio}" opacity=".55"><ellipse cx="160" cy="232" rx="90" ry="10"/><ellipse cx="72" cy="214" rx="26" ry="10"/><ellipse cx="248" cy="214" rx="26" ry="10"/><ellipse cx="196" cy="110" rx="18" ry="22" opacity=".6"/></g>
</g>
</svg>`;
  }

  /* ------------------------- ASSASSINO DAS SOMBRAS -------------------------
     Estrutura de roupa do conceito do app (jaqueta aberta com capuz abaixado, gola alta,
     alças cruzadas, cintos, coldre na coxa, luvas sem dedos, botas de combate, casaco
     rasgado atrás e adagas curvas serrilhadas). Rosto e paleta próprios do app. */
  const AS_ACC = { E: '#6f93a3', D: '#4fb6c4', C: '#3fd3dc', B: '#5ee9ef', A: '#7ff2f5', S: '#e9fdff' };
  const AS_AURA = { E: .14, D: .22, C: .3, B: .4, A: .48, S: .5 };

  function assassin(p, rk) {
    const id = uidA('as');
    const rank = rk || 'E', ri = ['E', 'D', 'C', 'B', 'A', 'S'].indexOf(rank);
    const f = p.sex === 'f';
    const hN = Math.min(1, Math.max(0, ((+p.height || 170) - 145) / 55)), sy = .88 + hN * .17;
    const bmi = (+p.weight || 70) / Math.pow((+p.height || 170) / 100, 2);
    const w = bmi < 19 ? .88 : bmi < 25 ? 1 : bmi < 30 ? 1.12 : 1.25;
    const sh = 22 * w * (f ? .86 : 1), hip = 12.5 * w * (f ? 1.14 : 1), lw = 8.4 * Math.min(w, 1.2), aw = 7.6 * Math.min(w, 1.2);
    const skin = SKINS[p.skin] || SKINS[1], hair = HAIRS[p.hair] || HAIRS[0];
    const acc = AS_ACC[rank], gold = '#d9b45a', metal = '#a9b6c4', steel = '#6c7a88';
    const jacket = '#161b22', jacket2 = '#202832', shirt = '#0c0f13', pants = '#11151b', leather = '#2b2522', strapC = '#3a3330';
    const edge = ri >= 2 ? acc : '#34414d';
    const L = 60 - sh, R = 60 + sh, hipL = 60 - hip, hipR = 60 + hip;
    const shL = [L + 3, 66], shR = [R - 3, 66], handL = [L - 4, 116], handR = [R + 4, 116];
    const mid = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const elL = mid(shL, handL, .48), elR = mid(shR, handR, .48);

    // adaga curva serrilhada, lâmina para baixo (pegada reversa)
    const dagger = ([x, y], s, glow) => {
      const len = 26 + ri * 1.6, tx = x + s * (7 + ri * .4), ty = y + len;
      const blade = `M${F(x - s * 1.4)} ${F(y + 4)} Q${F(x + s * 8)} ${F(y + len * .45)} ${F(tx)} ${F(ty)} Q${F(x + s * 1.5)} ${F(y + len * .55)} ${F(x + s * 2.2)} ${F(y + 4)} Z`;
      const teeth = [0.3, 0.45, 0.6].map(t => { const px = x + s * (2.5 + 5 * t), py = y + 4 + len * t; return `<path d="M${F(px)} ${F(py)} l${F(s * 2.4)} 1.2 l${F(-s * 2.2)} 1.6" fill="none" stroke="#dfe8f0" stroke-width=".6"/>`; }).join('');
      return `<g class="dagger">
        ${glow ? `<path d="${blade}" fill="none" stroke="${acc}" stroke-width="3.2" filter="url(#${id}b)" opacity=".9"/>` : ''}
        <path d="${blade}" fill="url(#${id}bl)" stroke="${glow ? acc : '#c9d4df'}" stroke-width=".6"/>${teeth}
        <path d="M${F(x - 4)} ${F(y + 3)} L${F(x + 4)} ${F(y + 3)}" stroke="${ri >= 4 ? gold : steel}" stroke-width="2"/>
        <rect x="${F(x - 1.3)}" y="${F(y - 6)}" width="2.6" height="8" fill="${leather}"/>
        <path d="M${F(x - 2)} ${F(y - 7)} L${F(x)} ${F(y - 10)} L${F(x + 2)} ${F(y - 7)} Z" fill="${ri >= 4 ? gold : steel}"/>
      </g>`;
    };

    const spectral = ri >= 5 ? `<g class="spectral" opacity=".75">${[[18, 70, -30], [102, 64, 30], [12, 132, -12], [108, 138, 14]].map(([x, y, a]) =>
      `<g transform="rotate(${a} ${x} ${y})"><path d="M${x} ${y - 16} L${x + 3} ${y + 6} L${x} ${y + 10} L${x - 3} ${y + 6} Z" fill="${acc}" opacity=".35" filter="url(#${id}b)"/><path d="M${x} ${y - 16} L${x + 2} ${y + 6} L${x} ${y + 9} L${x - 2} ${y + 6} Z" fill="none" stroke="${acc}" stroke-width=".8"/></g>`).join('')}</g>` : '';

    // casaco rasgado atrás: cresce com o rank
    const tailY = 160 + ri * 5, spread = 6 + ri * 2;
    let tail = `M${F(hipL - 2)} 106 L${F(hipR + 2)} 106`;
    const nT = 8;
    for (let k = 0; k <= nT; k++) {
      const x = hipR + spread - (2 * hip + 2 * spread) * k / nT;
      const y = tailY - (k % 2 ? 10 + (k * 7) % 8 : 0) + (k < nT / 2 ? 6 : 0);
      tail += ` L${F(x)} ${F(y)}`;
    }
    tail += ' Z';

    const pauldron = ri >= 1 ? `<g class="pauldron">
      <path d="M${F(L - 6)} 70 Q${F(L - 4)} 56 ${F(L + 8)} 57 Q${F(L + 14)} 62 ${F(L + 12)} 68 Q${F(L + 2)} 66 ${F(L - 6)} 70 Z" fill="${steel}" stroke="${ri >= 4 ? gold : metal}" stroke-width=".9"/>
      <path d="M${F(L - 7)} 76 Q${F(L - 5)} 66 ${F(L + 6)} 66 Q${F(L + 11)} 70 ${F(L + 9)} 74 Q${F(L)} 73 ${F(L - 7)} 76 Z" fill="#55626f" stroke="${ri >= 4 ? gold : metal}" stroke-width=".8"/>
      ${ri >= 3 ? `<circle cx="${F(L + 3)}" cy="61" r="1.4" fill="${acc}"/>` : ''}</g>` : '';

    // braço: manga da jaqueta até o cotovelo, antebraço com faixas e luva sem dedos
    const arm = (sh0, el, hand, s) => `
      <line x1="${F(sh0[0])}" y1="${F(sh0[1])}" x2="${F(el[0])}" y2="${F(el[1])}" stroke="${jacket2}" stroke-width="${F(aw + 1)}" stroke-linecap="round"/>
      <line x1="${F(el[0])}" y1="${F(el[1])}" x2="${F(hand[0])}" y2="${F(hand[1] - 3)}" stroke="${shirt}" stroke-width="${F(aw - .6)}" stroke-linecap="round"/>
      <path d="M${F(el[0] - 4)} ${F(el[1] - 1)} L${F(el[0] + 4)} ${F(el[1] + 1)}" stroke="${jacket}" stroke-width="3"/>
      ${[0.35, 0.55, 0.75].map(t => { const q = mid(el, hand, t); return `<path d="M${F(q[0] - aw / 2)} ${F(q[1] - 1)} L${F(q[0] + aw / 2)} ${F(q[1] + 1)}" stroke="${ri >= 1 ? steel : strapC}" stroke-width="1.6"/>`; }).join('')}
      ${ri >= 3 ? (() => { const q = mid(el, hand, .55); return `<circle cx="${F(q[0])}" cy="${F(q[1])}" r="1" fill="${acc}"/>`; })() : ''}
      <circle cx="${F(hand[0])}" cy="${F(hand[1])}" r="${F(aw / 2 + .4)}" fill="#1a1d22"/>
      <path d="M${F(hand[0] - aw / 2 + .6)} ${F(hand[1] + 1.4)} Q${F(hand[0])} ${F(hand[1] + aw / 2 + 1.6)} ${F(hand[0] + aw / 2 - .6)} ${F(hand[1] + 1.4)}" fill="${skin}"/>`;

    const hairM = `<path d="M47 36 Q45 22 56 20 Q60 14 66 19 Q76 20 74 34 L71 30 L70 37 L67 31 L64 39 L62 32 L59 40 L57 32 L54 38 L52 31 L49 37 Z" fill="${hair}"/>
      <path d="M52 22 L48 16 L55 20 M62 18 L63 11 L66 18 M70 22 L76 17 L72 24" stroke="${hair}" stroke-width="2.4" stroke-linecap="round"/>`;
    const hairF = `<path d="M46 44 Q42 24 56 19 Q66 15 73 24 Q78 32 75 46 L74 64 Q71 58 70 46 L68 32 Q63 36 56 33 L52 40 L50 52 L48 66 Q45 56 46 44 Z" fill="${hair}"/>
      <path d="M48 34 Q50 26 57 25 Q53 30 52 38 Z" fill="${hair}"/>`;

    const pulse = ri >= 3 ? `<g class="rank-pulse rank-${rank}"><circle cx="60" cy="108" r="51" fill="none" stroke="${acc}" stroke-width="1.1" opacity=".5"/><circle cx="60" cy="108" r="43" fill="none" stroke="${ri >= 4 ? gold : acc}" stroke-width=".6" opacity=".35"/></g>` : '';
    const particles = ri >= 5 ? `<g class="rank-particles">${[[15, 44], [99, 35], [22, 99], [103, 122], [18, 154], [98, 174], [31, 190], [88, 76], [26, 68], [95, 202], [12, 126], [109, 88]].map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="${k % 3 === 0 ? 1.7 : 1}" fill="${k % 2 ? acc : gold}"/>`).join('')}</g>` : '';

    return `<svg class="immersive-avatar assassin-avatar rank-${rank}" viewBox="0 0 120 210" role="img" aria-label="Avatar do jogador: Assassino, Rank ${rank}" style="overflow:visible">
<defs>
  <radialGradient id="${id}g" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="${acc}" stop-opacity="${AS_AURA[rank]}"/><stop offset="1" stop-color="${acc}" stop-opacity="0"/></radialGradient>
  <linearGradient id="${id}bl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7d8a97"/><stop offset=".5" stop-color="#dfe8f0"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
  <linearGradient id="${id}j" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${jacket2}"/><stop offset="1" stop-color="${jacket}"/></linearGradient>
  <filter id="${id}b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.4"/></filter>
</defs>
<ellipse cx="60" cy="112" rx="58" ry="102" fill="url(#${id}g)"/>
<ellipse cx="60" cy="202" rx="30" ry="4" fill="#000" opacity=".55"/>
${spectral}
<g transform="translate(60 200) scale(1 ${sy.toFixed(3)}) translate(-60 -200)">
  <!-- casaco rasgado (atrás) -->
  <path d="${tail}" fill="${jacket}" stroke="${edge}" stroke-width=".6" opacity=".97"/>
  <!-- capuz abaixado, atrás do pescoço -->
  <path d="M44 62 Q40 46 50 44 Q60 50 70 44 Q80 46 76 62 Z" fill="${jacket2}" stroke="${edge}" stroke-width=".6"/>
  <!-- pernas, coldre e botas de combate -->
  <rect x="${F(hipL + .5)}" y="116" width="${F(lw)}" height="66" fill="${pants}"/>
  <rect x="${F(hipR - .5 - lw)}" y="116" width="${F(lw)}" height="66" fill="${pants}"/>
  <path d="M${F(hipL)} 132 l${F(lw + 1)} 1.5 M${F(hipL)} 142 l${F(lw + 1)} 1.5" stroke="${strapC}" stroke-width="2"/>
  <rect x="${F(hipR - lw - 1.5)}" y="126" width="${F(lw * .8)}" height="13" rx="1" fill="${leather}" stroke="${ri >= 1 ? steel : '#4a3f39'}" stroke-width=".6"/>
  <path d="M${F(hipR - lw - 2)} 128 l${F(lw + 2)} 1 M${F(hipR - lw - 2)} 137 l${F(lw + 2)} 1" stroke="${strapC}" stroke-width="1.6"/>
  <path d="M${F(hipL - 1.5)} 176 h${F(lw + 3)} l1 18 h${F(-(lw + 6))} Z" fill="#0d1014"/>
  <path d="M${F(hipR - lw - 1.5)} 176 h${F(lw + 3)} l2.5 18 h${F(-(lw + 6))} Z" fill="#0d1014"/>
  <rect x="${F(hipL - 3)}" y="194" width="${F(lw + 7)}" height="4.5" rx="1" fill="#050608"/>
  <rect x="${F(hipR - lw - 2.5)}" y="194" width="${F(lw + 7)}" height="4.5" rx="1" fill="#050608"/>
  <g stroke="${ri >= 2 ? acc : '#3b4a57'}" stroke-width=".6" opacity=".9">
    ${[180, 184, 188].map(y => `<path d="M${F(hipL + 1)} ${y} h${F(lw - 2)} M${F(hipR - lw + 1)} ${y} h${F(lw - 2)}"/>`).join('')}
  </g>
  <path d="M${F(hipL - 1.5)} 178 h${F(lw + 3)} M${F(hipR - lw - 1.5)} 178 h${F(lw + 3)}" stroke="${steel}" stroke-width="1.2"/>
  <!-- braços -->
  ${arm(shL, elL, handL, -1)}${arm(shR, elR, handR, 1)}
  <!-- camiseta -->
  <path d="M${F(L + 2)} 62 L${F(R - 2)} 62 L${F(hipR + 1)} 114 L${F(hipL - 1)} 114 Z" fill="${shirt}"/>
  <!-- alças cruzadas -->
  <path d="M${F(L + 6)} 64 L${F(hipR - 1)} 106 M${F(R - 6)} 64 L${F(hipL + 1)} 106" stroke="${strapC}" stroke-width="2.6"/>
  <circle cx="60" cy="${F(64 + (106 - 64) * ((60 - L - 6) / (hipR - 1 - L - 6)))}" r="2.4" fill="none" stroke="${ri >= 4 ? gold : metal}" stroke-width="1.1"/>
  ${ri >= 1 ? [0.3, 0.42].map(t => { const x = L + 6 + (hipR - 1 - L - 6) * t, y = 64 + 42 * t; return `<path d="M${F(x - 1)} ${F(y - 4)} L${F(x + 1)} ${F(y - 4)} L${F(x + .6)} ${F(y + 3)} L${F(x - .6)} ${F(y + 3)} Z" fill="${metal}"/>`; }).join('') : ''}
  <!-- jaqueta aberta -->
  <path d="M${F(L)} 62 L54 62 L53.5 88 L${F(hipL + 2)} 114 L${F(hipL - 4)} 114 L${F(L - 1)} 84 Z" fill="url(#${id}j)" stroke="${edge}" stroke-width=".7"/>
  <path d="M${F(R)} 62 L66 62 L66.5 88 L${F(hipR - 2)} 114 L${F(hipR + 4)} 114 L${F(R + 1)} 84 Z" fill="url(#${id}j)" stroke="${edge}" stroke-width=".7"/>
  <path d="M53.8 64 L53.6 88 L${F(hipL + 2.6)} 113 M66.2 64 L66.4 88 L${F(hipR - 2.6)} 113" stroke="${metal}" stroke-width=".5" stroke-dasharray="1.2 1" opacity=".8"/>
  ${ri >= 4 ? `<path d="M${F(L - 1)} 84 L${F(hipL - 4)} 114 M${F(R + 1)} 84 L${F(hipR + 4)} 114" stroke="${gold}" stroke-width=".9"/>` : ''}
  <!-- gola alta -->
  <path d="M49 52 L55 50 L56 63 L${F(L + 2)} 63 Z" fill="${jacket2}" stroke="${edge}" stroke-width=".6"/>
  <path d="M71 52 L65 50 L64 63 L${F(R - 2)} 63 Z" fill="${jacket2}" stroke="${edge}" stroke-width=".6"/>
  <!-- dois cintos com fivela do emblema -->
  <path d="M${F(hipL - 3)} 105 L${F(hipR + 3)} 107 L${F(hipR + 3)} 111 L${F(hipL - 3)} 109 Z" fill="${leather}"/>
  <path d="M${F(hipL - 2)} 112 L${F(hipR + 2)} 110 L${F(hipR + 2)} 113.5 L${F(hipL - 2)} 115.5 Z" fill="${strapC}"/>
  <g fill="none" stroke="${ri >= 4 ? gold : ri >= 2 ? acc : metal}" stroke-width=".9"><path d="M60 103 L60 112"/><path d="M60 104.5 Q57 106.5 56 110"/><path d="M60 104.5 Q63 106.5 64 110"/></g>
  ${ri >= 3 ? `<path d="M60 74 l3.5 3.5 -3.5 3.5 -3.5 -3.5 Z" fill="${shirt}" stroke="${acc}" stroke-width=".9"/>` : ''}
  ${pauldron}
  <!-- adagas -->
  ${dagger(handL, -1, ri >= 3)}${dagger(handR, 1, ri >= 3)}
  <!-- pescoço e cabeça -->
  <rect x="56" y="46" width="8" height="12" fill="${skin}"/>
  ${f ? `<path d="M46 44 Q44 60 48 68 L52 66 Q49 56 50 44 Z M74 44 Q76 60 72 68 L68 66 Q71 56 70 44 Z" fill="${hair}"/>` : ''}
  <ellipse cx="60" cy="38" rx="12" ry="13" fill="${skin}"/>
  ${f ? hairF : hairM}
  <!-- olhos -->
  <g class="eyes"><g filter="url(#${id}b)" fill="${acc}"><path d="M51.5 38 L57.5 39.2 L57 40.6 L52 39.6 Z"/><path d="M68.5 38 L62.5 39.2 L63 40.6 L68 39.6 Z"/></g>
  <path d="M52.4 38.8 L57 39.7 M67.6 38.8 L63 39.7" stroke="#f2fdff" stroke-width=".9"/></g>
  <!-- máscara de pano -->
  <path d="M47.5 42.5 Q60 47 72.5 42.5 L71 52 Q60 57 49 52 Z" fill="#232c35" stroke="${edge}" stroke-width=".6"/>
  <path d="M51 47 Q60 50 69 47" stroke="#151b21" stroke-width=".8" fill="none"/>
  ${ri >= 4 ? `<path d="M49 44 Q60 48 71 44" stroke="${gold}" stroke-width=".7" fill="none"/>` : ''}
</g>
${pulse}${particles}
</svg>`;
  }

  /* -------------------------- ligação com o app -------------------------- */
  const prevAvatar = avatar;
  avatar = function (p, rk, shadow) {
    if (!shadow && p && p.cls === 'assassino') return assassin(p, rk);
    return prevAvatar(p, rk, shadow);
  };
  const prevMArt = mArt;
  mArt = function (key, mini) {
    if (key === 'golem') return titan();
    return prevMArt(key, mini);
  };

  window.__ART__ = { titan, assassin };
})();
