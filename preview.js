// 1.  CONFIGURE YOUR FREE API KEY HERE
const API_KEY = 'YOUR_SERPSTACK_KEY';   // ← get it in 30 s: https://serpstack.com/product

const searchBox = document.getElementById('searchBox');
const results   = document.getElementById('results');

searchBox.addEventListener('keydown', e => {
  if (e.key === 'Enter') doSearch(searchBox.value.trim());
});

async function doSearch(query) {
  if (!query) return;
  results.innerHTML = '<p style="width:100%">Searching…</p>';

  // 2.  CALL SERPSTACK (real Google results)
  const url = `https://api.serpstack.com/search?access_key=${API_KEY}&query=${encodeURIComponent(query)}&num=6`;
  const data = await fetch(url).then(r => r.json());

  if (!data.organic_results || !data.organic_results.length) {
    results.innerHTML = '<p>No results.</p>';
    return;
  }

  // 3.  BUILD PREVIEW CARDS
  results.innerHTML = '';
  data.organic_results.slice(0, 6).forEach(res => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="title">
        <a href="${res.url}" target="_blank" rel="noreferrer">${res.title}</a>
      </div>
      <iframe src="${res.url}" loading="lazy" sandbox="allow-same-origin allow-scripts"></iframe>
    `;
    results.appendChild(card);
  });
}
