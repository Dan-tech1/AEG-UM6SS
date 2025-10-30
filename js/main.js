// ===== MAIN.JS =====
// Script principal pour le site AEG-UM6SS

document.addEventListener('DOMContentLoaded', function() {
    // ===== VARIABLES GLOBALES =====
    const API_URL = 'data/data.json';
    
    // ===== FONCTIONS UTILITAIRES =====
    
    // Fonction pour masquer le préchargeur
    function hidePreloader() {
        const preloader = document.getElementById('preloder');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }
    
    // Fonction pour gérer le menu mobile
    function initMobileMenu() {
        const navSwitch = document.querySelector('.nav-switch');
        const mainMenu = document.querySelector('.main-menu');
        
        if (navSwitch && mainMenu) {
            navSwitch.addEventListener('click', function() {
                mainMenu.classList.toggle('active');
                this.classList.toggle('active');
            });
        }
    }
    
    // Fonction pour récupérer les données JSON
    async function fetchData() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des données');
            }
            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            return null;
        }
    }
    
    // Fonction pour formater les dates
    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
    
    // Fonction pour initialiser le compteur d'événement
    function initEventCounter() {
        const eventDate = new Date('2023-11-15T19:00:00').getTime();
        const countdownElement = document.querySelector('.counter');
        
        if (!countdownElement) return;
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = eventDate - now;
            
            if (distance < 0) {
                countdownElement.innerHTML = '<div class="counter-item"><h4>Événement terminé</h4></div>';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.querySelector('.counter-item:nth-child(1) h4').textContent = days;
            document.querySelector('.counter-item:nth-child(2) h4').textContent = hours;
            document.querySelector('.counter-item:nth-child(3) h4').textContent = minutes;
            document.querySelector('.counter-item:nth-child(4) h4').textContent = seconds;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // Fonction pour initialiser les animations au scroll
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-item, .course-item, .blog-item, .fact');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // Fonction pour initialiser la galerie
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.querySelector('a').getAttribute('href');
                openImagePopup(imgSrc);
            });
        });
    }
    
    // Fonction pour ouvrir une popup d'image
    function openImagePopup(src) {
        const popup = document.createElement('div');
        popup.className = 'image-popup';
        popup.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
        `;
        
        popup.appendChild(img);
        document.body.appendChild(popup);
        
        popup.addEventListener('click', function() {
            document.body.removeChild(popup);
        });
    }
    
    // Fonction pour initialiser le formulaire de newsletter
    function initNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input[type="text"]').value;
                
                if (validateEmail(email)) {
                    // Simulation d'envoi
                    this.querySelector('input[type="text"]').value = '';
                    showNotification('Merci pour votre inscription à notre newsletter!', 'success');
                } else {
                    showNotification('Veuillez entrer une adresse email valide.', 'error');
                }
            });
        }
    }
    
    // Fonction pour valider les emails
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Fonction pour afficher les notifications
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#006B3C' : '#d9534f'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Fonction pour initialiser le mode sombre/clair
    function initThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fa fa-moon"></i>';
        themeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        `;
        
        document.body.appendChild(themeToggle);
        
        // Vérifier le thème sauvegardé
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fa fa-sun"></i>';
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
                this.innerHTML = '<i class="fa fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                this.innerHTML = '<i class="fa fa-moon"></i>';
            }
        });
    }
    
    // ===== INITIALISATION =====
    function init() {
        hidePreloader();
        initMobileMenu();
        initEventCounter();
        initScrollAnimations();
        initGallery();
        initNewsletterForm();
        initThemeToggle();
        
        // Ajouter les styles pour le mode sombre
        const darkThemeStyles = `
            <style>
                body.dark-theme {
                    --bg-color: #121212;
                    --bg-light: #1e1e1e;
                    --text-color: #e0e0e0;
                    --text-light: #aaaaaa;
                    --border-color: #333333;
                }
                
                body.dark-theme .header-section,
                body.dark-theme .service-item,
                body.dark-theme .course-item,
                body.dark-theme .blog-item,
                body.dark-theme .event-item {
                    background-color: var(--bg-light);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', darkThemeStyles);
    }
    
    // Démarrer l'initialisation
    init();
});