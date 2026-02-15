
// Static Site JavaScript - No Chart.js Dependencies  
console.log('JavaScript file loaded successfully!');

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
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.theme = e.matches ? 'dark' : 'light';
          this.applyTheme(this.theme);
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
      const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
      if (activeLink && !activeLink.classList.contains('active')) {
        this.updateActiveNav(activeLink);
      }
    }
  }
}

class BackToTopManager {
  constructor() {
    this.backToTopBtn = document.getElementById('back-to-top');
    this.init();
  }

  init() {
    if (!this.backToTopBtn) return;

    // Add click event listener
    this.backToTopBtn.addEventListener('click', () => this.scrollToTop());
    
    // Add keyboard support
    this.backToTopBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.scrollToTop();
      }
    });

    // Show/hide button based on scroll position
    window.addEventListener('scroll', this.throttle(() => this.handleScroll(), 100));
  }

  handleScroll() {
    if (!this.backToTopBtn) return;

    if (window.pageYOffset > 300) {
      this.backToTopBtn.style.opacity = '1';
      this.backToTopBtn.style.visibility = 'visible';
      this.backToTopBtn.style.transform = 'translateY(0)';
    } else {
      this.backToTopBtn.style.opacity = '0';
      this.backToTopBtn.style.visibility = 'hidden';
      this.backToTopBtn.style.transform = 'translateY(20px)';
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new NavigationManager();
  new BackToTopManager();
  
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
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});
