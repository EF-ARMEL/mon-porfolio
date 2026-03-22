// Global Intersection Observer for generic reveals
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

// Observe existing .reveal and .underline-anim elements
document.querySelectorAll('.reveal, .underline-anim').forEach(el => observer.observe(el));
document.querySelectorAll('section > .container, .about, .stack, .projects, .contact').forEach(el => {
  if (!el.classList.contains('reveal')) {
    el.classList.add('reveal');
    observer.observe(el);
  }
});

// Staggered reveal for Project Cards & Tech Items
const staggerObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), e.target.dataset.delay);
      staggerObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.tech-list').forEach(list => {
  list.querySelectorAll('.tech-item').forEach((item, index) => {
    item.classList.add('reveal');
    item.dataset.delay = index * 40; // 40ms stagger
    staggerObserver.observe(item);
  });
});

document.querySelectorAll('.projects-grid').forEach(grid => {
  grid.querySelectorAll('.project-card').forEach((card, index) => {
    // We remove .reveal temporarily to let our stagger logic animate them cleanly
    card.classList.remove('reveal');
    card.classList.add('reveal');
    card.dataset.delay = index * 120; // 120ms stagger
    staggerObserver.observe(card);
  });
});

// Smooth nav & Scroll Progress
const nav = document.querySelector('nav');
const progressBar = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  // Nav background
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Scroll Progress
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  if (progressBar) progressBar.style.width = progress + '%';
});

// 3D Tilt Effect for cards and photo
const tiltElements = document.querySelectorAll('.project-card, .photo-wrap, .cv-card');
tiltElements.forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize coordinates (-0.5 to 0.5)
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;

    // Multiply by max tilt angle (15deg)
    const rotateX = yPct * -15;
    const rotateY = xPct * 15;

    // We add an inline translateY for cards so we retain the hover "lift" aesthetic
    const translateY = el.classList.contains('photo-wrap') ? -5 : -8;

    el.style.transform = `perspective(1000px) translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    el.style.transition = 'none'; // remove transition for smooth tracking
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = ''; // clears inline style, resets to CSS logic
    el.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease'; // restore smooth reset
  });
});
