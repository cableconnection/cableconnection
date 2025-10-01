// Coverage Explorer functionality
document.addEventListener('DOMContentLoaded', function() {
    initCoverageMap();
    initZipChecker();
});

let coverageMap;
let particles = [];
let animationId;

function initCoverageMap() {
    const canvas = document.getElementById('coverageMap');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
        const container = canvas.parentElement;
        canvas.width = Math.min(container.offsetWidth, 800);
        canvas.height = Math.min(container.offsetWidth * 0.5, 400);
        canvas.style.width = canvas.width + 'px';
        canvas.style.height = canvas.height + 'px';
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Coverage map data (simplified for demo)
    const coverageZones = [
        { x: 150, y: 100, radius: 80, strength: 0.8, zip: '10001' },
        { x: 350, y: 150, radius: 100, strength: 0.9, zip: '10002' },
        { x: 500, y: 120, radius: 60, strength: 0.7, zip: '10003' },
        { x: 650, y: 180, radius: 90, strength: 0.85, zip: '10004' },
        { x: 200, y: 250, radius: 70, strength: 0.75, zip: '10005' },
        { x: 450, y: 280, radius: 85, strength: 0.8, zip: '10006' },
        { x: 600, y: 320, radius: 95, strength: 0.9, zip: '10007' }
    ];
    
    // Initialize particles
    function createMapParticles() {
        particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                color: Math.random() > 0.5 ? '#00F5FF' : '#FF2D95'
            });
        }
    }
    
    createMapParticles();
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background grid
        drawGrid(ctx);
        
        // Draw coverage zones
        drawCoverageZones(ctx, coverageZones);
        
        // Draw and update particles
        updateParticles(ctx);
        
        // Draw connections between nearby particles
        drawConnections(ctx);
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        // Attract particles to mouse
        particles.forEach(particle => {
            const dx = mouseX - particle.x;
            const dy = mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 1000;
                particle.vx += dx * force;
                particle.vy += dy * force;
            }
        });
    });
    
    // Click to check coverage at location
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const zone = findCoverageZone(clickX, clickY, coverageZones);
        if (zone) {
            showCoverageResult(true, zone.zip, zone.strength);
            createClickEffect(clickX, clickY);
        } else {
            showCoverageResult(false, null, 0);
        }
    });
}

function drawGrid(ctx) {
    const { width, height } = ctx.canvas;
    const gridSize = 30;
    
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
}

function drawCoverageZones(ctx, zones) {
    zones.forEach(zone => {
        // Outer glow
        const gradient = ctx.createRadialGradient(
            zone.x, zone.y, 0,
            zone.x, zone.y, zone.radius
        );
        gradient.addColorStop(0, `rgba(0, 245, 255, ${zone.strength * 0.3})`);
        gradient.addColorStop(0.5, `rgba(255, 45, 149, ${zone.strength * 0.2})`);
        gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner core
        ctx.fillStyle = `rgba(0, 245, 255, ${zone.strength * 0.8})`;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Pulsing animation
        const pulseSize = zone.radius * 0.3 + Math.sin(Date.now() * 0.003) * 5;
        ctx.strokeStyle = `rgba(0, 245, 255, ${zone.strength * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, pulseSize, 0, Math.PI * 2);
        ctx.stroke();
    });
}

function updateParticles(ctx) {
    particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = ctx.canvas.width;
        if (particle.x > ctx.canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = ctx.canvas.height;
        if (particle.y > ctx.canvas.height) particle.y = 0;
        
        // Slow down over time
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    });
}

function drawConnections(ctx) {
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
                const opacity = (80 - distance) / 80 * 0.3;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

function findCoverageZone(x, y, zones) {
    for (const zone of zones) {
        const dx = x - zone.x;
        const dy = y - zone.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= zone.radius) {
            return zone;
        }
    }
    return null;
}

function createClickEffect(x, y) {
    const canvas = document.getElementById('coverageMap');
    const ctx = canvas.getContext('2d');
    
    let radius = 0;
    const maxRadius = 50;
    
    function animateClick() {
        ctx.strokeStyle = '#00F5FF';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 1 - (radius / maxRadius);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        
        radius += 2;
        
        if (radius < maxRadius) {
            requestAnimationFrame(animateClick);
        }
    }
    
    animateClick();
}

function initZipChecker() {
    const zipInput = document.getElementById('zipInput');
    const checkBtn = document.getElementById('checkCoverageBtn');
    
    if (!zipInput || !checkBtn) return;
    
    // Sample coverage data
    const coverageData = {
        '10001': { available: true, speed: '1 Gbps', price: '$49.99' },
        '10002': { available: true, speed: '500 Mbps', price: '$39.99' },
        '10003': { available: true, speed: '1 Gbps', price: '$49.99' },
        '10004': { available: true, speed: '800 Mbps', price: '$44.99' },
        '10005': { available: true, speed: '600 Mbps', price: '$39.99' },
        '10006': { available: true, speed: '1 Gbps', price: '$49.99' },
        '10007': { available: true, speed: '900 Mbps', price: '$44.99' },
        '90210': { available: false, speed: null, price: null },
        '12345': { available: false, speed: null, price: null }
    };
    
    checkBtn.addEventListener('click', checkCoverage);
    zipInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkCoverage();
        }
    });
    
    zipInput.addEventListener('input', (e) => {
        // Only allow numbers and limit to 5 digits
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
    });
    
    function checkCoverage() {
        const zip = zipInput.value.trim();
        
        if (zip.length !== 5) {
            showError('Please enter a valid 5-digit ZIP code');
            return;
        }
        
        // Show loading state
        checkBtn.textContent = 'Checking...';
        checkBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            const coverage = coverageData[zip];
            
            if (coverage && coverage.available) {
                showCoverageResult(true, zip, 0.9, coverage.speed, coverage.price);
            } else {
                showCoverageResult(false, zip, 0);
            }
            
            checkBtn.textContent = 'Check Availability';
            checkBtn.disabled = false;
        }, 1500);
    }
}

function showCoverageResult(available, zip, strength, speed = null, price = null) {
    const resultDiv = document.getElementById('coverageResult');
    if (!resultDiv) return;
    
    resultDiv.className = `coverage-result ${available ? 'available' : 'unavailable'} show`;
    
    if (available) {
        resultDiv.innerHTML = `
            <h4>🎉 Great News!</h4>
            <p><strong>ZIP ${zip}</strong> is in our coverage area!</p>
            ${speed ? `<p><strong>Available Speed:</strong> Up to ${speed}</p>` : ''}
            ${price ? `<p><strong>Starting at:</strong> ${price}/month</p>` : ''}
            <p><strong>Signal Strength:</strong> ${Math.round(strength * 100)}%</p>
            <button class="cta-primary" style="margin-top: 1rem; padding: 0.75rem 1.5rem; font-size: 0.9rem;" onclick="window.location.href='contact.html'">
                Get Connected Now
            </button>
        `;
    } else {
        resultDiv.innerHTML = `
            <h4>Service Not Available</h4>
            <p><strong>ZIP ${zip || 'code'}</strong> is not currently in our coverage area.</p>
            <p>We're rapidly expanding our network. Leave your contact info to be notified when service becomes available.</p>
            <button class="cta-secondary" style="margin-top: 1rem; padding: 0.75rem 1.5rem; font-size: 0.9rem;" onclick="window.location.href='contact.html'">
                Notify Me
            </button>
        `;
    }
    
    // Create celebration effect for positive results
    if (available) {
        createCelebrationEffect();
    }
}

function showError(message) {
    const resultDiv = document.getElementById('coverageResult');
    if (!resultDiv) return;
    
    resultDiv.className = 'coverage-result unavailable show';
    resultDiv.innerHTML = `<p>${message}</p>`;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        resultDiv.classList.remove('show');
    }, 3000);
}

function createCelebrationEffect() {
    const container = document.querySelector('.coverage-explorer');
    if (!container) return;
    
    // Create confetti particles
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: ${Math.random() > 0.5 ? '#00F5FF' : '#FF2D95'};
            border-radius: 50%;
            left: 50%;
            top: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        container.appendChild(confetti);
        
        // Animate confetti
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = 50 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity - 50; // Slight upward bias
        
        confetti.animate([
            { 
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1 
            },
            { 
                transform: `translate(${vx - 50}%, ${vy + 100}%) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            confetti.remove();
        };
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});