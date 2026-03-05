/**
 * Admin Dashboard JavaScript
 * Backend logic for event management
 */

// Admin configuration
const ADMIN_PASSWORD = 'admin123'; // In production, use proper authentication

// Global state
let events = [];
let bookings = [];
let editingEventId = null;
let eventToDelete = null;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const eventModal = document.getElementById('eventModal');
const deleteModal = document.getElementById('deleteModal');
const eventForm = document.getElementById('eventForm');
const eventsTableBody = document.getElementById('eventsTableBody');

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    setupEventListeners();
});

/**
 * Check if user is already authenticated
 */
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('bewell_admin_auth') === 'true';
    
    if (isAuthenticated) {
        showDashboard();
        loadData();
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Login form
    loginForm?.addEventListener('submit', handleLogin);
    
    // Logout
    logoutBtn?.addEventListener('click', handleLogout);
    
    // Navigation
    document.querySelectorAll('.admin-nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            switchSection(section);
            
            // Update active nav
            document.querySelectorAll('.admin-nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Create event button
    document.getElementById('createEventBtn')?.addEventListener('click', () => openEventModal());
    
    // Event form submission
    eventForm?.addEventListener('submit', handleEventSubmit);
    
    // Image upload preview
    document.getElementById('eventImageInput')?.addEventListener('change', handleImageUpload);
    
    // Delete confirmation
    document.getElementById('confirmDelete')?.addEventListener('click', confirmDeleteEvent);
    
    // Filter and search
    document.getElementById('adminEventFilter')?.addEventListener('change', renderEventsTable);
    document.getElementById('adminEventSearch')?.addEventListener('input', debounce(renderEventsTable, 300));
}

/**
 * Handle admin login
 */
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('bewell_admin_auth', 'true');
        showDashboard();
        loadData();
        showToast('Welcome to the admin dashboard!', 'success');
    } else {
        showToast('Incorrect password', 'error');
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    sessionStorage.removeItem('bewell_admin_auth');
    loginScreen.style.display = 'flex';
    adminDashboard.style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

/**
 * Show dashboard after login
 */
function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'flex';
}

/**
 * Load events and bookings data
 */
async function loadData() {
    try {
        // Load events from localStorage or JSON file
        const storedEvents = localStorage.getItem('bewell_events');
        
        if (storedEvents) {
            events = JSON.parse(storedEvents);
        } else {
            // Load from JSON file
            const response = await fetch('events.json');
            const data = await response.json();
            events = data.events || [];
            saveEvents(); // Save to localStorage
        }
        
        // Load bookings
        const storedBookings = localStorage.getItem('bewell_bookings');
        bookings = storedBookings ? JSON.parse(storedBookings) : [];
        
        renderEventsTable();
        updateStats();
        renderBookingsTable();
        
    } catch (error) {
        console.error('Error loading data:', error);
        showToast('Error loading data', 'error');
    }
}

/**
 * Save events to localStorage
 */
function saveEvents() {
    localStorage.setItem('bewell_events', JSON.stringify(events));
    // Also notify other tabs
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'bewell_events',
        newValue: JSON.stringify(events)
    }));
}

/**
 * Save bookings to localStorage
 */
function saveBookings() {
    localStorage.setItem('bewell_bookings', JSON.stringify(bookings));
}

/**
 * Switch between admin sections
 */
function switchSection(section) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    document.getElementById(section + 'Section')?.classList.add('active');
    
    // Update page title
    const titles = {
        events: 'Event Management',
        bookings: 'Bookings',
        analytics: 'Analytics',
        settings: 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section] || 'Dashboard';
    
    // Show/hide create button
    const createBtn = document.getElementById('createEventBtn');
    if (createBtn) {
        createBtn.style.display = section === 'events' ? 'block' : 'none';
    }
}

/**
 * Render events table
 */
function renderEventsTable() {
    const filter = document.getElementById('adminEventFilter')?.value || 'all';
    const search = document.getElementById('adminEventSearch')?.value.toLowerCase() || '';
    
    let filtered = [...events];
    
    // Apply filter
    if (filter !== 'all') {
        filtered = filtered.filter(e => e.status === filter);
    }
    
    // Apply search
    if (search) {
        filtered = filtered.filter(e => 
            e.title.toLowerCase().includes(search) ||
            e.location.toLowerCase().includes(search) ||
            e.tags.some(t => t.toLowerCase().includes(search))
        );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filtered.length === 0) {
        eventsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">No events found</td>
            </tr>
        `;
        return;
    }
    
    eventsTableBody.innerHTML = filtered.map(event => createEventRow(event)).join('');
}

/**
 * Create HTML for an event table row
 */
function createEventRow(event) {
    const date = new Date(event.date);
    const dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    
    return `
        <tr data-id="${event.id}">
            <td>
                <div class="event-cell">
                    <img src="${event.image || 'https://via.placeholder.com/48'}" alt="" class="event-cell-image">
                    <div class="event-cell-info">
                        <h4>${event.title}</h4>
                        <span>${event.tags[0] || 'Event'}</span>
                    </div>
                </div>
            </td>
            <td>${dateStr}</td>
            <td>$${event.price}</td>
            <td>${event.spotsLeft}/${event.capacity}</td>
            <td><span class="status-badge ${event.status}">${event.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon view" onclick="window.open('event-detail.html?id=${event.id}', '_blank')" title="View">👁️</button>
                    <button class="btn-icon edit" onclick="editEvent('${event.id}')" title="Edit">✏️</button>
                    <button class="btn-icon delete" onclick="deleteEvent('${event.id}')" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Update dashboard stats
 */
function updateStats() {
    document.getElementById('totalEvents').textContent = events.length;
    document.getElementById('activeEvents').textContent = events.filter(e => e.status === 'active').length;
    document.getElementById('soldOutEvents').textContent = events.filter(e => e.status === 'sold-out').length;
    document.getElementById('totalBookings').textContent = bookings.length;
}

/**
 * Render bookings table
 */
function renderBookingsTable() {
    const tbody = document.getElementById('bookingsTableBody');
    
    if (bookings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">No bookings yet</td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => {
        const event = events.find(e => e.id === booking.eventId);
        return `
            <tr>
                <td>${booking.firstName} ${booking.lastName}</td>
                <td>${event?.title || 'Unknown Event'}</td>
                <td>${new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>${booking.quantity}</td>
                <td>${booking.email}</td>
                <td><span class="status-badge active">${booking.status}</span></td>
            </tr>
        `;
    }).join('');
}

/**
 * Open event modal for create/edit
 */
function openEventModal(eventId = null) {
    editingEventId = eventId;
    const modalTitle = document.getElementById('modalTitle');
    
    if (eventId) {
        // Edit mode
        const event = events.find(e => e.id === eventId);
        if (!event) return;
        
        modalTitle.textContent = 'Edit Event';
        populateEventForm(event);
    } else {
        // Create mode
        modalTitle.textContent = 'Create New Event';
        eventForm.reset();
        document.getElementById('eventId').value = '';
        document.getElementById('imagePreview').innerHTML = '<span class="preview-placeholder">📷 Click to upload image</span>';
    }
    
    eventModal.classList.add('active');
}

/**
 * Populate form with event data
 */
function populateEventForm(event) {
    document.getElementById('eventId').value = event.id;
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDateInput').value = event.date;
    document.getElementById('eventTimeInput').value = event.time;
    document.getElementById('eventDuration').value = event.duration;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventPrice').value = event.price;
    document.getElementById('eventCapacity').value = event.capacity;
    document.getElementById('eventShortDesc').value = event.shortDescription || '';
    document.getElementById('eventDescription').value = event.description;
    document.getElementById('eventImageUrl').value = event.image || '';
    
    // Set image preview
    if (event.image) {
        document.getElementById('imagePreview').innerHTML = `<img src="${event.image}" alt="Preview">`;
    }
    
    // Set featured checkbox
    document.getElementById('eventFeatured').checked = event.featured || false;
    
    // Set tags
    const tagCheckboxes = document.querySelectorAll('input[name="tags"]');
    tagCheckboxes.forEach(cb => {
        cb.checked = event.tags.includes(cb.value);
    });
}

/**
 * Close event modal
 */
function closeEventModal() {
    eventModal.classList.remove('active');
    editingEventId = null;
}

/**
 * Handle image upload preview
 */
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showToast('Image too large. Max 2MB.', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        document.getElementById('eventImageUrl').value = e.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * Handle event form submission
 */
function handleEventSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Get selected tags
    const tags = [];
    document.querySelectorAll('input[name="tags"]:checked').forEach(cb => {
        tags.push(cb.value);
    });
    
    const eventData = {
        id: editingEventId || generateId(),
        title: formData.get('title'),
        description: formData.get('description'),
        shortDescription: formData.get('shortDescription') || formData.get('description').substring(0, 150),
        date: formData.get('date'),
        time: formData.get('time'),
        duration: formData.get('duration'),
        location: formData.get('location'),
        price: parseFloat(formData.get('price')),
        currency: '$',
        capacity: parseInt(formData.get('capacity')),
        spotsLeft: editingEventId ? 
            events.find(e => e.id === editingEventId)?.spotsLeft || parseInt(formData.get('capacity')) :
            parseInt(formData.get('capacity')),
        image: document.getElementById('eventImageUrl').value || 'https://via.placeholder.com/800x400?text=Event',
        featured: document.getElementById('eventFeatured').checked,
        status: 'active',
        tags: tags
    };
    
    if (editingEventId) {
        // Update existing event
        const index = events.findIndex(e => e.id === editingEventId);
        if (index !== -1) {
            events[index] = eventData;
            showToast('Event updated successfully!', 'success');
        }
    } else {
        // Create new event
        events.push(eventData);
        showToast('Event created successfully!', 'success');
    }
    
    saveEvents();
    renderEventsTable();
    updateStats();
    closeEventModal();
}

/**
 * Generate unique ID
 */
function generateId() {
    return 'evt_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Edit event
 */
function editEvent(eventId) {
    openEventModal(eventId);
}

/**
 * Delete event confirmation
 */
function deleteEvent(eventId) {
    eventToDelete = eventId;
    deleteModal.classList.add('active');
}

/**
 * Confirm delete event
 */
function confirmDeleteEvent() {
    if (!eventToDelete) return;
    
    events = events.filter(e => e.id !== eventToDelete);
    saveEvents();
    renderEventsTable();
    updateStats();
    
    closeDeleteModal();
    showToast('Event deleted successfully!', 'success');
    
    eventToDelete = null;
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
    deleteModal.classList.remove('active');
    eventToDelete = null;
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'success' ? '✓' : '⚠️'}</span>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove after delay
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
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

// Close modals on backdrop click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// Close modals on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});
