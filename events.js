/**
 * Events Page JavaScript - Editorial Style
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
        
    } catch (error) {
        console.error('Error loading events:', error);
        eventsGrid.innerHTML = `
            <div class="no-events-editorial" style="grid-column: 1/-1;">
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
 * Create HTML for an event card - Editorial Style
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
    
    return `
        <article class="event-card-editorial" data-id="${event.id}">
            <div class="event-card-image">
                <img src="${event.image || 'https://via.placeholder.com/600x800?text=Event'}" alt="${event.title}">
                <div class="event-card-badges">
                    ${event.featured ? '<span class="event-badge-editorial featured">Featured</span>' : ''}
                    ${isSoldOut ? '<span class="event-badge-editorial sold-out">Sold Out</span>' : `<span class="event-badge-editorial">${event.tags[0] || 'Event'}</span>`}
                </div>
            </div>
            <div class="event-card-content">
                <div class="event-card-date">${dateStr}</div>
                <h3 class="event-card-title">${event.title}</h3>
                <p class="event-card-description">${event.shortDescription || event.description.substring(0, 120)}...</p>
                <div class="event-card-meta">
                    <span>⏱ ${event.time} · ${event.duration}</span>
                    <span>📍 ${event.location.split(',')[0]}</span>
                    <span>${isSoldOut ? 'Sold Out' : `${event.spotsLeft} spots left`}</span>
                </div>
                <div class="event-card-footer">
                    <div class="event-card-price">
                        ${event.currency}${event.price}
                    </div>
                    <a href="event-detail.html?id=${event.id}" class="btn-outline">
                        ${isSoldOut ? 'Join Waitlist' : 'View Details'}
                    </a>
                </div>
            </div>
        </article>
    `;
}

/**
 * Setup filter event listeners
 */
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('eventSearch');
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            applyFilters(filter, searchInput.value.toLowerCase());
        });
    });
    
    // Search input
    searchInput?.addEventListener('input', debounce(() => {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        applyFilters(activeFilter, searchInput.value.toLowerCase());
    }, 300));
}

/**
 * Apply filters
 */
function applyFilters(filterType, searchTerm) {
    let filtered = [...allEvents];
    
    // Filter by type/tag
    if (filterType !== 'all') {
        filtered = filtered.filter(e => 
            e.tags.includes(filterType) || e.status === filterType
        );
    }
    
    // Filter by search
    if (searchTerm.trim()) {
        filtered = filtered.filter(e => 
            e.title.toLowerCase().includes(searchTerm) ||
            e.description.toLowerCase().includes(searchTerm) ||
            e.location.toLowerCase().includes(searchTerm)
        );
    }
    
    // Only show active/sold out events
    filtered = filtered.filter(e => e.status === 'active' || e.status === 'sold-out');
    
    // Sort by date
    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    renderEvents(filtered);
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
