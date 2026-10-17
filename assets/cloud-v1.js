/* Cadastro, login e progresso salvo na nuvem (Supabase).
   Só funciona quando assets/cloud-config.js tem url e anonKey; sem isso, o app segue local.
   - Tela de entrada: Entrar, Criar conta ou Continuar sem conta.
   - Ao entrar: se a conta já tem save na nuvem, ele é carregado; se não tem, o save deste aparelho é enviado.
   - Cada alteração é enviada à nuvem (agrupada a cada ~1,5 s).
   Tabela e regras de segurança: supabase/schema.sql */
(() => {
  'use strict';
  const cfg = window.CLOUD || {};
  if (!cfg.url || !cfg.anonKey) return; // sem configuração: app local, como antes

  const LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
  const KEY = 'sistema-disciplina-v2', SKIP = 'sistema-cloud-skip';
  let sb = null, user = null, pending = null, timer = null, ready = false;
  const $id = id => document.getElementById(id);

  const css = document.createElement('style');
  css.textContent = `
  #authScr{min-height:100vh;display:grid;place-items:center;padding-block:24px;
    padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
  #authScr .win{width:100%;max-width:420px;display:flex;flex-direction:column;gap:14px}
  #authScr form{display:flex;flex-direction:column;gap:10px}
  #authScr .msg{min-height:1.2em;font-size:13px;color:#ffc2c8;text-align:center}
  #authScr .msg.ok{color:#9fe8c8}
  #authScr .alt{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:13px}
  #authScr .alt button{background:none;border:0;color:var(--glow);text-decoration:underline;cursor:pointer;font:inherit;padding:0}
  #acctBox{display:flex;gap:8px;align-items:center}
  #acctBox button{background:none;border:0;color:var(--muted);text-decoration:underline;cursor:pointer;font:inherit;padding:0}
  .cloud-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#55e0b4;margin-right:4px;vertical-align:middle}
  .cloud-dot.wait{background:#ffc65c}.cloud-dot.err{background:#ff4d5e}`;
  document.head.appendChild(css);

  function loadLib() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = LIB; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  }

  function acct(state) {
    const box = $id('acctBox'); if (!box) return;
    if (!user) { box.innerHTML = sb ? `<button id="cloudLogin">Entrar para salvar na nuvem</button>` : ''; return; }
    const cls = state === 'wait' ? 'wait' : state === 'err' ? 'err' : '';
    const label = state === 'wait' ? 'salvando…' : state === 'err' ? 'sem conexão, tentando de novo' : 'salvo na nuvem';
    box.innerHTML = `<span title="${user.email}"><i class="cloud-dot ${cls}"></i>${label}</span><button id="cloudLogout">Sair</button>`;
  }

  async function push() {
    if (!user || !pending) return;
    const data = pending; pending = null; acct('wait');
    const { error } = await sb.from('saves').upsert({ user_id: user.id, data, updated_at: new Date().toISOString() });
    if (error) { pending = pending || data; acct('err'); clearTimeout(timer); timer = setTimeout(push, 8000); }
    else acct('ok');
  }
  window.onSave = st => {
    if (!user || !ready || !st || !st.p) return;
    pending = JSON.parse(JSON.stringify(st)); clearTimeout(timer); timer = setTimeout(push, 1500);
  };
  window.addEventListener('pagehide', () => { if (pending) push(); });

  async function afterLogin(boot) {
    const { data, error } = await sb.from('saves').select('data').eq('user_id', user.id).maybeSingle();
    if (!error && data && data.data && data.data.p) {
      S = data.data; try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    }
    ready = true;
    hideAuth(); boot();
    if (S && S.p && !(data && data.data)) { window.onSave(S); }
    acct('ok');
  }

  function hideAuth() { const a = $id('authScr'); if (a) a.remove(); }
  function showAuth(boot, mode = 'in') {
    hideAuth();
    const el = document.createElement('div'); el.id = 'authScr';
    const signup = mode === 'up';
    el.innerHTML = `<div class="win">
      <div class="tag c">Sistema</div>
      <p class="sys">${signup ? 'Registre-se como <b>Jogador</b>.' : 'Identifique-se, <b>Jogador</b>.'}</p>
      <form id="authForm">
        <input class="field" id="authEmail" type="email" autocomplete="email" placeholder="E-mail" required>
        <input class="field" id="authPass" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" placeholder="Senha (mínimo 6 caracteres)" minlength="6" required>
        <button class="btn solid" type="submit">${signup ? 'Criar conta' : 'Entrar'}</button>
      </form>
      <p class="msg" id="authMsg"></p>
      <div class="alt">
        <button id="authSwap">${signup ? 'Já tenho conta' : 'Criar conta'}</button>
        <button id="authSkip">Continuar sem conta</button>
      </div>
      <p class="note" style="text-align:center">Com conta, seu progresso fica salvo e abre em qualquer aparelho.</p>
    </div>`;
    $id('app').hidden = true; $id('onb').hidden = true; const bar = $id('bar'); if (bar) bar.hidden = true;
    document.body.appendChild(el);
    const msg = (t, ok) => { const m = $id('authMsg'); m.textContent = t; m.className = 'msg' + (ok ? ' ok' : ''); };
    $id('authSwap').onclick = () => showAuth(boot, signup ? 'in' : 'up');
    $id('authSkip').onclick = () => { try { localStorage.setItem(SKIP, '1'); } catch (e) {} ready = false; hideAuth(); boot(); acct(); };
    $id('authForm').onsubmit = async e => {
      e.preventDefault();
      const email = $id('authEmail').value.trim(), password = $id('authPass').value;
      msg(signup ? 'Criando conta…' : 'Entrando…', true);
      const r = signup ? await sb.auth.signUp({ email, password }) : await sb.auth.signInWithPassword({ email, password });
      if (r.error) {
        const t = r.error.message || '';
        msg(/Invalid login/i.test(t) ? 'E-mail ou senha incorretos.' : /registered/i.test(t) ? 'Este e-mail já tem conta. Toque em "Já tenho conta".' : /Email not confirmed/i.test(t) ? 'Confirme seu e-mail pelo link que enviamos e tente de novo.' : 'Não deu certo: ' + t);
        return;
      }
      if (!r.data.session) { msg('Conta criada. Abra o link que enviamos para o seu e-mail e depois entre aqui.', true); return; }
      user = r.data.session.user; try { localStorage.removeItem(SKIP); } catch (e) {}
      afterLogin(boot);
    };
  }

  window.beforeBoot = async boot => {
    try { await loadLib(); sb = window.supabase.createClient(cfg.url, cfg.anonKey); }
    catch (e) { console.warn('[cloud] não carregou; seguindo local', e); boot(); return; }
    const { data } = await sb.auth.getSession();
    if (data && data.session) { user = data.session.user; afterLogin(boot); return; }
    let skipped = false; try { skipped = !!localStorage.getItem(SKIP); } catch (e) {}
    if (skipped) { boot(); acct(); return; }
    showAuth(boot);
  };

  document.addEventListener('click', async e => {
    if (e.target.id === 'cloudLogout') {
      if (pending) await push();
      await sb.auth.signOut(); user = null; ready = false;
      try { localStorage.removeItem(KEY); localStorage.removeItem(SKIP); } catch (err) {}
      location.reload();
    }
    if (e.target.id === 'cloudLogin') { try { localStorage.removeItem(SKIP); } catch (err) {} location.reload(); }
  });
})();
