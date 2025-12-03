# ShoreSquad - Beach Cleanup Community Platform

Rally your crew, track weather, and hit the next beach cleanup with our dope map app!

## 🌊 Project Overview

ShoreSquad creates value by mobilizing young people to clean beaches, using weather and maps for easy planning and social features to make eco-action fun and connected.

## 🚀 Features

- **Interactive Maps** - Find cleanup locations and events near you
- **Weather Integration** - Real-time weather data for optimal cleanup planning
- **Social Features** - Connect with your cleanup crew and track collective impact
- **Event Management** - Create, join, and manage beach cleanup events
- **Impact Tracking** - Visualize your environmental contribution
- **Mobile-First Design** - Optimized for on-the-go use
- **Progressive Web App** - Works offline and installs like a native app

## 🎨 Design System

### Color Palette
- **Ocean Blue** (#0077BE) - Primary brand color
- **Sandy Beige** (#F5E6D3) - Secondary color for beach vibes  
- **Coral** (#FF6B6B) - Accent color for CTAs and energy
- **Sea Green** (#20B2AA) - Success states and eco-friendly actions
- **Deep Navy** (#1E3A8A) - Text and headers
- **Clean White** (#FFFFFF) - Background and clean spaces

### Typography
- **Font Family**: Inter (with system font fallbacks)
- **Responsive scaling** from 12px to 48px
- **Accessibility-focused** with proper contrast ratios

## 🛠️ Technology Stack

- **HTML5** - Semantic, accessible markup
- **CSS3** - Modern CSS with custom properties and Grid/Flexbox
- **JavaScript (ES6+)** - Modular, class-based architecture
- **Leaflet.js** - Interactive maps
- **Progressive Web App** technologies
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
shoreSquad/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── app.js             # Main JavaScript application
├── .vscode/
│   └── settings.json      # VS Code Live Server configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code (recommended)

### Installation

1. **Clone or download** this repository
2. **Open in VS Code** with Live Server extension installed
3. **Right-click** on `index.html` and select "Open with Live Server"
4. **Visit** `http://localhost:3000` in your browser

### Alternative Setup
```bash
# If you have Node.js installed
npx live-server --port=3000 --open=index.html
```

## 🌟 Key Features Breakdown

### Navigation System
- **Responsive mobile menu** with hamburger toggle
- **Accessibility focused** with ARIA labels and keyboard navigation
- **Smooth scrolling** to page sections

### Interactive Weather Widget
- **Geolocation-based** weather data
- **Caching system** to reduce API calls
- **Graceful fallbacks** for offline or API failures

### Dynamic Events System
- **Event filtering** by location, date, and crew
- **Lazy loading** for performance
- **Real-time updates** (ready for WebSocket integration)

### Interactive Maps
- **Leaflet.js integration** for smooth map interaction
- **Custom markers** for cleanup locations
- **Geolocation support** to find nearby events
- **Weather overlay** capability

### Impact Tracking
- **Animated counters** that trigger on scroll
- **Visual charts** showing collective impact
- **Real-time statistics** (ready for API integration)

## 📱 Mobile-First Design

- **Responsive breakpoints**: 480px, 768px, 1024px
- **Touch-friendly** interface elements
- **Progressive enhancement** from mobile to desktop
- **Optimized performance** on mobile networks

## ♿ Accessibility Features

- **WCAG 2.1 AA compliance** target
- **Semantic HTML** structure
- **Screen reader** support with proper ARIA labels
- **Keyboard navigation** throughout the interface
- **High contrast mode** support
- **Reduced motion** preferences respected

## 🔧 Customization

### Color Scheme
Modify CSS custom properties in `:root` to change the color palette:

```css
:root {
  --ocean-blue: #0077BE;
  --sandy-beige: #F5E6D3;
  --coral: #FF6B6B;
  /* ... */
}
```

### API Integration
Update the `CONFIG` object in `js/app.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'https://your-api-endpoint.com',
    WEATHER_API_KEY: 'your-weather-api-key',
    // ...
};
```

## 🚀 Performance Optimizations

- **Lazy loading** for images and non-critical resources
- **Debounced and throttled** event handlers
- **Intersection Observer** for scroll animations
- **Local storage caching** for API responses
- **Optimized images** and compressed assets

## 🔮 Future Enhancements

- [ ] **User Authentication** system
- [ ] **Real-time chat** between crew members
- [ ] **Push notifications** for nearby events
- [ ] **Gamification** with badges and leaderboards  
- [ ] **Photo sharing** from cleanup events
- [ ] **Advanced analytics** dashboard
- [ ] **Multi-language** support
- [ ] **Dark mode** toggle
- [ ] **Offline functionality** with service workers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌊 About ShoreSquad

ShoreSquad is more than just a cleanup app - it's a movement to connect young environmental advocates through technology, making beach conservation social, accessible, and impactful.

**Making waves for cleaner oceans, one cleanup at a time.** 🏄‍♀️🌊

---

Built with ❤️ for our oceans and future generations.