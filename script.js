'use strict';

// Content stays visible if JavaScript or IntersectionObserver is unavailable.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const reveals = document.querySelectorAll('.reveal');
let observer;

function revealAll() {
  observer?.disconnect();
  reveals.forEach(element => element.classList.remove('is-pending'));
}

if (!motionPreference.matches && 'IntersectionObserver' in window) {
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  reveals.forEach(element => {
    // Avoid hiding sections already visible at page load or at a deep link.
    if (element.getBoundingClientRect().top > window.innerHeight) {
      element.classList.add('is-pending');
      observer.observe(element);
    }
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) revealAll();
  });
  window.addEventListener('beforeprint', revealAll);
}
