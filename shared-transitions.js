(() => {
  const supportsViewTransitions = 'startViewTransition' in document;
  const tribePageMatch = window.location.pathname.match(/tribe-([a-z]+)(?:\.html)?$/i);
  const tribeKey = tribePageMatch ? tribePageMatch[1].toLowerCase() : '';
  const tribeNames = {
    agikuyu: 'agikuyu',
    abagusii: 'abagusii',
    luo: 'luo',
    maasai: 'maasai',
    luhya: 'luhya',
    kalenjin: 'kalenjin'
  };

  const tribeLocations = {
    agikuyu: { name: 'Agikuyu', region: 'Central highlands · Mount Kenya', x: 53, y: 39 },
    abagusii: { name: 'Abagusii', region: 'Kisii and Nyamira · Western highlands', x: 31, y: 55 },
    luo: { name: 'Luo', region: 'Lake Victoria · Nyanza region', x: 22, y: 66 },
    maasai: { name: 'Maasai', region: 'Southern Rift Valley and Amboseli', x: 57, y: 72 },
    luhya: { name: 'Luhya', region: 'Western Kenya · Kakamega region', x: 25, y: 42 },
    kalenjin: { name: 'Kalenjin', region: 'Rift Valley highlands · Kericho region', x: 42, y: 35 }
  };

  function addTribeLocationMap() {
    if (!tribeKey || !tribeLocations[tribeKey]) return;
    const detailGrid = document.querySelector('.detail-grid');
    if (!detailGrid || document.querySelector('.tribe-location')) return;
    const location = tribeLocations[tribeKey];
    const section = document.createElement('section');
    section.className = 'tribe-location';
    section.setAttribute('aria-labelledby', 'location-title');
    section.innerHTML = `
      <div class="location-heading">
        <p class="eyebrow">Place &amp; belonging</p>
        <h2 id="location-title">Where the <em>${location.name}</em> story lives</h2>
        <p>${location.region}</p>
      </div>
      <div class="location-map-shell">
        <div class="kenya-map" role="img" aria-label="Approximate cultural heartland of the ${location.name} in Kenya">
          <svg viewBox="0 0 420 520" aria-hidden="true">
            <path class="kenya-outline" d="M190 12 270 22 318 72 302 126 352 178 330 242 370 304 332 356 346 426 286 492 225 458 168 474 130 420 80 400 92 344 45 310 62 252 38 196 82 156 72 104 126 78 144 30Z"></path>
            <path class="kenya-rift" d="M194 42 172 106 190 168 172 242 204 300 186 362 224 438"></path>
            <path class="kenya-lake" d="M48 264 76 246 95 270 84 310 53 326 30 305Z"></path>
            <path class="kenya-border" d="M128 78 190 112 270 104 318 156 302 218 330 242"></path>
          </svg>
          <span class="location-marker" style="left:${location.x}%;top:${location.y}%"><i></i><b>${location.name}</b></span>
          <span class="map-compass">N</span>
          <span class="map-water-label">Lake Victoria</span>
          <span class="map-ocean-label">Indian Ocean</span>
        </div>
        <p class="map-note">Location shown as an approximate cultural heartland, not a boundary. Communities and identities extend across regions and national borders.</p>
      </div>`;
    detailGrid.before(section);
  }

  addTribeLocationMap();

  if (tribeKey && tribeNames[tribeKey]) {
    const detailHero = document.querySelector('.tribe-detail-hero');
    if (detailHero) detailHero.style.viewTransitionName = `tribe-${tribeKey}`;
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

    const tribeLink = url.pathname.match(/tribe-([a-z]+)\.html$/i);
    if (tribeLink && tribeNames[tribeLink[1].toLowerCase()]) {
      const card = link.closest('.tribe-tile, .heritage-links a');
      const image = card?.querySelector('img');
      if (image) image.style.viewTransitionName = `tribe-${tribeLink[1].toLowerCase()}`;
    }

    document.documentElement.classList.add('is-navigating');
    if (!supportsViewTransitions) return;

    event.preventDefault();
    document.startViewTransition(() => {
      window.location.assign(url.href);
    });
  });
})();
