// Script pour la page Événements — Tailwind CSS
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    initEventFilters();
});

async function loadEvents() {
    try {
        const response = await fetch('data/data.json');
        const data = await response.json();

        const eventsContainer = document.getElementById('events-container');
        if (eventsContainer && data.events) {
            displayEvents(data.events, eventsContainer);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
    }
}

function displayEvents(events, container) {
    if (!events.length) {
        container.innerHTML = '<div class="col-span-full text-center py-16"><p class="text-slate-400 text-lg">Aucun événement à afficher pour le moment.</p></div>';
        return;
    }

    /* Mapping catégorie → slug filtre (correspondant aux data-filter dans events.html) */
    function getCategorySlug(category) {
        const cat = (category || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (cat.includes('sport'))      return 'sport';
        if (cat.includes('academ'))     return 'academique';
        if (cat.includes('culture') || cat.includes('culturel')) return 'culture';
        if (cat.includes('formation'))  return 'formation';
        if (cat.includes('social') || cat.includes('associativ')) return 'social';
        return cat.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    container.innerHTML = events.map(event => {
        const catSlug = getCategorySlug(event.category);
        return `
        <div class="event-item ${catSlug} group bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
            <div class="relative h-52 overflow-hidden">
                <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='assets/images/aeg.jpg'" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div class="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center shadow-card">
                    <span class="text-xs font-bold text-primary">${formatDate(event.date)}</span>
                </div>
            </div>
            <div class="p-6">
                <h4 class="font-heading text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">${event.title}</h4>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mb-3">
                    <span class="flex items-center gap-1.5"><i class="far fa-clock text-primary/60"></i> ${event.time}</span>
                    <span class="flex items-center gap-1.5"><i class="fas fa-map-marker-alt text-primary/60"></i> ${event.location}</span>
                </div>
                <p class="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">${event.description}</p>
                <div class="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div class="flex items-center gap-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">${event.category}</span>
                        <span class="text-xs font-semibold text-slate-600">${event.price} ${event.priceFor}</span>
                    </div>
                    <a href="#" class="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-700 transition-colors uppercase tracking-wider group/btn">
                        S'inscrire <i class="fas fa-arrow-right text-[9px] group-hover/btn:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </div>
        </div>`;
    }).join('');
}

function initEventFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active', 'bg-primary', 'text-white', 'border-primary'));
            filterBtns.forEach(b => { if (!b.classList.contains('active')) { b.classList.add('bg-white', 'text-slate-600', 'border-slate-200'); } });

            this.classList.add('active', 'bg-primary', 'text-white', 'border-primary');
            this.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');

            const filterValue = this.getAttribute('data-filter');
            const filterClass = filterValue.replace(/^\./, ''); // strip leading dot
            const eventItems = document.querySelectorAll('.event-item');

            eventItems.forEach(item => {
                if (filterValue === '*' || item.classList.contains(filterClass)) {
                    item.style.display = '';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => { item.style.display = 'none'; }, 300);
                }
            });
        });
    });
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}