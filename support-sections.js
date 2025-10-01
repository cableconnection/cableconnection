// Support Sections JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    initLiveAgents();
    initInternetIssues();
    initTechnicianBooking();
});

// Live Agents Section
function initLiveAgents() {
    const chatButtons = document.querySelectorAll('.agent-chat-btn');
    
    chatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const agentType = this.getAttribute('data-type');
            startChat(agentType);
        });
    });
}

function startChat(agentType) {
    // Create chat modal
    const modal = document.createElement('div');
    modal.className = 'chat-modal';
    modal.innerHTML = `
        <div class="chat-container">
            <div class="chat-header">
                <h3>Chat with ${agentType.charAt(0).toUpperCase() + agentType.slice(1)} Support</h3>
                <button class="chat-close">&times;</button>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="agent-message">
                    <div class="message-avatar">👨‍💼</div>
                    <div class="message-content">
                        <p>Hi! I'm here to help you with ${agentType} support. What can I assist you with today?</p>
                    </div>
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chatInput" placeholder="Type your message..." />
                <button id="chatSend">Send</button>
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .chat-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .chat-container {
            background: white;
            width: 90%;
            max-width: 500px;
            height: 600px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .chat-header {
            background: var(--color-black);
            color: white;
            padding: 1rem;
            border-radius: 12px 12px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .chat-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .chat-messages {
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
        }
        
        .agent-message {
            display: flex;
            margin-bottom: 1rem;
        }
        
        .message-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: var(--color-gray-light);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 0.5rem;
        }
        
        .message-content {
            background: var(--color-gray-lighter);
            padding: 0.75rem;
            border-radius: 12px;
            max-width: 70%;
        }
        
        .chat-input-area {
            padding: 1rem;
            border-top: 1px solid var(--color-gray-light);
            display: flex;
            gap: 0.5rem;
        }
        
        #chatInput {
            flex: 1;
            padding: 0.75rem;
            border: 2px solid var(--color-gray-light);
            border-radius: 8px;
        }
        
        #chatSend {
            background: var(--color-black);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Handle modal close
    modal.querySelector('.chat-close').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    // Handle chat functionality
    const chatInput = modal.querySelector('#chatInput');
    const chatSend = modal.querySelector('#chatSend');
    const chatMessages = modal.querySelector('#chatMessages');
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'user-message';
            userMessage.innerHTML = `
                <div class="message-content" style="background: var(--color-black); color: white; margin-left: auto;">
                    <p>${message}</p>
                </div>
            `;
            chatMessages.appendChild(userMessage);
            chatInput.value = '';
            
            // Simulate agent response
            setTimeout(() => {
                const agentResponse = document.createElement('div');
                agentResponse.className = 'agent-message';
                agentResponse.innerHTML = `
                    <div class="message-avatar">👨‍💼</div>
                    <div class="message-content">
                        <p>Thanks for your message! For immediate assistance, please call us at (855) 569-7568. Our team will be happy to help you with your ${agentType} needs.</p>
                    </div>
                `;
                chatMessages.appendChild(agentResponse);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Internet Issues Section
function initInternetIssues() {
    const troubleshootBtn = document.querySelector('.btn-troubleshoot');
    
    if (troubleshootBtn) {
        troubleshootBtn.addEventListener('click', function() {
            startTroubleshooting();
        });
    }
}

function startTroubleshooting() {
    const steps = [
        "Checking your connection status...",
        "Running speed diagnostics...",
        "Analyzing network performance...",
        "Identifying potential issues..."
    ];
    
    const modal = document.createElement('div');
    modal.className = 'troubleshoot-modal';
    modal.innerHTML = `
        <div class="troubleshoot-container">
            <h3>Running Diagnostics</h3>
            <div class="progress-bar">
                <div class="progress-fill" id="progressFill"></div>
            </div>
            <p id="currentStep">${steps[0]}</p>
            <button id="closeTroubleshoot" style="display: none;">Close</button>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .troubleshoot-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .troubleshoot-container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: var(--color-gray-light);
            border-radius: 4px;
            margin: 1rem 0;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--color-black);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    const progressFill = modal.querySelector('#progressFill');
    const currentStep = modal.querySelector('#currentStep');
    const closeBtn = modal.querySelector('#closeTroubleshoot');
    
    let stepIndex = 0;
    const interval = setInterval(() => {
        stepIndex++;
        progressFill.style.width = (stepIndex / steps.length) * 100 + '%';
        
        if (stepIndex < steps.length) {
            currentStep.textContent = steps[stepIndex];
        } else {
            clearInterval(interval);
            currentStep.innerHTML = `
                <strong style="color: #FF4444;">Issue Detected!</strong><br>
                We found some connectivity issues. Our technician can resolve this remotely or schedule a visit.<br>
                <a href="tel:+18555697568" style="color: var(--color-black); font-weight: bold;">Call (855) 569-7568</a>
            `;
            closeBtn.style.display = 'block';
        }
    }, 1500);
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
}

// Technician Booking Section
function initTechnicianBooking() {
    const bookingForm = document.querySelector('.tech-booking-form');
    
    if (bookingForm) {
        // Set minimum date to today
        const dateInput = bookingForm.querySelector('#preferredDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
        
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmission(this);
        });
    }
}

function handleBookingSubmission(form) {
    const formData = new FormData(form);
    const bookingData = {};
    
    for (let [key, value] of formData.entries()) {
        bookingData[key] = value;
    }
    
    // Show success message
    const modal = document.createElement('div');
    modal.className = 'booking-success-modal';
    modal.innerHTML = `
        <div class="success-container">
            <div class="success-icon">✅</div>
            <h3>Booking Confirmed!</h3>
            <p>Your technician visit has been scheduled for <strong>${bookingData.preferredDate}</strong> during <strong>${getTimeSlotText(bookingData.timeSlot)}</strong>.</p>
            <p>We'll call you at <strong>${bookingData.customerPhone}</strong> to confirm the exact time.</p>
            <p><strong>Reference #:</strong> TCH${Date.now().toString().slice(-6)}</p>
            <button id="closeBookingSuccess">Close</button>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .booking-success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .success-container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            max-width: 500px;
            width: 90%;
        }
        
        .success-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .success-container h3 {
            color: #00AA00;
            margin-bottom: 1rem;
        }
        
        .success-container p {
            margin-bottom: 1rem;
            line-height: 1.5;
        }
        
        #closeBookingSuccess {
            background: var(--color-black);
            color: white;
            border: none;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 1rem;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    modal.querySelector('#closeBookingSuccess').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
        form.reset();
    });
}

function getTimeSlotText(slot) {
    const slots = {
        'morning': 'Morning (8AM - 12PM)',
        'afternoon': 'Afternoon (12PM - 5PM)',
        'evening': 'Evening (5PM - 8PM)'
    };
    return slots[slot] || slot;
}