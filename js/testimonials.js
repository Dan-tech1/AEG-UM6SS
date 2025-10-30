// testimonials.js - Script pour charger les témoignages
document.addEventListener('DOMContentLoaded', function() {
    loadTestimonials();
});

async function loadTestimonials() {
    try {
        const response = await fetch('data/data.json');
        const data = await response.json();
        
        const testimonialsContainer = document.getElementById('testimonials-container');
        if (testimonialsContainer && data.testimonials) {
            displayTestimonials(data.testimonials, testimonialsContainer);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des témoignages:', error);
    }
}

function displayTestimonials(testimonials, container) {
    if (!testimonials || !testimonials.length) {
        container.innerHTML = '<p class="no-testimonials">Aucun témoignage à afficher pour le moment.</p>';
        return;
    }
    
    // Version slider (pour l'accueil)
    if (container.classList.contains('testimonials-slider')) {
        container.innerHTML = `
            <div class="testimonials-carousel">
                ${testimonials.map(testimonial => `
                    <div class="testimonial-slide">
                        <div class="testimonial-content">
                            <div class="testimonial-text">
                                <p>"${testimonial.text}"</p>
                            </div>
                            <div class="testimonial-author">
                                <div class="author-image">
                                    <img src="${testimonial.image}" alt="${testimonial.name}" 
                                         onerror="this.src='assets/images/placeholder-avatar.jpg'">
                                </div>
                                <div class="author-info">
                                    <h5>${testimonial.name}</h5>
                                    <span>${testimonial.promotion}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } 
    // Version grid (pour la page about)
    else if (container.classList.contains('testimonials-grid')) {
        container.innerHTML = testimonials.map(testimonial => `
            <div class="testimonial-item">
                <div class="testimonial-card">
                    <div class="testimonial-quote">
                        <i class="fa fa-quote-left"></i>
                    </div>
                    <div class="testimonial-content">
                        <p>"${testimonial.text}"</p>
                    </div>
                    <div class="testimonial-author">
                        <div class="author-image">
                            <img src="${testimonial.image}" alt="${testimonial.name}"
                                 onerror="this.src='assets/images/placeholder-avatar.jpg'">
                        </div>
                        <div class="author-details">
                            <h5>${testimonial.name}</h5>
                            <span class="author-promotion">${testimonial.promotion}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}