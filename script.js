/**
 * BeWell - Breathwork & Ice Bath Website
 * JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // ========================================
    // Navbar Scroll Effect
    // ========================================
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            navbar.classList.toggle('scrolled', currentScroll > 50);
            lastScroll = currentScroll;
        });
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Modal Functionality
    // ========================================
    const modal = document.getElementById('successModal');
    
    // Make closeModal function globally accessible
    window.closeModal = function() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Open modal function
    window.openModal = function() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ========================================
    // Contact Form Handling
    // ========================================
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form data
            if (!validateForm(data)) {
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Simulate API call
            setTimeout(function() {
                // Reset form
                contactForm.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Show success modal
                openModal();
                
                // Log form data (in production, this would be sent to a server)
                console.log('Form submitted:', data);
            }, 1500);
        });
    }

    // Form validation function
    function validateForm(data) {
        const errors = [];

        if (!data.name || data.name.trim() === '') {
            errors.push('Name is required');
        }

        if (!data.email || data.email.trim() === '') {
            errors.push('Email is required');
        } else if (!isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (errors.length > 0) {
            console.error('Validation errors:', errors);
            return false;
        }

        return true;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ========================================
    // Scroll Animation on Elements
    // ========================================
    const animateOnScroll = function() {
        const elements = document.querySelectorAll(
            '.service-card, .benefit-card, .testimonial-card, .process-step'
        );
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize animation styles
    const animatedElements = document.querySelectorAll(
        '.service-card, .benefit-card, .testimonial-card, .process-step'
    );
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });

    // Run animation check on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // ========================================
    // Stats Counter Animation
    // ========================================
    const statsSection = document.querySelector('.hero-stats');
    let statsAnimated = false;

    const animateStats = function() {
        if (statsAnimated) return;
        
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = stat.textContent;
            const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
            const suffix = target.replace(/[0-9]/g, '');
            const duration = 2000;
            const step = numericValue / (duration / 16);
            let current = 0;
            
            const updateCounter = function() {
                current += step;
                if (current < numericValue) {
                    stat.textContent = Math.floor(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
        
        statsAnimated = true;
    };

    // Trigger stats animation when hero section is in view
    const observeStats = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        observeStats.observe(statsSection);
    }

    // ========================================
    // Parallax Effect for Hero Shapes
    // ========================================
    const shapes = document.querySelectorAll('.shape');
    
    if (!window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 10;
                const x = (mouseX - 0.5) * speed;
                const y = (mouseY - 0.5) * speed;
                
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // ========================================
    // Input Focus Effects
    // ========================================
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // ========================================
    // Service Cards Hover Effect Enhancement
    // ========================================
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            setTimeout(() => {
                this.style.zIndex = '1';
            }, 300);
        });
    });

    // ========================================
    // Testimonial Cards Auto-rotate (Optional)
    // ========================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;

    // Add subtle highlight to testimonials on mobile
    if (window.innerWidth < 768 && testimonialCards.length > 0) {
        testimonialCards.forEach((card, index) => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function() {
                testimonialCards.forEach(c => c.style.opacity = '0.6');
                this.style.opacity = '1';
            });
        });
        
        // Set first one as active initially
        testimonialCards.forEach((card, index) => {
            if (index !== 0) card.style.opacity = '0.6';
        });
    }

    // ========================================
    // Load Upcoming Events on Homepage
    // ========================================
    loadHomepageEvents();
    
    // ========================================
    // Console Welcome Message
    // ========================================
    console.log('%c🧘 Welcome to BeWell', 'color: #0d7377; font-size: 24px; font-weight: bold;');
    console.log('%cTransform through breath and cold. Discover your inner strength with Terry.', 'color: #4a4a5a; font-size: 14px;');
});

/**
 * Load and display upcoming events on homepage
 */
async function loadHomepageEvents() {
    const eventsGrid = document.getElementById('homeEventsGrid');
    if (!eventsGrid) return;
    
    try {
        // Try localStorage first
        const storedEvents = localStorage.getItem('bewell_events');
        let events = [];
        
        if (storedEvents) {
            events = JSON.parse(storedEvents);
        } else {
            const response = await fetch('events.json');
            const data = await response.json();
            events = data.events || [];
        }
        
        // Filter active events, sort by date, take first 3
        const upcomingEvents = events
            .filter(e => e.status === 'active')
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
        
        if (upcomingEvents.length === 0) {
            eventsGrid.innerHTML = '<p class="no-events">No upcoming events. Check back soon!</p>';
            return;
        }
        
        eventsGrid.innerHTML = upcomingEvents.map(event => createHomeEventCard(event)).join('');
        
    } catch (error) {
        console.error('Error loading homepage events:', error);
        eventsGrid.innerHTML = '<p class="no-events">Events coming soon!</p>';
    }
}

/**
 * Create HTML for homepage event card
 */
function createHomeEventCard(event) {
    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    
    return `
        <article class="event-card">
            <div class="event-card-image">
                <img src="${event.image || 'https://via.placeholder.com/400x200?text=Event'}" alt="${event.title}">
            </div>
            <div class="event-card-content">
                <div class="event-card-date">📅 ${dateStr} · ${event.time}</div>
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-description">${event.shortDescription || event.description.substring(0, 100)}...</p>
                <div class="event-card-footer">
                    <span class="event-card-price">${event.currency}${event.price}</span>
                    <a href="event-detail.html?id=${event.id}" class="btn-primary">Learn More</a>
                </div>
            </div>
        </article>
    `;
}

// ========================================
// Utility Functions
// ========================================

/**
 * Debounce function to limit how often a function can fire
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to limit execution rate
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
