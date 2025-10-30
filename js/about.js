// Script pour la page À propos
document.addEventListener('DOMContentLoaded', function() {
    loadTeamMembers();
});

async function loadTeamMembers() {
    try {
        const response = await fetch('data/data.json');
        const data = await response.json();
        
        const teamContainer = document.getElementById('team-container');
        if (teamContainer && data.team) {
            teamContainer.innerHTML = data.team.map(member => `
                <div class="col-lg-3 col-md-6">
                    <div class="team-member">
                        <div class="team-img">
                            <img src="${member.image}" alt="${member.name}">
                        </div>
                        <div class="team-info">
                            <h5>${member.name}</h5>
                            <div class="team-position">${member.position}</div>
                            <p>${member.description}</p>
                            <a href="mailto:${member.email}" class="team-email">${member.email}</a>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des membres:', error);
    }
}