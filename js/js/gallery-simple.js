// Gallery Simple - Chargement depuis JSON
class SimpleGallery {
    constructor() {
        this.galleryData = [];
        this.init();
    }

    async init() {
        await this.loadGalleryData();
        this.renderGallery();
        this.initImagePopup();
    }

    async loadGalleryData() {
        try {
            const response = await fetch('data/data/gallery.json');
            const data = await response.json();
            this.galleryData = data.gallery;
        } catch (error) {
            console.error('Erreur chargement galerie:', error);
        }
    }

    renderGallery() {
        const container = document.getElementById('gallery-container');
        if (!container || !this.galleryData.length) return;

        const galleryHTML = this.galleryData.map((item, index) => 
            this.createGalleryItem(item, index)
        ).join('');

        container.innerHTML = `<div class="grid-sizer"></div>${galleryHTML}`;
        this.initSetBg();
    }

    createGalleryItem(item, index) {
        const sizeClass = this.getSizeClass(item.width);
        
        return `
            <div class="gallery-item ${sizeClass} set-bg" data-setbg="${item.image}">
                <a class="img-popup" href="${item.popup}"><i class="ti-plus"></i></a>
            </div>
        `;
    }

    getSizeClass(width) {
        const sizes = {
            'big': 'gi-big',
            'long': 'gi-long', 
            'normal': ''
        };
        return sizes[width] || '';
    }

    initSetBg() {
        const elements = document.querySelectorAll('#gallery-container .set-bg');
        
        elements.forEach(element => {
            const imageUrl = element.getAttribute('data-setbg');
            if (imageUrl) {
                this.setBackgroundImage(element, imageUrl);
            }
        });
    }

    setBackgroundImage(element, imageUrl) {
        const img = new Image();
        
        img.onload = function() {
            element.style.backgroundImage = `url('${imageUrl}')`;
        };
        
        img.onerror = function() {
            console.error(`Image non trouvée: ${imageUrl}`);
        };
        
        img.src = imageUrl;
    }

    initImagePopup() {
        // Utilise la fonction existante de main.js ou crée une version simple
        document.addEventListener('click', (e) => {
            if (e.target.closest('.img-popup')) {
                e.preventDefault();
                const link = e.target.closest('.img-popup');
                this.openImagePopup(link.href);
            }
        });
    }

    openImagePopup(imageSrc) {
        const popup = document.createElement('div');
        popup.className = 'image-popup-overlay';
        popup.innerHTML = `
            <div class="image-popup-content">
                <span class="popup-close">&times;</span>
                <img src="${imageSrc}" alt="">
            </div>
        `;

        document.body.appendChild(popup);
        document.body.style.overflow = 'hidden';

        // Fermer le popup
        popup.querySelector('.popup-close').addEventListener('click', () => {
            document.body.removeChild(popup);
            document.body.style.overflow = 'auto';
        });

        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                document.body.removeChild(popup);
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new SimpleGallery();
});