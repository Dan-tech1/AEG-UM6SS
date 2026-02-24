// testimonials.js — Tailwind CSS
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
        container.innerHTML = '<p class="text-center text-white/60 text-base py-8">Aucun témoignage à afficher pour le moment.</p>';
        return;
    }

    // Couleurs cycliques : vert, jaune, bleu
    const cardStyles = [
        { bg: 'bg-emerald-600',  border: 'border-emerald-400/30', text: 'text-white',        quote: 'text-emerald-200/60', sub: 'text-emerald-100/80', name: 'text-white',        divider: 'border-white/20',        ring: 'border-emerald-200/50', hover: 'hover:bg-emerald-700' },
        { bg: 'bg-yellow-400',   border: 'border-yellow-500/40',  text: 'text-slate-900',    quote: 'text-yellow-700/60',  sub: 'text-slate-700',      name: 'text-slate-900',    divider: 'border-slate-900/15',    ring: 'border-yellow-600/50',  hover: 'hover:bg-yellow-300' },
        { bg: 'bg-blue-600',     border: 'border-blue-400/30',    text: 'text-white',        quote: 'text-blue-200/60',    sub: 'text-blue-100/80',    name: 'text-white',        divider: 'border-white/20',        ring: 'border-blue-200/50',    hover: 'hover:bg-blue-700' },
    ];

    function buildCard(testimonial, index) {
        const s = cardStyles[index % cardStyles.length];
        return `
            <div class="testimonial-card ${s.bg} ${s.hover} ${s.border} border rounded-2xl p-7 shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div class="${s.quote} text-3xl mb-4"><i class="fas fa-quote-left"></i></div>
                <p class="text-sm ${s.text} leading-relaxed mb-6 italic">"${testimonial.text}"</p>
                <div class="flex items-center gap-3.5 pt-4 border-t ${s.divider}">
                    <div class="w-11 h-11 rounded-full overflow-hidden border-2 ${s.ring} flex-shrink-0">
                        <img src="${testimonial.image}" alt="${testimonial.name}" class="w-full h-full object-cover" onerror="this.src='assets/images/aeg.jpg'" />
                    </div>
                    <div>
                        <h5 class="font-heading text-sm font-bold ${s.name}">${testimonial.name}</h5>
                        <span class="text-xs ${s.sub}">${testimonial.promotion}</span>
                    </div>
                </div>
            </div>`;
    }

    // Version slider (pour l'accueil — index.html)
    if (container.classList.contains('testimonials-slider')) {
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${testimonials.map((t, i) => buildCard(t, i)).join('')}
            </div>
        `;
    }
    // Version grid (pour la page about)
    else if (container.classList.contains('testimonials-grid')) {
        container.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                ${testimonials.map((t, i) => buildCard(t, i)).join('')}
            </div>
        `;
    }
}