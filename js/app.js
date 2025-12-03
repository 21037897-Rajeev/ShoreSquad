// ShoreSquad JavaScript - Modern, Modular, and Performance-Optimized

// App Configuration
const CONFIG = {
    API_BASE_URL: 'https://api.shoresquad.com',
    WEATHER_API_KEY: 'your-weather-api-key-here',
    MAP_DEFAULT_CENTER: [40.7128, -74.0060], // NYC coordinates
    MAP_DEFAULT_ZOOM: 10,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    LOCAL_STORAGE_PREFIX: 'shoresquad_'
};

// Utility Functions
const Utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll/resize events
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format numbers with animation
    animateNumber(element, target, duration = 1000) {
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(CONFIG.LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage not available:', e);
            }
        },
        
        get(key) {
            try {
                const item = localStorage.getItem(CONFIG.LOCAL_STORAGE_PREFIX + key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('Error reading from LocalStorage:', e);
                return null;
            }
        },
        
        remove(key) {
            try {
                localStorage.removeItem(CONFIG.LOCAL_STORAGE_PREFIX + key);
            } catch (e) {
                console.warn('Error removing from LocalStorage:', e);
            }
        }
    },

    // Intersection Observer for animations
    createIntersectionObserver(callback, options = {}) {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        return new IntersectionObserver(callback, { ...defaultOptions, ...options });
    },

    // Generate unique IDs
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Format date for display
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options })
            .format(new Date(date));
    }
};

// Navigation Controller
class NavigationController {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupAccessibility();
    }

    bindEvents() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !e.target.closest('.nav-container')) {
                this.closeMenu();
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        navMenu?.classList.add('active');
        navToggle?.setAttribute('aria-expanded', 'true');
        this.isMenuOpen = true;
        
        // Focus first menu item for accessibility
        const firstLink = navMenu?.querySelector('.nav-link');
        firstLink?.focus();
    }

    closeMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        navMenu?.classList.remove('active');
        navToggle?.setAttribute('aria-expanded', 'false');
        this.isMenuOpen = false;
    }

    setupAccessibility() {
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Toggle navigation menu');
        }
    }
}

// Weather Service
class WeatherService {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 10 * 60 * 1000; // 10 minutes
    }

    async getCurrentWeather(lat, lon) {
        const cacheKey = `${lat}-${lon}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }

        try {
            // Mock weather data for demo
            const weatherData = await this.fetchWeatherData(lat, lon);
            this.cache.set(cacheKey, {
                data: weatherData,
                timestamp: Date.now()
            });
            
            return weatherData;
        } catch (error) {
            console.error('Weather fetch failed:', error);
            return this.getMockWeatherData();
        }
    }

    async fetchWeatherData(lat, lon) {
        // In production, replace with actual weather API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.getMockWeatherData());
            }, 1000);
        });
    }

    getMockWeatherData() {
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
        const temps = [65, 68, 72, 75, 78, 82];
        const winds = [5, 8, 12, 15, 18];
        
        return {
            temperature: temps[Math.floor(Math.random() * temps.length)],
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            windSpeed: winds[Math.floor(Math.random() * winds.length)],
            humidity: Math.floor(Math.random() * 40) + 40,
            icon: this.getWeatherIcon(conditions[0])
        };
    }

    getWeatherIcon(condition) {
        const icons = {
            'Sunny': '☀️',
            'Partly Cloudy': '⛅',
            'Cloudy': '☁️',
            'Light Rain': '🌦️',
            'Clear': '🌤️'
        };
        return icons[condition] || '🌤️';
    }

    renderWeatherWidget(weatherData, container) {
        if (!container || !weatherData) return;
        
        container.innerHTML = `
            <div class="weather-info">
                <div class="weather-icon">${weatherData.icon}</div>
                <div class="weather-details">
                    <div class="weather-temp">${weatherData.temperature}°F</div>
                    <div class="weather-condition">${weatherData.condition}</div>
                    <div class="weather-wind">Wind: ${weatherData.windSpeed} mph</div>
                </div>
            </div>
        `;
    }
}

// Events Manager
class EventsManager {
    constructor() {
        this.events = [];
        this.filteredEvents = [];
        this.currentFilter = 'all';
        this.loadingMore = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadEvents();
    }

    bindEvents() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e.target.dataset.filter));
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-events');
        loadMoreBtn?.addEventListener('click', () => this.loadMoreEvents());
    }

    async loadEvents() {
        const container = document.getElementById('events-grid');
        if (!container) return;

        try {
            // Mock API call - replace with real endpoint
            const events = await this.fetchEvents();
            this.events = events;
            this.filteredEvents = events;
            this.renderEvents();
        } catch (error) {
            console.error('Failed to load events:', error);
            this.renderError();
        }
    }

    async fetchEvents() {
        // Mock data for demonstration
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 1,
                        title: 'Santa Monica Beach Cleanup',
                        date: new Date('2024-12-15T09:00:00'),
                        location: 'Santa Monica, CA',
                        participants: 23,
                        organizer: 'Ocean Warriors',
                        image: 'https://via.placeholder.com/300x200?text=Beach+Cleanup',
                        tags: ['beach', 'nearby', 'this-week']
                    },
                    {
                        id: 2,
                        title: 'Malibu Coastal Restoration',
                        date: new Date('2024-12-18T08:30:00'),
                        location: 'Malibu, CA',
                        participants: 15,
                        organizer: 'Coastal Guardians',
                        image: 'https://via.placeholder.com/300x200?text=Coastal+Cleanup',
                        tags: ['beach', 'restoration']
                    },
                    {
                        id: 3,
                        title: 'Hermosa Beach Squad Meetup',
                        date: new Date('2024-12-20T10:00:00'),
                        location: 'Hermosa Beach, CA',
                        participants: 8,
                        organizer: 'Beach Squad LA',
                        image: 'https://via.placeholder.com/300x200?text=Squad+Meetup',
                        tags: ['beach', 'my-crew', 'this-week']
                    }
                ]);
            }, 1500);
        });
    }

    handleFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        // Filter events
        if (filter === 'all') {
            this.filteredEvents = this.events;
        } else {
            this.filteredEvents = this.events.filter(event => 
                event.tags.includes(filter)
            );
        }

        this.renderEvents();
    }

    renderEvents() {
        const container = document.getElementById('events-grid');
        if (!container) return;

        if (this.filteredEvents.length === 0) {
            container.innerHTML = `
                <div class="no-events">
                    <h3>No events found</h3>
                    <p>Try adjusting your filters or create a new event!</p>
                    <button class="btn btn-primary">Create Event</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredEvents.map(event => this.createEventCard(event)).join('');
        this.animateEventCards();
    }

    createEventCard(event) {
        return `
            <article class="event-card" data-event-id="${event.id}">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}" loading="lazy">
                    <div class="event-date">
                        <span class="event-month">${Utils.formatDate(event.date, { month: 'short' })}</span>
                        <span class="event-day">${Utils.formatDate(event.date, { day: 'numeric' })}</span>
                    </div>
                </div>
                
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-meta">
                        <div class="event-location">📍 ${event.location}</div>
                        <div class="event-time">🕒 ${Utils.formatDate(event.date, { hour: '2-digit', minute: '2-digit' })}</div>
                        <div class="event-participants">👥 ${event.participants} joined</div>
                    </div>
                    <div class="event-organizer">
                        Organized by <strong>${event.organizer}</strong>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-primary btn-join" data-event-id="${event.id}">
                            Join Event
                        </button>
                        <button class="btn btn-secondary btn-details" data-event-id="${event.id}">
                            Learn More
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    animateEventCards() {
        const cards = document.querySelectorAll('.event-card');
        const observer = Utils.createIntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            });
        });

        cards.forEach((card, index) => {
            card.style.transform = 'translateY(20px)';
            card.style.opacity = '0';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }

    renderError() {
        const container = document.getElementById('events-grid');
        if (!container) return;

        container.innerHTML = `
            <div class="events-error">
                <h3>Oops! Something went wrong</h3>
                <p>We couldn't load events right now. Please try again later.</p>
                <button class="btn btn-primary" onclick="eventsManager.loadEvents()">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Map Controller
class MapController {
    constructor() {
        this.map = null;
        this.markers = [];
        this.userLocation = null;
        this.weatherLayer = null;
        this.init();
    }

    async init() {
        await this.initializeMap();
        this.bindEvents();
        this.getUserLocation();
    }

    async initializeMap() {
        const mapContainer = document.getElementById('cleanup-map');
        if (!mapContainer) return;

        try {
            // Initialize Leaflet map
            this.map = L.map('cleanup-map').setView(CONFIG.MAP_DEFAULT_CENTER, CONFIG.MAP_DEFAULT_ZOOM);
            
            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 18
            }).addTo(this.map);

            // Add sample cleanup locations
            this.addCleanupLocations();
            
            // Hide loading indicator
            const loading = mapContainer.querySelector('.map-loading');
            if (loading) loading.style.display = 'none';
            
        } catch (error) {
            console.error('Map initialization failed:', error);
            this.renderMapError();
        }
    }

    bindEvents() {
        const locateBtn = document.getElementById('locate-me');
        const weatherBtn = document.getElementById('weather-toggle');
        const cleanupBtn = document.getElementById('cleanup-spots');

        locateBtn?.addEventListener('click', () => this.centerOnUser());
        weatherBtn?.addEventListener('click', () => this.toggleWeatherLayer());
        cleanupBtn?.addEventListener('click', () => this.toggleCleanupSpots());
    }

    async getUserLocation() {
        if (!navigator.geolocation) return;

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            this.userLocation = [position.coords.latitude, position.coords.longitude];
            this.addUserMarker();
        } catch (error) {
            console.warn('Geolocation failed:', error);
        }
    }

    addUserMarker() {
        if (!this.map || !this.userLocation) return;

        const userIcon = L.divIcon({
            html: '<div class="user-marker">📍</div>',
            className: 'custom-div-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });

        L.marker(this.userLocation, { icon: userIcon })
            .addTo(this.map)
            .bindPopup('You are here!')
            .openPopup();
    }

    addCleanupLocations() {
        const locations = [
            {
                coords: [40.7589, -73.9851],
                title: 'Central Park Cleanup',
                description: 'Weekly community cleanup event',
                type: 'regular'
            },
            {
                coords: [40.6892, -74.0445],
                title: 'Statue of Liberty Beach',
                description: 'Monthly beach restoration',
                type: 'beach'
            },
            {
                coords: [40.7505, -73.9934],
                title: 'Times Square Area',
                description: 'Urban cleanup initiative',
                type: 'urban'
            }
        ];

        locations.forEach(location => {
            const icon = this.getLocationIcon(location.type);
            const marker = L.marker(location.coords, { icon })
                .addTo(this.map)
                .bindPopup(`
                    <div class="map-popup">
                        <h4>${location.title}</h4>
                        <p>${location.description}</p>
                        <button class="btn btn-primary btn-sm">Join Cleanup</button>
                    </div>
                `);
            
            this.markers.push(marker);
        });
    }

    getLocationIcon(type) {
        const icons = {
            regular: '🧹',
            beach: '🏖️',
            urban: '🏙️'
        };

        return L.divIcon({
            html: `<div class="cleanup-marker">${icons[type] || '📍'}</div>`,
            className: 'custom-div-icon',
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        });
    }

    centerOnUser() {
        if (this.map && this.userLocation) {
            this.map.setView(this.userLocation, 15);
        } else {
            this.getUserLocation();
        }
    }

    toggleWeatherLayer() {
        // Mock weather layer toggle
        const btn = document.getElementById('weather-toggle');
        if (!btn) return;

        if (this.weatherLayer) {
            this.map.removeLayer(this.weatherLayer);
            this.weatherLayer = null;
            btn.classList.remove('active');
        } else {
            // In production, add actual weather overlay
            btn.classList.add('active');
            console.log('Weather layer would be added here');
        }
    }

    toggleCleanupSpots() {
        const btn = document.getElementById('cleanup-spots');
        if (!btn) return;

        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            // Hide cleanup markers
            this.markers.forEach(marker => this.map.removeLayer(marker));
            btn.classList.remove('active');
        } else {
            // Show cleanup markers
            this.markers.forEach(marker => marker.addTo(this.map));
            btn.classList.add('active');
        }
    }

    renderMapError() {
        const mapContainer = document.getElementById('cleanup-map');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="map-error">
                <h3>Map Unavailable</h3>
                <p>We couldn't load the interactive map. Please try refreshing the page.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

// Impact Tracker
class ImpactTracker {
    constructor() {
        this.impactData = {
            beachesCleaned: 0,
            plasticRemoved: 0,
            volunteers: 0,
            eventsCompleted: 0,
            cleanupCount: 0,
            memberCount: 0,
            trashCollected: 0
        };
        this.init();
    }

    init() {
        this.loadImpactData();
        this.animateCounters();
        this.setupChart();
    }

    async loadImpactData() {
        try {
            // Mock API call - replace with real endpoint
            const data = await this.fetchImpactData();
            this.impactData = { ...this.impactData, ...data };
        } catch (error) {
            console.error('Failed to load impact data:', error);
            // Use mock data as fallback
            this.impactData = {
                beachesCleaned: 127,
                plasticRemoved: 15420,
                volunteers: 892,
                eventsCompleted: 234,
                cleanupCount: 156,
                memberCount: 2340,
                trashCollected: 8765
            };
        }
    }

    async fetchImpactData() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    beachesCleaned: Math.floor(Math.random() * 200) + 100,
                    plasticRemoved: Math.floor(Math.random() * 20000) + 10000,
                    volunteers: Math.floor(Math.random() * 1000) + 500,
                    eventsCompleted: Math.floor(Math.random() * 300) + 200,
                    cleanupCount: Math.floor(Math.random() * 200) + 100,
                    memberCount: Math.floor(Math.random() * 3000) + 2000,
                    trashCollected: Math.floor(Math.random() * 10000) + 5000
                });
            }, 800);
        });
    }

    animateCounters() {
        const observer = Utils.createIntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const key = element.id.replace('-', '');
                    const target = this.impactData[key] || 0;
                    
                    Utils.animateNumber(element, target, 2000);
                    observer.unobserve(element);
                }
            });
        });

        // Observe all impact counters
        Object.keys(this.impactData).forEach(key => {
            const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
            if (element) {
                observer.observe(element);
            }
        });
    }

    setupChart() {
        const canvas = document.getElementById('impact-chart');
        if (!canvas) return;

        // Mock chart setup - in production, use Chart.js or similar
        const ctx = canvas.getContext('2d');
        
        // Simple bar chart visualization
        this.drawChart(ctx, canvas.width, canvas.height);
    }

    drawChart(ctx, width, height) {
        const data = [
            { label: 'Events', value: this.impactData.eventsCompleted },
            { label: 'Volunteers', value: this.impactData.volunteers },
            { label: 'Beaches', value: this.impactData.beachesCleaned },
            { label: 'Items Removed', value: this.impactData.plasticRemoved / 100 }
        ];

        const maxValue = Math.max(...data.map(d => d.value));
        const barWidth = width / data.length - 20;
        const barMaxHeight = height - 60;

        ctx.fillStyle = '#FF6B6B';
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * barMaxHeight;
            const x = index * (barWidth + 20) + 10;
            const y = height - barHeight - 30;

            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Labels
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(item.label, x + barWidth / 2, height - 10);
            ctx.fillText(item.value.toLocaleString(), x + barWidth / 2, y - 5);
            
            ctx.fillStyle = '#FF6B6B';
        });
    }
}

// App Controller - Main application class
class ShoreSquadApp {
    constructor() {
        this.components = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Initialize components
            this.components.navigation = new NavigationController();
            this.components.weather = new WeatherService();
            this.components.events = new EventsManager();
            this.components.map = new MapController();
            this.components.impact = new ImpactTracker();

            // Setup global event listeners
            this.setupGlobalEvents();
            
            // Initialize weather widget
            this.initWeatherWidget();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            this.isInitialized = true;
            console.log('ShoreSquad App initialized successfully! 🏄‍♀️');
            
        } catch (error) {
            console.error('App initialization failed:', error);
            this.handleInitError();
        }
    }

    setupGlobalEvents() {
        // Handle form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.search-form')) {
                e.preventDefault();
                this.handleSearch(new FormData(e.target));
            }
        });

        // Handle button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-join')) {
                this.handleJoinEvent(e.target.dataset.eventId);
            } else if (e.target.matches('#find-events-btn')) {
                this.handleFindEvents();
            } else if (e.target.matches('#create-event-btn')) {
                this.handleCreateEvent();
            } else if (e.target.matches('#join-pasir-ris')) {
                this.handleJoinPasirRis();
            } else if (e.target.matches('#share-cleanup')) {
                this.handleShareCleanup();
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'k':
                        e.preventDefault();
                        this.focusSearch();
                        break;
                    case 'm':
                        e.preventDefault();
                        this.scrollToSection('map');
                        break;
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', Utils.throttle(() => {
            if (this.components.map?.map) {
                this.components.map.map.invalidateSize();
            }
        }, 250));
    }

    async initWeatherWidget() {
        const widget = document.getElementById('weather-widget');
        if (!widget) return;

        try {
            // Get user location for weather
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const weather = await this.components.weather.getCurrentWeather(
                position.coords.latitude,
                position.coords.longitude
            );

            this.components.weather.renderWeatherWidget(weather, widget);
        } catch (error) {
            console.warn('Weather widget initialization failed:', error);
            // Show default weather
            const defaultWeather = this.components.weather.getMockWeatherData();
            this.components.weather.renderWeatherWidget(defaultWeather, widget);
        }
    }

    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with a real performance monitoring service
            console.log('Performance monitoring initialized');
        }

        // Monitor JavaScript errors
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            // In production, send to error tracking service
        });

        // Monitor unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            // In production, send to error tracking service
        });
    }

    handleJoinEvent(eventId) {
        if (!eventId) return;
        
        // In production, this would make an API call
        console.log(`Joining event: ${eventId}`);
        
        // Show success feedback
        this.showNotification('Successfully joined the cleanup event! 🎉', 'success');
    }

    handleFindEvents() {
        this.scrollToSection('events');
        
        // Optionally filter to nearby events
        const nearbyFilter = document.querySelector('[data-filter="nearby"]');
        if (nearbyFilter) {
            nearbyFilter.click();
        }
    }

    handleCreateEvent() {
        // In production, this would open a modal or navigate to a form
        console.log('Create event flow started');
        this.showNotification('Event creation coming soon! 🚀', 'info');
    }

    handleJoinPasirRis() {
        // Handle joining the specific Pasir Ris cleanup event
        console.log('Joining Pasir Ris Beach cleanup');
        
        // In production, this would make an API call to register the user
        const participantCount = document.querySelector('.cleanup-participants .meta-content strong');
        if (participantCount) {
            // Simulate updating participant count
            const currentText = participantCount.textContent;
            const currentNumber = parseInt(currentText.match(/\d+/)?.[0] || '47');
            participantCount.innerHTML = `<strong>Registered:</strong> ${currentNumber + 1} participants`;
        }
        
        this.showNotification('🌊 Awesome! You\'ve joined the Pasir Ris Beach cleanup! See you there! 🏖️', 'success');
        
        // Scroll to the cleanup section to show confirmation
        this.scrollToSection('next-cleanup');
    }

    handleShareCleanup() {
        // Handle sharing the cleanup event
        console.log('Sharing Pasir Ris cleanup event');
        
        if (navigator.share) {
            // Use native Web Share API if available
            navigator.share({
                title: 'Join me at Pasir Ris Beach Cleanup!',
                text: 'Hey! I\'m joining a beach cleanup at Pasir Ris Beach. Want to come help save our oceans? 🌊🏖️',
                url: window.location.href + '#next-cleanup'
            }).then(() => {
                this.showNotification('Thanks for sharing! Let\'s grow our cleanup crew! 📱', 'success');
            }).catch((error) => {
                console.log('Share failed:', error);
                this.fallbackShare();
            });
        } else {
            // Fallback sharing method
            this.fallbackShare();
        }
    }

    fallbackShare() {
        // Fallback sharing method for browsers without Web Share API
        const shareText = 'Join me at Pasir Ris Beach Cleanup! 🌊🏖️\n\nDate: Saturday, December 14, 2024\nTime: 9:00 AM - 12:00 PM\nLocation: Pasir Ris Beach, Singapore\n\nLet\'s make waves for cleaner oceans!\n\n' + window.location.href + '#next-cleanup';
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                this.showNotification('Share link copied to clipboard! 📋', 'success');
            }).catch(() => {
                this.showManualShare(shareText);
            });
        } else {
            this.showManualShare(shareText);
        }
    }

    showManualShare(text) {
        // Show a modal or alert with the share text for manual copying
        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <h3>Share This Cleanup Event</h3>
                <textarea readonly class="share-text">${text}</textarea>
                <div class="share-actions">
                    <button class="btn btn-primary copy-text">Copy Text</button>
                    <button class="btn btn-secondary close-modal">Close</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle modal interactions
        modal.querySelector('.copy-text').addEventListener('click', () => {
            const textarea = modal.querySelector('.share-text');
            textarea.select();
            document.execCommand('copy');
            this.showNotification('Text copied! 📋', 'success');
            modal.remove();
        });
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    focusSearch() {
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.focus();
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Close notification">×</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto-remove after delay
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Handle close button
        notification.querySelector('.notification-close')?.addEventListener('click', () => {
            notification.remove();
        });
    }

    handleInitError() {
        document.body.innerHTML = `
            <div class="init-error">
                <h1>Oops! Something went wrong</h1>
                <p>We're having trouble loading ShoreSquad. Please try refreshing the page.</p>
                <button onclick="location.reload()" class="btn btn-primary">
                    Refresh Page
                </button>
            </div>
        `;
    }
}

// Initialize the app when the script loads
let app;

// Support for older browsers
if (typeof Promise === 'undefined') {
    console.error('ShoreSquad requires a modern browser with Promise support');
} else {
    app = new ShoreSquadApp();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoreSquadApp, CONFIG };
}