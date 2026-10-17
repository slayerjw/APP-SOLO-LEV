/* Modo desenvolvedor.
   Abrir: endereço do app com #dev no final, ou 5 toques rápidos em "SISTEMA" na barra do topo.
   Serve para ver todas as evoluções, monstros e eventos sem esperar dias.
   Antes da primeira alteração, o save atual é copiado para um backup que pode ser restaurado.
   Observação: é um atalho escondido, não uma proteção. Qualquer pessoa que souber do #dev consegue abrir. */
(() => {
  'use strict';
  if (window.__DEV_V1__) return;
  window.__DEV_V1__ = true;

  const BKEY = 'sistema-disciplina-v2-backup';
  const RK = ['E', 'D', 'C', 'B', 'A', 'S'];
  const CLS = ['guerreiro', 'assassino', 'mago', 'guardiao', 'xama'];
  const $id = id => document.getElementById(id);
  let tab = 'gal', galCls = null, galSex = null;

  const css = document.createElement('style');
  css.textContent = `
  #devPanel{position:fixed;inset:0;z-index:46;background:rgba(3,5,10,.97);overflow:auto;
    padding:calc(12px + env(safe-area-inset-top,0px)) max(16px,env(safe-area-inset-right,0px)) calc(24px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
  #devPanel .in{max-width:980px;margin:0 auto;display:flex;flex-direction:column;gap:14px}
  .dev-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .dev-head h2{flex:1;font-size:18px;color:#ffc65c;text-shadow:0 0 10px rgba(255,198,92,.5)}
  .dev-tabs{display:flex;gap:6px;flex-wrap:wrap}
  .dev-tabs button.on{color:#fff;border-color:#ffc65c;box-shadow:0 0 10px rgba(255,198,92,.4)}
  .dev-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .dev-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:10px}
  .dev-card{background:var(--deep);border:1px solid var(--rule);padding:8px;text-align:center;font-family:var(--f-display);font-size:12px;letter-spacing:.06em;color:var(--muted)}
  .dev-card svg{display:block;width:100%;height:auto;max-height:230px}
  .dev-card b{display:block;color:var(--ice);font-size:13px;margin-top:4px}
  .dev-mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
  .dev-note{font-size:12px;color:var(--muted)}
  .dev-kv{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
  .dev-kv label{display:flex;flex-direction:column;gap:4px;font-family:var(--f-display);font-size:11px;letter-spacing:.12em;color:var(--muted);text-transform:uppercase}
  .dev-kv input,.dev-kv select{background:var(--deep);border:1px solid var(--edge);color:var(--ice);padding:9px;font:inherit;font-size:15px;letter-spacing:0;text-transform:none}
  .toast{z-index:48}
  `;
  document.head.appendChild(css);

  const hasGame = () => typeof S !== 'undefined' && S && S.p;
  function backup() { try { if (hasGame() && !localStorage.getItem(BKEY)) localStorage.setItem(BKEY, JSON.stringify(S)); } catch (e) {} }
  function commit(msg) { save(); render(); if (msg) toast(msg); draw(); }

  /* ------------------------------ ações ------------------------------ */
  const A = {
    lvlUp() { backup(); gainXP(needXP(S.lv) - S.xp); commit(); },
    rankUp() {
      backup(); const next = RANKS.find(([l]) => l > S.lv); if (!next) return toast('Já está no rank máximo.');
      S.lv = next[0] - 1; S.xp = 0; gainXP(needXP(S.lv)); commit();
    },
    xp() { backup(); gainXP(+($id('devXp').value || 100)); commit(); },
    setLv() { backup(); S.lv = Math.max(1, Math.min(99, +$id('devLv').value || 1)); S.xp = 0; checkIntro(); commit(`Nível ${S.lv} · Rank ${rankOf(S.lv)}`); },
    setCh() {
      backup(); const c = +$id('devCh').value; S.ch = c; S.bossHp = c < CH.length ? CH[c].hp : 0;
      for (let k = 0; k <= c; k++) S.intro[k] = 1;
      if (c < CH.length && S.lv < CH[c].req) S.lv = CH[c].req;
      commit(`Capítulo ${c + 1}`);
    },
    phase2() {
      backup(); if (!bossActive()) return toast('Nenhum chefe ativo.');
      const c = CH[S.ch]; delete S.p2[S.ch]; S.bossHp = Math.floor(c.hp / 2) + 1;
      hitBoss({ s: 'X', xp: 5, id: 'dev' }); commit();
    },
    kill() { backup(); if (!bossActive()) return toast('Nenhum chefe ativo.'); S.p2[S.ch] = 1; S.bossHp = 1; hitBoss({ s: 'X', xp: 5, id: 'dev' }); commit(); },
    day21() {
      backup(); const q = S.quests.find(x => !x.m); if (!q) return toast('Todos os hábitos já foram dominados.');
      q.h = 20; q.done = false; save(); toggle(q.id); draw();
    },
    allDone() { backup(); S.bonusDay = null; S.quests.filter(q => !q.done).forEach(q => toggle(q.id)); draw(); },
    fail() {
      backup(); if (S.streak < 1) S.streak = 3;
      S.quests.forEach(q => { q.done = false; q.fresh = null; }); S.day = '2000-01-01'; rollover(); commit();
    },
    nextDay() {
      backup(); S.quests.forEach(q => { q.done = true; }); S.penalty = null; S.day = '2000-01-01'; rollover(); commit('Dia avançado sem falhas.');
    },
    pts() { backup(); S.free += 10; commit('+10 pontos de atributo'); },
    look() {
      backup(); S.p.cls = $id('devCls').value; S.p.sex = $id('devSex').value; commit('Aparência alterada.');
    },
    saveBackup() { try { localStorage.setItem(BKEY, JSON.stringify(S)); toast('Backup salvo.'); } catch (e) { toast('Não foi possível salvar o backup.'); } draw(); },
    restore() {
      let b = null; try { b = JSON.parse(localStorage.getItem(BKEY)); } catch (e) {}
      if (!b) return toast('Nenhum backup encontrado.');
      S = b; save(); try { localStorage.removeItem(BKEY); } catch (e) {} render(); toast('Save restaurado.'); draw();
    }
  };

  /* ------------------------------ telas ------------------------------ */
  function gallery() {
    const p0 = hasGame() ? S.p : { name: 'Dev', sex: 'm', height: 175, weight: 70, skin: 1, hair: 0 };
    const cls = galCls || (hasGame() ? S.p.cls : 'assassino'), sex = galSex || p0.sex;
    const p = Object.assign({}, p0, { cls, sex });
    const opts = (arr, sel, lab) => arr.map(v => `<option value="${v}" ${v === sel ? 'selected' : ''}>${lab(v)}</option>`).join('');
    const art = window.AVATAR_ART || {};
    return `<div class="dev-row">
        <select id="devGCls" class="ibtn">${opts(CLS, cls, v => CLASSES[v].n[sex === 'f' ? 1 : 0])}</select>
        <select id="devGSex" class="ibtn">${opts(['m', 'f'], sex, v => v === 'm' ? 'Masculino' : 'Feminino')}</select>
        <span class="dev-note">Usa altura, peso, pele e cabelo do jogador atual.</span></div>
      <div class="dev-grid">${RK.map(r => `<div class="dev-card">${avatar(p, r)}<b>Rank ${r}</b>${art[`${cls}/${sex}/${r}`] ? 'ilustração' : 'desenho SVG'}</div>`).join('')}</div>
      <div class="dev-card" style="max-width:220px">${avatar(p, 'E', true)}<b>Sombra do Antigo Eu</b>chefe final</div>`;
  }
  function monsters() {
    const keys = Object.keys(MON);
    return `<div class="dev-mgrid">${keys.map(k => `<div class="dev-card">${mArt(k)}<b>${MON[k].n}</b>${MON[k].rk} · fraqueza ${STATS[MON[k].weak] || '—'}</div>`).join('')}</div>`;
  }
  function events() {
    if (!hasGame()) return `<p class="dev-note">Crie um jogador primeiro.</p>`;
    const b = (act, label) => `<button class="btn" data-dev="${act}">${label}</button>`;
    return `<div class="dev-row">${b('lvlUp', 'Level up')}${b('rankUp', 'Subir de rank')}${b('day21', 'Dia 21 (habilidade)')}${b('allDone', 'Completar missão diária')}</div>
      <div class="dev-row">${b('phase2', 'Chefe: fase 2')}${b('kill', 'Derrotar chefe')}${b('fail', 'Falhar o dia (penalidade + Ladrão)')}${b('nextDay', 'Avançar dia sem falhas')}</div>
      <div class="dev-row"><input id="devXp" class="field" style="width:120px" type="number" value="100" aria-label="XP"> ${b('xp', 'Dar XP')} ${b('pts', '+10 pontos')}</div>
      <p class="dev-note">Os eventos alteram o save atual. O primeiro uso guarda um backup automático, que você pode restaurar na aba Progresso.</p>`;
  }
  function progress() {
    if (!hasGame()) return `<p class="dev-note">Crie um jogador primeiro.</p>`;
    let hasB = false; try { hasB = !!localStorage.getItem(BKEY); } catch (e) {}
    const b = (act, label, cls = '') => `<button class="btn ${cls}" data-dev="${act}">${label}</button>`;
    return `<div class="dev-kv">
        <label>Nível (rank ${rankOf(S.lv)})<input id="devLv" type="number" min="1" max="99" value="${S.lv}"></label>
        <label>Capítulo<select id="devCh">${CH.map((c, k) => `<option value="${k}" ${k === S.ch ? 'selected' : ''}>${k + 1} · ${c.t} (nível ${c.req})</option>`).join('')}<option value="${CH.length}" ${S.ch >= CH.length ? 'selected' : ''}>Fim da história</option></select></label>
        <label>Classe<select id="devCls">${CLS.map(v => `<option value="${v}" ${v === S.p.cls ? 'selected' : ''}>${CLASSES[v].n[0]}</option>`).join('')}</select></label>
        <label>Sexo<select id="devSex"><option value="m" ${S.p.sex === 'm' ? 'selected' : ''}>Masculino</option><option value="f" ${S.p.sex === 'f' ? 'selected' : ''}>Feminino</option></select></label>
      </div>
      <div class="dev-row">${b('setLv', 'Aplicar nível')}${b('setCh', 'Ir para capítulo')}${b('look', 'Aplicar classe e sexo')}</div>
      <div class="dev-row">${b('saveBackup', 'Salvar backup agora')}${b('restore', hasB ? 'Restaurar backup' : 'Sem backup', 'red')}</div>
      <p class="dev-note">Trocar a classe aqui muda só a aparência; os hábitos continuam os mesmos. Nível ${S.lv} · XP ${S.xp}/${needXP(S.lv)} · Capítulo ${Math.min(S.ch + 1, CH.length)} · Sequência ${S.streak}.</p>`;
  }

  function draw() {
    const el = $id('devPanel'); if (!el) return;
    const T = { gal: ['Evoluções', gallery], mon: ['Monstros', monsters], ev: ['Eventos', events], pr: ['Progresso', progress] };
    el.innerHTML = `<div class="in">
      <div class="dev-head"><h2>MODO DESENVOLVEDOR</h2><button class="btn" id="devClose">Fechar</button></div>
      <div class="dev-tabs">${Object.entries(T).map(([k, [n]]) => `<button class="ibtn ${k === tab ? 'on' : ''}" data-tab="${k}">${n}</button>`).join('')}</div>
      <section class="win">${T[tab][1]()}</section></div>`;
  }
  function open() {
    if ($id('devPanel')) return;
    const el = document.createElement('div'); el.id = 'devPanel'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Modo desenvolvedor');
    document.body.appendChild(el); draw();
  }
  function close() { const el = $id('devPanel'); if (el) el.remove(); if (location.hash === '#dev') history.replaceState(null, '', location.pathname + location.search); }

  document.addEventListener('click', e => {
    const t = e.target.closest('button,[data-tab]'); if (!t || !t.closest('#devPanel')) return;
    if (t.id === 'devClose') return close();
    if (t.dataset.tab) { tab = t.dataset.tab; return draw(); }
    if (t.dataset.dev && A[t.dataset.dev] && hasGame()) A[t.dataset.dev]();
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'devGCls') { galCls = e.target.value; draw(); }
    if (e.target.id === 'devGSex') { galSex = e.target.value; draw(); }
  });
  // 5 toques no logo
  let taps = [];
  document.addEventListener('click', e => {
    if (!e.target.closest('.logo')) return;
    const now = Date.now(); taps = taps.filter(t => now - t < 3000); taps.push(now);
    if (taps.length >= 5) { taps = []; open(); }
  });
  const check = () => { if (location.hash === '#dev') open(); };
  window.addEventListener('hashchange', check);
  window.addEventListener('load', check);
  window.DEV = { open, close };
})();
