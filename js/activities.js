// ===== CALENDRIER DES ACTIVITÉS — AEG-UM6SS =====
(function () {
    'use strict';

    /* ── Données des événements ── */
    const EVENTS = [
        /* Février 2026 */
        { date: '2026-02-07', title: 'Soirée Culturelle Gabonaise', type: 'culture',    time: '19h00', icon: 'fa-masks-theater' },
        { date: '2026-02-14', title: 'Tournoi de Football Inter-Assos', type: 'sport',   time: '15h00', icon: 'fa-futbol' },
        { date: '2026-02-21', title: 'Séminaire : Médecine Tropicale',  type: 'academique', time: '10h00', icon: 'fa-graduation-cap' },
        { date: '2026-02-28', title: 'Atelier Danses Traditionnelles',  type: 'culture',    time: '18h00', icon: 'fa-music' },
        /* Mars 2026 */
        { date: '2026-03-07', title: 'Session Tutorat Intensif',        type: 'academique', time: '09h00', icon: 'fa-pen' },
        { date: '2026-03-14', title: 'Marathon Universitaire',          type: 'sport',      time: '08h30', icon: 'fa-person-running' },
        { date: '2026-03-21', title: 'Exposition Artistique AEG',       type: 'culture',    time: '17h00', icon: 'fa-palette' },
        { date: '2026-03-28', title: 'Conférence : Santé & Gabon',      type: 'academique', time: '14h00', icon: 'fa-microphone' },
        /* Avril 2026 */
        { date: '2026-04-04', title: 'Tournoi de Basketball',           type: 'sport',      time: '16h00', icon: 'fa-basketball' },
        { date: '2026-04-11', title: 'Journée Culturelle Gabonaise',    type: 'culture',    time: '12h00', icon: 'fa-star' },
        { date: '2026-04-18', title: 'Préparation aux Examens',         type: 'academique', time: '09h00', icon: 'fa-clipboard-list' },
        { date: '2026-04-25', title: 'Rencontre Inter-Associations',    type: 'culture',    time: '18h30', icon: 'fa-handshake' },
        /* Mai 2026 */
        { date: '2026-05-02', title: 'Session de Révision Groupée',     type: 'academique', time: '10h00', icon: 'fa-book' },
        { date: '2026-05-09', title: 'Tournoi de Volleyball',           type: 'sport',      time: '15h00', icon: 'fa-volleyball' },
        { date: '2026-05-16', title: 'Gastronomie Gabonaise',           type: 'culture',    time: '19h00', icon: 'fa-utensils' },
        { date: '2026-05-23', title: 'Atelier Langues Africaines',      type: 'academique', time: '11h00', icon: 'fa-language' },
    ];

    const MONTH_NAMES = [
        'Janvier','Février','Mars','Avril','Mai','Juin',
        'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
    ];
    const SHORT_MONTHS = [
        'Jan','Fév','Mar','Avr','Mai','Jun',
        'Jul','Aoû','Sep','Oct','Nov','Déc'
    ];

    /* ── État courant ── */
    const today = new Date();
    let currentYear  = today.getFullYear();
    let currentMonth = today.getMonth(); // 0-indexed

    /* ── Utilitaires ── */
    function pad(n) { return String(n).padStart(2, '0'); }
    function dateKey(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

    function eventsForMonth(year, month) {
        const prefix = `${year}-${pad(month + 1)}-`;
        return EVENTS.filter(e => e.date.startsWith(prefix));
    }

    /* ── Rendu du calendrier ── */
    function renderCalendar() {
        const grid  = document.getElementById('cal-grid');
        const title = document.getElementById('cal-month-title');
        if (!grid || !title) return;

        title.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;

        /* Première cellule = Lundi → 0, correction de getDay (0=dim) */
        const firstDate = new Date(currentYear, currentMonth, 1);
        const lastDate  = new Date(currentYear, currentMonth + 1, 0);
        let startDow    = firstDate.getDay(); // 0=dim
        startDow = startDow === 0 ? 6 : startDow - 1; // 0=lun

        /* Construire un dict date→events */
        const eventMap = {};
        EVENTS.forEach(e => {
            if (!eventMap[e.date]) eventMap[e.date] = [];
            eventMap[e.date].push(e);
        });

        let html = '';

        /* Cases vides avant le 1er */
        for (let i = 0; i < startDow; i++) {
            html += '<div class="cal-cell cal-empty"></div>';
        }

        /* Jours du mois */
        for (let d = 1; d <= lastDate.getDate(); d++) {
            const key      = dateKey(currentYear, currentMonth, d);
            const dayEvents = eventMap[key] || [];
            const isToday  = (d === today.getDate()
                           && currentMonth === today.getMonth()
                           && currentYear  === today.getFullYear());
            const dow = new Date(currentYear, currentMonth, d).getDay();
            const isWeekend = (dow === 0 || dow === 6);

            let cls = 'cal-cell';
            if (isToday)           cls += ' cal-today';
            if (dayEvents.length)  cls += ' cal-has-event';
            if (isWeekend && !isToday) cls += ' cal-weekend-day';

            /* Dots (max 3) */
            const dots = dayEvents.slice(0, 3).map(ev =>
                `<span class="cal-dot ${ev.type}"></span>`
            ).join('');

            html += `
              <div class="${cls}" data-date="${key}" tabindex="${dayEvents.length ? 0 : -1}" role="${dayEvents.length ? 'button' : 'presentation'}" aria-label="${dayEvents.length ? `${d} — ${dayEvents.length} événement(s)` : d}">
                <span>${d}</span>
                ${dots ? `<div class="cal-dots">${dots}</div>` : ''}
              </div>`;
        }

        grid.innerHTML = html;

        /* Clic sur un jour avec événements */
        grid.querySelectorAll('.cal-cell.cal-has-event').forEach(cell => {
            cell.addEventListener('click', function () {
                grid.querySelectorAll('.cal-selected').forEach(c => c.classList.remove('cal-selected'));
                this.classList.add('cal-selected');
                const key = this.dataset.date;
                renderEventPanel(eventMap[key] || [], true);
            });
            cell.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
            });
        });

        /* Panneau par défaut : tous les événements du mois */
        renderEventPanel(eventsForMonth(currentYear, currentMonth), false);
    }

    /* ── Panneau d'événements à droite ── */
    function renderEventPanel(events, selectedDay) {
        const list    = document.getElementById('cal-events-list');
        const noEvts  = document.getElementById('cal-no-events');
        const panTitle = document.getElementById('cal-events-title');
        if (!list) return;

        if (panTitle) {
            const span = panTitle.querySelector('span');
            if (span) span.textContent = selectedDay ? 'Événements du jour' : 'Événements du mois';
        }

        if (!events.length) {
            list.innerHTML = '';
            list.style.display = 'none';
            if (noEvts) noEvts.style.display = 'block';
            return;
        }

        if (noEvts) noEvts.style.display = 'none';
        list.style.display = 'flex';

        list.innerHTML = events.map(ev => {
            const parts = ev.date.split('-');
            const day   = parseInt(parts[2], 10);
            const mon   = SHORT_MONTHS[parseInt(parts[1], 10) - 1];
            return `
              <li class="cal-event-item">
                <div class="cal-event-date-badge">
                  <span class="cal-badge-day">${day}</span>
                  <span class="cal-badge-month">${mon}</span>
                </div>
                <div class="cal-event-info">
                  <h6>${ev.title}</h6>
                  <div class="cal-event-meta">
                    <span class="cal-event-time"><i class="fas fa-clock"></i>${ev.time}</span>
                    <span class="cal-event-tag ${ev.type}">${ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}</span>
                  </div>
                </div>
              </li>`;
        }).join('');
    }

    /* ── Navigation ── */
    function bindNav() {
        const btnPrev = document.getElementById('cal-prev');
        const btnNext = document.getElementById('cal-next');
        if (btnPrev) {
            btnPrev.addEventListener('click', function () {
                currentMonth--;
                if (currentMonth < 0) { currentMonth = 11; currentYear--; }
                // Désélectionner
                document.querySelectorAll('#cal-grid .cal-selected')
                    .forEach(c => c.classList.remove('cal-selected'));
                renderCalendar();
            });
        }
        if (btnNext) {
            btnNext.addEventListener('click', function () {
                currentMonth++;
                if (currentMonth > 11) { currentMonth = 0; currentYear++; }
                document.querySelectorAll('#cal-grid .cal-selected')
                    .forEach(c => c.classList.remove('cal-selected'));
                renderCalendar();
            });
        }
    }

    /* ── Init ── */
    function init() {
        renderCalendar();
        bindNav();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
