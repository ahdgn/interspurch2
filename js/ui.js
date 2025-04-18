// js/ui.js

const UI = (() => {
    const container = document.getElementById('exhibitors');
    const pager     = document.getElementById('pagination-list');
    const modal     = document.getElementById('exhibitor-modal');
    const body      = document.getElementById('modal-body');
    const closeBtn  = modal.querySelector('.modal-close');
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav   = document.querySelector('.site-nav');
  
    function initialize() {
      navToggle.addEventListener('click', () =>
        document.body.classList.toggle('is-nav-open')
      );
      closeBtn.addEventListener('click', () => hideModal());
      modal.addEventListener('click', e => {
        if (e.target === modal) hideModal();
      });
    }
  
    function renderExhibitors(data, perPage, page) {
      container.innerHTML = '';
      const start = (page - 1) * perPage;
      const slice = data.slice(start, start + perPage);
      const frag = document.createDocumentFragment();
      slice.forEach(item => frag.appendChild(createCard(item)));
      container.appendChild(frag);
    }
  
    function createCard(item) {
      const tpl = document.createElement('template');
      tpl.innerHTML = `
        <article class="exhibitor-card" data-id="${item.id}">
          <header>${item.name}</header>
          <div class="card-body"><p>${item.description || ''}</p></div>
          <div class="card-footer">
            <button class="favorite-btn" aria-pressed="false">★</button>
            <button class="details-btn">⋯</button>
          </div>
        </article>
      `.trim();
  
      const card = tpl.content.firstChild;
      card.querySelector('.favorite-btn')
        .addEventListener('click', e => {
          const b = e.currentTarget;
          const st = b.getAttribute('aria-pressed') === 'true';
          b.setAttribute('aria-pressed', String(!st));
        });
      card.querySelector('.details-btn')
        .addEventListener('click', () => showModal(item));
      return card;
    }
  
    function renderPagination(total, perPage, page, onClick) {
      pager.innerHTML = '';
      const pages = Math.ceil(total / perPage);
      const frag  = document.createDocumentFragment();
  
      function btn(lbl, enabled, fn, active = false) {
        const li = document.createElement('li');
        const a  = document.createElement('a');
        a.href = '#'; a.textContent = lbl;
        if (!enabled) a.classList.add('disabled');
        if (active)  a.classList.add('active');
        if (enabled) a.addEventListener('click', e => {
          e.preventDefault(); fn();
        });
        li.appendChild(a);
        return li;
      }
  
      frag.appendChild(btn('Précédent', page>1, () => onClick(page-1)));
      for (let i=1; i<=pages; i++) {
        frag.appendChild(btn(i, i!==page, () => onClick(i), i===page));
      }
      frag.appendChild(btn('Suivant', page<pages, () => onClick(page+1)));
      pager.appendChild(frag);
    }
  
    function showModal(item) {
      body.innerHTML = `
        <h2>${item.name}</h2>
        <p>${item.description||''}</p>
        ${item.website?`<p><a href="${item.website}" target="_blank">Site web</a></p>` : ''}
      `;
      modal.hidden = false;
    }
  
    function hideModal() {
      modal.hidden = true;
      body.innerHTML = '';
    }
  
    return { initialize, renderExhibitors, renderPagination };
  })();
  
  window.UI = UI;
  