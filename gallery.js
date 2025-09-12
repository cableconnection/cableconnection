// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    initGalleryFilter();
    initLightbox();
    initMasonryLayout();
});

let currentFilter = 'all';
let lightbox;

function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterBtns.length || !galleryItems.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            filterGalleryItems(filter, galleryItems);
            currentFilter = filter;
            
            // Create filter effect
            createFilterEffect(btn);
        });
    });
}

function filterGalleryItems(filter, items) {
    items.forEach((item, index) => {
        const shouldShow = filter === 'all' || item.dataset.category === filter;
        
        if (shouldShow) {
            // Show with stagger animation
            setTimeout(() => {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8) translateY(20px)';
                
                requestAnimationFrame(() => {
                    item.style.transition = 'all 0.4s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1) translateY(0)';
                });
            }, index * 50);
        } else {
            // Hide with animation
            item.style.transition = 'all 0.3s ease';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8) translateY(-20px)';
            
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

function createFilterEffect(button) {
    const rect = button.getBoundingClientRect();
    const effect = document.createElement('div');
    
    effect.style.cssText = `
        position: fixed;
        left: ${rect.left}px;
        top: ${rect.top}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        background: var(--color-black);
        border-radius: 25px;
        pointer-events: none;
        z-index: 9999;
        opacity: 0.2;
        transform: scale(1);
        animation: filterPulse 0.6s ease-out;
    `;
    
    document.body.appendChild(effect);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes filterPulse {
            0% {
                transform: scale(1);
                opacity: 0.5;
            }
            50% {
                transform: scale(1.2);
                opacity: 0.8;
            }
            100% {
                transform: scale(1.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 600);
}

function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = document.querySelector('.lightbox-close');
    
    if (!lightbox || !lightboxImage || !closeBtn) return;
    
    // Add click handlers to gallery items
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (!img) return;
        
        item.addEventListener('click', () => {
            openLightbox(img.src, img.alt, index);
        });
        
        // Add hover effect
        item.addEventListener('mouseenter', () => {
            createHoverEffect(item);
        });
    });
    
    // Close lightbox events
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Check if it's a horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                navigateLightbox(-1); // Swipe right, go to previous
            } else {
                navigateLightbox(1); // Swipe left, go to next
            }
        }
    });
}

let currentLightboxIndex = 0;

function openLightbox(src, alt, index) {
    const lightboxImage = document.getElementById('lightboxImage');
    currentLightboxIndex = index;
    
    lightbox.classList.add('active');
    lightboxImage.src = src;
    lightboxImage.alt = alt;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    lightbox.style.opacity = '0';
    requestAnimationFrame(() => {
        lightbox.style.transition = 'opacity 0.3s ease';
        lightbox.style.opacity = '1';
    });
    
    // Scale image animation
    lightboxImage.style.transform = 'scale(0.8)';
    lightboxImage.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImage.style.transition = 'all 0.3s ease';
        lightboxImage.style.transform = 'scale(1)';
        lightboxImage.style.opacity = '1';
    }, 100);
}

function closeLightbox() {
    const lightboxImage = document.getElementById('lightboxImage');
    
    // Exit animation
    lightboxImage.style.transition = 'all 0.3s ease';
    lightboxImage.style.transform = 'scale(0.8)';
    lightboxImage.style.opacity = '0';
    
    lightbox.style.transition = 'opacity 0.3s ease';
    lightbox.style.opacity = '0';
    
    setTimeout(() => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightbox.style.transition = '';
        lightbox.style.opacity = '';
        lightboxImage.style.transition = '';
        lightboxImage.style.transform = '';
        lightboxImage.style.opacity = '';
    }, 300);
}

function navigateLightbox(direction) {
    const visibleItems = Array.from(document.querySelectorAll('.gallery-item'))
        .filter(item => {
            const isVisible = currentFilter === 'all' || item.dataset.category === currentFilter;
            return isVisible && item.style.display !== 'none';
        });
    
    if (visibleItems.length === 0) return;
    
    const currentVisibleIndex = visibleItems.findIndex((item, index) => 
        Array.from(document.querySelectorAll('.gallery-item')).indexOf(item) === currentLightboxIndex
    );
    
    let newIndex = currentVisibleIndex + direction;
    
    if (newIndex < 0) {
        newIndex = visibleItems.length - 1;
    } else if (newIndex >= visibleItems.length) {
        newIndex = 0;
    }
    
    const newItem = visibleItems[newIndex];
    const newGlobalIndex = Array.from(document.querySelectorAll('.gallery-item')).indexOf(newItem);
    const img = newItem.querySelector('img');
    
    if (img) {
        // Slide transition effect
        const lightboxImage = document.getElementById('lightboxImage');
        const isNext = direction > 0;
        
        lightboxImage.style.transition = 'transform 0.3s ease';
        lightboxImage.style.transform = `translateX(${isNext ? '-100%' : '100%'}) scale(0.8)`;
        
        setTimeout(() => {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            currentLightboxIndex = newGlobalIndex;
            
            lightboxImage.style.transform = `translateX(${isNext ? '100%' : '-100%'}) scale(0.8)`;
            
            requestAnimationFrame(() => {
                lightboxImage.style.transform = 'translateX(0) scale(1)';
            });
        }, 150);
    }
}

function createHoverEffect(item) {
    const overlay = document.createElement('div');
    overlay.className = 'gallery-hover-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 15px;
        cursor: pointer;
    `;
    
    const icon = document.createElement('div');
    icon.innerHTML = '🔍';
    icon.style.cssText = `
        font-size: 3rem;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    overlay.appendChild(icon);
    item.style.position = 'relative';
    item.appendChild(overlay);
    
    // Show overlay
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        icon.style.transform = 'scale(1)';
    });
    
    // Remove overlay on mouse leave
    const removeOverlay = () => {
        overlay.style.opacity = '0';
        icon.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 300);
        
        item.removeEventListener('mouseleave', removeOverlay);
    };
    
    item.addEventListener('mouseleave', removeOverlay);
}

function initMasonryLayout() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    // Simple masonry-like layout for different aspect ratios
    const items = grid.querySelectorAll('.gallery-item');
    
    items.forEach((item, index) => {
        const img = item.querySelector('img');
        if (!img) return;
        
        // Add random aspect ratios for visual variety
        const aspects = ['1/1', '4/3', '3/4', '16/9'];
        const randomAspect = aspects[Math.floor(Math.random() * aspects.length)];
        
        item.style.aspectRatio = randomAspect;
        
        // Add intersection observer for lazy loading effect
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        observer.observe(item);
    });
    
    // Add CSS for masonry effect
    const style = document.createElement('style');
    style.textContent = `
        .gallery-grid {
            columns: 3;
            column-gap: 2rem;
        }
        
        .gallery-item {
            break-inside: avoid;
            margin-bottom: 2rem;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .gallery-item.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media (max-width: 768px) {
            .gallery-grid {
                columns: 2;
                column-gap: 1rem;
            }
        }
        
        @media (max-width: 480px) {
            .gallery-grid {
                columns: 1;
            }
        }
    `;
    document.head.appendChild(style);
}