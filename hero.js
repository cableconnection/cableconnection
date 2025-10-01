// Hero section specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initHeroAnimations();
    initHeroCTAs();
});

function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Enhanced particle system
    createAdvancedParticles();
    
    // Fiber optic animation
    initFiberAnimation();
    
    // Hero text animations
    animateHeroText();
}

function createAdvancedParticles() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    const particleCount = window.innerWidth < 768 ? 30 : 80;
    const particles = [];
    
    class Particle {
        constructor() {
            this.element = document.createElement('div');
            this.element.className = 'particle';
            this.reset();
            container.appendChild(this.element);
        }
        
        reset() {
            // Random size and color
            const size = Math.random() * 6 + 2;
            const isBlue = Math.random() > 0.5;
            
            this.element.style.width = size + 'px';
            this.element.style.height = size + 'px';
            this.element.style.background = isBlue ? '#00F5FF' : '#FF2D95';
            
            // Random position and movement
            this.x = Math.random() * window.innerWidth;
            this.y = window.innerHeight + 100;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = -(Math.random() * 3 + 1);
            this.opacity = Math.random() * 0.8 + 0.2;
            
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.opacity = this.opacity;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.005;
            
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.opacity = this.opacity;
            
            // Reset when particle goes off screen or fades out
            if (this.y < -100 || this.opacity <= 0 || this.x < -100 || this.x > window.innerWidth + 100) {
                this.reset();
            }
        }
        
        destroy() {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }
    }
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Animation loop
    function animateParticles() {
        particles.forEach(particle => particle.update());
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    container.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Create attraction effect
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                particle.speedX += dx * force * 0.001;
                particle.speedY += dy * force * 0.001;
            }
        });
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        particles.forEach(particle => particle.destroy());
    });
}

function initFiberAnimation() {
    const fiberElement = document.querySelector('.fiber-animation');
    if (!fiberElement) return;
    
    // Create multiple fiber layers
    for (let i = 0; i < 3; i++) {
        const layer = document.createElement('div');
        layer.className = 'fiber-layer';
        layer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                ${45 + i * 30}deg,
                transparent 30%,
                rgba(0, 245, 255, ${0.1 - i * 0.02}) 50%,
                transparent 70%
            );
            background-size: ${200 + i * 50}px ${200 + i * 50}px;
            animation: fiberFlow ${20 + i * 5}s linear infinite;
            animation-delay: ${-i * 2}s;
        `;
        fiberElement.appendChild(layer);
    }
}

function animateHeroText() {
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const cta = document.querySelector('.hero-cta');
    
    if (!title) return;
    
    // Split title into words for individual animation
    const words = title.textContent.split(' ');
    title.innerHTML = words.map((word, index) => 
        `<span class="word" style="animation-delay: ${index * 0.2}s">${word}</span>`
    ).join(' ');
    
    // Add CSS for word animation
    const style = document.createElement('style');
    style.textContent = `
        .hero-title .word {
            display: inline-block;
            opacity: 0;
            transform: translateY(50px) rotateX(90deg);
            animation: wordSlideIn 0.8s ease forwards;
        }
        
        @keyframes wordSlideIn {
            to {
                opacity: 1;
                transform: translateY(0) rotateX(0deg);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Typewriter effect for subtitle
    if (subtitle) {
        const text = subtitle.textContent;
        subtitle.textContent = '';
        subtitle.style.borderRight = '2px solid #00F5FF';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                subtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            } else {
                // Remove cursor after typing
                setTimeout(() => {
                    subtitle.style.borderRight = 'none';
                }, 500);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}

function initHeroCTAs() {
    const checkServiceBtn = document.getElementById('checkServiceBtn');
    const finalCta = document.getElementById('finalCta');
    
    // Check Service button functionality
    if (checkServiceBtn) {
        checkServiceBtn.addEventListener('click', () => {
            // Scroll to coverage explorer or show modal
            const coverageSection = document.querySelector('.coverage-explorer');
            if (coverageSection) {
                coverageSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Focus the ZIP input after scroll
                setTimeout(() => {
                    const zipInput = document.getElementById('zipInput');
                    if (zipInput) {
                        zipInput.focus();
                    }
                }, 1000);
            }
        });
    }
    
    // Final CTA button
    if (finalCta) {
        finalCta.addEventListener('click', () => {
            // Create explosion effect
            createExplosionEffect(finalCta);
            
            // Navigate to contact or show modal
            setTimeout(() => {
                window.location.href = 'contact.html';
            }, 1000);
        });
    }
}

function createExplosionEffect(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create particles for explosion
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${Math.random() > 0.5 ? '#00F5FF' : '#FF2D95'};
            border-radius: 50%;
            left: ${centerX}px;
            top: ${centerY}px;
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle
        const angle = (Math.PI * 2 * i) / 20;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${vx}px, ${vy}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
    
    // Button shake effect
    button.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(-3px)' },
        { transform: 'translateX(3px)' },
        { transform: 'translateX(0)' }
    ], {
        duration: 500,
        easing: 'ease-in-out'
    });
}

// Hero scroll indicator
function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;
    
    indicator.addEventListener('click', () => {
        const firstPanel = document.querySelector('.life-panels');
        if (firstPanel) {
            firstPanel.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
    
    // Hide indicator when scrolled
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (scrolled > 100) {
            indicator.style.opacity = '0';
        } else {
            indicator.style.opacity = '1';
        }
    });
}

// Initialize scroll indicator
document.addEventListener('DOMContentLoaded', initScrollIndicator);

// Performance monitoring
function monitorHeroPerformance() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Monitor animation performance
    let fps = 60;
    let lastTime = performance.now();
    
    function measureFPS() {
        const now = performance.now();
        const delta = now - lastTime;
        fps = 1000 / delta;
        lastTime = now;
        
        // If FPS drops below 30, reduce particle count
        if (fps < 30) {
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                if (index % 2 === 0) {
                    particle.style.display = 'none';
                }
            });
        }
        
        requestAnimationFrame(measureFPS);
    }
    
    measureFPS();
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', monitorHeroPerformance);