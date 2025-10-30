// Script pour la page Blog
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
        container.innerHTML = '<div class="col-12 text-center"><p class="no-posts">Aucun article à afficher pour le moment.</p></div>';
        return;
    }
    
    container.innerHTML = posts.map(post => `
        <div class="col-lg-12">
            <div class="blog-item">
                <div class="blog-thumb set-bg" style="background-image: url('${post.image}')"></div>
                <div class="blog-content">
                    <span class="blog-category">${post.category}</span>
                    <h4>${post.title}</h4>
                    <div class="blog-meta">
                        <span><i class="fa fa-calendar-o"></i> ${formatDate(post.date)}</span>
                        <span><i class="fa fa-user"></i> ${post.author}</span>
                    </div>
                    <p>${post.summary}</p>
                    <a href="blog-single.html?id=${post.id}" class="read-more">Lire la suite <i class="fa fa-angle-double-right"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

function displayRecentPosts(posts, container) {
    container.innerHTML = posts.map(post => `
        <div class="post-item">
            <div class="post-thumb">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="post-content">
                <h6>${post.title}</h6>
                <span><i class="fa fa-calendar-o"></i> ${formatDate(post.date)}</span>
            </div>
        </div>
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
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}