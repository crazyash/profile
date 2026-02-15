# Professional Profile - Static Website

A modern, professional profile website built as a static site featuring clean design, dark/light theme switching, and time analytics visualization.

## Features

- **Static Content**: All content embedded in HTML files for fast loading
- **Theme Switching**: Professional dark/light theme toggle with smooth transitions
- **Time Analytics**: Visual time allocation chart showing professional activity breakdown
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance Optimized**: Pure static files with smooth animations and optimized assets
- **Professional UI**: Clean, modern design with professional LinkedIn integration

## Tech Stack

- **Frontend**: Static HTML, vanilla JavaScript, modern CSS
- **Styling**: CSS with CSS Variables for theming
- **Charts**: SVG-based charts for lightweight visualizations
- **Icons**: Font Awesome for professional iconography
- **Hosting**: Any static hosting service

##  Quick Setup

This is a static website - no build process required! Just open `index.html` in a browser or host the files on any web server.

### Local Development
```bash
# Option 1: Simple Python server
python -m http.server 8000

# Option 2: Node.js serve (if you have it)
npx serve .

# Option 3: Just open index.html in your browser
```

##  Updating Your Profile

When you modify `profile.json` with your information:

### Method 1: Manual Update (Recommended)
1. Edit `profile.json` with your details
2. Update the content in both:
   - `public/index.html` (main file with relative paths)
   - `index.html` (root file pointing to public folder)
3. Deploy the updated files

### Method 2: Using the Sync Script
If you have Node.js installed:
```bash
# After updating profile.json, run:
node sync.js

# This copies changes from public/index.html to index.html
```

### Method 3: Automated Build (Advanced)
For advanced users who want automated profile updates:
```bash
npm install
npm run build
```

##  Customization Guide

### Profile Information
Edit these sections in `public/index.html`:
- **Header**: Name, title, contact info, LinkedIn link
- **Summary**: Professional summary section
- **Skills**: Technical skills and expertise
- **Experience**: Work history and achievements
- **Projects**: Portfolio projects
- **Education**: Academic background

### LinkedIn Integration
The LinkedIn link uses transparent styling for better visibility:
- Icon: Semi-transparent white background with LinkedIn blue
- Link: Glassmorphism effect with backdrop blur
- Hover: Enhanced opacity and subtle animations

### Time Analytics Chart
Update the SVG chart data by modifying:
- Chart slices (path elements) with your time allocation
- Activity stats section with corresponding data
- Colors and percentages to match your schedule
### Styling & Themes
Modify `public/css/style.css`:
- **Theme Colors**: Update CSS variables for custom color schemes
- **LinkedIn Styling**: Adjust transparency and hover effects
- **Chart Styling**: Customize SVG chart appearance
- **Responsive Breakpoints**: Modify for different screen sizes

##  File Structure

```
profile/
├── index.html             # Root file (points to public/)
├── public/                # Main static site
│   ├── index.html         # Primary site file
│   ├── css/
│   │   └── style.css      # All styling and themes
│   ├── js/
│   │   └── static-app.js  # Theme toggle, navigation, back-to-top
│   └── images/            # Profile images
├── profile.json           # Profile data (for reference/future builds)
├── sync.js                # Helper script to sync root index.html
└── README.md
```

##  Deployment

### Static Hosting (Recommended)
Upload files to any static hosting service:
- **GitHub Pages**: Push to repository, enable Pages
- **Netlify**: Drag & drop the files
- **Vercel**: Connect repository or upload files
- **AWS S3**: Upload to bucket with static hosting
- **Any web server**: Copy files to web directory

### Both Files Work:
- **`public/index.html`**: Use for hosting just the public folder
- **`index.html`**: Use for hosting from root directory

##  Features Implemented

### Professional Design
-  Clean, modern interface with professional color schemes
-  Responsive grid layouts for all screen sizes
-  Interactive hover effects and smooth transitions
-  Professional LinkedIn integration with transparency effects

### Theme System
-  Dark/light theme toggle with smooth transitions
-  CSS variables for consistent theming
-  System preference detection and localStorage persistence
-  Theme-aware chart and component colors

### Time Analytics
-  Clean SVG-based pie chart (removed text clutter)
-  Professional activity breakdown visualization
-  Responsive chart design with hover effects
-  Activity stats sidebar for detailed information

### User Experience
-  Back-to-top button with smooth scrolling
-  Keyboard navigation support
-  Screen reader compatibility
-  Fast loading with no external dependencies

##  Advanced Customization

### Adding New Sections
1. Add HTML structure in `public/index.html`
2. Add corresponding styles in `public/css/style.css`
3. Update navigation in the navbar
4. Run `node sync.js` to update root file

### Updating Time Chart
1. Modify the SVG paths in the chart section
2. Update the activity stats to match
3. Ensure colors and percentages align
4. Test responsiveness across devices

## 📝 Tips

- **Performance**: All files are static, no server required
- **SEO**: Add meta tags and structured data as needed
- **Analytics**: Add Google Analytics or similar tracking
- **Icons**: Use Font Awesome classes for consistent iconography
- **Images**: Optimize images for web (WebP format recommended)

##  Contributing

This is a personal profile template. Feel free to:
1. Fork for your own use
2. Customize extensively
3. Share improvements via pull requests
4. Report issues or suggestions

##  License

MIT License - Use freely for your professional profile!

---

**Professional static profile ready for deployment** 
- No build process required
- Works on any hosting platform  
- Professional LinkedIn integration
- Clean, modern design