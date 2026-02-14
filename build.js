const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
const StaticChartGenerator = require('./chartGenerator');

class StaticSiteBuilder {
  constructor() {
    this.srcDir = path.join(__dirname);
    this.buildDir = path.join(__dirname, 'build');
    this.publicDir = path.join(__dirname, 'public');
    this.chartGenerator = new StaticChartGenerator();
  }

  async build() {
    try {
      console.log('🏗️  Starting static site build...');
      
      // Create build directory
      await this.ensureDir(this.buildDir);
      
      // Load profile data
      const profileData = await this.loadProfileData();
      
      // Generate charts
      await this.generateCharts(profileData);
      
      // Generate HTML
      await this.generateHTML(profileData);
      
      // Copy static assets
      await this.copyStaticAssets();
      
      // Generate root index.html (for hosting)
      await this.generateRootHTML(profileData);
      
      console.log('✅ Build completed successfully!');
      console.log(`📁 Build output: ${this.buildDir}`);
      console.log(`📄 Root index.html generated for static hosting`);
      
    } catch (error) {
      console.error('❌ Build failed:', error);
      process.exit(1);
    }
  }

  async loadProfileData() {
    try {
      const data = await fs.readFile(path.join(this.srcDir, 'profile.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to load profile data: ${error.message}`);
    }
  }

  async generateCharts(profileData) {
    try {
      console.log('📊 Generating static charts...');
      
      // Generate donut chart
      const donutChart = await this.chartGenerator.generateTimeAllocationChart(profileData.timeActivities);
      await fs.writeFile(path.join(this.buildDir, 'time-chart.svg'), donutChart);
      
      // Generate bar chart as alternative
      const barChart = await this.chartGenerator.generateSimpleBarChart(profileData.timeActivities);
      await fs.writeFile(path.join(this.buildDir, 'time-bar-chart.svg'), barChart);
      
      console.log('✅ Generated static charts');
      
    } catch (error) {
      throw new Error(`Failed to generate charts: ${error.message}`);
    }
  }

  async generateHTML(profileData) {
    try {
      const templatePath = path.join(this.srcDir, 'views', 'static.ejs');
      
      // Check if static template exists, if not create it
      try {
        await fs.access(templatePath);
      } catch {
        await this.createStaticTemplate();
      }
      
      const template = await fs.readFile(templatePath, 'utf8');
      
      const html = ejs.render(template, {
        profile: profileData,
        title: `${profileData.personalInfo.name} - ${profileData.personalInfo.title}`,
        chartSvg: await fs.readFile(path.join(this.buildDir, 'time-chart.svg'), 'utf8')
      });
      
      // Generate minified HTML
      const minifiedHTML = this.minifyHTML(html);
      
      await fs.writeFile(path.join(this.buildDir, 'index.html'), minifiedHTML);
      console.log('✅ Generated build/index.html');
      
    } catch (error) {
      throw new Error(`Failed to generate HTML: ${error.message}`);
    }
  }

  async createStaticTemplate() {
    // Create a static version of the template without Chart.js dependencies
    const staticTemplate = await fs.readFile(path.join(this.srcDir, 'views', 'index.ejs'), 'utf8');
    
    // Only remove Chart.js script and canvas, keep Font Awesome
    const modifiedTemplate = staticTemplate
      .replace('<canvas id="timeChart"></canvas>', '<%- chartSvg %>')
      .replace('<script src="/js/app.js"></script>', '<script src="/js/static-app.js"></script>')
      .replace('src="/js/app.js"', 'src="./build/js/static-app.js"');
    
    await fs.writeFile(path.join(this.srcDir, 'views', 'static.ejs'), modifiedTemplate);
  }

  async generateRootHTML(profileData) {
    try {
      const templatePath = path.join(this.srcDir, 'views', 'static.ejs');
      const template = await fs.readFile(templatePath, 'utf8');
      
      // Update asset paths for root deployment but keep Font Awesome CDN
      const staticTemplate = template
        .replace(/href="\/css\//g, 'href="./build/css/')
        .replace(/src="\/js\//g, 'src="./build/js/')
        .replace(/src="\/images\//g, 'src="./build/images/')
        .replace(/href="\/images\//g, 'href="./build/images/')
        .replace(/this\.src='\/images\//g, "this.src='./build/images/")
        .replace('src="./build/js/static-app.js"', 'src="./build/js/static-app.js"');
      
      const chartSvg = await fs.readFile(path.join(this.buildDir, 'time-chart.svg'), 'utf8');
      
      const html = ejs.render(staticTemplate, {
        profile: profileData,
        title: `${profileData.personalInfo.name} - ${profileData.personalInfo.title}`,
        chartSvg: chartSvg
      });
      
      const minifiedHTML = this.minifyHTML(html);
      
      // Write to root directory for static hosting
      await fs.writeFile(path.join(this.srcDir, 'index.html'), minifiedHTML);
      console.log('✅ Generated root index.html for static hosting');
      
    } catch (error) {
      throw new Error(`Failed to generate root HTML: ${error.message}`);
    }
  }

  async copyStaticAssets() {
    try {
      // Copy and process CSS (keep Font Awesome imports for icons)
      await this.ensureDir(path.join(this.buildDir, 'css'));
      
      let css = await fs.readFile(path.join(this.publicDir, 'css', 'style.css'), 'utf8');
      
      // Only remove Google Fonts and other external imports, keep Font Awesome
      css = css.replace(/@import\s+url\(['"].*googleapis.*['"].*\);?/gi, '');
      
      // Minify CSS
      const minifiedCSS = css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, '}')
        .replace(/{\s*/g, '{')
        .replace(/;\s*/g, ';')
        .trim();
      
      await fs.writeFile(path.join(this.buildDir, 'css', 'style.css'), minifiedCSS);
      
      // Create static JS (without Chart.js dependencies)
      await this.ensureDir(path.join(this.buildDir, 'js'));
      await this.createStaticJS();
      
      // Copy images
      await this.ensureDir(path.join(this.buildDir, 'images'));
      const imagesDir = path.join(this.publicDir, 'images');
      try {
        const files = await fs.readdir(imagesDir);
        for (const file of files) {
          await this.copyFile(
            path.join(imagesDir, file),
            path.join(this.buildDir, 'images', file)
          );
        }
      } catch (error) {
        console.log('⚠️  No images directory found, creating placeholder...');
        await fs.writeFile(
          path.join(this.buildDir, 'images', '.gitkeep'),
          '# Images directory'
        );
      }
      
      console.log('✅ Copied and processed static assets');
      
    } catch (error) {
      throw new Error(`Failed to copy static assets: ${error.message}`);
    }
  }

  async createStaticJS() {
    const staticJS = `
// Static Site JavaScript - No Chart.js Dependencies
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeBtn = document.getElementById('theme-btn');
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    if (this.themeBtn) {
      this.themeBtn.addEventListener('click', () => this.toggleTheme());
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.theme);
    localStorage.setItem('theme', this.theme);
  }

  applyTheme(theme) {
    document.body.className = theme + '-theme';
    document.documentElement.setAttribute('data-theme', theme);
    
    if (this.themeBtn) {
      const icon = this.themeBtn.querySelector('i');
      if (icon) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
      }
    }
  }
}

class NavigationManager {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('.section');
    this.init();
  }

  init() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          this.updateActiveNav(link);
        }
      });
    });

    window.addEventListener('scroll', () => this.handleScroll());
    this.handleScroll();
  }

  updateActiveNav(activeLink) {
    this.navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  handleScroll() {
    let current = '';
    const scrollY = window.scrollY + 100;

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      const activeLink = document.querySelector(\`.nav-link[href="#\${current}"]\`);
      if (activeLink && !activeLink.classList.contains('active')) {
        this.updateActiveNav(activeLink);
      }
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new NavigationManager();
  
  // Add fade-in animation to sections
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});
`;

    await fs.writeFile(path.join(this.buildDir, 'js', 'static-app.js'), staticJS);
    console.log('✅ Created static JavaScript');
  }

  async ensureDir(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async copyFile(src, dest) {
    try {
      const data = await fs.readFile(src);
      await fs.writeFile(dest, data);
    } catch (error) {
      console.warn(`⚠️  Could not copy ${src}: ${error.message}`);
    }
  }

  minifyHTML(html) {
    return html
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .replace(/\s+>/g, '>')
      .replace(/<\s+/g, '<')
      .trim();
  }

  // Development build with source maps and unminified assets
  async buildDev() {
    console.log('🔧 Starting development build...');
    await this.build();
    console.log('🔄 Development build ready!');
  }

  // Production build with optimizations
  async buildProd() {
    console.log('🚀 Starting production build...');
    await this.build();
    
    // Additional production optimizations can be added here
    // - CSS minification
    // - JS minification
    // - Image optimization
    
    console.log('🌟 Production build ready!');
  }
}

// CLI interface
const command = process.argv[2];
const builder = new StaticSiteBuilder();

switch (command) {
  case 'dev':
    builder.buildDev();
    break;
  case 'prod':
    builder.buildProd();
    break;
  default:
    builder.build();
    break;
}
