document.addEventListener('DOMContentLoaded', () => {

  const input = document.querySelector('#q');
  const sections = [...document.querySelectorAll('details.sec')];

  let allMarks = [];
  let currentIndex = 0;

  function clearMarks(root) {
    root.querySelectorAll('mark').forEach(m => {
      m.replaceWith(document.createTextNode(m.textContent));
    });
  }

  function highlight(el, q) {
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(safe, 'gi');

    const walker = document.createTreeWalker(
      el,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.nodeValue;
      if (!re.test(text)) continue;

      const span = document.createElement('span');
      span.innerHTML = text.replace(re, match => `<mark>${match}</mark>`);
      node.parentNode.replaceChild(span, node);
    }
  }

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

  function scrollToMatch(i) {
    allMarks[i].scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    allMarks.forEach(m => m.style.backgroundColor = 'yellow');
    allMarks[i].style.backgroundColor = 'orange';
  }

  function clearSearch() {
    if (!input) return;

    input.value = '';

    sections.forEach(sec => {
      sec.classList.remove('hidden');
      clearMarks(sec);
    });

    allMarks = [];
    currentIndex = 0;
  }

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

  document.body.addEventListener('click', e => {
    if (e.target.matches('[data-action="search"]')) runSearch();
    if (e.target.matches('[data-action="clear-search"]')) clearSearch();
    if (e.target.matches('[data-action="expand-all"]')) sections.forEach(d => d.open = true);
    if (e.target.matches('[data-action="collapse-all"]')) sections.forEach(d => d.open = false);
  });

});