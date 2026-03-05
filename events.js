/**
 * Events Page JavaScript
 * Handles loading, filtering, and displaying events
 */

// Global events data
let allEvents = [];
let filteredEvents = [];

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    setupFilters();
});

/**
 * Load events from JSON file
 */
async function loadEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const noEvents = document.getElementById('noEvents');
    
    try {
        // Try to get events from localStorage first (for admin updates)
        const storedEvents = localStorage.getItem('bewell_events');
        
        if (storedEvents) {
            allEvents = JSON.parse(storedEvents);
        } else {
            // Fall back to fetching from JSON file
            const response = await fetch('events.json');
            const data = await response.json();
            allEvents = data.events || [];
        }
        
        // Filter only active events
        filteredEvents = allEvents.filter(e => e.status === 'active' || e.status === 'sold-out');
        
        // Sort by date (soonest first)
        filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        renderEvents(filteredEvents);
        renderFeaturedEvents();
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsGrid.innerHTML = `
            <div class="no-events">
                <div class="no-events-icon">⚠️</div>
                <h3>Could not load events</h3>
                <p>Please try refreshing the page.</p>
            </div>
        `;
    }
}

/**
 * Render events to the grid
 */
function renderEvents(events) {
    const eventsGrid = document.getElementById('eventsGrid');
    const noEvents = document.getElementById('noEvents');
    
    if (events.length === 0) {
        eventsGrid.innerHTML = '';
        noEvents.style.display = 'block';
        return;
    }
    
    noEvents.style.display = 'none';
    
    eventsGrid.innerHTML = events.map(event => createEventCard(event)).join('');
}

/**
 * Create HTML for an event card
 */
function createEventCard(event) {
    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const isSoldOut = event.status === 'sold-out' || event.spotsLeft === 0;
    const spotsClass = event.spotsLeft <= 3 ? 'low' : '';
    
    return `
        <article class="event-card" data-id="${event.id}">
            <div class="event-card-image">
                <img src="${event.image || 'https://via.placeholder.com/400x200?text=Event'}" alt="${event.title}">
                <div class="event-card-badges">
                    ${event.featured ? '<span class="event-badge featured">Featured</span>' : ''}
                    ${isSoldOut ? '<span class="event-badge sold-out">Sold Out</span>' : ''}
                    <span class="event-badge tag">${event.tags[0] || 'Event'}</span>
                </div>
            </div>
            <div class="event-card-content">
                <div class="event-card-date">
                    📅 ${dateStr}
                </div>
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-description">${event.shortDescription || event.description.substring(0, 120)}...</p>
                <div class="event-card-meta">
                    <div class="event-card-meta-item">
                        🕐 ${event.time} · ${event.duration}
                    </div>
                    <div class="event-card-meta-item">
                        📍 ${event.location.split(',')[0]}
                    </div>
                    <div class="event-card-meta-item">
                        🎫 ${isSoldOut ? 'Sold Out' : event.spotsLeft + ' spots left'}
                    </div>
                </div>
                <div class="event-card-footer">
                    <div class="event-card-price">
                        ${event.currency}${event.price}
                    </div>
                    <a href="event-detail.html?id=${event.id}" class="btn-primary">
                        ${isSoldOut ? 'Join Waitlist' : 'View Details'}
                    </a>
                </div>
            </div>
        </article>
    `;
}

/**
 * Render featured events
 */
function renderFeaturedEvents() {
    const featuredGrid = document.getElementById('featuredEventsGrid');
    const featuredSection = document.getElementById('featuredEvents');
    
    const featuredEvents = allEvents.filter(e => e.featured && e.status === 'active');
    
    if (featuredEvents.length === 0) {
        featuredSection.style.display = 'none';
        return;
    }
    
    featuredGrid.innerHTML = featuredEvents.map(event => createEventCard(event)).join('');
}

/**
 * Setup filter event listeners
 */
function setupFilters() {
    const typeFilter = document.getElementById('eventType');
    const monthFilter = document.getElementById('eventMonth');
    const searchInput = document.getElementById('eventSearch');
    
    const applyFilters = () => {
        let filtered = [...allEvents];
        
        // Filter by type/tag
        if (typeFilter.value !== 'all') {
            filtered = filtered.filter(e => 
                e.tags.includes(typeFilter.value) || 
                e.status === typeFilter.value
            );
        }
        
        // Filter by month
        if (monthFilter.value !== 'all') {
            filtered = filtered.filter(e => {
                const eventMonth = new Date(e.date).getMonth() + 1;
                return eventMonth === parseInt(monthFilter.value);
            });
        }
        
        // Filter by search
        if (searchInput.value.trim()) {
            const search = searchInput.value.toLowerCase();
            filtered = filtered.filter(e => 
                e.title.toLowerCase().includes(search) ||
                e.description.toLowerCase().includes(search) ||
                e.location.toLowerCase().includes(search)
            );
        }
        
        // Only show active/sold out events
        filtered = filtered.filter(e => e.status === 'active' || e.status === 'sold-out');
        
        // Sort by date
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        renderEvents(filtered);
    };
    
    typeFilter?.addEventListener('change', applyFilters);
    monthFilter?.addEventListener('change', applyFilters);
    searchInput?.addEventListener('input', debounce(applyFilters, 300));
}

/**
 * Debounce utility
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

// Listen for storage changes (when admin updates events)
window.addEventListener('storage', function(e) {
    if (e.key === 'bewell_events') {
        loadEvents();
    }
});
