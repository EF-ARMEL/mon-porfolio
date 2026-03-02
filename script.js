// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('section > .container, .about, .stack, .projects, .contact').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Smooth nav background on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(10,10,10,0.92)';
    nav.style.backdropFilter = 'blur(12px)';
    nav.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
  } else {
    nav.style.background = '';
    nav.style.backdropFilter = '';
    nav.style.borderBottom = '';
  }
});
