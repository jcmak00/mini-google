// 1.  FREE API KEYS
const SERP_KEY = '3915e87a44280c93b18be8c16feea323';        // ← still needed for search
const SCREENSHOT_KEY = 'demo';                // ← optional (free 100/mo) https://screenshotapi.net

const box = document.getElementById('searchBox');
const res = document.getElementById('results');

box.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });

async function run() {
  const q = box.value.trim();   if (!q) return;
  res.innerHTML = '<div style="padding:20px;text-align:center">Searching…</div>';

  // 2.  get real Google results via SerpStack
  const url = `https://api.serpstack.com/search?access_key=${SERP_KEY}&query=${encodeURIComponent(q)}&num=8`;
  const data = await fetch(url).then(r => r.json());
  if (!data.organic_results || !data.organic_results.length) {
    res.innerHTML = '<div style="padding:20px">No results.</div>'; return;
  }

  // 3.  build vertical cards
  res.innerHTML = '';
  data.organic_results.slice(0, 6).forEach(r => {
    const card = document.createElement('div');
    card.className = 'card';

    // use screenshot image (fast, always works) – 1 mobile-screen tall
    const picUrl = `https://shot.screenshotapi.net/screenshot?token=${SCREENSHOT_KEY}&url=${encodeURIComponent(r.url)}&width=390&height=844&fresh=true`;

    card.innerHTML = `
      <div class="title"><a href="${r.url}" target="_blank" rel="noreferrer">${r.title}</a></div>
      <img class="pic" src="${picUrl}" alt="preview">
    `;
    res.appendChild(card);
  });
}
