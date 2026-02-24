// Script pour la page À propos — Tailwind CSS
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
                <div class="team-member group bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden hover:shadow-glow hover:-translate-y-1.5 transition-all duration-300">
                    <div class="relative h-56 overflow-hidden">
                        <img src="${member.image}" alt="${member.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='assets/images/aeg.jpg'" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div class="p-5 text-center">
                        <h5 class="font-heading text-[15px] font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">${member.name}</h5>
                        <div class="inline-flex items-center gap-1.5 bg-primary/8 text-primary text-[10px] font-bold uppercase tracking-[1px] px-3 py-1 rounded-full mb-3">${member.position}</div>
                        <p class="text-xs text-slate-400 leading-relaxed mb-3">${member.description}</p>
                        <a href="mailto:${member.email}" class="inline-flex items-center gap-1.5 text-xs font-medium text-primary/70 hover:text-primary transition-colors">
                            <i class="far fa-envelope text-[11px]"></i> ${member.email}
                        </a>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des membres:', error);
    }
}