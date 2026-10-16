(() => {
  'use strict';

  const VERSION = 'immersive-v1.0';
  if (window.__IMMERSIVE_V1__ === VERSION) return;
  window.__IMMERSIVE_V1__ = VERSION;

  const base = { avatar, mArt, gainXP, hitBoss, master, rollover, render, ambStart, ambStop };

  Object.assign(MON.golem, {
    n: 'Titã da Preguiça',
    lore: 'Uma massa colossal formada por adiamentos, manhãs perdidas e promessas empurradas para depois. Quanto mais tempo você fica parado, mais pesado ele se torna.',
    q: ['Fica. Só hoje.', 'Você pode começar amanhã.', 'O primeiro passo é sempre o mais pesado. Então não dê.']
  });
  Object.assign(MON.aranha, {
    n: 'Devorador de Foco', art: 'o',
    lore: 'Uma criatura de olhos demais e atenção nenhuma. Alimenta-se de notificações, abas abertas e minutos roubados até transformar uma hora em nada.',
    q: ['Só mais uma olhada.', 'Você não precisa terminar agora.', 'Tem sempre algo mais interessante do que o que importa.']
  });
  Object.assign(MON.espectro, {
    n: 'Parasita da Procrastinação',
    lore: 'Não precisa derrotar você. Basta convencê-lo a adiar. Ele se enrola em cada tarefa não iniciada e fica mais forte toda vez que você diz “depois”.',
    q: ['Depois fica mais fácil.', 'Ainda dá tempo.', 'Planejar parece quase a mesma coisa que fazer, não parece?']
  });
  Object.assign(MON.sombra, {
    n: 'Sussurrador da Dúvida', art: 'o',
    lore: 'Uma presença sem rosto que imita vozes antigas, fracassos e comparações. Cada promessa cumprida consigo mesmo apaga uma de suas vozes.',
    q: ['Você não é esse tipo de pessoa.', 'Vai desistir de novo.', 'E se todo esse esforço não mudar nada?']
  });
  Object.assign(MON.hidra, {
    n: 'Abismo do Caos', art: 'o',
    lore: 'Uma entidade feita de pendências, desordem e decisões acumuladas. Tentar resolver tudo ao mesmo tempo só aprofunda o vazio. Ordem é a única arma.',
    q: ['Tem coisa demais. Nem começa.', 'Você perdeu o controle faz tempo.', 'Mais uma pendência. Mais uma. Mais uma.']
  });

  MON.ladrao = {
    n: 'Ladrão de Sequência', art: 'o', rk: 'Rank A', weak: 'DIS',
    lore: 'Ele não aparece no primeiro dia. Espera você construir ritmo, confiança e uma sequência — então surge no exato momento em que uma falha tenta virar abandono.',
    ab: 'Roubo de Ritmo · aparece quando uma sequência é quebrada. Recuperar no próximo dia reduz sua força.',
    q: ['Viu? Acabou a sequência.', 'Agora tanto faz falhar de novo.', 'Eu não roubo um dia. Eu roubo o próximo.']
  };

  function signatureMonster(key) {
    const id = `im-${key}-${Math.random().toString(36).slice(2,7)}`;
    const common = (inner, accent = '#ff4058', secondary = '#7b1630') => `
      <svg class="monster-art monster-${key}" viewBox="0 0 320 230" role="img" aria-label="${MON[key].n}">
        <defs>
          <radialGradient id="${id}-a" cx="50%" cy="48%" r="62%"><stop offset="0" stop-color="${accent}" stop-opacity=".28"/><stop offset=".58" stop-color="${secondary}" stop-opacity=".12"/><stop offset="1" stop-color="#03050a" stop-opacity="0"/></radialGradient>
          <linearGradient id="${id}-m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#28344b"/><stop offset="1" stop-color="#070b13"/></linearGradient>
          <filter id="${id}-g" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4"/></filter>
          <filter id="${id}-s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000" flood-opacity=".8"/></filter>
        </defs>
        <ellipse cx="160" cy="116" rx="150" ry="102" fill="url(#${id}-a)"/>
        <ellipse cx="160" cy="207" rx="78" ry="9" fill="#000" opacity=".65"/>
        ${inner(id, accent)}
      </svg>`;

    if (key === 'golem') return common((i,a)=>`
      <g filter="url(#${i}-s)">
        <path d="M91 187 L106 98 Q111 61 160 50 Q209 61 214 98 L229 187 Z" fill="url(#${i}-m)" stroke="#596272" stroke-width="2"/>
        <path d="M106 105 L63 142 L74 187 L108 157 Z M214 105 L257 142 L246 187 L212 157 Z" fill="#111723" stroke="#4a5361" stroke-width="2"/>
        <path d="M126 55 L141 29 L153 48 L171 24 L183 53" fill="#161d29" stroke="#626d7f" stroke-width="2"/>
        <path d="M132 83 Q160 62 188 83 L183 113 Q160 129 137 113 Z" fill="#080c12" stroke="#3a4658"/>
        <g fill="${a}" filter="url(#${i}-g)"><circle cx="147" cy="94" r="7"/><circle cx="173" cy="94" r="7"/></g>
        <g fill="#ffd8de"><circle cx="147" cy="94" r="3"/><circle cx="173" cy="94" r="3"/></g>
        <g stroke="${a}" stroke-width="2" opacity=".7"><path d="M116 130 L143 116 L150 147 L176 121 L204 139" fill="none"/><path d="M88 161 L111 151 M232 161 L209 151"/></g>
      </g>`);

    if (key === 'aranha') return common((i,a)=>`
      <g filter="url(#${i}-s)" stroke-linecap="round">
        <g stroke="#26364d" stroke-width="8" fill="none">
          <path d="M135 105 L88 73 L42 65 M129 122 L78 112 L27 122 M132 139 L81 153 L42 188 M185 105 L232 73 L278 65 M191 122 L242 112 L293 122 M188 139 L239 153 L278 188"/>
        </g>
        <ellipse cx="160" cy="133" rx="48" ry="58" fill="#0a101b" stroke="#374861" stroke-width="2"/>
        <ellipse cx="160" cy="83" rx="31" ry="28" fill="#0d1422" stroke="#3d4e68" stroke-width="2"/>
        <g fill="${a}" filter="url(#${i}-g)">${[[146,76],[160,70],[174,76],[151,87],[169,87]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6"/>`).join('')}</g>
        <g fill="#e5fbff">${[[146,76],[160,70],[174,76],[151,87],[169,87]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2"/>`).join('')}</g>
        <g stroke="#38bdf8" opacity=".62"><path d="M124 132 Q160 112 196 132"/><path d="M128 149 Q160 129 192 149"/><path d="M139 167 Q160 152 181 167"/></g>
        <g fill="#38bdf8" opacity=".65">${[[65,49],[253,48],[35,109],[284,107],[58,180],[263,181]].map(([x,y])=>`<rect x="${x-4}" y="${y-3}" width="8" height="6" rx="1"/>`).join('')}</g>
      </g>`, '#38bdf8', '#193d65');

    if (key === 'espectro') return common((i,a)=>`
      <g filter="url(#${i}-s)">
        <path d="M160 34 Q202 48 208 95 L230 192 Q199 171 184 191 Q169 170 154 194 Q136 170 116 190 Q96 168 87 191 L111 92 Q117 47 160 34 Z" fill="#10101a" stroke="#4c3d67" stroke-width="2"/>
        <path d="M132 78 Q160 56 188 78 L182 112 Q160 127 138 112 Z" fill="#050508"/>
        <g fill="${a}" filter="url(#${i}-g)"><path d="M141 91 L153 87 L151 97 Z"/><path d="M179 91 L167 87 L169 97 Z"/></g>
        <g stroke="#a46bff" fill="none" opacity=".65"><circle cx="160" cy="141" r="23"/><path d="M160 118 L160 141 L176 151"/><circle cx="160" cy="141" r="3" fill="#a46bff"/></g>
        <g fill="#a46bff" opacity=".6">${[[105,55],[217,70],[92,129],[230,143],[115,178],[205,177]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2"/>`).join('')}</g>
      </g>`, '#a46bff', '#3e225f');

    if (key === 'sombra') return common((i,a)=>`
      <g filter="url(#${i}-s)">
        <path d="M160 27 Q196 42 201 86 L223 195 Q190 178 174 195 Q160 174 145 196 Q126 176 98 193 L119 84 Q124 41 160 27 Z" fill="#06070b" stroke="#24273a" stroke-width="2"/>
        <ellipse cx="160" cy="83" rx="32" ry="38" fill="#030408"/>
        <g fill="${a}" filter="url(#${i}-g)"><path d="M137 81 Q147 73 156 81 Q147 89 137 81 Z"/><path d="M183 81 Q173 73 164 81 Q173 89 183 81 Z"/></g>
        <g fill="#ffbbc5">${[[145,82],[175,82]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2"/>`).join('')}</g>
        <g stroke="#31374e" stroke-width="1" opacity=".6">${[0,1,2,3,4].map(n=>`<path d="M${88+n*10} ${105+n*15} Q160 ${78+n*9} ${232-n*10} ${105+n*15}" fill="none"/>`).join('')}</g>
        <g fill="#ff4058" opacity=".45">${[[74,62],[244,56],[64,134],[252,146],[109,202],[212,198]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.4"/>`).join('')}</g>
      </g>`);

    if (key === 'hidra') return common((i,a)=>`
      <g filter="url(#${i}-s)">
        <path d="M116 184 Q99 141 119 111 Q130 92 144 86 Q139 63 124 51 Q147 47 160 68 Q173 47 196 51 Q181 63 176 86 Q190 92 201 111 Q221 141 204 184 Z" fill="#0c1119" stroke="#3d4c60" stroke-width="2"/>
        <g fill="#121a26" stroke="#45576f" stroke-width="2">
          <path d="M135 91 Q94 89 76 56 Q107 58 126 71 Z"/><path d="M185 91 Q226 89 244 56 Q213 58 194 71 Z"/><path d="M143 80 Q119 49 128 25 Q149 42 154 67 Z"/><path d="M177 80 Q201 49 192 25 Q171 42 166 67 Z"/>
        </g>
        <g fill="${a}" filter="url(#${i}-g)">${[[105,67],[215,67],[141,49],[179,49],[151,112],[169,112]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5"/>`).join('')}</g>
        <circle cx="160" cy="143" r="31" fill="#030508" stroke="#232f42"/>
        <circle cx="160" cy="143" r="18" fill="#000"/>
        <circle cx="160" cy="143" r="7" fill="${a}" opacity=".85" filter="url(#${i}-g)"/>
      </g>`, '#7c3aed', '#30134f');

    if (key === 'ladrao') return common((i,a)=>`
      <g filter="url(#${i}-s)">
        <path d="M160 37 Q195 40 207 72 L195 179 Q175 194 160 194 Q145 194 125 179 L113 72 Q125 40 160 37 Z" fill="#0b0e16" stroke="#3b4357" stroke-width="2"/>
        <path d="M122 70 Q160 48 198 70 L187 101 Q160 84 133 101 Z" fill="#101827" stroke="#47536b"/>
        <g fill="${a}" filter="url(#${i}-g)"><path d="M136 83 L154 80 L149 90 Z"/><path d="M184 83 L166 80 L171 90 Z"/></g>
        <path d="M112 116 L72 151 L91 170 L127 139 M208 116 L248 151 L229 170 L193 139" fill="none" stroke="#6a758b" stroke-width="8" stroke-linecap="round"/>
        <path d="M79 152 L57 133 M241 152 L263 133" stroke="${a}" stroke-width="4"/>
        <g class="broken-chain" stroke="#ffc65c" stroke-width="5" fill="none"><path d="M135 150 C123 136 112 153 124 165 C136 177 147 159 135 150 Z"/><path d="M185 150 C197 136 208 153 196 165 C184 177 173 159 185 150 Z"/><path d="M151 157 L169 157" stroke-dasharray="5 6"/></g>
        <g fill="#ffc65c" opacity=".85">${[[146,164],[172,146],[156,141],[181,169]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.2"/>`).join('')}</g>
      </g>`, '#ff9d3d', '#6b2b16');
    return null;
  }

  const TITAN_ART = 'assets/monsters/titan-preguica.webp';
  mArt = function(key, mini) {
    if (key === 'golem') return `<img class="monster-art premium-monster" src="${TITAN_ART}" alt="${MON.golem.n}">`;
    if (['golem','aranha','espectro','sombra','hidra','ladrao'].includes(key)) return signatureMonster(key);
    const out = base.mArt(key, mini);
    return out.replace('<svg ', `<svg class="monster-art monster-${key}" `);
  };

  avatar = function(p, rk, shadow) {
    const rank = rk || 'E';
    let svg = base.avatar(p, rank, shadow);
    if (shadow) return svg;
    const ri = ['E','D','C','B','A','S'].indexOf(rank);
    const metallic = ri >= 1 ? `<g class="rank-metal rank-${rank}"><path d="M37 66 L48 60 L52 74 L41 81 Z" fill="#aab7c8" stroke="#e7f1ff" stroke-width=".65"/><path d="M83 66 L72 60 L68 74 L79 81 Z" fill="#aab7c8" stroke="#e7f1ff" stroke-width=".65"/><path d="M52 113 L68 113 L66 118 L54 118 Z" fill="#77879b" stroke="#d7e4f3" stroke-width=".55"/></g>` : '';
    const crest = ri >= 2 ? `<g class="rank-crest rank-${rank}"><path d="M60 79 l7 8 -7 8 -7-8z" fill="none" stroke="${rank==='S'?'#d7b8ff':'#7fd0ff'}" stroke-width="1.25"/><circle cx="60" cy="87" r="2.2" fill="${rank==='S'?'#fff0ff':'#dff6ff'}"/></g>` : '';
    const pulse = ri >= 3 ? `<g class="rank-pulse rank-${rank}"><circle cx="60" cy="108" r="51" fill="none" stroke="${rank==='S'?'#a46bff':'#4ea8ff'}" stroke-width="1.2" opacity=".55"/><circle cx="60" cy="108" r="43" fill="none" stroke="${rank==='A'?'#ffc65c':'#7fd0ff'}" stroke-width=".7" opacity=".4"/></g>` : '';
    const crown = ri >= 4 ? `<g class="rank-crown rank-${rank}" fill="none" stroke="${rank==='S'?'#d9b7ff':'#ffc65c'}" stroke-width="1"><path d="M43 25 Q60 13 77 25"/><path d="M48 20 L51 14 M60 17 L60 9 M72 20 L69 14"/></g>` : '';
    const particles = ri >= 5 ? `<g class="rank-particles">${[[15,44],[99,35],[22,99],[103,122],[18,154],[98,174],[31,190],[88,76],[26,68],[95,202],[12,126],[109,88]].map(([x,y],n)=>`<circle cx="${x}" cy="${y}" r="${n%3===0?1.8:1.1}" fill="${n%2?'#a46bff':'#dff6ff'}"/>`).join('')}</g>` : '';
    return svg.replace('</svg>', `${metallic}${crest}${pulse}${crown}${particles}</svg>`).replace('<svg ', `<svg class="immersive-avatar rank-${rank}" `);
  };

  function noise(duration=.12, vol=.035, highpass=500) {
    if (!S || !S.sfx) return;
    const a = ac(); if (!a) return;
    const len = Math.max(1, Math.floor(a.sampleRate * duration));
    const buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    for (let i=0;i<len;i++) d[i] = (Math.random()*2-1) * (1-i/len);
    const src = a.createBufferSource(), hp = a.createBiquadFilter(), g = a.createGain();
    hp.type = 'highpass'; hp.frequency.value = highpass; g.gain.value = vol;
    src.buffer = buf; src.connect(hp).connect(g).connect(a.destination); src.start();
  }
  function chord(notes, opts={}) { tone(notes, opts.step ?? .055, opts.dur ?? .24, opts.type ?? 'triangle', opts.vol ?? .055); }
  function sweep(from, to, dur=.32, type='sine', vol=.045) {
    if (!S || !S.sfx) return; const a = ac(); if (!a) return;
    const o=a.createOscillator(), g=a.createGain(), t=a.currentTime;
    o.type=type; o.frequency.setValueAtTime(from,t); o.frequency.exponentialRampToValueAtTime(Math.max(20,to),t+dur);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(vol,t+.015); g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t+dur+.03);
  }

  const FX = {
    ui_click(){ chord([660],{dur:.07,type:'sine',vol:.025}); },
    quest_complete(){ chord([740,988,1245],{step:.045,dur:.2,vol:.05}); sweep(420,860,.18,'triangle',.025); },
    xp_gain(){ chord([1047,1319],{step:.035,dur:.12,vol:.03}); },
    streak_complete(){ chord([523,659,784,1047],{step:.06,dur:.28,vol:.055}); },
    level_up(){ chord([392,523,659,784,1047],{step:.07,dur:.42,vol:.075}); sweep(180,1180,.55,'triangle',.035); },
    rank_up(){ noise(.18,.025,900); chord([261.6,392,523.3,784,1046.5,1568],{step:.08,dur:.6,vol:.08}); sweep(110,1760,.8,'sawtooth',.025); },
    boss_hit(){ noise(.09,.04,250); chord([110,165],{step:.02,dur:.12,type:'square',vol:.035}); },
    boss_phase2(){ noise(.45,.04,120); sweep(90,55,.75,'sawtooth',.05); chord([110,103,98],{step:.12,dur:.45,type:'sawtooth',vol:.035}); },
    boss_defeat(){ noise(.25,.028,700); chord([196,294,392,587,784,1175],{step:.075,dur:.62,vol:.065}); sweep(160,1400,.65,'triangle',.04); },
    warning(){ chord([440,330,440,294],{step:.12,dur:.18,type:'square',vol:.025}); },
    failure(){ noise(.16,.025,250); chord([196,147,110],{step:.12,dur:.4,type:'sawtooth',vol:.04}); },
    skill_mastered(){ noise(.28,.02,1200); chord([261.6,329.6,392,523.3,659.3,784,1046.5],{step:.09,dur:.75,vol:.075}); sweep(130,2093,.95,'triangle',.035); }
  };

  const PRI = {ui_click:1,xp_gain:2,boss_hit:3,quest_complete:3,warning:4,streak_complete:5,failure:5,level_up:6,boss_phase2:7,rank_up:8,boss_defeat:8,skill_mastered:9};
  let lastPri = 0, lastAt = 0;
  Object.keys(FX).forEach(k => { const fn = FX[k]; FX[k] = () => {
    const now = performance.now();
    if (now - lastAt < 350 && PRI[k] < lastPri) return;
    lastPri = PRI[k]; lastAt = now; fn();
  }; });

  Object.assign(SFX, FX, { ok: FX.ui_click, lvl: FX.level_up, bad: FX.failure, boss: FX.boss_defeat, open: FX.ui_click });
  document.addEventListener('click', e => { if (e.target.closest('button,.ibtn,.mcard')) FX.ui_click(); }, true);

  const Music = {
    state: 'ambient', requested: 'ambient', master: null, bus: null, nodes: [], timer: null,
    presets: {
      ambient: {root:55, chord:[1,1.5,2,3], bpm:44, cutoff:520, vol:.038, wave:'triangle'},
      focus:   {root:65.4, chord:[1,1.25,1.5,2], bpm:72, cutoff:900, vol:.045, wave:'sine'},
      boss:    {root:49, chord:[1,1.059,1.5,2], bpm:96, cutoff:680, vol:.055, wave:'sawtooth'},
      victory: {root:65.4, chord:[1,1.25,1.5,2,2.5], bpm:60, cutoff:1500, vol:.06, wave:'triangle'}
    },
    stop(fade=.45){
      if (!this.master) return;
      const a=AC, old={master:this.master,nodes:this.nodes.slice(),timer:this.timer};
      if (old.timer) clearInterval(old.timer);
      try { old.master.gain.cancelScheduledValues(a.currentTime); old.master.gain.linearRampToValueAtTime(0,a.currentTime+fade); } catch(e){}
      setTimeout(()=>old.nodes.forEach(n=>{try{n.stop?.()}catch(e){}}), (fade+.08)*1000);
      this.master=null; this.bus=null; this.nodes=[]; this.timer=null; amb=null;
    },
    start(state=this.requested){
      const a=ac(); if(!a) return;
      this.stop(.16); this.state=state; this.requested=state;
      const p=this.presets[state]||this.presets.ambient;
      const master=a.createGain(), lp=a.createBiquadFilter();
      master.gain.value=0; master.gain.linearRampToValueAtTime(p.vol,a.currentTime+.7);
      lp.type='lowpass'; lp.frequency.value=p.cutoff; lp.Q.value=2.5; lp.connect(master).connect(a.destination);
      const os=[];
      p.chord.forEach((ratio,i)=>{ const o=a.createOscillator(), g=a.createGain(); o.type=p.wave; o.frequency.value=p.root*ratio; g.gain.value=.22/(i+1); o.connect(g).connect(lp); o.start(); os.push(o); });
      const beatMs=60000/p.bpm; let beat=0;
      const timer=setInterval(()=>{
        const t=a.currentTime, o=a.createOscillator(), g=a.createGain();
        const scale=state==='boss'?[1,1.059,1.189,1.5]:state==='victory'?[1,1.25,1.5,2]:[1,1.125,1.25,1.5,2];
        o.type=state==='boss'?'square':'sine'; o.frequency.value=p.root*4*scale[beat%scale.length]; beat++;
        g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(state==='boss'?.022:.014,t+.015); g.gain.exponentialRampToValueAtTime(.0001,t+Math.min(.55,beatMs/1000*.75));
        o.connect(g).connect(master); o.start(t); o.stop(t+.65);
      }, beatMs);
      this.master=master; this.bus=lp; this.nodes=os; this.timer=timer; amb={immersive:true};
    },
    set(state, temporaryMs=0){
      this.requested=state;
      if (this.master) this.start(state);
      if (temporaryMs) setTimeout(()=>{
        const next = bossActive() ? 'boss' : (document.body.classList.contains('focus-mode') ? 'focus':'ambient');
        this.requested=next; if(this.master) this.start(next);
      }, temporaryMs);
    }
  };

  ambStart = function(){ Music.start(bossActive()?'boss':(document.body.classList.contains('focus-mode')?'focus':'ambient')); };
  ambStop = function(){ Music.stop(); };

  const focusBtn=document.createElement('button');
  focusBtn.className='ibtn'; focusBtn.id='focusBtn'; focusBtn.textContent='◎ Foco'; focusBtn.setAttribute('aria-pressed','false');
  const ambBtn=document.getElementById('ambBtn');
  if(ambBtn?.parentNode) ambBtn.parentNode.insertBefore(focusBtn, ambBtn);
  focusBtn.addEventListener('click',()=>{
    const on=!document.body.classList.contains('focus-mode');
    document.body.classList.toggle('focus-mode',on); focusBtn.classList.toggle('on',on); focusBtn.setAttribute('aria-pressed',String(on));
    if(amb) Music.set(on?'focus':(bossActive()?'boss':'ambient'));
    toast(on?'Modo Foco ativado. O ruído fica do lado de fora.':'Modo Foco encerrado.');
  });

  gainXP = function(n){
    const beforeRank=rankOf(S.lv);
    S.xp+=n; let ups=0;
    while(S.xp>=needXP(S.lv)){ S.xp-=needXP(S.lv); S.lv++; S.free+=3; ups++; }
    FX.xp_gain();
    if(ups){
      const newRank=rankOf(S.lv), rankChanged=newRank!==beforeRank; flash();
      if(rankChanged) FX.rank_up(); else FX.level_up();
      showModal({kind:`gold ${rankChanged?'rank-event':'level-event'}`,tag:rankChanged?'RANK ASCENDIDO':'LEVEL UP',title:rankChanged?`RANK ${newRank}`:`Nível ${S.lv}`,
        body:`<div class="rank-event-avatar">${avatar(S.p,newRank)}</div><div class="event-kicker">${rankChanged?'NOVO PATAMAR DESBLOQUEADO':'PODER AUMENTADO'}</div>`+
          `Você recebeu <b>${3*ups} pontos de atributo</b>.`+(rankChanged?`<br>Sua presença mudou. O Sistema reconhece você como <b>Rank ${newRank}</b>.`:``)+`<br>Título: <b>${titleOf(S.lv)}</b>`});
    }
    checkIntro();
  };

  hitBoss = function(q){
    if(!bossActive()) return 0;
    const dmg=dmgFor(q), c=CH[S.ch], x=X(S.p); S.bossHp-=dmg; q.hit=S.ch; q.dmg=dmg; FX.boss_hit();
    const bossWasDefeated=S.bossHp<=0;
    if(S.bossHp>0 && S.bossHp<=c.hp/2 && !S.p2[S.ch]){
      S.p2[S.ch]=1; FX.boss_phase2(); Music.set('boss');
      showModal({kind:'story red phase2-event',tag:'FASE 2',title:bossName(S.ch),body:mArt(bossKey(S.ch))+paras(c.p2(x))+SY(MON[bossKey(S.ch)].ab),btn:'Continuar lutando'});
    }
    if(bossWasDefeated){
      FX.boss_defeat(); Music.set('victory',6500);
      showModal({kind:'story victory-event',tag:'CHEFE DERROTADO',title:bossName(S.ch),body:paras(c.outro(x))+SY('Recompensa: +80 XP · Disciplina +2'),btn:'Reivindicar vitória'});
      flash(); S.ch++; S.bossHp=S.ch<CH.length?CH[S.ch].hp:0; S.stats.DIS+=2; gainXP(80);
    }
    return dmg;
  };

  master = function(q){
    q.m=true; q.mDay=S.day; S.stats[q.s]+=3; flash(); FX.skill_mastered(); Music.set('victory',8000);
    const nq=unlockHidden();
    showModal({kind:'gold mastery-event',tag:'21 DIAS · ASCENSÃO',title:q.sk,btn:'Selar habilidade',
      body:`<div class="mastery-seal"><div class="mastery-ring"><span>21</span><small>DIAS</small></div>${avatar(S.p,rankOf(S.lv))}</div>`+
        `<div class="event-kicker">HÁBITO TRANSFORMADO EM IDENTIDADE</div>`+
        `<p>Você repetiu <b>${esc(q.t)}</b> até não depender mais de motivação.</p>`+
        `<div class="mastery-reward"><b>HABILIDADE PASSIVA PERMANENTE</b><span>${STATS[q.s]} +3</span></div>`+
        (nq?`<div class="hidden-unlock">MISSÃO OCULTA DESBLOQUEADA<br><b>${esc(nq.t)}</b></div>`:'')});
  };

  rollover = function(){
    const t=today(); if(S.day===t) return;
    const previousStreak=S.streak||0;
    const missed=S.quests.filter(q=>!q.done&&q.fresh!==S.day&&!q.m), missedM=S.quests.filter(q=>!q.done&&q.m), penOpen=S.penalty&&!S.penalty.done;
    const drops=[]; missed.forEach(q=>{ const f=phaseFloor(q.h); if(q.h>f||q.h>0) drops.push(`${esc(q.t)}: dia ${q.h} → ${f}`); q.h=f; });
    if(missed.length||missedM.length||penOpen){
      const all=[...missed,...missedM], loss=Math.round(all.reduce((a,q)=>a+q.xp,0)/2)+(penOpen?20:0);
      S.xp-=loss; while(S.xp<0&&S.lv>1){ S.lv--; S.xp+=needXP(S.lv); } if(S.xp<0) S.xp=0;
      S.streak=0; let heal='';
      if(bossActive()){ const hp=CH[S.ch].hp, h=Math.round(hp*(S.p2[S.ch]?.25:.15)); S.bossHp=Math.min(hp,S.bossHp+h); heal=`<br>${bossName(S.ch)} recuperou <b>${h} HP</b>.`; }
      S.penalty={t:PENALTIES[Math.floor(Math.random()*PENALTIES.length)],done:false}; FX.failure();
      showModal({kind:'red',tag:'Penalidade',title:'Missão incompleta',body:`Você falhou em ${all.length} hábito(s). −${loss} XP. Sequência zerada.${heal}`+(drops.length?`<br><br>Hábitos que voltaram ao início da fase:<br>${drops.join('<br>')}`:'')+`<br><br>Missão de penalidade de hoje:<br><b style="color:var(--red)">${S.penalty.t}</b>`});
      if(previousStreak>0){
        FX.warning();
        showModal({kind:'story red thief-event',tag:'AMEAÇA DE SEQUÊNCIA',title:MON.ladrao.n,btn:'Recuperar o ritmo',
          body:mArt('ladrao')+`<p>Ele apareceu porque uma falha tentou virar abandono.</p><p><i>“${MON.ladrao.q[2]}”</i></p>`+SY(`Sua sequência de ${previousStreak} dia${previousStreak===1?'':'s'} foi quebrada. O próximo dia é a batalha importante.`)});
      }
    } else {
      S.streak++; S.penalty=null;
      if(S.streak>0 && S.streak%7===0){ FX.streak_complete(); Music.set('victory',4200); toast(`<b>Sequência ${S.streak} dias</b> · Ritmo consolidado.`); }
    }
    S.quests.forEach(q=>{ q.done=false; q.hit=null; q.dmg=0; q.fresh=null; }); S.day=t; save();
  };

  toggle = function(id){
    const q=S.quests.find(x=>x.id===id); if(!q) return;
    q.done=!q.done;
    if(q.done){
      S.stats[q.s]++; S.total++; if(!q.m) q.h=Math.min(HABIT_DAYS,q.h+1);
      const dmg=hitBoss(q); FX.quest_complete();
      toast(`<b>+${q.xp} XP</b> · ${STATS[q.s]} +1`+(dmg?` · ${dmg} de dano`:``)+(q.m?``:` · dia ${q.h}/21`));
      gainXP(q.xp);
      if(!q.m&&q.h>=HABIT_DAYS) master(q);
      if(S.quests.every(x=>x.done)&&S.bonusDay!==S.day){
        S.bonusDay=S.day; S.stats.DIS++; FX.streak_complete(); Music.set('victory',3600);
        showModal({tag:'Missão diária',title:'Concluída',body:`Recompensa extra: <b>+30 XP</b> e <b>Disciplina +1</b>.<br>Volte amanhã, Jogador.`});
        gainXP(30);
      }
    } else {
      S.xp-=q.xp; S.stats[q.s]--; S.total--;
      if(q.m&&q.mDay===S.day){ q.m=false; S.stats[q.s]-=3; }
      if(!q.m) q.h=Math.max(0,q.h-1);
      while(S.xp<0&&S.lv>1){ S.lv--; S.xp+=needXP(S.lv); S.free=Math.max(0,S.free-3); } if(S.xp<0) S.xp=0;
      if(q.hit===S.ch&&bossActive()) S.bossHp=Math.min(CH[S.ch].hp,S.bossHp+(q.dmg||q.xp));
      q.hit=null; q.dmg=0; FX.warning();
    }
    save(); render();
  };

  render = function(){
    base.render();
    const bossEl=document.querySelector('#bArt > *'); if(bossEl) bossEl.classList.add('bossart','monster-art');
    if(amb && !Music.master) Music.start(bossActive()?'boss':'ambient');
    if(Music.master && bossActive() && Music.state!=='boss' && Music.state!=='victory' && !document.body.classList.contains('focus-mode')) Music.set('boss');
    document.body.classList.toggle('boss-active',!!bossActive());
  };

  console.info('[Sistema] Immersive V1 loaded');
})();
