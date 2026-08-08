const header = document.querySelector('[data-header]');
const menu = document.querySelector('[data-menu]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Provider-neutral conversion hooks. When GA4 or GTM is added, these events
// begin flowing without another markup pass; no personal form data is included.
window.dataLayer = window.dataLayer || [];

const recordConversion = (eventName, detail = {}) => {
  const payload = {
    event: 'beverlys_conversion',
    conversion_name: eventName,
    page_path: window.location.pathname,
    ...detail
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  } else {
    window.dataLayer.push(payload);
  }

  window.dispatchEvent(new CustomEvent('beverlys:conversion', { detail: payload }));
};

const classifyLink = (link) => {
  const href = link.getAttribute('href') || '';
  if (href.startsWith('tel:')) return 'call_teddy';
  if (href.startsWith('sms:')) return 'text_teddy';
  if (href.startsWith('mailto:')) return 'email_teddy';
  if (/contact|consultation-form/i.test(href)) return 'consultation_cta';
  if (/instagram\.com/i.test(href)) return 'instagram_click';
  if (/tiktok\.com/i.test(href)) return 'tiktok_click';
  if (/facebook\.com/i.test(href)) return 'facebook_click';
  if (/couturehouse\.co/i.test(href)) return 'site_credit_click';
  return '';
};

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link) return;
  const conversion = link.dataset.analyticsEvent || classifyLink(link);
  if (conversion) recordConversion(conversion, { link_text: (link.textContent || '').trim().slice(0, 80) });
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('form');
  if (!form) return;
  recordConversion(`${form.getAttribute('name') || 'website_form'}_submit`);
});

const professionalGlyphs = {
  '↗': 'up-right',
  '↓': 'down',
  '↑': 'up',
  '←': 'left',
  '→': 'right',
  '✦': 'diamond'
};

const glyphPattern = /[↗↓↑←→✦]/g;
const glyphNodes = [];
const glyphWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
let glyphNode;

while ((glyphNode = glyphWalker.nextNode())) {
  const parent = glyphNode.parentElement;
  if (parent && !parent.closest('script, style, svg') && glyphPattern.test(glyphNode.nodeValue || '')) {
    glyphNodes.push(glyphNode);
  }
  glyphPattern.lastIndex = 0;
}

glyphNodes.forEach((node) => {
  const fragment = document.createDocumentFragment();
  const parts = (node.nodeValue || '').split(/([↗↓↑←→✦])/);
  parts.forEach((part) => {
    const iconName = professionalGlyphs[part];
    if (!iconName) {
      if (part) fragment.appendChild(document.createTextNode(part));
      return;
    }
    const icon = document.createElement('span');
    icon.className = `ui-icon ui-icon-${iconName}`;
    icon.setAttribute('aria-hidden', 'true');
    fragment.appendChild(icon);
  });
  node.replaceWith(fragment);
});

if (menu && !menu.querySelector('a[href*="academy"]')) {
  const academyLink = document.createElement('a');
  academyLink.href = './academy.html';
  academyLink.textContent = 'Academy';
  if (window.location.pathname.endsWith('/academy') || window.location.pathname.endsWith('/academy.html')) {
    academyLink.setAttribute('aria-current', 'page');
  }
  menu.appendChild(academyLink);
}

if (menu && !menu.querySelector('.mobile-nav-contact')) {
  const contactLink = document.createElement('a');
  contactLink.className = 'mobile-nav-contact';
  contactLink.href = './contact.html';
  contactLink.textContent = 'Contact';
  if (window.location.pathname.endsWith('/contact') || window.location.pathname.endsWith('/contact.html')) {
    contactLink.setAttribute('aria-current', 'page');
  }
  menu.appendChild(contactLink);
}

document.querySelectorAll('.mobile-contact').forEach((bar) => {
  if (!bar.hasAttribute('aria-label')) bar.setAttribute('aria-label', 'Contact Teddy');
});

document.querySelectorAll('.footer-bottom').forEach((footer) => {
  if (footer.querySelector('.footer-legal')) return;
  const legal = document.createElement('span');
  legal.className = 'footer-legal';
  legal.innerHTML = '<a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/accessibility">Accessibility</a>';
  footer.appendChild(legal);
});

document.querySelectorAll('form[data-netlify="true"]:not([hidden])').forEach((form) => {
  if (form.querySelector('.form-privacy')) return;
  const note = document.createElement('p');
  note.className = 'form-privacy';
  note.innerHTML = 'By submitting, you agree that Beverly\'s of Nashville may use this information to respond to your request. See our <a href="/privacy">Privacy Policy</a>.';
  const submit = form.querySelector('[type="submit"]');
  if (submit) submit.insertAdjacentElement('beforebegin', note);
  else form.appendChild(note);
});

const serviceSelect = document.querySelector('#service');
if (serviceSelect) {
  const interest = new URLSearchParams(window.location.search).get('interest');
  const interestMap = {
    wig: 'Custom wig',
    reveal: 'The Reveal Session',
    color: 'Hair color'
  };
  if (interestMap[interest]) serviceSelect.value = interestMap[interest];
}

const articleShell = document.querySelector('.article-shell');
const articleDeck = articleShell?.querySelector('.article-deck');
if (articleDeck && !articleShell.querySelector('.article-updated')) {
  const byline = document.createElement('p');
  byline.className = 'article-updated page-reveal';
  byline.innerHTML = '<time datetime="2026-07-20">Updated July 20, 2026</time> · By Teddy Chisom';
  articleDeck.insertAdjacentElement('afterend', byline);
}

const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menu?.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const closeMobileMenu = () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('open');
  document.body.classList.remove('menu-open');
};

window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && menu?.classList.contains('open')) closeMobileMenu();
}, { passive: true });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.classList.contains('open')) {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle?.focus();
  }
});

document.querySelectorAll('[data-video-card]').forEach((card) => {
  const video = card.querySelector('video');
  const toggle = card.querySelector('[data-video-toggle]');
  if (!video || !toggle) return;

  const hydrateVideo = () => {
    const source = video.querySelector('source[data-src]');
    if (!source) return;
    source.src = source.dataset.src;
    source.removeAttribute('data-src');
    video.load();
  };

  const updateVideoButton = () => {
    const paused = video.paused;
    toggle.textContent = paused ? 'Play film' : 'Pause film';
    toggle.setAttribute('aria-pressed', String(!paused));
  };

  toggle.addEventListener('click', async () => {
    if (video.paused) {
      hydrateVideo();
      try { await video.play(); } catch (_) { /* Browser may require another gesture. */ }
    } else {
      video.pause();
    }
    updateVideoButton();
  });

  video.addEventListener('play', updateVideoButton);
  video.addEventListener('pause', updateVideoButton);
  updateVideoButton();

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      hydrateVideo();
      video.play().catch(() => updateVideoButton());
      observer.disconnect();
    }, { rootMargin: '300px 0px' });
    videoObserver.observe(video);
  }
});

const revealWithoutGsap = () => {
  const revealItems = document.querySelectorAll('.reveal, .image-reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        instance.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
  revealItems.forEach((item) => observer.observe(item));
};

if (reduceMotion) {
  document.documentElement.classList.add('motion-reduced');
  document.querySelectorAll('video').forEach((video) => {
    video.pause();
  });
  revealWithoutGsap();
} else if (window.gsap && window.ScrollTrigger) {
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('gsap-ready');

  const homePage = document.querySelector('.hero');
  if (homePage) {

  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .from('.hero-kicker', { opacity: 0, y: 18, duration: .7 })
    .from('.hero-title .title-line', { opacity: 0, yPercent: 115, duration: 1.05, stagger: .11 }, '-=.42')
    .from('.hero-portrait', { clipPath: 'inset(100% 0 0 0)', scale: 1.08, duration: 1.25, ease: 'power4.inOut' }, '-=.92')
    .from('.hero-copy', { opacity: 0, y: 28, duration: .75 }, '-=.48')
    .from('.scroll-note', { opacity: 0, duration: .55 }, '-=.2');

  // Keep the hero visible if a browser pauses animation frames during loading,
  // printing, screenshot capture, or tab restoration.
  window.setTimeout(() => {
    gsap.set('.hero-title .title-line, .hero-portrait, .hero-copy, .scroll-note', {
      clearProps: 'opacity,transform,clipPath,visibility'
    });
  }, 2200);

  gsap.to('.hero-portrait img', {
    yPercent: 7,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  const copyBlocks = document.querySelectorAll(
    '.artist-copy, .section-heading, .wigs-copy, .color-title-wrap, .color-copy, .booking-intro, .consult-form, .footer-feature-copy'
  );
  copyBlocks.forEach((block) => {
    gsap.from(block, {
      opacity: 0,
      y: 52,
      duration: .9,
      ease: 'power3.out',
      scrollTrigger: { trigger: block, start: 'top 84%', once: true }
    });
  });

  gsap.utils.toArray('.image-reveal, .wig-video').forEach((frame) => {
    gsap.from(frame, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.15,
      ease: 'power4.inOut',
      scrollTrigger: { trigger: frame, start: 'top 82%', once: true }
    });
  });

  ScrollTrigger.batch('.work-card', {
    start: 'top 88%',
    once: true,
    onEnter: (cards) => gsap.from(cards, { opacity: 0, y: 64, duration: .85, stagger: .13, ease: 'power3.out' })
  });

  ScrollTrigger.batch('.service-row', {
    start: 'top 90%',
    once: true,
    onEnter: (rows) => gsap.from(rows, { opacity: 0, x: -34, duration: .65, stagger: .08, ease: 'power2.out' })
  });

  gsap.utils.toArray('.work-media img, .wig-process-card img').forEach((image) => {
    gsap.fromTo(image, { scale: 1.09 }, {
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: image, start: 'top bottom', end: 'bottom top', scrub: .7 }
    });
  });

  gsap.from('.wig-process-card', {
    opacity: 0,
    y: 74,
    stagger: .14,
    duration: .9,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.wig-process-grid', start: 'top 82%', once: true }
  });

  gsap.from('.campaign-card-back', {
    opacity: 0,
    xPercent: -28,
    rotation: -17,
    duration: 1.05,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.campaign-stack', start: 'top 78%', once: true }
  });
  gsap.from('.campaign-card-front', {
    opacity: 0,
    xPercent: 28,
    rotation: 16,
    duration: 1.05,
    delay: .12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.campaign-stack', start: 'top 78%', once: true }
  });

  gsap.to('.campaign-card-back', {
    yPercent: -5,
    rotation: -4,
    ease: 'none',
    scrollTrigger: { trigger: '.wig-campaign', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });
  gsap.to('.campaign-card-front', {
    yPercent: 5,
    rotation: 3,
    ease: 'none',
    scrollTrigger: { trigger: '.wig-campaign', start: 'top bottom', end: 'bottom top', scrub: 1 }
  });

  const kingSection = document.querySelector('[data-king-statement]');
  if (kingSection) {
    gsap.from('.king-statement-copy .eyebrow', {
      opacity: 0,
      y: 24,
      scrollTrigger: { trigger: kingSection, start: 'top 70%', end: 'top 38%', scrub: 1 }
    });
    gsap.from('.king-statement-copy h2 > *', {
      opacity: 0,
      xPercent: -16,
      stagger: .12,
      scrollTrigger: { trigger: kingSection, start: 'top 62%', end: 'top 24%', scrub: 1 }
    });
    const mediaQuery = gsap.matchMedia();
    mediaQuery.add('(min-width: 901px)', () => {
      ScrollTrigger.create({
        trigger: kingSection,
        start: 'top top',
        end: '+=70%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1
      });
    });
  }

    window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  }
} else {
  revealWithoutGsap();
}

const pageRevealItems = document.querySelectorAll('.page-reveal');
if (pageRevealItems.length) {
  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    pageRevealItems.forEach((item) => {
      item.classList.add('is-visible');
      window.gsap.from(item, {
        opacity: 0,
        y: 36,
        duration: .78,
        ease: 'power3.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true }
      });
    });
  } else if (reduceMotion || !('IntersectionObserver' in window)) {
    pageRevealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const pageRevealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -4% 0px' });
    pageRevealItems.forEach((item) => pageRevealObserver.observe(item));
  }
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

const revealBuilder = document.querySelector('[data-reveal-builder]');
if (revealBuilder) {
  const basePrice = Number(revealBuilder.dataset.basePrice || 375);
  const total = revealBuilder.querySelector('[data-builder-total]');
  const estimateLink = revealBuilder.querySelector('[data-builder-link]');
  const packageButtons = [...revealBuilder.querySelectorAll('[data-package-price]')];
  const addonButtons = [...revealBuilder.querySelectorAll('[data-addon-price]')];
  let selectedPackage = null;

  const updateBuilder = () => {
    const addonTotal = addonButtons.reduce((sum, button) => (
      button.classList.contains('is-selected') ? sum + Number(button.dataset.addonPrice) : sum
    ), 0);
    const packagePrice = selectedPackage ? Number(selectedPackage.dataset.packagePrice) : basePrice;
    const estimate = selectedPackage ? packagePrice : basePrice + addonTotal;
    if (total) total.textContent = `$${estimate}`;

    const packageName = selectedPackage?.dataset.packageName || 'Custom Reveal';
    const addOns = selectedPackage
      ? 'celebration package selected'
      : addonButtons.filter((button) => button.classList.contains('is-selected')).map((button) => button.dataset.addonName).join(', ') || 'base session only';
    if (estimateLink) {
      const message = `Hi Teddy, I am interested in The Reveal Session. My website estimate is $${estimate} for ${packageName} (${addOns}). Please confirm availability and final pricing.`;
      estimateLink.href = `sms:+16154974215?body=${encodeURIComponent(message)}`;
    }
  };

  packageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const deselecting = selectedPackage === button;
      packageButtons.forEach((item) => {
        item.classList.remove('is-selected');
        item.setAttribute('aria-pressed', 'false');
      });
      selectedPackage = deselecting ? null : button;
      if (selectedPackage) {
        selectedPackage.classList.add('is-selected');
        selectedPackage.setAttribute('aria-pressed', 'true');
        addonButtons.forEach((item) => {
          item.classList.remove('is-selected');
          item.setAttribute('aria-pressed', 'false');
        });
      }
      updateBuilder();
    });
  });

  addonButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (selectedPackage) {
        selectedPackage.classList.remove('is-selected');
        selectedPackage.setAttribute('aria-pressed', 'false');
        selectedPackage = null;
      }
      const selected = button.classList.toggle('is-selected');
      button.setAttribute('aria-pressed', String(selected));
      updateBuilder();
    });
  });

  updateBuilder();
}
