const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$('.reveal').forEach((element) => revealObserver.observe(element));

const storyCards = $$('.tribe-carousel-item');
const heroImage = $('.hero-image');
const heroCardName = $('#hero-card-name');
const heroCardRegion = $('#hero-card-region');
const heroEyebrow = $('.hero-content .eyebrow');
const heroTitle = $('.hero-content h1');
const heroContent = $('.hero-content');
const heroCarousel = $('.hero-carousel');
const heroCard = $('.hero-card');

if (heroContent) {
  heroContent.style.pointerEvents = 'none';
  heroContent.querySelectorAll('*').forEach((node) => {
    node.style.pointerEvents = 'auto';
  });
}
if (heroCarousel) heroCarousel.style.zIndex = '5';
if (heroCard) heroCard.style.zIndex = '3';

function setFeaturedTribe(card) {
  const { name, region, image } = card.dataset;
  storyCards.forEach((item) => {
    const active = item === card;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', active ? 'true' : 'false');
  });

  const index = Number(card.dataset.index || 1);
  heroCardName.textContent = name;
  heroCardRegion.textContent = region;
  heroEyebrow.textContent = region;
  heroTitle.innerHTML = `THE <em>${name.toUpperCase()}</em>`;
  heroImage.style.backgroundImage = `url("${image}")`;
  heroImage.style.filter = 'saturate(1) brightness(0.82)';

  const metaCounter = $('.hero-meta span');
  if (metaCounter) {
    metaCounter.textContent = `${String(index).padStart(2, '0')} / ${String(storyCards.length).padStart(2, '0')}`;
  }
}

storyCards.forEach((card, index) => {
  card.dataset.index = String(index + 1);
  card.style.backgroundImage = `url("${card.dataset.image}")`;
  card.addEventListener('mouseenter', () => setFeaturedTribe(card));
  card.addEventListener('focus', () => setFeaturedTribe(card));
  card.addEventListener('click', () => setFeaturedTribe(card));
});

if (storyCards.length) {
  setFeaturedTribe(storyCards[0]);
}

const nodes = $$('.node');
const tooltip = $('.map-tooltip');

function showTooltip(tribeName, regionLabel = 'Heartland') {
  const strong = $('strong', tooltip);
  const small = $('small', tooltip);
  const span = $('span', tooltip);
  strong.textContent = tribeName;
  small.textContent = regionLabel;
  span.textContent = tribeName === 'Agikuyu' ? 'Central highlands' : tribeName === 'Abagusii' ? 'Western highlands' : tribeName === 'Luo' ? 'Lake Victoria' : tribeName === 'Maasai' ? 'Rift Valley' : tribeName === 'Luhya' ? 'Western Kenya' : 'Rift Valley highlands';
  tooltip.classList.add('visible');
}

nodes.forEach((node) => {
  node.addEventListener('mouseenter', () => showTooltip(node.dataset.tribe));
  node.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
});

$$('.region-item').forEach((item) => {
  item.addEventListener('mouseenter', () => {
    $$('.region-item').forEach((entry) => entry.classList.remove('active'));
    item.classList.add('active');
    const tribe = $('strong', item).textContent;
    showTooltip(tribe);
  });
  item.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
});

const filters = $$('.filter');
filters.forEach((filter) => {
  filter.addEventListener('click', () => {
    filters.forEach((button) => button.classList.toggle('active', button === filter));
    const selected = filter.dataset.filter;
    $$('.artifact').forEach((artifact) => {
      const match = selected === 'all' || artifact.dataset.tribe === selected;
      artifact.classList.toggle('is-hidden', !match);
    });
  });
});

const lightbox = $('.lightbox');
const lightboxImg = $('img', lightbox);
const lightboxLabel = $('.eyebrow', lightbox);
const lightboxTitle = $('h2', lightbox);

$$('.artifact').forEach((artifact) => {
  artifact.addEventListener('click', () => {
    lightboxImg.src = $('img', artifact).src;
    lightboxImg.alt = $('img', artifact).alt;
    lightboxLabel.textContent = artifact.dataset.tribe;
    lightboxTitle.textContent = artifact.dataset.title;
    lightbox.classList.add('open');
  });
});

$('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.classList.remove('open');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') lightbox.classList.remove('open');
});

const audioButton = $('.audio-toggle');
const equalizer = $('.equalizer');

audioButton.addEventListener('click', () => {
  const playing = equalizer.classList.toggle('playing');
  audioButton.textContent = playing ? 'Playing audio' : 'Play audio';
  audioButton.setAttribute('aria-label', playing ? 'Pause pronunciation' : 'Play pronunciation');
});

$$('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = $(button.dataset.scroll);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
