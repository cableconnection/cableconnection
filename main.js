// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollAnimations();
    initParticles();
    initMobileMenu();
    initScrollProgress();
    
    console.log('Cabel Connection website loaded successfully!');
});

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class when scrolled down
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Smooth scroll for anchor links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.panel, .service-card, .gallery-item, .review-card, .team-member, .mv-item, .stat-item');
    
    animatedElements.forEach((el, index) => {
        // Add stagger delay
        el.style.animationDelay = `${index * 0.1}s`;
        
        // Add appropriate animation class based on element type
        if (el.classList.contains('panel')) {
            el.classList.add('fade-in');
        } else if (el.classList.contains('service-card')) {
            el.classList.add('scale-in');
        } else {
            el.classList.add('fade-in');
        }
        
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    initParallax();
}

// Parallax effects
function initParallax() {
    const parallaxElements = document.querySelectorAll('.panel-image img, .hero-background');
    
    if (parallaxElements.length === 0) return;
    
    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            if (element.closest('.hero')) {
                element.style.transform = `translateY(${rate * 0.3}px)`;
            } else {
                const rect = element.getBoundingClientRect();
                const speed = 0.2;
                const yPos = -(scrolled - rect.top) * speed;
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    };
    
    // Use requestAnimationFrame for smooth animations
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    });
}

// Particle system for hero section
function initParticles() {
    const particleContainer = document.getElementById('particleContainer');
    if (!particleContainer) return;
    
    const particleCount = window.innerWidth < 768 ? 20 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        
        // Random animation duration
        const duration = Math.random() * 10 + 8;
        particle.style.animationDuration = duration + 's';
        
        // Random delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';
        
        particleContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                createParticle(); // Create new particle
            }
        }, (duration + delay) * 1000);
    }
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);
    
    const progressBarInner = progressBar.querySelector('.scroll-progress-bar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBarInner.style.width = scrolled + '%';
    });
}

// Network reveal animation
function initNetworkReveal() {
    const layers = document.querySelectorAll('.layer');
    if (layers.length === 0) return;
    
    layers.forEach((layer, index) => {
        layer.addEventListener('click', () => {
            // Hide current layer
            layer.style.opacity = '0';
            layer.style.transform = 'translateY(-20px)';
            
            // Show next layer
            setTimeout(() => {
                layer.style.display = 'none';
                if (layers[index + 1]) {
                    layers[index + 1].style.zIndex = '10';
                }
            }, 500);
        });
    });
}

// Initialize network reveal if on home page
if (document.querySelector('.network-reveal')) {
    document.addEventListener('DOMContentLoaded', initNetworkReveal);
}

// Magnetic hover effect for buttons
function initMagneticHover() {
    const magneticElements = document.querySelectorAll('.cta-primary, .cta-secondary, .cta-mega');
    
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px)';
        });
    });
}

// Initialize magnetic hover
document.addEventListener('DOMContentLoaded', initMagneticHover);

// Reviews carousel auto-scroll
function initReviewsCarousel() {
    const carousel = document.getElementById('reviewsCarousel');
    if (!carousel) return;
    
    let scrollAmount = 0;
    const scrollSpeed = 1;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    
    function autoScroll() {
        scrollAmount += scrollSpeed;
        
        if (scrollAmount >= maxScroll) {
            scrollAmount = 0;
        }
        
        carousel.scrollLeft = scrollAmount;
    }
    
    // Auto-scroll every 50ms
    const scrollInterval = setInterval(autoScroll, 50);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(scrollInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        setInterval(autoScroll, 50);
    });
}

// Initialize reviews carousel
document.addEventListener('DOMContentLoaded', initReviewsCarousel);

// Form handling
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = form.querySelector('[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'form-success';
                successMsg.textContent = 'Thank you! Your message has been sent.';
                successMsg.style.cssText = `
                    background: rgba(0, 245, 255, 0.1);
                    border: 1px solid rgba(0, 245, 255, 0.3);
                    color: #00F5FF;
                    padding: 1rem;
                    border-radius: 10px;
                    margin-top: 1rem;
                    text-align: center;
                `;
                
                form.appendChild(successMsg);
                form.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
                
            }, 2000);
        });
    });
}

// Initialize forms
document.addEventListener('DOMContentLoaded', initForms);

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Performance optimization
function optimizeImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

// Initialize image optimization
document.addEventListener('DOMContentLoaded', optimizeImages);

// Error handling
window.addEventListener('error', (e) => {
    console.warn('An error occurred:', e.error);
    // Could send error to analytics service here
});

// Service worker registration (if needed in future)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js');
    });
}