// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeBtn = document.getElementById('theme-btn');
    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.themeBtn.addEventListener('click', () => this.toggleTheme());
    
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
    document.body.className = `${theme}-theme`;
    document.documentElement.setAttribute('data-theme', theme);
    
    const icon = this.themeBtn.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    
    // Add smooth transition
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.navLinks = document.querySelectorAll('.nav-link');
    this.sections = document.querySelectorAll('.section');
    this.init();
  }

  init() {
    // Smooth scrolling for navigation links
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
          
          // Update active navigation
          this.updateActiveNav(link);
        }
      });
    });

    // Update active navigation on scroll
    window.addEventListener('scroll', () => this.handleScroll());
    
    // Set initial active navigation
    this.handleScroll();
  }

  updateActiveNav(activeLink) {
    this.navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
  }

  handleScroll() {
    let current = '';
    const scrollY = window.scrollY + 100; // Offset for navbar height

    this.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
      if (activeLink && !activeLink.classList.contains('active')) {
        this.updateActiveNav(activeLink);
      }
    }
  }
}

// Chart Management
class ChartManager {
  constructor() {
    this.chartCanvas = document.getElementById('timeChart');
    this.chart = null;
    this.init();
  }

  async init() {
    try {
      // Load profile data
      const response = await fetch('/api/profile');
      const data = await response.json();
      this.createChart(data.timeActivities);
      
      // Update chart on theme change
      document.addEventListener('themeChanged', () => {
        this.updateChartTheme();
      });
      
    } catch (error) {
      console.error('Error loading profile data:', error);
      this.showChartError();
    }
  }

  createChart(activities) {
    const ctx = this.chartCanvas.getContext('2d');
    
    // Get theme colors
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#f8f9fa' : '#212529';
    const gridColor = isDark ? '#495057' : '#dee2e6';

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: activities.map(activity => activity.activity),
        datasets: [{
          data: activities.map(activity => activity.hours),
          backgroundColor: activities.map(activity => activity.color),
          borderWidth: 2,
          borderColor: isDark ? '#2d2d2d' : '#ffffff',
          hoverBorderWidth: 3,
          hoverBorderColor: isDark ? '#f8f9fa' : '#212529'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              padding: 20,
              font: {
                size: 12,
                family: "'Segoe UI', system-ui, -apple-system, sans-serif"
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: isDark ? '#2d2d2d' : '#ffffff',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: gridColor,
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value}h (${percentage}%)`;
              }
            }
          }
        },
        cutout: '50%',
        animation: {
          animateRotate: true,
          duration: 1500,
          easing: 'easeInOutQuart'
        },
        onHover: (event, elements) => {
          event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
        }
      }
    });
  }

  updateChartTheme() {
    if (!this.chart) return;

    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? '#f8f9fa' : '#212529';
    const gridColor = isDark ? '#495057' : '#dee2e6';

    // Update chart colors
    this.chart.options.plugins.legend.labels.color = textColor;
    this.chart.options.plugins.tooltip.backgroundColor = isDark ? '#2d2d2d' : '#ffffff';
    this.chart.options.plugins.tooltip.titleColor = textColor;
    this.chart.options.plugins.tooltip.bodyColor = textColor;
    this.chart.options.plugins.tooltip.borderColor = gridColor;
    
    // Update dataset border colors
    this.chart.data.datasets[0].borderColor = isDark ? '#2d2d2d' : '#ffffff';
    this.chart.data.datasets[0].hoverBorderColor = isDark ? '#f8f9fa' : '#212529';
    
    this.chart.update();
  }

  showChartError() {
    this.chartCanvas.style.display = 'none';
    const container = this.chartCanvas.parentElement;
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <p>Unable to load time analytics chart</p>
        <p style="font-size: 0.9rem; margin-top: 5px;">Please try refreshing the page</p>
      </div>
    `;
  }
}

// Performance Optimizations
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.setupLazyLoading();
    
    // Optimize scroll performance
    this.optimizeScrolling();
    
    // Preload critical resources
    this.preloadResources();
  }

  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  optimizeScrolling() {
    let ticking = false;

    function updateOnScroll() {
      // Scroll-based animations or updates go here
      ticking = false;
    }

    document.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    });
  }

  preloadResources() {
    // Preload important images
    const preloadImages = [
      '/images/default-avatar.jpg'
    ];

    preloadImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }
}

// Accessibility Enhancements
class AccessibilityManager {
  constructor() {
    this.init();
  }

  init() {
    // Keyboard navigation
    this.setupKeyboardNavigation();
    
    // Focus management
    this.setupFocusManagement();
    
    // Screen reader optimizations
    this.setupScreenReaderOptimizations();
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // ESC key to close modals or reset focus
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
      
      // Tab navigation enhancements
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  setupFocusManagement() {
    // Add focus indicators for keyboard users
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      element.addEventListener('focus', () => {
        if (document.body.classList.contains('keyboard-navigation')) {
          element.classList.add('keyboard-focus');
        }
      });

      element.addEventListener('blur', () => {
        element.classList.remove('keyboard-focus');
      });
    });
  }

  setupScreenReaderOptimizations() {
    // Add skip links
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.init();
  }

  init() {
    // Intersection Observer for animations
    this.setupScrollAnimations();
    
    // Reduce motion for accessibility
    this.respectReducedMotion();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe sections for animations
    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });
  }

  respectReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
      document.documentElement.style.setProperty('--transition-duration', '0.01ms');
    }
  }
}

// Back to Top Button Manager
class BackToTopManager {
  constructor() {
    this.backToTopBtn = document.getElementById('back-to-top');
    this.scrollThreshold = 300;
    this.init();
  }

  init() {
    if (!this.backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', this.throttle(() => {
      this.handleScroll();
    }, 100));

    // Handle click event
    this.backToTopBtn.addEventListener('click', () => {
      this.scrollToTop();
    });

    // Keyboard accessibility
    this.backToTopBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.scrollToTop();
      }
    });
  }

  handleScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollPosition > this.scrollThreshold) {
      this.backToTopBtn.classList.add('show');
      this.backToTopBtn.setAttribute('aria-hidden', 'false');
    } else {
      this.backToTopBtn.classList.remove('show');
      this.backToTopBtn.setAttribute('aria-hidden', 'true');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Focus management for accessibility
    setTimeout(() => {
      const mainContent = document.querySelector('main') || document.querySelector('#main-content');
      if (mainContent) {
        mainContent.focus();
      }
    }, 500);
  }

  throttle(func, wait) {
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
}

// Main Application
class ProfileApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.navigationManager = new NavigationManager();
    this.chartManager = new ChartManager();
    this.performanceManager = new PerformanceManager();
    this.accessibilityManager = new AccessibilityManager();
    this.animationManager = new AnimationManager();
    this.backToTopManager = new BackToTopManager();
    
    this.init();
  }

  init() {
    // Add loading state management
    this.handleLoading();
    
    // Add error handling
    this.setupErrorHandling();
    
    // Add analytics (privacy-focused)
    this.setupAnalytics();
  }

  handleLoading() {
    window.addEventListener('load', () => {
      document.body.classList.add('loaded');
      
      // Hide loading spinner if present
      const loader = document.querySelector('.loader');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 300);
      }
    });
  }

  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Application error:', e.error);
      // Could send to error reporting service
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      // Could send to error reporting service
    });
  }

  setupAnalytics() {
    // Privacy-focused analytics
    // Track only essential user interactions
    const trackEvent = (event, data) => {
      // Simple privacy-focused tracking
      console.log('Event:', event, data);
    };

    // Track theme changes
    document.addEventListener('click', (e) => {
      if (e.target.closest('#theme-btn')) {
        trackEvent('theme_toggle', { theme: this.themeManager.theme });
      }
    });

    // Track navigation usage
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const section = link.getAttribute('href');
        trackEvent('navigation_click', { section: section.replace('#', '') });
      });
    });
  }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ProfileApp();
});

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  .section {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .section.animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .keyboard-focus {
    outline: 2px solid var(--accent-primary) !important;
    outline-offset: 2px !important;
  }
  
  .loaded .section {
    transition-delay: calc(var(--section-index, 0) * 0.1s);
  }
`;
document.head.appendChild(animationStyles);
