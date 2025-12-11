// 1.  FREE TIER KEYS
const SERP_KEY = '3915e87a44280c93b18be8c16feea323';               // ← your existing key
const PROXY    = 'https://iframe-proxy.lyokato.dev'; // ← open-source proxy (free)
const SS_KEY   = 'demo';                              // fallback screenshots

const box = document.getElementById('searchBox');
const res = document.getElementById('results');

box.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });

async function run() {
  const q = box.value.trim(); if (!q) return;
  res.innerHTML = '<div class=card style="place-content:center;text-align:center">Searching…</div>';

  // 2.  fetch real Google results
  const url = `https://api.serpstack.com/search?access_key=${SERP_KEY}&query=${encodeURIComponent(q)}&num=8`;
  const data = await fetch(url).then(r => r.json());
  if (!data.organic_results || !data.organic_results.length) { res.innerHTML = '<div class=card>No results</div>'; return; }

  res.innerHTML = '';
  data.organic_results.slice(0, 6).forEach(r => makeCard(r.url, r.title));
}

function makeCard(pageUrl, title) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="title"><a href="${pageUrl}" target="_blank" rel="noreferrer">${title}</a></div>
    <iframe src="${PROXY}/?url=${encodeURIComponent(pageUrl)}"></iframe>
  `;
  res.appendChild(card);

  const iframe = card.querySelector('iframe');
  iframe.onerror = () => useScreenshot(card, pageUrl);          // network error
  iframe.onload = () => {                                       // still blank? → screenshot
    try { iframe.contentWindow.document; } catch { useScreenshot(card, pageUrl); }
    setTimeout(() => {
      if (iframe.contentDocument && iframe.contentDocument.body.innerHTML.length < 200) useScreenshot(card, pageUrl);
    }, 2500);
  };
}

function useScreenshot(card, pageUrl) {
  const img = document.createElement('img');
  img.src = `https://shot.screenshotapi.net/screenshot?token=${SS_KEY}&url=${encodeURIComponent(pageUrl)}&width=390&height=844&fresh=true`;
  card.querySelector('iframe').replaceWith(img);
}
