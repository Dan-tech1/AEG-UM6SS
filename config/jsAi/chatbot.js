(function () {
  'use strict';

  /* ════════════════════════════════════════════════════
     1. INJECTION DES STYLES
  ════════════════════════════════════════════════════ */
  const STYLE = `
    /* ── Conteneur racine ── */
    #aeg-chatbot {
      position: fixed;
      left: 24px;
      bottom: 24px;
      z-index: 9999;
      font-family: 'Inter', Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    /* ── Bouton toggle professionnel ── */
    #aeg-chat-toggle {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary-color, #006B3C);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 24px rgba(0,107,60,0.38), 0 2px 8px rgba(0,0,0,0.18);
      cursor: pointer;
      border: none;
      position: relative;
      transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.3s ease;
      outline: none;
    }
    #aeg-chat-toggle:hover {
      transform: scale(1.10);
      box-shadow: 0 10px 30px rgba(0,107,60,0.45), 0 3px 10px rgba(0,0,0,0.22);
    }
    #aeg-chat-toggle:active { transform: scale(0.97); }

    #aeg-chat-toggle svg { display: block; }

    /* Point de notification animé */
    #aeg-chat-toggle .cb-notif {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 11px;
      height: 11px;
      background: var(--secondary-color, #FCD116);
      border-radius: 50%;
      border: 2px solid #fff;
      animation: cb-pulse 2s infinite;
    }
    @keyframes cb-pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50%       { transform: scale(1.35); opacity: 0.75; }
    }

    /* ── Bulle de teasing ── */
    #cb-bubble {
      background: #fff;
      color: #1a2730;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 12px 12px 12px 2px;
      box-shadow: 0 4px 18px rgba(0,0,0,0.13);
      max-width: 220px;
      line-height: 1.4;
      animation: cb-slide-in 0.35s ease;
      pointer-events: none;
      border: 1px solid rgba(0,107,60,0.12);
    }
    @keyframes cb-slide-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0);   }
    }

    /* ── Fenêtre de chat ── */
    #aeg-chat-window {
      width: 340px;
      max-width: calc(100vw - 48px);
      height: 500px;
      background: #fff;
      box-shadow: 0 12px 40px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.10);
      border-radius: 18px;
      overflow: hidden;
      display: none;
      flex-direction: column;
      animation: cb-window-in 0.28s cubic-bezier(0.4,0,0.2,1);
      border: 1px solid rgba(0,0,0,0.06);
    }
    @keyframes cb-window-in {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }

    /* ── Header ── */
    #aeg-chat-header {
      background: var(--primary-color, #006B3C);
      color: #fff;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .cb-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .cb-avatar {
      width: 36px;
      height: 36px;
      background: rgba(255,255,255,0.20);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      flex-shrink: 0;
    }
    .cb-header-info { line-height: 1.3; }
    .cb-header-info .cb-name {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    .cb-header-info .cb-status {
      font-size: 11px;
      opacity: 0.78;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .cb-status-dot {
      width: 7px;
      height: 7px;
      background: #4ade80;
      border-radius: 50%;
      display: inline-block;
    }
    .cb-header-actions {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .cb-header-actions button {
      background: rgba(255,255,255,0.18);
      border: none;
      color: #fff;
      border-radius: 8px;
      padding: 5px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .cb-header-actions button:hover { background: rgba(255,255,255,0.30); }
    #aeg-chat-close {
      width: 30px;
      height: 30px;
      padding: 0 !important;
      display: flex !important;
      align-items: center;
      justify-content: center;
      border-radius: 50% !important;
      font-size: 14px !important;
    }

    /* ── Corps messages ── */
    #aeg-chat-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px 14px;
      background: #f7f9fc;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    #aeg-chat-body::-webkit-scrollbar { width: 4px; }
    #aeg-chat-body::-webkit-scrollbar-thumb { background: #dde; border-radius: 4px; }

    .aeg-msg {
      max-width: 82%;
      padding: 9px 13px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.5;
      word-break: break-word;
    }
    .aeg-msg.bot {
      background: #fff;
      color: #1a2730;
      border: 1px solid #eaebef;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .aeg-msg.user {
      background: var(--primary-color, #006B3C);
      color: #fff;
      border-bottom-right-radius: 4px;
      align-self: flex-end;
    }

    /* ── Indicateur de frappe ── */
    .cb-typing {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 11px 14px;
      background: #fff;
      border: 1px solid #eaebef;
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }
    .cb-typing span {
      width: 7px;
      height: 7px;
      background: #adb5bd;
      border-radius: 50%;
      animation: cb-dot 1.2s infinite;
    }
    .cb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cb-dot {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
      40%           { transform: translateY(-5px); opacity: 1; }
    }

    .aeg-btn {
      display: inline-block;
      padding: 6px 12px;
      margin-top: 8px;
      border-radius: 20px;
      background: var(--primary-color, #006B3C);
      color: #fff;
      font-size: 12.5px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      text-decoration: none;
    }

    /* ── Formulaire adhésion ── */
    #aeg-enroll {
      display: none;
      padding: 14px;
      background: #fff;
      border-top: 1px solid #eee;
      flex-shrink: 0;
    }
    #aeg-enroll h4 { margin: 0 0 10px; font-size: 14px; color: var(--primary-color,#006B3C); }
    #aeg-enroll input,
    #aeg-enroll textarea,
    #aeg-enroll select {
      width: 100%;
      padding: 8px 10px;
      margin-bottom: 8px;
      border: 1px solid #dde;
      border-radius: 8px;
      font-size: 13px;
      outline: none;
      background: #f7f9fc;
      color: #1a2730;
      font-family: inherit;
    }
    #aeg-enroll input:focus,
    #aeg-enroll textarea:focus,
    #aeg-enroll select:focus { border-color: var(--primary-color,#006B3C); }
    #aeg-enroll .cb-enroll-actions { display: flex; gap: 8px; }
    #en-submit {
      background: var(--primary-color,#006B3C);
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    #en-cancel {
      background: #e5e7eb;
      color: #444;
      border: none;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 13px;
      cursor: pointer;
    }

    /* ── Pied de page ── */
    #aeg-chat-footer {
      padding: 10px 12px;
      border-top: 1px solid #eee;
      display: flex;
      gap: 8px;
      align-items: center;
      background: #fff;
      flex-shrink: 0;
    }
    #aeg-chat-input {
      flex: 1;
      padding: 9px 14px;
      border-radius: 22px;
      border: 1.5px solid #dde;
      outline: none;
      font-size: 13px;
      font-family: inherit;
      color: #1a2730;
      background: #f7f9fc;
      transition: border-color 0.2s;
    }
    #aeg-chat-input:focus { border-color: var(--primary-color,#006B3C); background:#fff; }
    #aeg-chat-send {
      background: var(--primary-color,#006B3C);
      color: #fff;
      border: none;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s;
    }
    #aeg-chat-send:hover { transform: scale(1.08); }

    /* ── Dark theme ── */
    body.dark-theme #aeg-chat-window { background: #1e2330; border-color: #2e3443; }
    body.dark-theme #aeg-chat-body   { background: #151820; }
    body.dark-theme .aeg-msg.bot     { background: #1e2330; color: #e8edf4; border-color: #2e3443; }
    body.dark-theme #aeg-chat-footer { background: #1e2330; border-color: #2e3443; }
    body.dark-theme #aeg-chat-input  { background: #151820; border-color: #2e3443; color: #e8edf4; }
    body.dark-theme #aeg-enroll      { background: #1e2330; border-color: #2e3443; }
    body.dark-theme #aeg-enroll input,
    body.dark-theme #aeg-enroll textarea,
    body.dark-theme #aeg-enroll select { background: #151820; border-color: #2e3443; color: #e8edf4; }
    body.dark-theme #cb-bubble { background: #1e2330; color: #e8edf4; border-color: #2e3443; }

    /* ── Responsive ── */
    @media (max-width: 480px) {
      #aeg-chatbot { left: 14px; bottom: 16px; }
      #aeg-chat-window { width: calc(100vw - 28px); height: 480px; }
      #aeg-chat-toggle { width: 54px; height: 54px; }
    }
  `;

  /* ════════════════════════════════════════════════════
     2. INJECTION HTML
  ════════════════════════════════════════════════════ */
  const HTML = `
    <div id="aeg-chatbot" aria-live="polite">

      <!-- Fenêtre de chat -->
      <div id="aeg-chat-window" role="dialog" aria-label="Assistant AEG" aria-modal="true">

        <div id="aeg-chat-header">
          <div class="cb-header-left">
            <div class="cb-avatar">🤝</div>
            <div class="cb-header-info">
              <div class="cb-name">Assistant AEG-UM6SS</div>
              <div class="cb-status">
                <span class="cb-status-dot"></span>En ligne — Répond instantanément
              </div>
            </div>
          </div>
          <div class="cb-header-actions">
            <button id="aeg-open-enroll" title="Formulaire d'adhésion">
              <i class="fas fa-user-plus"></i> S'inscrire
            </button>
            <button id="aeg-chat-close" aria-label="Fermer">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div id="aeg-chat-body" role="log">
          <div class="aeg-msg bot">
            👋 Bonjour ! Je suis l'assistant de l'AEG-UM6SS.<br>
            Je peux répondre à vos questions sur l'association, les études de santé, ou vous aider à adhérer. Comment puis-je vous aider ?
          </div>
        </div>

        <!-- Formulaire adhésion -->
        <div id="aeg-enroll">
          <h4><i class="fas fa-user-plus" style="margin-right:6px"></i>Formulaire d'adhésion</h4>
          <input id="en-name"  placeholder="Nom complet *" />
          <input id="en-email" placeholder="Email *" type="email" />
          <select id="en-program">
            <option value="">Choisir le programme</option>
            <option>Médecine</option>
            <option>Orthophonie</option>
            <option>Biomédical</option>
            <option>Pharmacie</option>
            <option>Autre</option>
          </select>
          <input id="en-year" placeholder="Année d'étude (ex: 1ère année)" />
          <textarea id="en-note" rows="2" placeholder="Message optionnel…"></textarea>
          <div class="cb-enroll-actions">
            <button id="en-submit"><i class="fas fa-paper-plane" style="margin-right:5px"></i>Envoyer</button>
            <button id="en-cancel">Annuler</button>
          </div>
        </div>

        <div id="aeg-chat-footer">
          <input id="aeg-chat-input" placeholder="Écrivez votre message…" aria-label="Message" />
          <button id="aeg-chat-send" aria-label="Envoyer">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Bulle de teasing -->
      <div id="cb-bubble" style="display:none">💬 Une question ? Je suis là !</div>

      <!-- Bouton flottant -->
      <button id="aeg-chat-toggle" aria-label="Ouvrir l'assistant AEG" aria-expanded="false">
        <svg id="cb-icon-open" width="28" height="28" viewBox="0 0 32 32" fill="none">
          <path d="M16 3C9.37 3 4 7.71 4 13.5c0 2.8 1.26 5.35 3.32 7.2l-.94 5.24a.5.5 0 0 0 .73.53L13 23.2c.96.2 1.96.3 3 .3 6.63 0 12-4.71 12-10.5S22.63 3 16 3z" fill="#fff" fill-opacity=".95"/>
          <circle cx="10.5" cy="13.5" r="1.5" fill="var(--primary-color,#006B3C)"/>
          <circle cx="16"   cy="13.5" r="1.5" fill="var(--primary-color,#006B3C)"/>
          <circle cx="21.5" cy="13.5" r="1.5" fill="var(--primary-color,#006B3C)"/>
        </svg>
        <!-- Icône X -->
        <svg id="cb-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" style="display:none">
          <path d="M18 6L6 18M6 6l12 12" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <span class="cb-notif" id="cb-notif"></span>
      </button>
    </div>
  `;

  /* ════════════════════════════════════════════════════
     3. INSERTION DANS LE DOM
  ════════════════════════════════════════════════════ */
  function mount() {
    const styleEl = document.createElement('style');
    styleEl.textContent = STYLE;
    document.head.appendChild(styleEl);

    const tmp = document.createElement('div');
    tmp.innerHTML = HTML;
    while (tmp.firstChild) document.body.appendChild(tmp.firstChild);

    initLogic();
    initCycle();
  }

  /* ════════════════════════════════════════════════════
     4. CYCLE VISIBILITÉ : 60 s visible → 30 s caché → boucle
  ════════════════════════════════════════════════════ */
  function initCycle() {
    const SHOW_MS  = 60_000; // 1 minute
    const HIDE_MS  = 30_000; // 30 secondes

    const toggle   = document.getElementById('aeg-chat-toggle');
    const bubble   = document.getElementById('cb-bubble');
    const windowEl = document.getElementById('aeg-chat-window');

    let bubbleTimer = null;

    function showChatbot() {
      toggle.style.opacity  = '1';
      toggle.style.pointerEvents = 'auto';
      toggle.style.transform = 'scale(1)';
      toggle.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

      /* Bulle de teasing après 2 s si fenêtre fermée */
      bubbleTimer = setTimeout(function () {
        if (windowEl.style.display !== 'flex') {
          bubble.style.display = 'block';
        }
      }, 2000);
    }

    function hideChatbot() {
      /* Ne pas masquer si l'utilisateur est en train de chatter */
      if (windowEl.style.display === 'flex') {
        /* Reporter le cycle */
        setTimeout(runCycle, SHOW_MS);
        return;
      }
      clearTimeout(bubbleTimer);
      bubble.style.display = 'none';
      toggle.style.opacity = '0';
      toggle.style.pointerEvents = 'none';
      toggle.style.transform = 'scale(0.7)';

      setTimeout(showChatbot, HIDE_MS);
    }

    function runCycle() {
      showChatbot();
      setTimeout(hideChatbot, SHOW_MS);
    }

    /* Masquer la bulle sur click */
    document.getElementById('aeg-chat-toggle').addEventListener('click', function () {
      bubble.style.display = 'none';
      clearTimeout(bubbleTimer);
    });

    runCycle();
  }

  /* ════════════════════════════════════════════════════
     5. LOGIQUE CHATBOT
  ════════════════════════════════════════════════════ */
  function initLogic() {
    const toggle      = document.getElementById('aeg-chat-toggle');
    const windowEl    = document.getElementById('aeg-chat-window');
    const closeBtn    = document.getElementById('aeg-chat-close');
    const body        = document.getElementById('aeg-chat-body');
    const input       = document.getElementById('aeg-chat-input');
    const sendBtn     = document.getElementById('aeg-chat-send');
    const openEnroll  = document.getElementById('aeg-open-enroll');
    const enrollSec   = document.getElementById('aeg-enroll');
    const enSubmit    = document.getElementById('en-submit');
    const enCancel    = document.getElementById('en-cancel');
    const iconOpen    = document.getElementById('cb-icon-open');
    const iconClose   = document.getElementById('cb-icon-close');
    const notifDot    = document.getElementById('cb-notif');

    /* ── Ouvrir / fermer ── */
    function showWindow() {
      windowEl.style.display = 'flex';
      windowEl.style.flexDirection = 'column';
      toggle.setAttribute('aria-expanded', 'true');
      iconOpen.style.display  = 'none';
      iconClose.style.display = 'block';
      notifDot.style.display  = 'none';
      input.focus();
    }
    function hideWindow() {
      windowEl.style.display = 'none';
      enrollSec.style.display = 'none';
      toggle.setAttribute('aria-expanded', 'false');
      iconOpen.style.display  = 'block';
      iconClose.style.display = 'none';
    }

    toggle.addEventListener('click', function () {
      windowEl.style.display === 'flex' ? hideWindow() : showWindow();
    });
    closeBtn.addEventListener('click', hideWindow);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && windowEl.style.display === 'flex') hideWindow();
    });

    /* ── Formulaire adhésion ── */
    openEnroll.addEventListener('click', function () {
      enrollSec.style.display = 'block';
      body.scrollTop = body.scrollHeight;
    });
    enCancel.addEventListener('click', function () {
      enrollSec.style.display = 'none';
    });
    enSubmit.addEventListener('click', function () {
      const name    = document.getElementById('en-name').value.trim();
      const email   = document.getElementById('en-email').value.trim();
      const program = document.getElementById('en-program').value;
      const year    = document.getElementById('en-year').value.trim();
      const note    = document.getElementById('en-note').value.trim();
      if (!name || !email) {
        alert('Veuillez renseigner votre nom et email.');
        return;
      }
      const entry = { name, email, program, year, note, ts: new Date().toISOString() };
      const list  = JSON.parse(localStorage.getItem('aeg_enrollments') || '[]');
      list.push(entry);
      localStorage.setItem('aeg_enrollments', JSON.stringify(list));
      enrollSec.style.display = 'none';
      /* Réinitialiser les champs */
      ['en-name','en-email','en-year','en-note'].forEach(function(id){
        document.getElementById(id).value = '';
      });
      document.getElementById('en-program').value = '';
      addMessage(`✅ Merci <strong>${escapeHtml(name)}</strong> ! Votre demande d'adhésion a bien été enregistrée. Nous vous contacterons très bientôt.`, 'bot', true);
    });

    /* ── Ajouter un message ── */
    function addMessage(text, who, html) {
      const el = document.createElement('div');
      el.className = 'aeg-msg ' + (who === 'user' ? 'user' : 'bot');
      if (html) el.innerHTML = text;
      else el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      return el;
    }

    /* ── Indicateur de frappe ── */
    function showTyping() {
      const el = document.createElement('div');
      el.className = 'cb-typing';
      el.id = 'cb-typing-indicator';
      el.innerHTML = '<span></span><span></span><span></span>';
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }
    function hideTyping() {
      const el = document.getElementById('cb-typing-indicator');
      if (el) el.remove();
    }

    /* ── Logique de réponse ── */
    async function handleUserMessage(text) {
      if (!text.trim()) return;
      addMessage(text, 'user');
      input.value = '';

      const lower = text.toLowerCase();

      /* Délai simulé + indicateur */
      showTyping();
      await delay(900);
      hideTyping();

      /* ── Intents ── */
      if (/inscri|adhér|s'inscr|je veux m|inscription|adhésion|rejoindre/.test(lower)) {
        addMessage(`Je peux vous aider à rejoindre l'AEG ! Cliquez ci-dessous pour remplir le formulaire.`, 'bot');
        const btn = document.createElement('button');
        btn.className = 'aeg-btn';
        btn.innerHTML = '<i class="fas fa-user-plus" style="margin-right:5px"></i>Formulaire d\'adhésion';
        btn.onclick = function () { enrollSec.style.display = 'block'; body.scrollTop = body.scrollHeight; };
        body.appendChild(btn);
        body.scrollTop = body.scrollHeight;
        return;
      }

      if (/bonjour|salut|bonsoir|hello|coucou|hey/.test(lower)) {
        addMessage(`Bonjour ! 😊 Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur l'AEG-UM6SS, les études de santé, ou demander à vous inscrire.`, 'bot');
        return;
      }

      if (/merci|thank|super|excellent|parfait/.test(lower)) {
        addMessage(`Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions.`, 'bot');
        return;
      }

      if (/contact|email|téléphone|joindre/.test(lower)) {
        addMessage('📞 Vous pouvez nous contacter :\n✉️ aegum6ss@gmail.com\n📱 (+212) 778 856 692\n📍 UM6SS, Casablanca', 'bot');
        return;
      }

      if (/activité|événement|programme|agenda/.test(lower)) {
        addMessage(`🗓️ Consultez notre page Activités pour le calendrier complet ! Nous organisons des événements culturels, académiques et sportifs toute l'année.`, 'bot', true);
        const btn = document.createElement('a');
        btn.className = 'aeg-btn';
        btn.href = 'activities.html';
        btn.innerHTML = '<i class="fas fa-calendar" style="margin-right:5px"></i>Voir les activités';
        body.appendChild(btn);
        body.scrollTop = body.scrollHeight;
        return;
      }

      if (/qui|aeg|association|présidant|bureau/.test(lower)) {
        addMessage(`🇬🇦 L'AEG-UM6SS est l'Association des Étudiants Gabonais de l'Université Mohammed VI des Sciences et de la Santé. Nous soutenons les étudiants gabonais dans leur intégration académique, culturelle et sociale au Maroc.`, 'bot');
        return;
      }

      /* Fallback Wikipedia */
      addMessage('Je cherche des informations…', 'bot');
      try {
        const query = encodeURIComponent(text);
        const sres = await fetch(
          'https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + query + '&format=json&origin=*'
        ).then(function(r){ return r.json(); });

        if (sres && sres.query && sres.query.search && sres.query.search.length > 0) {
          const first = sres.query.search[0].title;
          const sum = await fetch(
            'https://fr.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(first)
          ).then(function(r){ return r.json(); });

          if (sum && sum.extract) {
            /* Retrait du dernier message "Je cherche…" */
            const msgs = body.querySelectorAll('.aeg-msg.bot');
            if (msgs.length) msgs[msgs.length - 1].remove();

            const extract = sum.extract.substring(0, 900);
            const pageUrl = (sum.content_urls && sum.content_urls.desktop && sum.content_urls.desktop.page)
              ? sum.content_urls.desktop.page
              : 'https://fr.wikipedia.org/wiki/' + encodeURIComponent(first);

            addMessage('<strong>' + escapeHtml(sum.title) + '</strong><br><br>' + escapeHtml(extract) + '…'
              + '<br><br><a class="aeg-btn" href="' + pageUrl + '" target="_blank" rel="noopener">'
              + '<i class="fas fa-external-link-alt" style="margin-right:5px"></i>Voir la source</a>', 'bot', true);
            addMessage(`Avez-vous d'autres questions, ou souhaitez-vous vous inscrire à l'AEG ?`, 'bot');
            return;
          }
        }
        /* Retrait message "Je cherche…" */
        const msgs = body.querySelectorAll('.aeg-msg.bot');
        if (msgs.length) msgs[msgs.length - 1].remove();
        addMessage(`Je n'ai pas trouvé d'information précise sur ce sujet. Essayez une autre formulation ou contactez-nous directement.`, 'bot');
      } catch (err) {
        const msgs = body.querySelectorAll('.aeg-msg.bot');
        if (msgs.length) msgs[msgs.length - 1].remove();
        addMessage('Une erreur est survenue. Veuillez réessayer ou contacter : aegum6ss@gmail.com', 'bot');
      }
    }

    function delay(ms) {
      return new Promise(function(resolve){ setTimeout(resolve, ms); });
    }
    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function(c){
        return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
      });
    }

    /* ── Envoi ── */
    sendBtn.addEventListener('click', function () { handleUserMessage(input.value); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); handleUserMessage(input.value); }
    });
  }

  /* ════════════════════════════════════════════════════
     6. DÉMARRAGE
  ════════════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
