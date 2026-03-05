/**
 * Event Detail Page JavaScript - Editorial Style
 */

// Current event data
let currentEvent = null;
let eventPrice = 0;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    loadEventDetails();
});

/**
 * Load event details from URL parameter
 */
async function loadEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (!eventId) {
        showNotFound();
        return;
    }
    
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
        
        currentEvent = events.find(e => e.id === eventId);
        
        if (!currentEvent) {
            showNotFound();
            return;
        }
        
        renderEventDetails();
        loadRelatedEvents(events);
        
    } catch (error) {
        console.error('Error loading event:', error);
        showNotFound();
    }
}

/**
 * Show not found state
 */
function showNotFound() {
    document.getElementById('eventLoading').style.display = 'none';
    document.getElementById('eventNotFound').style.display = 'flex';
    document.getElementById('eventContent').style.display = 'none';
}

/**
 * Render event details to the page
 */
function renderEventDetails() {
    const event = currentEvent;
    eventPrice = event.price;
    
    // Update page title
    document.title = `${event.title} | BeWell Events`;
    
    // Update hero section
    document.getElementById('eventHeroImg').src = event.image || 'https://via.placeholder.com/1200x800?text=Event';
    document.getElementById('eventHeroImg').alt = event.title;
    document.getElementById('eventTag').textContent = event.tags[0] || 'Event';
    document.getElementById('eventFeatured').style.display = event.featured ? 'inline-block' : 'none';
    document.getElementById('eventTitle').textContent = event.title;
    
    // Format date
    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('eventDate').textContent = dateStr;
    
    document.getElementById('eventTime').textContent = `${formatTime(event.time)} · ${event.duration}`;
    document.getElementById('eventDuration').textContent = event.duration;
    document.getElementById('eventLocation').textContent = event.location.split(',')[0];
    
    // Update description
    document.getElementById('eventDescription').textContent = event.description;
    
    // Update booking card
    document.getElementById('eventPrice').textContent = `${event.currency}${event.price}`;
    document.getElementById('eventCapacity').textContent = `${event.capacity} people`;
    
    const isSoldOut = event.status === 'sold-out' || event.spotsLeft === 0;
    const spotsEl = document.getElementById('eventSpots');
    spotsEl.textContent = isSoldOut ? 'Sold Out' : `${event.spotsLeft} spots available`;
    spotsEl.style.color = event.spotsLeft <= 3 && !isSoldOut ? '#C4A77D' : '';
    
    // Show/hide booking button vs sold out message
    const bookingActions = document.getElementById('bookingActions');
    const soldOutMessage = document.getElementById('soldOutMessage');
    
    if (isSoldOut) {
        bookingActions.style.display = 'none';
        soldOutMessage.style.display = 'block';
    } else {
        bookingActions.style.display = 'flex';
        soldOutMessage.style.display = 'none';
        
        // Setup booking button
        document.getElementById('bookButton').addEventListener('click', openBookingModal);
    }
    
    // Setup share button
    document.getElementById('shareButton').addEventListener('click', openShareModal);
    
    // Update modal event details
    document.getElementById('modalEventTitle').textContent = event.title;
    document.getElementById('modalEventDate').textContent = `${dateStr} at ${formatTime(event.time)}`;
    
    // Setup quantity change for booking total
    document.getElementById('quantity').addEventListener('change', updateBookingTotal);
    
    // Setup booking form
    document.getElementById('bookingForm').addEventListener('submit', handleBooking);
    
    // Show content
    document.getElementById('eventLoading').style.display = 'none';
    document.getElementById('eventNotFound').style.display = 'none';
    document.getElementById('eventContent').style.display = 'block';
}

/**
 * Load related events
 */
function loadRelatedEvents(allEvents) {
    const relatedGrid = document.getElementById('relatedEventsGrid');
    
    // Find events with similar tags, excluding current event
    const related = allEvents
        .filter(e => 
            e.id !== currentEvent.id && 
            e.status === 'active' &&
            e.tags.some(tag => currentEvent.tags.includes(tag))
        )
        .slice(0, 2);
    
    // If not enough related, add upcoming events
    if (related.length < 2) {
        const upcoming = allEvents
            .filter(e => 
                e.id !== currentEvent.id && 
                e.status === 'active' &&
                !related.includes(e)
            )
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 2 - related.length);
        
        related.push(...upcoming);
    }
    
    if (related.length === 0) {
        document.querySelector('.related-events-editorial').style.display = 'none';
        return;
    }
    
    relatedGrid.innerHTML = related.map(event => createRelatedEventCard(event)).join('');
}

/**
 * Create HTML for a related event card
 */
function createRelatedEventCard(event) {
    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
    });
    
    return `
        <article class="event-card-editorial">
            <div class="event-card-image">
                <img src="${event.image || 'https://via.placeholder.com/600x800?text=Event'}" alt="${event.title}">
            </div>
            <div class="event-card-content">
                <div class="event-card-date">${dateStr} · ${event.time}</div>
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-description">${event.shortDescription || event.description.substring(0, 100)}...</p>
                <div class="event-card-footer">
                    <div class="event-card-price">${event.currency}${event.price}</div>
                    <a href="event-detail.html?id=${event.id}" class="btn-outline">View</a>
                </div>
            </div>
        </article>
    `;
}

/**
 * Format time from 24h to 12h format
 */
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Update booking total based on quantity
 */
function updateBookingTotal() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const total = eventPrice * quantity;
    document.getElementById('bookingTotal').textContent = `$${total}`;
}

/**
 * Open booking modal
 */
function openBookingModal() {
    updateBookingTotal();
    document.getElementById('bookingModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close booking modal
 */
function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Handle booking form submission
 */
function handleBooking(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const booking = {
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        quantity: parseInt(formData.get('quantity')),
        notes: formData.get('notes'),
        total: eventPrice * parseInt(formData.get('quantity')),
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Save booking to localStorage
    const bookings = JSON.parse(localStorage.getItem('bewell_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bewell_bookings', JSON.stringify(bookings));
    
    // Update event spots
    const events = JSON.parse(localStorage.getItem('bewell_events') || '[]');
    const eventIndex = events.findIndex(e => e.id === currentEvent.id);
    if (eventIndex !== -1) {
        events[eventIndex].spotsLeft -= booking.quantity;
        if (events[eventIndex].spotsLeft <= 0) {
            events[eventIndex].status = 'sold-out';
        }
        localStorage.setItem('bewell_events', JSON.stringify(events));
    }
    
    // Close modal and show success
    closeBookingModal();
    
    // Show success message
    showToast('Reservation confirmed! Check your email for details.');
    
    // Reset form
    e.target.reset();
    
    // Reload to update spots
    setTimeout(() => loadEventDetails(), 1500);
}

/**
 * Open share modal
 */
function openShareModal() {
    document.getElementById('shareModal').classList.add('active');
}

/**
 * Close share modal
 */
function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
}

/**
 * Share on Facebook
 */
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

/**
 * Share on Twitter
 */
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Join me at ${currentEvent?.title || 'this event'}!`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

/**
 * Copy link to clipboard
 */
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('Link copied to clipboard!');
        closeShareModal();
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Failed to copy link', 'error');
    });
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : '⚠️'}</span>
        <span class="toast-message">${message}</span>
    `;
    
    // Add styles if not already added
    if (!document.getElementById('toastStyles')) {
        const styles = document.createElement('style');
        styles.id = 'toastStyles';
        styles.textContent = `
            .toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: var(--color-charcoal);
                color: var(--color-warm-white);
                padding: 16px 28px;
                border-radius: 0;
                display: flex;
                align-items: center;
                gap: 12px;
                font-weight: 500;
                z-index: 10000;
                opacity: 0;
                transition: all 0.3s ease;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            }
            .toast.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            .toast-error { background: #C4A77D; }
            .toast-icon { font-size: 1.2rem; }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Close modals on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modals on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});
