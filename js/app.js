// js/app.js

const DATA_URL = 'data/exposants.json';
const ITEMS_PER_PAGE = 20;
let allExposants = [], filteredExposants = [], currentPage = 1;

function debounce(fn, delay=300) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), delay);
  };
}

function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() => console.log('SW ok'))
      .catch(e => console.error('SW error', e));
  }
}

async function loadData() {
  try {
    if (await DB.checkDataExists()) {
      allExposants = await DB.getExposants();
    } else {
      const r = await fetch(DATA_URL);
      const j = await r.json();
      allExposants = Array.isArray(j.exposants) ? j.exposants : [];
      await DB.saveExposants(allExposants);
    }
  } catch {
    const r = await fetch(DATA_URL);
    const j = await r.json();
    allExposants = Array.isArray(j.exposants) ? j.exposants : [];
  }
  filteredExposants = [...allExposants];
}

function handleSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  filteredExposants = allExposants.filter(x =>
    x.name.toLowerCase().includes(q)
  );
  currentPage = 1;
  render();
}

function goToPage(p) {
  currentPage = p; render();
}

function render() {
  UI.renderExhibitors(filteredExposants, ITEMS_PER_PAGE, currentPage);
  UI.renderPagination(
    filteredExposants.length,
    ITEMS_PER_PAGE,
    currentPage,
    goToPage
  );
}

async function init() {
  registerSW();
  await loadData();
  document.getElementById('search-input')
    .addEventListener('input', debounce(handleSearch));
  UI.initialize();
  render();
}

document.addEventListener('DOMContentLoaded', init);
