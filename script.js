// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const chatBubble = document.getElementById('chat-bubble');
const chatPanel = document.getElementById('chat-panel');
const chatClose = document.getElementById('chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');
// Summer Carousel elements - specifically target summer content
const carouselTrack = document.querySelector('#summer-content .carousel-track');
const slides = document.querySelectorAll('#summer-content .carousel-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const langBtns = document.querySelectorAll('.lang-btn');

// Language support
let currentLanguage = 'al'; // Default to Albanian

// Navigation functionality
function initNavigation() {
    // Sticky navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Chat functionality
function initChat() {
    let isOpen = false;

    // Toggle chat panel
    chatBubble.addEventListener('click', () => {
        isOpen = !isOpen;
        if (isOpen) {
            chatPanel.classList.add('active');
            chatInput.focus();
        } else {
            chatPanel.classList.remove('active');
        }
    });

    // Close chat panel
    chatClose.addEventListener('click', () => {
        isOpen = false;
        chatPanel.classList.remove('active');
    });

    // Track message count for contact redirection
    let userMessageCount = 0;
    
    // Send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';
            userMessageCount++;
            
            console.log('User message count:', userMessageCount); // Debug log
            
            // After 3rd message, redirect to contact
            if (userMessageCount >= 3) {
                setTimeout(() => {
                    const contactMessage = window.contactMessages ? window.contactMessages[currentLanguage] || window.contactMessages.al : "Faleminderit për pyetjet tuaja! Për informacione më të detajuara dhe rezervime, ju lutemi na kontaktoni direkt në Viber ose WhatsApp: +383 45 411 400. Ekipi ynë është këtu për t'ju ndihmuar!";
                    addMessage(contactMessage, 'agent');
                }, 1000);
            } else {
                // Simulate agent response for first 2 messages
                setTimeout(() => {
                    const responses = window.chatResponses || [
                        "Faleminderit për mesazhin tuaj! Si mund t'ju ndihmoj të planifikoni udhëtimin tuaj të ardhshëm?",
                        "Do të isha i lumtur t'ju ndihmoj me rezervimin e fluturimeve, hoteleve ose sigurimit të udhëtimeve. Çfarë po kërkoni?",
                        "Pyetje e shkëlqyer! Ne ofrojmë shërbime gjithëpërfshirëse udhëtimesh. Cili destinacion ju intereson?",
                        "Mund t'ju ndihmoj të gjeni ofertat më të mira për fluturime dhe akomodime. Ku do të donit të shkoni?",
                        "Ekipi ynë është këtu për t'i bërë ëndrrat tuaja të udhëtimeve realitet! Si mund t'ju ndihmoj sot?"
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    addMessage(randomResponse, 'agent');
                }, 1000);
            }
        }
    }

    // Send message on button click or Enter key
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
}

// Destinations Carousel functionality
let currentSlide = 0;
const totalSlides = slides.length;

console.log('Summer carousel - Total slides:', totalSlides);

function updateCarousel() {
    if (carouselTrack) {
        const translateX = -currentSlide * 100;
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        carouselTrack.style.transition = 'transform 0.3s ease-in-out';
    }
}

function goToSlide(slideIndex) {
    console.log('goToSlide called with index:', slideIndex, 'totalSlides:', totalSlides);
    currentSlide = slideIndex;
    if (currentSlide >= totalSlides) {
        console.log('Looping back to first slide - instant transition');
        currentSlide = 0;
        // Instant transition back to first slide - no delay
        if (carouselTrack) {
            carouselTrack.style.transition = 'none';
            carouselTrack.style.transform = 'translateX(0%)';
            // Force immediate reflow
            void carouselTrack.offsetWidth;
            // Re-enable transition immediately
            requestAnimationFrame(() => {
                carouselTrack.style.transition = 'transform 0.3s ease-in-out';
                console.log('Transition re-enabled');
            });
        }
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
        updateCarousel();
    } else {
        updateCarousel();
    }
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

function initDestinations() {
    // Navigation arrows
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    // Auto-play carousel
    let autoPlayInterval;
    
    function startAutoPlay() {
        clearInterval(autoPlayInterval); // Clear any existing interval
        autoPlayInterval = setInterval(nextSlide, 8000); // Change slide every 8 seconds
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Start auto-play only if summer content is active
    const summerContent = document.getElementById('summer-content');
    if (summerContent && summerContent.classList.contains('active')) {
        startAutoPlay();
    }
    
    // Monitor summer content activation
    if (summerContent) {
        const summerObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (summerContent.classList.contains('active')) {
                        startAutoPlay();
                    } else {
                        stopAutoPlay();
                    }
                }
            });
        });
        
        summerObserver.observe(summerContent, { attributes: true });
    }
    
    // Pause auto-play on hover and touch
    const carouselContainer = document.querySelector('#summer-content .carousel-container');
    if (carouselContainer) {
        // Mouse hover events
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', () => {
            if (summerContent && summerContent.classList.contains('active')) {
                startAutoPlay();
            }
        });
        
        // Touch events for mobile
        carouselContainer.addEventListener('touchstart', stopAutoPlay);
        carouselContainer.addEventListener('touchend', () => {
            // Resume auto-play after 3 seconds of no touch
            setTimeout(() => {
                if (summerContent && summerContent.classList.contains('active')) {
                    startAutoPlay();
                }
            }, 3000);
        });
        
        // Mouse click events
        carouselContainer.addEventListener('mousedown', stopAutoPlay);
        carouselContainer.addEventListener('mouseup', () => {
            // Resume auto-play after 3 seconds of no interaction
            setTimeout(() => {
                if (summerContent && summerContent.classList.contains('active')) {
                    startAutoPlay();
                }
            }, 3000);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        carouselContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe destination cards
    document.querySelectorAll('.destination-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Parallax effect for hero section
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.cloud, .airplane, .wave');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Loading animation
function initLoadingAnimation() {
    // Add loading class to body
    document.body.classList.add('loading');
    
    // Remove loading class after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 500);
    });
}

// Service card hover effects
function initServiceCards() {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Smooth reveal animations for sections
function initSectionReveals() {
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Language switching functionality
function initLanguageSwitching() {
    // Language switching
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
            
            // Update active button
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

function switchLanguage(lang) {
    currentLanguage = lang;
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-' + lang + ']');
    elements.forEach(element => {
        const text = element.getAttribute('data-' + lang);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update placeholders
    const inputs = document.querySelectorAll('input[data-' + lang + ']');
    inputs.forEach(input => {
        const placeholder = input.getAttribute('data-' + lang);
        if (placeholder) {
            input.placeholder = placeholder;
        }
    });
    
    // Update title
    const title = document.querySelector('title');
    const titleText = title.getAttribute('data-' + lang);
    if (titleText) {
        title.textContent = titleText;
    }
    
    // Update chat responses based on language
    updateChatResponses(lang);
}

function updateChatResponses(lang) {
    const responses = {
        al: [
            "Faleminderit për mesazhin tuaj! Si mund t'ju ndihmoj të planifikoni udhëtimin tuaj të ardhshëm?",
            "Do të isha i lumtur t'ju ndihmoj me rezervimin e fluturimeve, hoteleve ose sigurimit të udhëtimeve. Çfarë po kërkoni?",
            "Pyetje e shkëlqyer! Ne ofrojmë shërbime gjithëpërfshirëse udhëtimesh. Cili destinacion ju intereson?",
            "Mund t'ju ndihmoj të gjeni ofertat më të mira për fluturime dhe akomodime. Ku do të donit të shkoni?",
            "Ekipi ynë është këtu për t'i bërë ëndrrat tuaja të udhëtimeve realitet! Si mund t'ju ndihmoj sot?"
        ],
        en: [
            "Thank you for your message! How can I help you plan your next trip?",
            "I'd be happy to assist you with booking flights, hotels, or travel insurance. What are you looking for?",
            "Great question! We offer comprehensive travel services. What destination interests you?",
            "I can help you find the best deals on flights and accommodations. Where would you like to go?",
            "Our team is here to make your travel dreams come true! What can I help you with today?"
        ],
        de: [
            "Vielen Dank für Ihre Nachricht! Wie kann ich Ihnen bei der Planung Ihrer nächsten Reise helfen?",
            "Ich helfe Ihnen gerne beim Buchen von Flügen, Hotels oder Reiseversicherungen. Wonach suchen Sie?",
            "Großartige Frage! Wir bieten umfassende Reisedienstleistungen. Welches Reiseziel interessiert Sie?",
            "Ich kann Ihnen helfen, die besten Angebote für Flüge und Unterkünfte zu finden. Wohin möchten Sie reisen?",
            "Unser Team ist hier, um Ihre Reiseträume wahr werden zu lassen! Womit kann ich Ihnen heute helfen?"
        ]
    };
    
    // Store responses for use in chat
    window.chatResponses = responses[lang] || responses.al;
    
    // Store contact messages for each language
    window.contactMessages = {
        al: "Faleminderit për pyetjet tuaja! Për informacione më të detajuara dhe rezervime, ju lutemi na kontaktoni direkt në Viber ose WhatsApp: +383 45 411 400. Ekipi ynë është këtu për t'ju ndihmuar!",
        en: "Thank you for your questions! For more detailed information and bookings, please contact us directly on Viber or WhatsApp: +383 45 411 400. Our team is here to help you!",
        de: "Vielen Dank für Ihre Fragen! Für detailliertere Informationen und Buchungen kontaktieren Sie uns bitte direkt über Viber oder WhatsApp: +383 45 411 400. Unser Team ist hier, um Ihnen zu helfen!"
    };
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initChat();
    initDestinations();
    initScrollAnimations();
    initParallax();
    initLoadingAnimation();
    initServiceCards();
    initSectionReveals();
    initLanguageSwitching();
    
    // Add some CSS for loading animation
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            overflow: hidden;
        }
        
        .loading .hero-content {
            opacity: 0;
            transform: translateY(50px);
        }
        
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        section.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
        });
    });

    // Add click ripple effect to service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(102, 126, 234, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Health Insurance Modal functionality
    const insuranceService = document.querySelector('.service-card:nth-child(4)'); // Health Insurance is the 4th service
    const insuranceModal = document.getElementById('insurance-modal');
    const insuranceCloseBtn = document.getElementById('modal-close');
    const insuranceContactBtn = document.querySelector('#insurance-modal .contact-button');

    // Open modal when Health Insurance service is clicked
    if (insuranceService) {
        insuranceService.addEventListener('click', function(e) {
            e.preventDefault();
            insuranceModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close modal when X button is clicked
    if (insuranceCloseBtn) {
        insuranceCloseBtn.addEventListener('click', function() {
            insuranceModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    if (insuranceModal) {
        insuranceModal.addEventListener('click', function(e) {
            if (e.target === insuranceModal) {
                insuranceModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Contact button functionality
    if (insuranceContactBtn) {
        insuranceContactBtn.addEventListener('click', function() {
            // Close the modal and open chat
            insuranceModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Open chat bubble
            const chatBubble = document.querySelector('.chat-bubble');
            if (chatBubble) {
                chatBubble.click();
            }
        });
    }

    // Flight Tickets Modal functionality
    const flightsService = document.querySelector('.service-card:nth-child(1)'); // Flight Tickets is the 1st service
    const flightsModal = document.getElementById('flights-modal');
    const flightsCloseBtn = document.getElementById('flights-modal-close');
    const flightsContactBtn = document.querySelector('#flights-modal .contact-button');

    // Open modal when Flight Tickets service is clicked
    if (flightsService) {
        flightsService.addEventListener('click', function(e) {
            e.preventDefault();
            flightsModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close modal when X button is clicked
    if (flightsCloseBtn) {
        flightsCloseBtn.addEventListener('click', function() {
            flightsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    if (flightsModal) {
        flightsModal.addEventListener('click', function(e) {
            if (e.target === flightsModal) {
                flightsModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Contact button functionality
    if (flightsContactBtn) {
        flightsContactBtn.addEventListener('click', function() {
            // Close the modal and open chat
            flightsModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Open chat bubble
            const chatBubble = document.querySelector('.chat-bubble');
            if (chatBubble) {
                chatBubble.click();
            }
        });
    }

    // Boat Tickets Modal functionality
    const boatService = document.querySelector('.service-card:nth-child(2)'); // Boat Tickets is the 2nd service
    const boatModal = document.getElementById('boat-modal');
    const boatCloseBtn = document.getElementById('boat-modal-close');
    const boatContactBtn = document.querySelector('#boat-modal .contact-button');

    // Open modal when Boat Tickets service is clicked
    if (boatService) {
        boatService.addEventListener('click', function(e) {
            e.preventDefault();
            boatModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close modal when X button is clicked
    if (boatCloseBtn) {
        boatCloseBtn.addEventListener('click', function() {
            boatModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    if (boatModal) {
        boatModal.addEventListener('click', function(e) {
            if (e.target === boatModal) {
                boatModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Contact button functionality
    if (boatContactBtn) {
        boatContactBtn.addEventListener('click', function() {
            // Close the modal and open chat
            boatModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Open chat bubble
            const chatBubble = document.querySelector('.chat-bubble');
            if (chatBubble) {
                chatBubble.click();
            }
        });
    }

    // Bus Tickets Modal functionality
    const busService = document.querySelector('.service-card:nth-child(3)'); // Bus Tickets is the 3rd service
    const busModal = document.getElementById('bus-modal');
    const busCloseBtn = document.getElementById('bus-modal-close');
    const busContactBtn = document.querySelector('#bus-modal .contact-button');

    // Open modal when Bus Tickets service is clicked
    if (busService) {
        busService.addEventListener('click', function(e) {
            e.preventDefault();
            busModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }

    // Close modal when X button is clicked
    if (busCloseBtn) {
        busCloseBtn.addEventListener('click', function() {
            busModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    if (busModal) {
        busModal.addEventListener('click', function(e) {
            if (e.target === busModal) {
                busModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Contact button functionality
    if (busContactBtn) {
        busContactBtn.addEventListener('click', function() {
            // Close the modal and open chat
            busModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Open chat bubble
            const chatBubble = document.querySelector('.chat-bubble');
            if (chatBubble) {
                chatBubble.click();
            }
        });
    }

    // Seasonal Holidays Toggle functionality
    const seasonBtns = document.querySelectorAll('.season-btn');
    const seasonContents = document.querySelectorAll('.season-content');

    seasonBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const season = btn.getAttribute('data-season');
            
            // Remove active class from all buttons and contents
            seasonBtns.forEach(b => b.classList.remove('active'));
            seasonContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(season + '-content');
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // Initialize with summer content active
    const summerBtn = document.querySelector('[data-season="summer"]');
    const summerContent = document.getElementById('summer-content');
    if (summerBtn && summerContent) {
        summerBtn.classList.add('active');
        summerContent.classList.add('active');
    }

    // Winter carousel functionality
    const winterCarouselTrack = document.querySelector('#winter-content .carousel-track');
    const winterSlides = document.querySelectorAll('#winter-content .carousel-slide');
    const winterPrevBtn = document.getElementById('winterPrevBtn');
    const winterNextBtn = document.getElementById('winterNextBtn');
    
    let currentWinterSlide = 0;
    const totalWinterSlides = winterSlides.length;

    function updateWinterCarousel() {
        if (winterCarouselTrack) {
            const translateX = -currentWinterSlide * 100;
            winterCarouselTrack.style.transform = `translateX(${translateX}%)`;
            winterCarouselTrack.style.transition = 'transform 0.3s ease-in-out';
        }
    }

    function goToWinterSlide(slideIndex) {
        currentWinterSlide = slideIndex;
        if (currentWinterSlide >= totalWinterSlides) {
            currentWinterSlide = 0;
            // Instant transition back to first slide - no delay
            if (winterCarouselTrack) {
                winterCarouselTrack.style.transition = 'none';
                winterCarouselTrack.style.transform = 'translateX(0%)';
                // Force immediate reflow
                void winterCarouselTrack.offsetWidth;
                // Re-enable transition immediately
                requestAnimationFrame(() => {
                    winterCarouselTrack.style.transition = 'transform 0.3s ease-in-out';
                });
            }
        } else if (currentWinterSlide < 0) {
            currentWinterSlide = totalWinterSlides - 1;
            updateWinterCarousel();
        } else {
            updateWinterCarousel();
        }
    }

    function nextWinterSlide() {
        goToWinterSlide(currentWinterSlide + 1);
    }

    function prevWinterSlide() {
        goToWinterSlide(currentWinterSlide - 1);
    }

    // Winter carousel navigation
    if (winterNextBtn) {
        winterNextBtn.addEventListener('click', nextWinterSlide);
    }
    
    if (winterPrevBtn) {
        winterPrevBtn.addEventListener('click', prevWinterSlide);
    }
    
    // Auto-play winter carousel
    let winterAutoPlayInterval;
    
    function startWinterAutoPlay() {
        clearInterval(winterAutoPlayInterval); // Clear any existing interval
        winterAutoPlayInterval = setInterval(nextWinterSlide, 8000);
    }
    
    function stopWinterAutoPlay() {
        clearInterval(winterAutoPlayInterval);
    }
    
    // Start winter auto-play when winter content is shown
    const winterContent = document.getElementById('winter-content');
    if (winterContent) {
        const winterObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (winterContent.classList.contains('active')) {
                        startWinterAutoPlay();
                    } else {
                        stopWinterAutoPlay();
                    }
                }
            });
        });
        
        winterObserver.observe(winterContent, { attributes: true });
    }
    
    // Pause winter auto-play on hover and touch
    const winterCarouselContainer = document.querySelector('#winter-content .carousel-container');
    if (winterCarouselContainer) {
        // Mouse hover events
        winterCarouselContainer.addEventListener('mouseenter', stopWinterAutoPlay);
        winterCarouselContainer.addEventListener('mouseleave', () => {
            if (winterContent && winterContent.classList.contains('active')) {
                startWinterAutoPlay();
            }
        });
        
        // Touch events for mobile
        winterCarouselContainer.addEventListener('touchstart', stopWinterAutoPlay);
        winterCarouselContainer.addEventListener('touchend', () => {
            // Resume auto-play after 3 seconds of no touch
            setTimeout(() => {
                if (winterContent && winterContent.classList.contains('active')) {
                    startWinterAutoPlay();
                }
            }, 3000);
        });
        
        // Mouse click events
        winterCarouselContainer.addEventListener('mousedown', stopWinterAutoPlay);
        winterCarouselContainer.addEventListener('mouseup', () => {
            // Resume auto-play after 3 seconds of no interaction
            setTimeout(() => {
                if (winterContent && winterContent.classList.contains('active')) {
                    startWinterAutoPlay();
                }
            }, 3000);
        });
    }
});
