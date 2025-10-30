// Script pour la page Événements
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
        container.innerHTML = '<div class="col-12 text-center"><p class="no-events">Aucun événement à afficher pour le moment.</p></div>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="col-lg-6 event-item ${event.category}">
            <div class="event-item-inner">
                <div class="event-thumb">
                    <img src="${event.image}" alt="${event.title}">
                    <div class="event-date">
                        <span>${formatDate(event.date)}</span>
                    </div>
                </div>
                <div class="event-info">
                    <h4>${event.title}</h4>
                    <p><i class="fa fa-clock-o"></i> ${event.time} <i class="fa fa-map-marker"></i> ${event.location}</p>
                    <p>${event.description}</p>
                    <div class="event-meta">
                        <span class="event-category ${event.category}">${event.category.toUpperCase()}</span>
                        <span class="event-price">${event.price} ${event.priceFor}</span>
                    </div>
                    <a href="#" class="event-readmore">S'INSCRIRE <i class="fa fa-angle-double-right"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

function initEventFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const eventItems = document.querySelectorAll('.event-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            eventItems.forEach(item => {
                if (filterValue === '*' || item.classList.contains(filterValue)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}