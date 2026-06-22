
addEventListener('DOMContentLoaded',()=>{
let allMarks = [];
let currentIndex = 0;
  function openHash(){
    const id=location.hash?location.hash.slice(1):null; if(!id) return;
    const s=document.getElementById(id);
    if(s && s.parentElement && s.parentElement.tagName.toLowerCase()==='details'){
      s.parentElement.open=true; s.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }
  openHash();
  window.addEventListener('hashchange', openHash);
  document.querySelector('nav.sidebar')?.addEventListener('click',e=>{
    const a=e.target.closest('a.toc-btn'); if(!a) return;
    const id=a.getAttribute('data-target');
    const s=document.getElementById(id);
    if(s && s.parentElement && s.parentElement.tagName.toLowerCase()==='details') s.parentElement.open=true;
  });
// =======================
// ✅ CLEAN SEARCH SYSTEM
// =======================

const input = document.querySelector('#q');
const sections = [...document.querySelectorAll('details.sec')];

// ✅ remove highlights
function clearMarks(root) {
  root.querySelectorAll('mark').forEach(m => {
    m.replaceWith(document.createTextNode(m.textContent));
  });
}

// ✅ highlight ONLY matched words
function highlight(el, q) {
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(safe, 'gi');

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);

  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    if (!re.test(text)) continue;

    const span = document.createElement('span');
    span.innerHTML = text.replace(re, match => `<mark>${match}</mark>`);
    node.parentNode.replaceChild(span, node);
  }
}

// ✅ run search
function runSearch() {
  const q = (input?.value || '').trim().toLowerCase();

  sections.forEach(sec => {
    sec.classList.remove('hidden');
    clearMarks(sec);
  });

  if (!q) return;

  currentIndex = 0;

  sections.forEach(sec => {
    if (sec.textContent.toLowerCase().includes(q)) {
      sec.open = true;
      highlight(sec, q);
    } else {
      sec.classList.add('hidden');
    }
  });

  allMarks = document.querySelectorAll('mark');

  if (allMarks.length > 0) {
    scrollToMatch(0);
  }
}

// ✅ scroll to match
function scrollToMatch(i) {
  allMarks[i].scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  allMarks.forEach(m => m.style.backgroundColor = 'yellow');
  allMarks[i].style.backgroundColor = 'orange';
}

// ✅ clear search
function clearSearch() {
  if (!input) return;
  input.value = '';

  sections.forEach(sec => {
    sec.classList.remove('hidden');
    clearMarks(sec);
  });

  allMarks = [];
}

// ✅ enter key navigation
input?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();

    if (allMarks.length === 0) {
      runSearch();
    } else {
      currentIndex = (currentIndex + 1) % allMarks.length;
      scrollToMatch(currentIndex);
    }
  }
});

// ✅ buttons
document.body.addEventListener('click', e => {
  if (e.target.matches('[data-action="search"]')) runSearch();
  if (e.target.matches('[data-action="clear-search"]')) clearSearch();
  if (e.target.matches('[data-action="expand-all"]')) sections.forEach(d => d.open = true);
  if (e.target.matches('[data-action="collapse-all"]')) sections.forEach(d => d.open = false);
});

});

