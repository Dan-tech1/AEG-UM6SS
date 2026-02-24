// Script pour la page Blog — Tailwind CSS
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    initBlogSearch();
});

async function loadBlogPosts() {
    try {
        const response = await fetch('data/data.json');
        const data = await response.json();

        const blogContainer = document.getElementById('blog-container');
        const recentPostsContainer = document.getElementById('recent-posts-sidebar');

        if (blogContainer && data.blog) {
            displayBlogPosts(data.blog, blogContainer);
        }

        if (recentPostsContainer && data.blog) {
            const recentPosts = data.blog.slice(0, 3);
            displayRecentPosts(recentPosts, recentPostsContainer);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
    }
}

function displayBlogPosts(posts, container) {
    if (!posts.length) {
        container.innerHTML = '<div class="text-center py-12"><p class="text-slate-400 text-lg">Aucun article à afficher pour le moment.</p></div>';
        return;
    }

    container.innerHTML = posts.map(post => `
        <article class="blog-item group bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all duration-300 mb-8">
            <div class="relative h-56 md:h-64 overflow-hidden">
                <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='assets/images/aeg.jpg'" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <span class="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-primary text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    <i class="fas fa-tag text-[9px]"></i> ${post.category}
                </span>
            </div>
            <div class="p-6">
                <h4 class="font-heading text-lg font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">${post.title}</h4>
                <div class="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span class="flex items-center gap-1.5"><i class="far fa-calendar-alt text-primary/60"></i> ${formatDate(post.date)}</span>
                    <span class="flex items-center gap-1.5"><i class="far fa-user text-primary/60"></i> ${post.author}</span>
                </div>
                <p class="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">${post.summary}</p>
                <a href="blog-single.html?id=${post.id}" class="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-700 transition-colors group/link">
                    Lire la suite <i class="fas fa-arrow-right text-[10px] group-hover/link:translate-x-1 transition-transform"></i>
                </a>
            </div>
        </article>
    `).join('');
}

function displayRecentPosts(posts, container) {
    container.innerHTML = posts.map(post => `
        <a href="blog-single.html?id=${post.id}" class="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-100 transition-colors group/recent">
            <div class="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover group-hover/recent:scale-110 transition-transform duration-300" onerror="this.src='assets/images/aeg.jpg'" />
            </div>
            <div class="flex-1 min-w-0">
                <h6 class="text-sm font-semibold text-slate-700 leading-snug line-clamp-2 group-hover/recent:text-primary transition-colors mb-1">${post.title}</h6>
                <span class="text-xs text-slate-400 flex items-center gap-1"><i class="far fa-calendar-alt text-[10px]"></i> ${formatDate(post.date)}</span>
            </div>
        </a>
    `).join('');
}

function initBlogSearch() {
    const searchForm = document.querySelector('.search-widget form');

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.toLowerCase();
            filterBlogPosts(searchTerm);
        });
    }
}

function filterBlogPosts(searchTerm) {
    const blogItems = document.querySelectorAll('.blog-item');

    blogItems.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const content = item.querySelector('p').textContent.toLowerCase();

        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}