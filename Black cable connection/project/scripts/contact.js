// Contact page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
    checkBundleData();
});

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('.form-submit');
    
    // Add floating label effect
    inputs.forEach(input => {
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (!label) return;
        
        // Create floating label
        const floatingLabel = document.createElement('span');
        floatingLabel.className = 'floating-label';
        floatingLabel.textContent = label.textContent;
        floatingLabel.style.cssText = `
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: rgba(255, 255, 255, 0.6);
            transition: all 0.3s ease;
            font-size: 1rem;
        `;
        
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(floatingLabel);
        
        // Handle focus and blur
        const handleFocus = () => {
            floatingLabel.style.top = '0.5rem';
            floatingLabel.style.fontSize = '0.8rem';
            floatingLabel.style.color = '#00F5FF';
        };
        
        const handleBlur = () => {
            if (!input.value) {
                floatingLabel.style.top = '50%';
                floatingLabel.style.fontSize = '1rem';
                floatingLabel.style.color = 'rgba(255, 255, 255, 0.6)';
            }
        };
        
        input.addEventListener('focus', handleFocus);
        input.addEventListener('blur', handleBlur);
        
        // Check initial state
        if (input.value) {
            handleFocus();
        }
        
        // Add input validation styling
        input.addEventListener('input', () => {
            validateInput(input);
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmission(form, submitBtn);
    });
    
    // Real-time validation
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Format phone number as user types
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
    
    if (messageInput) {
        const charCount = document.createElement('div');
        charCount.className = 'char-count';
        charCount.style.cssText = `
            text-align: right;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.8rem;
            margin-top: 0.5rem;
        `;
        
        messageInput.parentNode.appendChild(charCount);
        
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            charCount.textContent = `${count}/1000 characters`;
            
            if (count > 800) {
                charCount.style.color = '#FF2D95';
            } else {
                charCount.style.color = 'rgba(255, 255, 255, 0.6)';
            }
        });
    }
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let message = '';
    
    // Remove existing validation message
    const existingMsg = input.parentNode.querySelector('.validation-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    switch (input.type) {
        case 'text':
            if (input.id === 'name') {
                isValid = value.length >= 2;
                message = 'Name must be at least 2 characters';
            }
            break;
        case 'tel':
            const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
            isValid = !value || phoneRegex.test(value);
            message = 'Please enter a valid phone number';
            break;
        case 'textarea':
            isValid = value.length >= 10;
            message = 'Message must be at least 10 characters';
            break;
    }
    
    // Update input styling
    if (value && !isValid) {
        input.style.borderColor = '#FF2D95';
        showValidationMessage(input, message, 'error');
    } else if (value && isValid) {
        input.style.borderColor = '#00F5FF';
    } else {
        input.style.borderColor = 'rgba(0, 245, 255, 0.2)';
    }
    
    return isValid;
}

function showValidationMessage(input, message, type) {
    const msgElement = document.createElement('div');
    msgElement.className = 'validation-message';
    msgElement.textContent = message;
    msgElement.style.cssText = `
        color: ${type === 'error' ? '#FF2D95' : '#00F5FF'};
        font-size: 0.8rem;
        margin-top: 0.5rem;
        animation: fadeIn 0.3s ease;
    `;
    
    input.parentNode.appendChild(msgElement);
}

function handleFormSubmission(form, submitBtn) {
    // Validate all inputs
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateInput(input) || !input.value.trim()) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showFormMessage('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.style.background = 'rgba(0, 245, 255, 0.5)';
    
    // Add loading animation to button
    const loader = document.createElement('div');
    loader.className = 'button-loader';
    loader.style.cssText = `
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top: 2px solid #000;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-left: 10px;
    `;
    
    submitBtn.appendChild(loader);
    
    // Simulate form submission
    setTimeout(() => {
        // Success response
        showFormMessage('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        
        // Reset floating labels
        const floatingLabels = form.querySelectorAll('.floating-label');
        floatingLabels.forEach(label => {
            label.style.top = '50%';
            label.style.fontSize = '1rem';
            label.style.color = 'rgba(255, 255, 255, 0.6)';
        });
        
        // Reset inputs
        const allInputs = form.querySelectorAll('input, textarea');
        allInputs.forEach(input => {
            input.style.borderColor = 'rgba(0, 245, 255, 0.2)';
        });
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
        
        // Create success animation
        createSuccessAnimation(form);
        
    }, 2000);
}

function showFormMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 245, 255, 0.95)' : 'rgba(255, 45, 149, 0.95)'};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        max-width: 300px;
    `;
    
    document.body.appendChild(messageElement);
    
    // Slide in
    requestAnimationFrame(() => {
        messageElement.style.transform = 'translateX(0)';
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 5000);
}

function createSuccessAnimation(form) {
    const rect = form.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create success particles
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: #00F5FF;
            border-radius: 50%;
            left: ${centerX}px;
            top: ${centerY}px;
            pointer-events: none;
            z-index: 10000;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 15;
        const velocity = 100 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.animate([
            { 
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1,
                background: '#00F5FF'
            },
            { 
                transform: `translate(${vx - 50}%, ${vy - 50}%) scale(0)`,
                opacity: 0,
                background: '#FF2D95'
            }
        ], {
            duration: 1500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) return;
        
        // Initially hide answers
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease';
        
        // Add click handler
        question.addEventListener('click', () => {
            const isOpen = answer.style.maxHeight !== '0px';
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherQuestion = otherItem.querySelector('.faq-question');
                    if (otherAnswer && otherQuestion) {
                        otherAnswer.style.maxHeight = '0';
                        otherQuestion.classList.remove('active');
                    }
                }
            });
            
            // Toggle current item
            if (isOpen) {
                answer.style.maxHeight = '0';
                question.classList.remove('active');
            } else {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                question.classList.add('active');
            }
        });
        
        // Add hover effect
        question.addEventListener('mouseenter', () => {
            question.style.color = '#FF2D95';
        });
        
        question.addEventListener('mouseleave', () => {
            if (!question.classList.contains('active')) {
                question.style.color = '#00F5FF';
            }
        });
    });
}

function checkBundleData() {
    // Check if user came from bundle configurator
    const urlParams = new URLSearchParams(window.location.search);
    const bundleData = localStorage.getItem('selectedBundle');
    
    if (urlParams.get('bundle') === 'true' && bundleData) {
        try {
            const services = JSON.parse(bundleData);
            displayBundleInfo(services);
        } catch (error) {
            console.error('Error parsing bundle data:', error);
        }
    }
}

function displayBundleInfo(services) {
    const form = document.getElementById('contactForm');
    if (!form || services.length === 0) return;
    
    // Create bundle summary
    const bundleInfo = document.createElement('div');
    bundleInfo.className = 'bundle-summary';
    bundleInfo.style.cssText = `
        background: rgba(0, 245, 255, 0.1);
        border: 1px solid rgba(0, 245, 255, 0.3);
        border-radius: 10px;
        padding: 1.5rem;
        margin-bottom: 2rem;
    `;
    
    let total = 0;
    let serviceList = '<h4 style="color: #00F5FF; margin-bottom: 1rem;">Your Selected Bundle:</h4>';
    
    services.forEach(([id, service]) => {
        serviceList += `<div style="margin-bottom: 0.5rem;">• ${service.name} - $${service.price.toFixed(2)}/month</div>`;
        total += service.price;
    });
    
    // Apply bundle discount
    let discount = 0;
    if (services.length >= 3) {
        discount = total * 0.15;
    } else if (services.length >= 2) {
        discount = total * 0.1;
    }
    
    const finalTotal = total - discount;
    
    serviceList += `
        <hr style="border: 1px solid rgba(0, 245, 255, 0.2); margin: 1rem 0;">
        ${discount > 0 ? `<div style="color: #FF2D95;">Bundle Discount: -$${discount.toFixed(2)}</div>` : ''}
        <div style="font-size: 1.2rem; font-weight: bold; color: #00F5FF;">
            Total: $${finalTotal.toFixed(2)}/month
        </div>
    `;
    
    bundleInfo.innerHTML = serviceList;
    form.parentNode.insertBefore(bundleInfo, form);
    
    // Pre-populate message field
    const messageField = document.getElementById('message');
    if (messageField) {
        messageField.value = `Hi! I'm interested in the bundle I configured on your website:\n\n${services.map(([id, service]) => `• ${service.name}`).join('\n')}\n\nTotal: $${finalTotal.toFixed(2)}/month\n\nPlease contact me to get started!`;
        
        // Trigger floating label
        const floatingLabel = messageField.parentNode.querySelector('.floating-label');
        if (floatingLabel) {
            floatingLabel.style.top = '0.5rem';
            floatingLabel.style.fontSize = '0.8rem';
            floatingLabel.style.color = '#00F5FF';
        }
    }
}

// Add CSS for FAQ animations and form enhancements
const style = document.createElement('style');
style.textContent = `
    .faq-question.active {
        color: #FF2D95 !important;
    }
    
    .faq-question::after {
        content: '+';
        float: right;
        font-size: 1.2rem;
        transition: transform 0.3s ease;
    }
    
    .faq-question.active::after {
        transform: rotate(45deg);
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 245, 255, 0.2);
    }
    
    @media (max-width: 768px) {
        .floating-call-btn {
            display: block !important;
        }
    }
`;
document.head.appendChild(style);