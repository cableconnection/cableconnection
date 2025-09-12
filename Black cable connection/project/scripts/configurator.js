// Bundle Configurator functionality
document.addEventListener('DOMContentLoaded', function() {
    initDragAndDrop();
    initPriceCalculator();
});

let selectedServices = new Map();
let draggedElement = null;

function initDragAndDrop() {
    const serviceCards = document.querySelectorAll('.service-card');
    const dropzone = document.getElementById('bundleDropzone');
    
    if (!serviceCards.length || !dropzone) return;
    
    serviceCards.forEach(card => {
        // Make cards draggable
        card.draggable = true;
        
        card.addEventListener('dragstart', (e) => {
            draggedElement = card;
            card.classList.add('dragging');
            
            // Set drag data
            const serviceData = {
                id: card.dataset.service,
                name: card.querySelector('h3').textContent,
                description: card.querySelector('p').textContent,
                price: parseFloat(card.dataset.price)
            };
            
            e.dataTransfer.setData('application/json', JSON.stringify(serviceData));
            e.dataTransfer.effectAllowed = 'copy';
            
            // Create custom drag preview
            createDragPreview(e, card);
        });
        
        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            draggedElement = null;
        });
        
        // Touch events for mobile
        let touchStartTime = 0;
        card.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
        });
        
        card.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            if (touchDuration < 300) { // Quick tap
                const serviceData = {
                    id: card.dataset.service,
                    name: card.querySelector('h3').textContent,
                    description: card.querySelector('p').textContent,
                    price: parseFloat(card.dataset.price)
                };
                
                addServiceToBundle(serviceData);
            }
        });
    });
    
    // Dropzone events
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        dropzone.classList.add('drag-over');
    });
    
    dropzone.addEventListener('dragleave', (e) => {
        if (!dropzone.contains(e.relatedTarget)) {
            dropzone.classList.remove('drag-over');
        }
    });
    
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        
        try {
            const serviceData = JSON.parse(e.dataTransfer.getData('application/json'));
            addServiceToBundle(serviceData);
        } catch (error) {
            console.error('Error parsing dropped data:', error);
        }
    });
}

function createDragPreview(e, card) {
    const preview = card.cloneNode(true);
    preview.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        width: ${card.offsetWidth}px;
        height: ${card.offsetHeight}px;
        opacity: 0.8;
        transform: rotate(5deg) scale(0.9);
        pointer-events: none;
        z-index: 10000;
    `;
    
    document.body.appendChild(preview);
    e.dataTransfer.setDragImage(preview, card.offsetWidth / 2, card.offsetHeight / 2);
    
    // Remove preview after drag
    setTimeout(() => {
        if (preview.parentNode) {
            preview.parentNode.removeChild(preview);
        }
    }, 0);
}

function addServiceToBundle(serviceData) {
    const servicesContainer = document.getElementById('selectedServices');
    if (!servicesContainer) return;
    
    // Check if service already exists
    if (selectedServices.has(serviceData.id)) {
        showServiceMessage('Service already added to your bundle!', 'warning');
        return;
    }
    
    // Add to selected services
    selectedServices.set(serviceData.id, serviceData);
    
    // Create service element
    const serviceElement = document.createElement('div');
    serviceElement.className = 'selected-service';
    serviceElement.dataset.serviceId = serviceData.id;
    serviceElement.innerHTML = `
        <h4>${serviceData.name}</h4>
        <p>${serviceData.description}</p>
        <span class="service-price">$${serviceData.price.toFixed(2)}/month</span>
        <button class="remove-service" onclick="removeServiceFromBundle('${serviceData.id}')">×</button>
    `;
    
    // Add with animation
    serviceElement.style.opacity = '0';
    serviceElement.style.transform = 'translateY(-20px)';
    servicesContainer.appendChild(serviceElement);
    
    // Animate in
    requestAnimationFrame(() => {
        serviceElement.style.transition = 'all 0.3s ease';
        serviceElement.style.opacity = '1';
        serviceElement.style.transform = 'translateY(0)';
    });
    
    updateTotal();
    updateDropzoneMessage();
    createAddEffect(serviceElement);
    showServiceMessage(`${serviceData.name} added to your bundle!`, 'success');
}

function removeServiceFromBundle(serviceId) {
    const serviceElement = document.querySelector(`.selected-service[data-service-id="${serviceId}"]`);
    if (!serviceElement) return;
    
    // Remove from map
    selectedServices.delete(serviceId);
    
    // Animate out
    serviceElement.style.transition = 'all 0.3s ease';
    serviceElement.style.opacity = '0';
    serviceElement.style.transform = 'translateY(-20px) scale(0.8)';
    
    setTimeout(() => {
        if (serviceElement.parentNode) {
            serviceElement.parentNode.removeChild(serviceElement);
        }
    }, 300);
    
    updateTotal();
    updateDropzoneMessage();
}

// Make removeServiceFromBundle globally accessible
window.removeServiceFromBundle = removeServiceFromBundle;

function updateTotal() {
    const totalElement = document.getElementById('totalPrice');
    if (!totalElement) return;
    
    let total = 0;
    selectedServices.forEach(service => {
        total += service.price;
    });
    
    // Apply bundle discount for multiple services
    let discount = 0;
    const serviceCount = selectedServices.size;
    
    if (serviceCount >= 3) {
        discount = total * 0.15; // 15% discount for triple play
    } else if (serviceCount >= 2) {
        discount = total * 0.1; // 10% discount for double play
    }
    
    const finalTotal = total - discount;
    
    // Animate price change
    const currentPrice = parseFloat(totalElement.textContent);
    if (currentPrice !== finalTotal) {
        animateNumber(totalElement, currentPrice, finalTotal);
    }
    
    // Show discount info
    const discountInfo = document.querySelector('.discount-info') || createDiscountInfo();
    if (discount > 0) {
        discountInfo.innerHTML = `
            <div class="discount-badge">
                ${serviceCount >= 3 ? 'Triple Play' : 'Double Play'} Discount: -$${discount.toFixed(2)}
            </div>
            <div class="original-price">Regular Price: $${total.toFixed(2)}</div>
        `;
        discountInfo.style.display = 'block';
    } else {
        discountInfo.style.display = 'none';
    }
}

function createDiscountInfo() {
    const totalContainer = document.querySelector('.total-price').parentNode;
    const discountInfo = document.createElement('div');
    discountInfo.className = 'discount-info';
    discountInfo.style.cssText = `
        margin-bottom: 1rem;
        text-align: center;
        display: none;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .discount-badge {
            background: linear-gradient(45deg, #00F5FF, #FF2D95);
            color: #000;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: bold;
            margin-bottom: 0.5rem;
            animation: pulse 2s infinite;
        }
        
        .original-price {
            color: #888;
            text-decoration: line-through;
            font-size: 0.9rem;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
    
    totalContainer.insertBefore(discountInfo, totalContainer.querySelector('.total-price'));
    return discountInfo;
}

function animateNumber(element, from, to) {
    const duration = 500;
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = from + (to - from) * easeOutCubic(progress);
        
        element.textContent = current.toFixed(2);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function updateDropzoneMessage() {
    const dropzone = document.getElementById('bundleDropzone');
    const messageElement = dropzone.querySelector('p');
    
    if (selectedServices.size === 0) {
        messageElement.textContent = 'Drop services here to build your bundle';
        dropzone.classList.remove('has-services');
    } else {
        messageElement.textContent = `Your Custom Bundle (${selectedServices.size} service${selectedServices.size > 1 ? 's' : ''})`;
        dropzone.classList.add('has-services');
    }
}

function createAddEffect(element) {
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(0, 245, 255, 0.3);
        transform: translate(-50%, -50%);
        animation: rippleExpand 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleExpand {
            to {
                width: 100px;
                height: 100px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

function showServiceMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `service-message ${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 245, 255, 0.9)' : 'rgba(255, 45, 149, 0.9)'};
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(messageElement);
    
    // Slide in
    requestAnimationFrame(() => {
        messageElement.style.transform = 'translateX(0)';
    });
    
    // Slide out after 3 seconds
    setTimeout(() => {
        messageElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 3000);
}

function initPriceCalculator() {
    // Initialize with empty state
    updateTotal();
    updateDropzoneMessage();
    
    // Add checkout button functionality
    const checkoutBtn = document.createElement('button');
    checkoutBtn.className = 'checkout-btn';
    checkoutBtn.textContent = 'Continue to Checkout';
    checkoutBtn.style.cssText = `
        width: 100%;
        margin-top: 1rem;
        padding: 1rem;
        background: linear-gradient(45deg, #FF2D95, #00F5FF);
        color: #000;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        display: none;
    `;
    
    checkoutBtn.addEventListener('click', () => {
        if (selectedServices.size > 0) {
            // Store bundle data for checkout
            localStorage.setItem('selectedBundle', JSON.stringify(Array.from(selectedServices.entries())));
            window.location.href = 'contact.html?bundle=true';
        }
    });
    
    const totalContainer = document.querySelector('.total-price').parentNode;
    totalContainer.appendChild(checkoutBtn);
    
    // Show/hide checkout button based on selection
    const originalUpdateTotal = updateTotal;
    updateTotal = function() {
        originalUpdateTotal();
        checkoutBtn.style.display = selectedServices.size > 0 ? 'block' : 'none';
    };
}