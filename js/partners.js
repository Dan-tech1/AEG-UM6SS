// partners.js - Script pour charger les partenaires depuis data.json
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
            <div class="no-partners">
                <p>Aucun partenaire à afficher pour le moment.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = partners.map(partner => `
        <div class="partner-item" data-partner-id="${partner.id}">
            <div class="partner-logo">
                <img src="${partner.logo}" alt="${partner.name}" 
                     onerror="this.src='assets/images/placeholder-partner.jpg'; this.alt='Image non disponible'">
            </div>
            <div class="partner-info">
                <h4>${partner.name}</h4>
                <p>${partner.description}</p>
                <span class="partner-type">${getPartnerType(partner.name)}</span>
            </div>
        </div>
    `).join('');
    
    // Ajouter les événements de clic
    addPartnerClickEvents();
}

function getPartnerType(partnerName) {
    const typeMapping = {
        'Ambassade': 'Institutionnel',
        'UM6SS': 'Académique',
        'Ministère': 'Gouvernemental',
        'Association': 'Associatif',
        'Office': 'Institutionnel',
        'Club': 'Culturel',
        'Médicale': 'Professionnel'
    };
    
    for (const [key, value] of Object.entries(typeMapping)) {
        if (partnerName.includes(key)) {
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
            // Vous pouvez ajouter ici une fonction pour afficher plus de détails
            console.log('Partenaire cliqué:', partnerId);
        });
    });
}

function displayError() {
    const container = document.getElementById('partners-container');
    container.innerHTML = `
        <div class="error-partners">
            <i class="fa fa-exclamation-triangle"></i>
            <p>Erreur lors du chargement des partenaires.</p>
            <button onclick="loadPartners()" class="site-btn">Réessayer</button>
        </div>
    `;
}

// Fonction pour filtrer les partenaires par type (optionnel)
function filterPartners(type) {
    const partners = document.querySelectorAll('.partner-item');
    partners.forEach(partner => {
        const partnerType = partner.querySelector('.partner-type').textContent;
        if (type === 'all' || partnerType === type) {
            partner.style.display = 'block';
        } else {
            partner.style.display = 'none';
        }
    });
}