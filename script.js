document.addEventListener('DOMContentLoaded', () => {
  // === Theme Mode Toggle ===
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  // Check initial theme preference
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  } else {
    // If no preference stored, check system color preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  // Handle click on theme switcher button
  themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });


  // === Mobile Responsive Menu ===
  const menuToggle = document.getElementById('menu-toggle');
  const navLinksMenu = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Toggle active class on burger menu and nav links
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksMenu.classList.toggle('active');
  });

  // Close menu when a navigation link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinksMenu.classList.remove('active');
    });
  });


  // === Intersection Observer for Active Link & Scroll Reveal ===
  const sections = document.querySelectorAll('section');
  const revealElements = document.querySelectorAll('.reveal');

  // Observer Options
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.15 // trigger when 15% of the element is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // 1. Scroll Reveal Animation
      if (entry.isIntersecting && entry.target.classList.contains('reveal')) {
        entry.target.classList.add('active');
      }

      // 2. Active Navigation Link highlighting
      if (entry.isIntersecting && entry.target.tagName === 'SECTION') {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  // Observe all sections and reveal elements
  sections.forEach(section => observer.observe(section));
  revealElements.forEach(element => observer.observe(element));


  // === Projects Filtering System ===
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and add to clicked one
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Simple animation transition during filter
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            // Trigger reflow to restart transition
            void card.offsetWidth;
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          } else {
            card.style.display = 'none';
          }
        }, 300); // match transition duration
      });
    });
  });


  // === Contact Form Validation & Submission Handler ===
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('btn-submit-form');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset status alert
    formStatus.style.display = 'none';
    formStatus.className = 'form-status';
    formStatus.textContent = '';

    // Get inputs
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email-input');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    let isValid = true;
    let errorMessage = '';

    // 1. Validate Full Name
    if (nameInput.value.trim().length < 3) {
      isValid = false;
      errorMessage = 'Nama lengkap minimal harus 3 karakter.';
      nameInput.focus();
    }
    // 2. Validate Email
    else if (!validateEmail(emailInput.value)) {
      isValid = false;
      errorMessage = 'Alamat email tidak valid. Silakan periksa kembali.';
      emailInput.focus();
    }
    // 3. Validate Subject
    else if (subjectInput.value.trim().length < 4) {
      isValid = false;
      errorMessage = 'Subjek pesan minimal harus 4 karakter.';
      subjectInput.focus();
    }
    // 4. Validate Message
    else if (messageInput.value.trim().length < 10) {
      isValid = false;
      errorMessage = 'Isi pesan minimal harus 10 karakter.';
      messageInput.focus();
    }

    if (!isValid) {
      showStatus(errorMessage, 'error');
      return;
    }

    // Success Simulation - Loader & Feedback
    submitBtn.disabled = true;
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Mengirim Pesan... <i class="fa-solid fa-spinner fa-spin"></i>';

    setTimeout(() => {
      // Simulate successful API submission
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
      
      showStatus('Pesan Anda berhasil dikirim! Terima kasih telah menghubungi saya.', 'success');
      contactForm.reset();
    }, 1500);
  });

  // Helper: Email validation regex
  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }

  // Helper: Show status message
  function showStatus(message, type) {
    formStatus.textContent = message;
    formStatus.classList.add(type);
    
    // Smooth fade in
    formStatus.style.display = 'block';
    formStatus.style.opacity = '0';
    formStatus.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      formStatus.style.opacity = '1';
    }, 10);
  }
});
