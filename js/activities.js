// Script pour la page Activités
document.addEventListener('DOMContentLoaded', function() {
    initActivitiesCalendar();
});

function initActivitiesCalendar() {
    const calendarContainer = document.getElementById('activities-calendar');
    
    // Simulation d'un calendrier simple
    const today = new Date();
    const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    
    const calendarHTML = `
        <div class="calendar-header">
            <h4>${monthNames[today.getMonth()]} ${today.getFullYear()}</h4>
        </div>
        <div class="calendar-grid">
            <div class="calendar-day">Lun</div>
            <div class="calendar-day">Mar</div>
            <div class="calendar-day">Mer</div>
            <div class="calendar-day">Jeu</div>
            <div class="calendar-day">Ven</div>
            <div class="calendar-day">Sam</div>
            <div class="calendar-day">Dim</div>
            
            ${generateCalendarDays(today)}
        </div>
        <div class="calendar-legend">
            <div class="legend-item">
                <span class="legend-color culture"></span>
                <span>Culturel</span>
            </div>
            <div class="legend-item">
                <span class="legend-color academique"></span>
                <span>Académique</span>
            </div>
            <div class="legend-item">
                <span class="legend-color sport"></span>
                <span>Sportif</span>
            </div>
        </div>
    `;
    
    calendarContainer.innerHTML = calendarHTML;
}

function generateCalendarDays(date) {
    let daysHTML = '';
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    // Jours vides au début
    for (let i = 0; i < firstDay.getDay(); i++) {
        daysHTML += '<div class="calendar-date empty"></div>';
    }
    
    // Jours du mois
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const hasEvent = Math.random() > 0.7; // Simulation d'événements
        const eventType = hasEvent ? ['culture', 'academique', 'sport'][Math.floor(Math.random() * 3)] : '';
        
        daysHTML += `
            <div class="calendar-date ${hasEvent ? 'has-event ' + eventType : ''}">
                ${i}
                ${hasEvent ? '<div class="event-dot"></div>' : ''}
            </div>
        `;
    }
    
    return daysHTML;
}