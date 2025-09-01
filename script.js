// Asset Management and Preloader
const requiredImages = [
    'hero-bg.jpg',
    'bundles-starter.jpg', 
    'bundles-family.jpg',
    'bundles-sports.jpg',
    'equipment-router.jpg',
    'equipment-mesh.jpg',
    'channels-logos.png',
    'sports-logos.png',
    'dvr-apps.jpg',
    'moving-service.jpg',
    'coverage-map.png',
    'testimonial-1.jpg',
    'testimonial-2.jpg',
    'testimonial-3.jpg',
    'support-hub.jpg',
    'logo.svg',
    'favicon.svg'
];

let loadedImages = 0;
let totalImages = requiredImages.length;

// Preload all images and handle failures
function preloadImages() {
    requiredImages.forEach(imagePath => {
        const img = new Image();
        img.onload = () => {
            loadedImages++;
            checkPreloadComplete();
        };
        img.onerror = () => {
            // Find all img elements with this src and replace with fallback
            const imageElements = document.querySelectorAll(`img[src="${imagePath}"]`);
            imageElements.forEach(element => {
                element.src = 'img-fallback.png';
                element.setAttribute('data-missing', 'true');
                element.alt = 'Image not available';
            });
            loadedImages++;
            checkPreloadComplete();
        };
        img.src = imagePath;
    });
}

function checkPreloadComplete() {
    if (loadedImages >= totalImages) {
        // Wait for fonts and full page load
        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
        }
    }
}

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            preloader.style.display = 'none';
        } else {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        }
    }
    
    // Initialize animations after preloader
    initializeAnimations();
}

// Create fallback image if it doesn't exist
function createFallbackImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, 1, 1);
    
    // Create a transparent 1x1 PNG data URL
    const fallbackDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    // Create a small transparent image file
    fetch(fallbackDataUrl)
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            // We'll use data URL directly as fallback
        });
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    createFallbackImage();
    preloadImages();
    initializeComponents();
});

// Initialize all interactive components
function initializeComponents() {
    initializeHeader();
    initializeMobileMenu();
    initializeConfiguratorPricing();
    initializeChannelFinder();
    initializeTestimonials();
    initializeFAQ();
    initializeSavingsCalculator();
    initializeMobileActionBar();
}

// Header scroll behavior
function initializeHeader() {
    const header = document.getElementById('header');
    let scrolled = false;

    function handleScroll() {
        const shouldBeScrolled = window.scrollY > 50;
        if (shouldBeScrolled !== scrolled) {
            scrolled = shouldBeScrolled;
            header.classList.toggle('scrolled', scrolled);
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus first link for accessibility
        setTimeout(() => {
            const firstLink = document.querySelector('.mobile-nav-link');
            if (firstLink) firstLink.focus();
        }, 300);
    }

    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        mobileMenuToggle.focus();
    }

    mobileMenuToggle.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    
    // Close on overlay click
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });

    // Close on navigation
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Bundle configurator pricing logic
function initializeConfiguratorPricing() {
    const speedInputs = document.querySelectorAll('input[name="speed"]');
    const tvInputs = document.querySelectorAll('input[name="tv"]');
    const addonInputs = document.querySelectorAll('input[name="addons"]');

    function updatePricing() {
        const selectedSpeed = document.querySelector('input[name="speed"]:checked');
        const selectedTV = document.querySelector('input[name="tv"]:checked');
        const selectedAddons = document.querySelectorAll('input[name="addons"]:checked');

        const speedPrice = selectedSpeed ? parseFloat(selectedSpeed.dataset.price) : 0;
        const tvPrice = selectedTV ? parseFloat(selectedTV.dataset.price) : 0;
        
        let addonsPrice = 0;
        selectedAddons.forEach(addon => {
            addonsPrice += parseFloat(addon.dataset.price);
        });

        const total = speedPrice + tvPrice + addonsPrice;

        // Update display
        document.getElementById('speedPrice').textContent = `$${speedPrice.toFixed(2)}/mo`;
        document.getElementById('tvPrice').textContent = `$${tvPrice.toFixed(2)}/mo`;
        
        const addonsLine = document.getElementById('addonsLine');
        const addonsDisplay = document.getElementById('addonsPrice');
        
        if (addonsPrice > 0) {
            addonsLine.style.display = 'flex';
            addonsDisplay.textContent = `$${addonsPrice.toFixed(2)}/mo`;
        } else {
            addonsLine.style.display = 'none';
        }

        document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}/mo`;
    }

    speedInputs.forEach(input => input.addEventListener('change', updatePricing));
    tvInputs.forEach(input => input.addEventListener('change', updatePricing));
    addonInputs.forEach(input => input.addEventListener('change', updatePricing));
}

// Channel finder functionality
function initializeChannelFinder() {
    const searchInput = document.getElementById('channelSearch');
    const categoryFilters = document.querySelectorAll('.category-filter');

    // Mock channel data
    const channels = {
        news: ['CNN', 'Fox News', 'MSNBC', 'BBC News'],
        sports: ['ESPN', 'Fox Sports', 'NFL Network', 'NBA TV'],
        entertainment: ['TBS', 'TNT', 'USA Network', 'FX'],
        kids: ['Disney Channel', 'Nickelodeon', 'Cartoon Network', 'PBS Kids'],
        movies: ['HBO', 'Showtime', 'Starz', 'Cinemax']
    };

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        // In a real app, this would filter the channel display
        console.log('Searching for:', query);
    });

    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            categoryFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            const category = filter.dataset.category;
            console.log('Filtering by category:', category);
        });
    });
}

// Testimonials slider
function initializeTestimonials() {
    const track = document.querySelector('.testimonial-track');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-arrow.prev');
    const nextBtn = document.querySelector('.testimonial-arrow.next');
    
    let currentSlide = 0;
    const totalSlides = 3;
    let autoAdvanceInterval;

    function updateSlide(index) {
        currentSlide = index;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        // For mobile, we'll use transform
        if (window.innerWidth <= 1024) {
            const translateX = -currentSlide * 100;
            track.style.transform = `translateX(${translateX}%)`;
        }
    }

    function nextSlide() {
        updateSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
        updateSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => updateSlide(index));
    });

    // Auto-advance on mobile
    function startAutoAdvance() {
        if (window.innerWidth <= 768) {
            autoAdvanceInterval = setInterval(nextSlide, 5000);
        }
    }

    function stopAutoAdvance() {
        clearInterval(autoAdvanceInterval);
    }

    // Touch/swipe support for mobile
    let startX = 0;
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoAdvance();
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startAutoAdvance();
    }, { passive: true });

    // Initialize
    startAutoAdvance();
    
    // Handle resize
    window.addEventListener('resize', () => {
        stopAutoAdvance();
        setTimeout(startAutoAdvance, 100);
    });
}

// FAQ accordion
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isOpen = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            faqItems.forEach(otherItem => {
                const otherQuestion = otherItem.querySelector('.faq-question');
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherQuestion.setAttribute('aria-expanded', 'false');
                otherAnswer.style.maxHeight = '0';
            });
            
            // Toggle current item
            if (!isOpen) {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// Savings calculator
function initializeSavingsCalculator() {
    const currentBillInput = document.getElementById('currentBill');
    
    currentBillInput.addEventListener('input', (e) => {
        const currentBill = parseFloat(e.target.value) || 0;
        if (currentBill > 0) {
            calculateSavings();
        } else {
            document.getElementById('savingsResult').style.display = 'none';
        }
    });
}

function calculateSavings() {
    const currentBillInput = document.getElementById('currentBill');
    const currentBill = parseFloat(currentBillInput.value) || 0;
    
    if (currentBill <= 0) return;
    
    // Mock savings calculation (assume our bundle is $109.98)
    const ourPrice = 109.98;
    const monthlySavings = Math.max(0, currentBill - ourPrice);
    const yearlySavings = monthlySavings * 12;
    
    document.getElementById('saveAmount').textContent = `$${monthlySavings.toFixed(0)}`;
    document.getElementById('yearlySavings').textContent = `$${yearlySavings.toFixed(0)}`;
    document.getElementById('savingsResult').style.display = 'block';
}

// Mobile action bar visibility
function initializeMobileActionBar() {
    const actionBar = document.getElementById('mobileActionBar');
    const hero = document.querySelector('.hero');
    
    function toggleActionBar() {
        if (window.innerWidth <= 768) {
            const heroBottom = hero.offsetTop + hero.offsetHeight;
            const scrolled = window.scrollY > heroBottom;
            actionBar.style.display = scrolled ? 'grid' : 'none';
        } else {
            actionBar.style.display = 'none';
        }
    }

    window.addEventListener('scroll', toggleActionBar, { passive: true });
    window.addEventListener('resize', toggleActionBar);
    toggleActionBar();
}

// Modal functions
function openZipChecker() {
    document.getElementById('zipModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        document.getElementById('zipInput').focus();
    }, 300);
}

function closeZipChecker() {
    document.getElementById('zipModal').classList.remove('active');
    document.body.style.overflow = '';
}

function checkZip() {
    const zipInput = document.getElementById('zipInput');
    const zip = zipInput.value.trim();
    
    if (zip.length === 5 && /^\d+$/.test(zip)) {
        document.getElementById('zipResults').style.display = 'block';
    } else {
        alert('Please enter a valid 5-digit ZIP code.');
    }
}

function openConfigurator() {
    const configurator = document.getElementById('configurator');
    configurator.scrollIntoView({ behavior: 'smooth' });
    closeZipChecker();
    closeMobileMenu();
}

function openLiveChat() {
    document.getElementById('liveChatModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 300);
}

function closeLiveChat() {
    document.getElementById('liveChatModal').classList.remove('active');
    document.body.style.overflow = '';
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message) {
        // Add user message to chat
        const chatMessages = document.getElementById('chatMessages');
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
                <small>You • Just now</small>
            </div>
        `;
        chatMessages.appendChild(userMessage);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate agent response
        setTimeout(() => {
            const agentMessage = document.createElement('div');
            agentMessage.className = 'chat-message agent';
            agentMessage.innerHTML = `
                <div class="message-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4.5c0-1.1.9-2 2-2s2 .9 2 2V18h3v-7.5c0-1.1.9-2 2-2s2 .9 2 2V18h3v-8c0-.55-.45-1-1-1h-4v1.5c0 1.1-.9 2-2 2s-2-.9-2-2V9H5c-.55 0-1 .45-1 1v8h0z"/>
                    </svg>
                </div>
                <div class="message-content">
                    <p>Thanks for your message! A support specialist will be with you shortly. In the meantime, you can call us at (855) 569-7568 for immediate assistance.</p>
                    <small>Support Agent • Just now</small>
                </div>
            `;
            chatMessages.appendChild(agentMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    }
}

function openFaq() {
    const faqSection = document.querySelector('.faq');
    faqSection.scrollIntoView({ behavior: 'smooth' });
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeZipChecker();
        closeLiveChat();
        closeMobileMenu();
    }
});

// Animation and Effects System
function initializeAnimations() {
    // Skip animations if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        initializeScrollReveal();
        initialize3DTilt();
        initializeHeroParallax();
        initializeHeroCanvas();
    }
}

// Scroll reveal animation
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// 3D tilt effect
function initialize3DTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        let bounds;
        
        function updateBounds() {
            bounds = element.getBoundingClientRect();
        }
        
        function handleMouseMove(e) {
            if (!bounds) updateBounds();
            
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6; // Max 6 degrees
            const rotateY = ((x - centerX) / centerX) * 6;
            
            element.style.setProperty('--tilt-x', `${rotateX}deg`);
            element.style.setProperty('--tilt-y', `${rotateY}deg`);
        }
        
        function handleMouseLeave() {
            element.style.setProperty('--tilt-x', '0deg');
            element.style.setProperty('--tilt-y', '0deg');
        }
        
        element.addEventListener('mouseenter', updateBounds);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
        
        // Update bounds on resize
        window.addEventListener('resize', updateBounds);
    });
}

// Hero parallax effect
function initializeHeroParallax() {
    const heroSection = document.querySelector('.hero');
    const heroBgImage = document.querySelector('.hero-bg-image');
    
    if (!heroSection || !heroBgImage) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        // Limit parallax on mobile to prevent performance issues
        if (window.innerWidth > 768) {
            heroBgImage.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Hero canvas light streaks
function initializeHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    function drawLightStreaks() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const time = Date.now() * 0.001;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        gradient.addColorStop(0, 'rgba(217, 119, 6, 0)');
        gradient.addColorStop(0.5, 'rgba(217, 119, 6, 0.1)');
        gradient.addColorStop(1, 'rgba(217, 119, 6, 0)');
        
        ctx.fillStyle = gradient;
        
        // Draw animated diagonal lines
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(time * 0.1);
        ctx.fillRect(-canvas.width, -20, canvas.width * 2, 40);
        ctx.rotate(Math.PI / 3);
        ctx.fillRect(-canvas.width, -20, canvas.width * 2, 40);
        ctx.restore();
        
        animationId = requestAnimationFrame(drawLightStreaks);
    }
    
    resizeCanvas();
    drawLightStreaks();
    
    window.addEventListener('resize', resizeCanvas);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        cancelAnimationFrame(animationId);
    });
}

// Utility function to close mobile menu
function closeMobileMenu() {
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    if (mobileMenuOverlay.classList.contains('active')) {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Enhanced accessibility
document.addEventListener('keydown', (e) => {
    // Tab trap for modals
    if (e.key === 'Tab') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            const focusableElements = activeModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    }
});

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach(entry => {
        if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
        }
    });
});

try {
    performanceObserver.observe({ entryTypes: ['largest-contentful-paint'] });
} catch (e) {
    // Fallback for browsers that don't support this
    console.log('Performance observer not supported');
}