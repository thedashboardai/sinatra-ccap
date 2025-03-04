/**
 * Main JavaScript for CCAP Digital Portfolio landing page
 */
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const body = document.body;
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelectorAll('.nav-link, .btn');
  
  // Set initial state
  if (window.innerWidth <= 900) {
    body.classList.add('mobile-closed');
  }
  
  // Toggle mobile menu
  mobileToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    body.classList.toggle('mobile-open');
    body.classList.toggle('mobile-closed');
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = event.target.closest('.nav-links');
    const isClickOnToggle = event.target.closest('.mobile-toggle');
    
    if (!isClickInsideNav && !isClickOnToggle && body.classList.contains('mobile-open')) {
      body.classList.remove('mobile-open');
      body.classList.add('mobile-closed');
    }
  });
  
  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 900) {
        body.classList.remove('mobile-open');
        body.classList.add('mobile-closed');
      }
    });
  });
  
  // Handle resize events
  window.addEventListener('resize', function() {
    if (window.innerWidth > 900) {
      body.classList.remove('mobile-open');
      body.classList.remove('mobile-closed');
    } else if (!body.classList.contains('mobile-open')) {
      body.classList.add('mobile-closed');
    }
  });
});