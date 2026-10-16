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

  /* ---------------------------- TITÃ DA PREGUIÇA ---------------------------- */
  function titan() {
    const i = uidA('ti');
    const crack = (d, w = 1) => `<path d="${d}" fill="none" stroke="#9d5cff" stroke-width="${5 * w}" filter="url(#${i}b)" opacity=".8"/><path d="${d}" fill="none" stroke="#d9c2ff" stroke-width="${1.3 * w}" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<svg class="monster-art monster-golem titan" viewBox="0 0 320 230" role="img" aria-label="${MON.golem.n}">
<defs>
  <radialGradient id="${i}au" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="#8a3cff" stop-opacity=".30"/><stop offset=".6" stop-color="#3a1466" stop-opacity=".12"/><stop offset="1" stop-color="#04060b" stop-opacity="0"/></radialGradient>
  <linearGradient id="${i}st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e2a37"/><stop offset=".5" stop-color="#1b1922"/><stop offset="1" stop-color="#0b0a10"/></linearGradient>
  <linearGradient id="${i}sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3644"/><stop offset=".55" stop-color="#1e1b26"/><stop offset="1" stop-color="#0d0c12"/></linearGradient>
  <linearGradient id="${i}gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1426"/><stop offset="1" stop-color="#07060c"/></linearGradient>
  <filter id="${i}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
  <filter id="${i}s" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#000" flood-opacity=".75"/></filter>
</defs>
<!-- caverna -->
<rect x="0" y="0" width="320" height="230" fill="none"/>
<ellipse cx="160" cy="120" rx="160" ry="112" fill="url(#${i}au)"/>
<g fill="#120e1c" opacity=".9">
  <path d="M0 0 L44 0 L36 34 L30 18 L22 52 L14 22 L6 40 Z"/>
  <path d="M276 0 L320 0 L320 46 L312 24 L304 58 L296 20 L288 36 Z"/>
  <path d="M120 0 L200 0 L190 14 L184 6 L176 26 L168 8 L158 30 L150 6 L140 20 L132 6 Z" opacity=".55"/>
</g>
<g fill="#b06bff" opacity=".35"><circle cx="30" cy="70" r="1.4"/><circle cx="292" cy="84" r="1.6"/><circle cx="58" cy="40" r="1"/><circle cx="268" cy="44" r="1.2"/><circle cx="16" cy="130" r="1"/><circle cx="306" cy="140" r="1.3"/></g>
<!-- chão -->
<path d="M0 196 Q160 186 320 196 L320 230 L0 230 Z" fill="url(#${i}gr)"/>
<ellipse cx="160" cy="207" rx="132" ry="10" fill="#000" opacity=".7"/>
<g opacity=".45"><path d="M70 214 Q160 208 250 214" stroke="#8a3cff" stroke-width="1" fill="none"/><path d="M96 221 Q160 217 224 221" stroke="#8a3cff" stroke-width=".6" fill="none"/></g>
<g class="titan-body" filter="url(#${i}s)">
  <!-- correntes arrastadas no chão (atrás) -->
  ${chain(56, 196, 30, 214, 2, 206, { step: 7.5 })}
  ${chain(264, 196, 292, 216, 318, 204, { step: 7.5 })}
  <!-- pernas curtas e pesadas -->
  <path d="M118 150 L112 198 L148 198 L150 160 Z" fill="url(#${i}st)" stroke="#3a3646" stroke-width="1.1"/>
  <path d="M202 150 L208 198 L172 198 L170 160 Z" fill="url(#${i}st)" stroke="#3a3646" stroke-width="1.1"/>
  <path d="M108 198 Q130 190 152 198 Z M168 198 Q190 190 212 198 Z" fill="#17141f"/>
  <!-- espinhos de rocha nas costas -->
  <g fill="#14121a" stroke="#3a3646" stroke-width="1">
    <path d="M84 70 L72 30 L96 62 Z"/><path d="M100 62 L98 18 L116 58 Z"/><path d="M122 58 L132 26 L138 60 Z"/>
    <path d="M236 70 L248 30 L224 62 Z"/><path d="M220 62 L222 18 L204 58 Z"/><path d="M198 58 L188 26 L182 60 Z"/>
  </g>
  <g stroke="#8a5cd6" stroke-width=".8" opacity=".55" fill="none"><path d="M72 30 L84 70 M98 18 L100 62 M248 30 L236 70 M222 18 L220 62"/></g>
  <!-- tronco do tita -->
  <path d="M96 168 Q84 122 104 92 Q126 62 160 60 Q194 62 216 92 Q236 122 224 168 Q192 182 160 182 Q128 182 96 168 Z" fill="url(#${i}st)" stroke="#3e3a4a" stroke-width="1.4"/>
  <g fill="none" stroke="#0f0d15" stroke-width="2" opacity=".85">
    <path d="M112 104 Q160 90 208 104"/><path d="M104 132 Q160 120 216 132"/><path d="M110 158 Q160 150 210 158"/>
    <path d="M146 92 L140 130 L146 176"/><path d="M176 92 L182 128 L176 176"/>
  </g>
  <!-- braços até o chão -->
  <path d="M92 86 Q66 110 60 150 L50 182 L80 186 L86 152 Q96 122 112 106 Z" fill="url(#${i}sh)" stroke="#3e3a4a" stroke-width="1.2"/>
  <path d="M228 86 Q254 110 260 150 L270 182 L240 186 L234 152 Q224 122 208 106 Z" fill="url(#${i}sh)" stroke="#3e3a4a" stroke-width="1.2"/>
  <!-- ombros: rochas -->
  <path d="M66 96 Q62 66 92 60 Q120 58 128 82 Q124 104 98 110 Q72 112 66 96 Z" fill="url(#${i}sh)" stroke="#4a4558" stroke-width="1.4"/>
  <path d="M254 96 Q258 66 228 60 Q200 58 192 82 Q196 104 222 110 Q248 112 254 96 Z" fill="url(#${i}sh)" stroke="#4a4558" stroke-width="1.4"/>
  <path d="M80 72 L92 64 L104 70 M216 70 L228 64 L240 72" stroke="#8a8698" stroke-width="1.2" fill="none" opacity=".7"/>
  <g fill="none" stroke="#8a5cd6" stroke-width="1.1" opacity=".55"><path d="M70 82 Q70 64 92 61 Q114 60 124 76"/><path d="M250 82 Q250 64 228 61 Q206 60 196 76"/><path d="M110 92 Q132 66 160 62 Q188 66 210 92"/></g>
  <!-- punhos apoiados no chão -->
  <path d="M38 184 Q36 168 52 166 L80 168 Q92 172 90 188 Q88 200 72 200 L46 200 Q38 198 38 184 Z" fill="url(#${i}sh)" stroke="#4a4558" stroke-width="1.3"/>
  <path d="M282 184 Q284 168 268 166 L240 168 Q228 172 230 188 Q232 200 248 200 L274 200 Q282 198 282 184 Z" fill="url(#${i}sh)" stroke="#4a4558" stroke-width="1.3"/>
  <g stroke="#14121a" stroke-width="1.4" fill="none"><path d="M52 174 L54 198 M64 172 L65 199 M76 172 L76 199"/><path d="M268 174 L266 198 M256 172 L255 199 M244 172 L244 199"/></g>
  <!-- algemas -->
  <rect x="50" y="156" width="34" height="9" rx="2" fill="#2c2a34" stroke="#8d8a99" stroke-width="1.2"/>
  <rect x="236" y="156" width="34" height="9" rx="2" fill="#2c2a34" stroke="#8d8a99" stroke-width="1.2"/>
  <!-- cabeça afundada entre os ombros -->
  <path d="M138 92 Q136 66 160 62 Q184 66 182 92 Q178 106 160 108 Q142 106 138 92 Z" fill="#1d1a25" stroke="#5c5868" stroke-width="1.4"/>
  <path d="M136 80 Q160 68 184 80 L182 86 Q160 78 138 86 Z" fill="#3a3644"/>
  <g class="eyes">
    <g filter="url(#${i}b)" fill="#ff5a3c"><ellipse cx="150" cy="90" rx="6" ry="2.6"/><ellipse cx="170" cy="90" rx="6" ry="2.6"/></g>
    <g fill="#ffd9c8"><ellipse cx="150" cy="90" rx="3" ry="1"/><ellipse cx="170" cy="90" rx="3" ry="1"/></g>
  </g>
  <path d="M150 100 L170 100" stroke="#0a090e" stroke-width="2"/>
  <!-- correntes no corpo -->
  ${chain(100, 96, 150, 124, 218, 150, { col: '#55525f', hi: '#9a97a6' })}
  ${chain(104, 140, 160, 158, 216, 138, { col: '#55525f', hi: '#9a97a6' })}
  ${chain(67, 165, 62, 182, 56, 196, { step: 6.5 })}
  ${chain(253, 165, 258, 182, 264, 196, { step: 6.5 })}
  <!-- fissuras de energia (seguem as placas de pedra) -->
  ${crack('M120 110 Q126 118 124 126 Q122 134 130 142', .7)}
  ${crack('M124 126 L114 130', .45)}
  ${crack('M200 108 Q194 116 197 124 Q200 134 192 146 Q188 152 191 160', .7)}
  ${crack('M197 124 L208 128', .45)}
  ${crack('M160 112 Q157 120 161 128', .5)}
  ${crack('M88 72 Q94 80 91 90', .5)}
  ${crack('M232 72 Q226 80 229 90', .5)}
  ${crack('M62 120 Q66 130 63 140', .45)}
  ${crack('M258 120 Q254 130 257 140', .45)}
  <g fill="#000" opacity=".35">${Array.from({length:26},(_,k)=>`<circle cx="${F(104 + (k*37)%112)}" cy="${F(96 + (k*23)%76)}" r="${k%3?0.9:1.4}"/>`).join('')}</g>
  <!-- musgo e pedras soltas -->
  <g fill="#2f3d2a" opacity=".8"><ellipse cx="88" cy="64" rx="10" ry="3"/><ellipse cx="234" cy="63" rx="8" ry="2.6"/><ellipse cx="160" cy="62" rx="9" ry="2.4"/></g>
</g>
<g fill="#2a2733" stroke="#4d4958" stroke-width=".8"><path d="M104 202 l8 -6 l7 5 l-4 4 Z"/><path d="M214 203 l6 -7 l9 4 l-3 5 Z"/><path d="M150 205 l5 -4 l6 3 l-2 3 Z"/></g>
<text x="300" y="56" fill="#9a8fb3" font-family="Chakra Petch,sans-serif" font-size="13" opacity=".7">z</text>
<text x="290" y="40" fill="#9a8fb3" font-family="Chakra Petch,sans-serif" font-size="10" opacity=".55">z</text>
</svg>`;
  }

  /* ------------------------- ASSASSINO DAS SOMBRAS ------------------------- */
  // Paleta própria: verde-azulado e aço, para não lembrar nenhum personagem existente.
  const AS_ACC = { E: '#6f93a3', D: '#4fb6c4', C: '#3fd3dc', B: '#5ee9ef', A: '#7ff2f5', S: '#e9fdff' };
  const AS_AURA = { E: .14, D: .22, C: .32, B: .44, A: .5, S: .5 };

  function assassin(p, rk) {
    const id = uidA('as');
    const rank = rk || 'E', ri = ['E', 'D', 'C', 'B', 'A', 'S'].indexOf(rank);
    const f = p.sex === 'f';
    const hN = Math.min(1, Math.max(0, ((+p.height || 170) - 145) / 55)), sy = .88 + hN * .17;
    const bmi = (+p.weight || 70) / Math.pow((+p.height || 170) / 100, 2);
    const w = bmi < 19 ? .88 : bmi < 25 ? 1 : bmi < 30 ? 1.12 : 1.25;
    const sh = 22 * w * (f ? .86 : 1), hip = 12.5 * w * (f ? 1.16 : 1), lw = 8 * Math.min(w, 1.2), aw = 7.4 * Math.min(w, 1.2);
    const skin = SKINS[p.skin] || SKINS[1], hair = HAIRS[p.hair] || HAIRS[0];
    const acc = AS_ACC[rank], gold = '#d9b45a', metal = '#a9b6c4', steel = '#6c7a88';
    const coat = '#18212b', coat2 = '#222e3a', cloth = '#2a3743', leather = '#3a2c22';
    const trim = ri >= 1 ? acc : '#33424f';
    const L = 60 - sh, R = 60 + sh, hipL = 60 - hip, hipR = 60 + hip;
    const handL = [L - 4, 118], handR = [R + 4, 118];
    const hemL = 156 + ri * 4.5, hemR = 146 + ri * 4;

    // adaga em pegada reversa: lâmina sobe junto ao antebraço
    const dagger = ([x, y], side, glow) => {
      const s = side === 'L' ? -1 : 1;
      const tip = [x + s * 5, y - 30 - ri * 1.5];
      const blade = `M${F(x + s * .6)} ${F(y - 3)} L${F(tip[0])} ${F(tip[1])} L${F(x + s * 4.2)} ${F(y - 4)} Z`;
      return `<g class="dagger">
        ${glow ? `<path d="${blade}" fill="none" stroke="${acc}" stroke-width="3.2" filter="url(#${id}b)" opacity=".9"/>` : ''}
        <path d="${blade}" fill="url(#${id}bl)" stroke="${glow ? acc : '#c9d4df'}" stroke-width=".6"/>
        <rect x="${F(x - 3.2)}" y="${F(y - 4.4)}" width="6.4" height="2" fill="${ri >= 4 ? gold : steel}"/>
        <rect x="${F(x - 1.4)}" y="${F(y - 2.6)}" width="2.8" height="8" fill="${leather}"/>
        <circle cx="${F(x)}" cy="${F(y + 6)}" r="1.5" fill="${ri >= 4 ? gold : steel}"/>
      </g>`;
    };

    // lâminas espectrais orbitando (Rank S)
    const spectral = ri >= 5 ? `<g class="spectral" opacity=".75">${[[18, 70, -30], [102, 64, 30], [12, 132, -12], [108, 138, 14]].map(([x, y, a]) =>
      `<g transform="rotate(${a} ${x} ${y})"><path d="M${x} ${y - 16} L${x + 3} ${y + 6} L${x} ${y + 10} L${x - 3} ${y + 6} Z" fill="${acc}" opacity=".35" filter="url(#${id}b)"/><path d="M${x} ${y - 16} L${x + 2} ${y + 6} L${x} ${y + 9} L${x - 2} ${y + 6} Z" fill="none" stroke="${acc}" stroke-width=".8"/></g>`).join('')}</g>` : '';

    // cachecol esvoaçando atrás (cresce com o rank)
    const sc = 18 + ri * 7;
    const scarfTail = `<path d="M64 50 Q${F(72 + sc * .4)} ${F(52 + ri)} ${F(70 + sc)} ${F(44 + ri * 2)} Q${F(74 + sc * .7)} ${F(56 + ri)} ${F(66 + sc * .9)} ${F(62 + ri * 2)} Q${F(70 + sc * .4)} 60 63 56 Z" fill="${cloth}" stroke="${ri >= 2 ? acc : '#3b4a57'}" stroke-width=".7"/>`;

    // barra irregular do casaco (C+)
    const jag = (x0, x1, y) => { let d = '', k = 0; for (let x = x0; s(x, x1); x += (x1 > x0 ? 4 : -4)) { d += ` L${F(x)} ${F(y + (k++ % 2 ? 4 : 0))}`; } return d; function s(a, b) { return x1 > x0 ? a <= b : a >= b; } };
    const hemBack = ri >= 2 ? `M${F(hipR + 6)} ${F(hemL + 8)}${jag(hipR + 6, hipL - 6, hemL + 8)}` : `M${F(hipR + 6)} ${F(hemL + 6)} L${F(hipL - 6)} ${F(hemL + 8)}`;

    const pauldron = ri >= 1 ? `<g class="pauldron">
      <path d="M${F(L - 6)} 70 Q${F(L - 4)} 56 ${F(L + 8)} 57 Q${F(L + 14)} 62 ${F(L + 12)} 68 Q${F(L + 2)} 66 ${F(L - 6)} 70 Z" fill="${steel}" stroke="${ri >= 4 ? gold : metal}" stroke-width=".9"/>
      <path d="M${F(L - 7)} 76 Q${F(L - 5)} 66 ${F(L + 6)} 66 Q${F(L + 11)} 70 ${F(L + 9)} 74 Q${F(L)} 73 ${F(L - 7)} 76 Z" fill="#55626f" stroke="${ri >= 4 ? gold : metal}" stroke-width=".8"/>
      ${ri >= 3 ? `<circle cx="${F(L + 3)}" cy="61" r="1.4" fill="${acc}"/>` : ''}</g>` : '';

    const bracer = ([x, y], s) => ri >= 1 ? `<path d="M${F(x - s * 1 - 4)} ${F(y - 16)} L${F(x - s * 1 + 4)} ${F(y - 16)} L${F(x + 4)} ${F(y - 5)} L${F(x - 4)} ${F(y - 5)} Z" fill="${leather}" stroke="${ri >= 4 ? gold : steel}" stroke-width=".7"/>
      <path d="M${F(x - 4)} ${F(y - 11)} L${F(x + 4)} ${F(y - 11)}" stroke="${ri >= 3 ? acc : steel}" stroke-width=".8"/>` : '';

    const strap = `<path d="M${F(L + 4)} 64 L${F(hipR + 1)} 112" stroke="${leather}" stroke-width="3.4"/>
      ${ri >= 1 ? [0.3, 0.45, 0.6].map(t => { const x = L + 4 + (hipR + 1 - L - 4) * t, y = 64 + 48 * t; return `<path d="M${F(x - 1)} ${F(y - 4)} L${F(x + 1)} ${F(y - 4)} L${F(x + .6)} ${F(y + 3)} L${F(x - .6)} ${F(y + 3)} Z" fill="${metal}"/>`; }).join('') : ''}
      ${ri >= 3 ? `<path d="M60 84 l4 4 -4 4 -4 -4 Z" fill="${coat}" stroke="${acc}" stroke-width="1"/><circle cx="60" cy="88" r="1.2" fill="${acc}"/>` : ''}`;

    const hairBits = f
      ? `<path d="M52 44 Q46 58 48 74 Q49 84 46 92" stroke="${hair}" stroke-width="4.5" fill="none" stroke-linecap="round"/>
         ${[56, 64, 72, 80, 88].map((y, k) => `<ellipse cx="${F(48 - (k % 2) * .6)}" cy="${y}" rx="2.6" ry="3.2" fill="${hair}" stroke="#0006" stroke-width=".4"/>`).join('')}
         <path d="M46 92 l-2 5 M46 92 l2 5" stroke="${acc}" stroke-width="1"/>
         <path d="M51 30 Q56 26 62 29 Q57 31 55 36 Z" fill="${hair}"/>`
      : `<path d="M50 31 Q55 25 62 27 Q68 25 70 31 Q66 29 63 34 L61 30 L58 35 L56 30 L53 34 Z" fill="${hair}"/>`;

    const pulse = ri >= 3 ? `<g class="rank-pulse rank-${rank}"><circle cx="60" cy="108" r="51" fill="none" stroke="${acc}" stroke-width="1.1" opacity=".5"/><circle cx="60" cy="108" r="43" fill="none" stroke="${ri >= 4 ? gold : acc}" stroke-width=".6" opacity=".35"/></g>` : '';
    const particles = ri >= 5 ? `<g class="rank-particles">${[[15, 44], [99, 35], [22, 99], [103, 122], [18, 154], [98, 174], [31, 190], [88, 76], [26, 68], [95, 202], [12, 126], [109, 88]].map(([x, y], k) => `<circle cx="${x}" cy="${y}" r="${k % 3 === 0 ? 1.7 : 1}" fill="${k % 2 ? acc : gold}"/>`).join('')}</g>` : '';

    return `<svg class="immersive-avatar assassin-avatar rank-${rank}" viewBox="0 0 120 210" role="img" aria-label="Avatar do jogador: Assassino, Rank ${rank}" style="overflow:visible">
<defs>
  <radialGradient id="${id}g" cx="50%" cy="55%" r="50%"><stop offset="0" stop-color="${acc}" stop-opacity="${AS_AURA[rank]}"/><stop offset="1" stop-color="${acc}" stop-opacity="0"/></radialGradient>
  <linearGradient id="${id}bl" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#7d8a97"/><stop offset=".6" stop-color="#dfe8f0"/><stop offset="1" stop-color="#ffffff"/></linearGradient>
  <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${coat2}"/><stop offset="1" stop-color="${coat}"/></linearGradient>
  <filter id="${id}b" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.4"/></filter>
</defs>
<ellipse cx="60" cy="112" rx="58" ry="102" fill="url(#${id}g)"/>
<ellipse cx="60" cy="202" rx="30" ry="4" fill="#000" opacity=".55"/>
${spectral}
<g transform="translate(60 200) scale(1 ${sy.toFixed(3)}) translate(-60 -200)">
  ${scarfTail}
  <!-- casaco: parte de trás -->
  <path d="M${F(hipL - 3)} 108 L${F(hipR + 3)} 108 L${F(hipR + 6)} ${F(hemL + 6)} ${hemBack.replace(/^M[^L]+/, '')} L${F(hipL - 6)} ${F(hemL + 8)} Z" fill="${coat}" opacity=".95"/>
  <!-- pernas e botas -->
  <rect x="${F(hipL + 1)}" y="118" width="${F(lw)}" height="80" fill="#121820"/>
  <rect x="${F(hipR - 1 - lw)}" y="118" width="${F(lw)}" height="80" fill="#121820"/>
  <path d="M${F(hipL)} 176 h${F(lw + 2)} v22 h-${F(lw + 4.5)} Z" fill="#0b0f15"/>
  <path d="M${F(hipR - lw - 2)} 176 h${F(lw + 2)} l2.5 22 h-${F(lw + 4.5)} Z" fill="#0b0f15"/>
  <g stroke="${ri >= 2 ? acc : '#3b4a57'}" stroke-width=".7" opacity=".9">
    <path d="M${F(hipL)} 181 l${F(lw + 2)} 3 M${F(hipL)} 187 l${F(lw + 2)} 3"/>
    <path d="M${F(hipR - lw - 2)} 184 l${F(lw + 2)} -3 M${F(hipR - lw - 2)} 190 l${F(lw + 2)} -3"/>
  </g>
  <!-- braços -->
  <line x1="${F(L + 3)}" y1="66" x2="${F(handL[0])}" y2="${handL[1] - 4}" stroke="${coat2}" stroke-width="${F(aw)}" stroke-linecap="round"/>
  <line x1="${F(R - 3)}" y1="66" x2="${F(handR[0])}" y2="${handR[1] - 4}" stroke="${coat2}" stroke-width="${F(aw)}" stroke-linecap="round"/>
  ${bracer(handL, -1)}${bracer(handR, 1)}
  <!-- tronco -->
  <path d="M${F(L)} 62 L${F(R)} 62 L${F(hipR + 3)} 114 L${F(hipL - 3)} 114 Z" fill="url(#${id}c)" stroke="${trim}" stroke-width=".7"/>
  <path d="M54 62 L60 80 L66 62" fill="#0e141b" stroke="${trim}" stroke-width=".6"/>
  <!-- abas da frente do casaco (assimétricas) -->
  <path d="M${F(hipL - 3)} 113 L57.5 113 L56 ${F(hemL - 4)} L${F(hipL - 9)} ${F(hemL)} Z" fill="url(#${id}c)" stroke="${trim}" stroke-width=".7"/>
  <path d="M62.5 113 L${F(hipR + 3)} 113 L${F(hipR + 7)} ${F(hemR - 6)} L64 ${F(hemR)} Z" fill="url(#${id}c)" stroke="${trim}" stroke-width=".7"/>
  ${ri >= 4 ? `<path d="M${F(hipL - 9)} ${F(hemL)} L56 ${F(hemL - 4)} M64 ${F(hemR)} L${F(hipR + 7)} ${F(hemR - 6)}" stroke="${gold}" stroke-width="1"/>` : ''}
  <!-- cinto e bolsas -->
  <rect x="${F(hipL - 3)}" y="108" width="${F(2 * hip + 6)}" height="5" fill="${leather}"/>
  <rect x="${F(hipL + 1)}" y="111" width="6" height="7" rx="1" fill="#2c2119" stroke="#4a3a2c" stroke-width=".5"/>
  <rect x="57.5" y="107.5" width="5" height="6" fill="none" stroke="${ri >= 4 ? gold : metal}" stroke-width=".9"/>
  ${strap}
  ${pauldron}
  <!-- mãos e adagas -->
  <circle cx="${F(handL[0])}" cy="${handL[1]}" r="${F(aw / 2 + .3)}" fill="${skin}"/>
  <circle cx="${F(handR[0])}" cy="${handR[1]}" r="${F(aw / 2 + .3)}" fill="${skin}"/>
  ${ri >= 2 ? dagger(handL, 'L', ri >= 3) : ''}
  ${dagger(handR, 'R', ri >= 3)}
  <!-- pescoço e cabeça -->
  <rect x="56" y="46" width="8" height="14" fill="${skin}"/>
  <circle cx="60" cy="38" r="12.5" fill="${skin}"/>
  ${hairBits}
  <!-- capuz -->
  <path d="M41 46 Q38 18 60 11 Q82 18 79 46 L76 60 Q60 53 44 60 Z" fill="${coat2}" stroke="${ri >= 2 ? acc : '#3b4a57'}" stroke-width="${ri >= 5 ? 1.2 : .8}"/>
  <path d="M60 11 Q66 6 72 8 Q66 12 64 16 Z" fill="${coat2}"/>
  <path d="M47 46 Q46 26 60 24 Q74 26 73 46 Q66 38 60 38 Q54 38 47 46 Z" fill="#070a0e" opacity=".92"/>
  ${f ? '' : `<path d="M51 30 Q56 26 62 28 Q67 26 70 31 Q66 30 63 33 L61 30 L58 34 L56 30 L53 33 Z" fill="${hair}"/>`}
  ${f ? `<path d="M51 30 Q56 26 62 29 Q57 31 55 36 Z" fill="${hair}"/>` : ''}
  <!-- olhos -->
  <g class="eyes"><g filter="url(#${id}b)" fill="${acc}"><path d="M51 37 L58 38.5 L57.5 40 L51.5 39 Z"/><path d="M69 37 L62 38.5 L62.5 40 L68.5 39 Z"/></g>
  <path d="M52 37.8 L57.4 38.8 M68 37.8 L62.6 38.8" stroke="#f2fdff" stroke-width=".9"/></g>
  <!-- máscara de pano -->
  <path d="M46.5 41.5 Q60 46.5 73.5 41.5 L72 54 Q60 60 48 54 Z" fill="${cloth}" stroke="${ri >= 2 ? acc : '#3b4a57'}" stroke-width=".6"/>
  <path d="M50 47 Q60 50 70 47 M51 51 Q60 54 69 51" stroke="#1a232c" stroke-width=".8" fill="none"/>
  ${ri >= 4 ? `<path d="M48 43 Q60 47.5 72 43" stroke="${gold}" stroke-width=".7" fill="none"/>` : ''}
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
