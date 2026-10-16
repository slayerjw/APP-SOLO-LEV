(() => {
  'use strict';

  if (window.__IMMERSIVE_ART_V1__) return;
  window.__IMMERSIVE_ART_V1__ = true;

  const ART = {
    E: 'assets/avatars/assassino/rank-e.webp',
    D: 'assets/avatars/assassino/rank-d.webp',
    C: 'assets/avatars/assassino/rank-c.webp',
    B: 'assets/avatars/assassino/rank-b.webp',
    A: 'assets/avatars/assassino/rank-a.webp',
    S: 'assets/avatars/assassino/rank-s.webp',
    titan: 'assets/monsters/titan-preguica.webp'
  };

  const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
  const map=(n,inA,inB,outA,outB)=>outA+(clamp(n,inA,inB)-inA)*(outB-outA)/(inB-inA);
  const hasState=()=>typeof S!=='undefined' && S && S.p;

  const previousAvatar = avatar;
  avatar = function(p, rk, shadow){
    let svg = previousAvatar(p, rk, shadow);
    if (!p || p.cls !== 'assassino' || shadow) return svg;
    const sy = map(+p.height || 170, 140, 210, .90, 1.10);
    const sx = map(+p.weight || 70, 40, 160, .84, 1.18);
    const label = `${p.height || 170} cm · ${p.weight || 70} kg`;
    return svg.replace('<svg ', `<svg data-proportional-avatar="1" data-body="${label}" style="overflow:visible;transform-origin:50% 100%;transform:scaleX(${sx.toFixed(3)}) scaleY(${sy.toFixed(3)});" `);
  };

  const previousMArt = mArt;
  mArt = function(key, mini){
    if (key === 'golem') {
      return `<img class="premium-monster-art ${mini?'mini':''}" src="${ART.titan}" alt="Titã da Preguiça" loading="lazy">`;
    }
    return previousMArt(key, mini);
  };

  function rankArt(rank){
    const r = ART[rank] ? rank : 'E';
    return `<img class="premium-rank-art" src="${ART[r]}" alt="Assassino Rank ${r}" loading="lazy">`;
  }

  function ensureEvolutionCard(){
    if (!hasState() || S.p.cls !== 'assassino') return;
    const root = document.getElementById('app');
    if (!root) return;
    const currentRank = rankOf(S.lv);
    let card = document.getElementById('assassinEvolutionCard');
    if (!card) {
      card = document.createElement('section');
      card.id = 'assassinEvolutionCard';
      card.className = 'win assassin-evolution-card';
      const firstWin = root.querySelector('.win');
      if (firstWin) firstWin.insertAdjacentElement('afterend',card);
      else root.prepend(card);
    }
    card.innerHTML = `
      <div class="tag">Evolução do Assassino</div>
      <div class="evo-hero">
        ${rankArt(currentRank)}
        <div class="evo-copy">
          <div class="evo-rank">RANK ${currentRank}</div>
          <h2>${CLASSES.assassino.n[S.p.sex==='f'?1:0]}</h2>
          <p class="muted">${S.p.height} cm · ${S.p.weight} kg</p>
          <p>Seu avatar dinâmico usa suas proporções; a arte premium representa sua evolução de rank.</p>
          <button class="btn" id="openEvolutionGallery">Ver evolução E → S</button>
        </div>
      </div>`;
    const btn=document.getElementById('openEvolutionGallery');
    if(btn) btn.onclick=openEvolutionGallery;
  }

  function openEvolutionGallery(){
    const ranks=['E','D','C','B','A','S'];
    const body=`<div class="rank-gallery">${ranks.map(r=>`<figure>${rankArt(r)}<figcaption>Rank ${r}</figcaption></figure>`).join('')}</div>`;
    if(typeof showModal==='function') showModal({kind:'gold story',tag:'Classe · Assassino',title:'Evolução E → S',body,btn:'Fechar'});
  }

  const overlay=document.getElementById('overlay');
  if(overlay){
    const observer=new MutationObserver(()=>{
      const modal=overlay.querySelector('.modal .win');
      if(!modal||modal.dataset.premiumArtApplied) return;
      const text=modal.textContent||'';
      let art='';
      if(hasState() && S.p.cls==='assassino' && /Level Up|Novo rank|Habilidade adquirida|21 DIAS|ASCENSÃO/i.test(text)) art=rankArt(rankOf(S.lv));
      if(/Titã da Preguiça/i.test(text)) art=`<img class="premium-boss-splash" src="${ART.titan}" alt="Titã da Preguiça">`;
      if(art){
        const tag=modal.querySelector('.tag');
        if(tag) tag.insertAdjacentHTML('afterend',`<div class="premium-modal-art">${art}</div>`);
        modal.dataset.premiumArtApplied='1';
      }
    });
    observer.observe(overlay,{childList:true,subtree:true});
  }

  const previousRender=render;
  render=function(){ previousRender(); ensureEvolutionCard(); };

  document.addEventListener('input',e=>{
    if(!['fH','fW'].includes(e.target?.id)) return;
    requestAnimationFrame(()=>{
      const preview=document.getElementById('avPrev');
      if(preview && typeof P!=='undefined') preview.innerHTML=avatar(P,'E');
    });
  });

  try{ if(hasState()) render(); }catch(e){ console.warn('[immersive-art]',e); }
})();