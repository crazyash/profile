# Professional Profile - Node.js Application

A modern, professional profile website built with Node.js, featuring dynamic content loading, dark/light theme switching, and interactive time analytics charts.

## 🚀 Features

- **Dynamic Content**: All content loaded from `profile.json` configuration file
- **Theme Switching**: Professional dark/light theme toggle with smooth transitions
- **Interactive Analytics**: Time allocation chart showing professional activity breakdown
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance Optimized**: Lazy loading, smooth animations, and optimized assets
- **Professional UI**: Clean, modern design with smooth transitions and hover effects

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: EJS templating, vanilla JavaScript
- **Styling**: Modern CSS with CSS Variables for theming
- **Charts**: Chart.js for interactive visualizations
- **Icons**: Font Awesome for professional iconography

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## 🔧 Installation & Usage

1. **Install dependencies:**
```bash
npm install
```

2. **Development server with hot reload:**
```bash
npm run dev
```

3. **Start production server:**
```bash
npm start
```

4. **Build static site for hosting:**
```bash
npm run build
```

5. **Quick deployment:**
```bash
npm run deploy
```

### Static Hosting
After running `npm run build`, you get:
- **`index.html`** - Ready for static hosting (root file)
- **`build/`** - Complete static site directory

Upload these to any static hosting service like GitHub Pages, Netlify, Vercel, or your web server.

### Dynamic Node.js Hosting
Use `npm start` for dynamic hosting on platforms like Heroku, Railway, or any Node.js hosting service.

## 📊 Configuration

Edit the `profile.json` file to customize your profile information:

```json
{
  "personalInfo": {
    "name": "Your Name",
    "title": "Your Title",
    "email": "your.email@example.com",
    // ... other personal information
  },
  "summary": "Your professional summary...",
  "coreSkills": [
    "Skill 1",
    "Skill 2"
  ],
  "timeActivities": [
    {
      "activity": "Professional Work",
      "hours": 40,
      "color": "#3498db"
    }
    // ... more activities
  ]
}
```

## 🎨 Theme System

The application features a sophisticated theme system:

- **Light Theme**: Clean, professional appearance for daytime use
- **Dark Theme**: Easy on the eyes for extended viewing
- **System Preference Detection**: Automatically matches your system theme
- **Persistent Settings**: Theme preference saved in localStorage
- **Smooth Transitions**: Animated theme switching with CSS transitions

## 📈 Analytics Dashboard

The time allocation chart provides insights into:
- Professional work distribution
- Learning and development time
- Personal project allocation
- Work-life balance visualization

## 🏗️ Project Structure

```
profile/
├── app.js                 # Express server
├── package.json           # Dependencies and scripts
├── profile.json           # Profile data configuration
├── views/
│   └── index.ejs          # Main template
├── public/
│   ├── css/
│   │   └── style.css      # Styles with theme system
│   ├── js/
│   │   └── app.js         # Client-side functionality
│   └── images/            # Static images
└── README.md
```

## 🚀 Deployment

### Production Mode
```bash
npm start
```

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## 🎯 Key Features Implemented

### ✅ Node.js Conversion
- Express.js server with EJS templating
- Dynamic content loading from JSON
- RESTful API endpoints

### ✅ Theme System
- Dark/light theme toggle
- CSS variables for consistent theming
- Smooth transitions and animations
- System preference detection

### ✅ Professional Design
- Modern, clean interface
- Responsive grid layouts
- Interactive hover effects
- Professional color schemes

### ✅ Analytics Dashboard
- Interactive doughnut chart
- Time allocation visualization
- Responsive chart design
- Theme-aware chart colors

### ✅ Performance & Accessibility
- Lazy loading optimizations
- Keyboard navigation support
- Screen reader compatibility
- Smooth scroll behavior

## 🔄 Scripts

- `npm start` - Start production Node.js server
- `npm run dev` - Start development server with auto-reload  
- `npm run build` - Build static HTML for hosting
- `npm run build:dev` - Development build
- `npm run build:prod` - Production build (optimized)
- `npm run deploy` - Quick build and deployment preparation
- `npm test` - Run tests (placeholder)

## 📝 Customization

1. **Profile Information**: Edit `profile.json`
2. **Styling**: Modify `public/css/style.css`
3. **Functionality**: Update `public/js/app.js`
4. **Layout**: Change `views/index.ejs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your own professional profile!

---

Built with ❤️ for professional developers who want to showcase their skills with style.