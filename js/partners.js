// partners.js — Tailwind CSS
document.addEventListener('DOMContentLoaded', function() {
    loadPartners();
});

async function loadPartners() {
    try {
        const response = await fetch('data/data.json');
        const data = await response.json();

        const partnersContainer = document.getElementById('partners-container');
        if (partnersContainer && data.partners) {
            displayPartners(data.partners, partnersContainer);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des partenaires:', error);
        displayError();
    }
}

function displayPartners(partners, container) {
    if (!partners || !partners.length) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-slate-400 text-lg">Aucun partenaire à afficher pour le moment.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = partners.map(partner => `
        <div class="partner-item group bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden hover:shadow-glow hover:-translate-y-1.5 transition-all duration-300 cursor-pointer" data-partner-id="${partner.id}">
            <div class="relative h-44 bg-surface-50 flex items-center justify-center p-6 overflow-hidden">
                <img src="${partner.logo}" alt="${partner.name}" class="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500" onerror="this.src='assets/images/aeg.jpg'; this.alt='Image non disponible'" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-5">
                <h4 class="font-heading text-sm font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">${partner.name}</h4>
                <p class="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">${partner.description}</p>
                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/8 text-primary">${getPartnerType(partner.name)}</span>
            </div>
        </div>
    `).join('');

    addPartnerClickEvents();
}

function getPartnerType(partnerName) {
    const typeMapping = {
        'Ambassade': 'Institutionnel',
        'UM6SS': 'Académique',
        'UNIVERSITÉ': 'Académique',
        'Ministère': 'Gouvernemental',
        'Association': 'Associatif',
        'Office': 'Institutionnel',
        'Club': 'Culturel',
        'Médicale': 'Professionnel',
        'SMART': 'Partenaire',
        'Systèmes': 'Technologie'
    };

    for (const [key, value] of Object.entries(typeMapping)) {
        if (partnerName.toUpperCase().includes(key.toUpperCase())) {
            return value;
        }
    }
    return 'Partenaire';
}

function addPartnerClickEvents() {
    const partnerItems = document.querySelectorAll('.partner-item');
    partnerItems.forEach(item => {
        item.addEventListener('click', function() {
            const partnerId = this.getAttribute('data-partner-id');
            console.log('Partenaire cliqué:', partnerId);
        });
    });
}

function displayError() {
    const container = document.getElementById('partners-container');
    if (!container) return;
    container.innerHTML = `
        <div class="col-span-full text-center py-16">
            <div class="w-16 h-16 bg-coral/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-exclamation-triangle text-2xl text-coral"></i>
            </div>
            <p class="text-slate-500 text-base mb-4">Erreur lors du chargement des partenaires.</p>
            <button onclick="loadPartners()" class="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-700 transition-colors shadow-card hover:shadow-glow">
                <i class="fas fa-redo text-xs"></i> Réessayer
            </button>
        </div>
    `;
}

function filterPartners(type) {
    const partners = document.querySelectorAll('.partner-item');
    partners.forEach(partner => {
        const partnerType = partner.querySelector('.text-primary').textContent;
        if (type === 'all' || partnerType === type) {
            partner.style.display = '';
        } else {
            partner.style.display = 'none';
        }
    });
}