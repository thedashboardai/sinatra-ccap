/**
 * Main JavaScript for CCAP Digital Portfolio landing page
 */
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const body = document.body;
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelectorAll('.nav-link, .btn');
    
    // Toggle mobile menu
    if (mobileToggle) {
      mobileToggle.addEventListener('click', function() {
        if (body.classList.contains('mobile-closed')) {
          body.classList.remove('mobile-closed');
          body.classList.add('mobile-open');
        } else {
          body.classList.add('mobile-closed');
          body.classList.remove('mobile-open');
        }
      });
    }
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 900) {
          body.classList.add('mobile-closed');
          body.classList.remove('mobile-open');
        }
      });
    });
    
    // Handle resize events
    window.addEventListener('resize', function() {
      if (window.innerWidth > 900) {
        body.classList.remove('mobile-open');
        body.classList.remove('mobile-closed');
      } else {
        if (!body.classList.contains('mobile-open')) {
          body.classList.add('mobile-closed');
        }
      }
    });
    
    // Initialize menu state on page load
    if (window.innerWidth <= 900) {
      body.classList.add('mobile-closed');
    }
  });