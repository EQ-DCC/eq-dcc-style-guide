
addEventListener('DOMContentLoaded',()=>{
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
  // Search controls
  const input=document.querySelector('#q');
  const sections=[...document.querySelectorAll('details.sec')];
  let allMarks = [];
  let currentIndex = 0;
  function clearMarks(root){ root.querySelectorAll('mark').forEach(m=>{ const t=document.createTextNode(m.textContent); m.replaceWith(t); }); }
  function highlight(el, q){
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${safe}\\b`, 'gi');

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);

  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue;

    if (!re.test(text)) continue;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    text.replace(re, (match, offset) => {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, offset)));

      const mark = document.createElement('mark');
      mark.className = 'hit';   // ✅ IMPORTANT
      mark.textContent = match;
      fragment.appendChild(mark);

      lastIndex = offset + match.length;
    });

    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));

    node.parentNode.replaceChild(fragment, node);
  }
}
``

  function runSearch(){
    const q=(input?.value||'').trim();
    sections.forEach(sec=>{ sec.classList.remove('hidden'); clearMarks(sec); });
    if(!q){ return; }
    sections.forEach(sec=>{ if(sec.textContent.toLowerCase().includes(q.toLowerCase())){ sec.open=true; highlight(sec,q);} else { sec.classList.add('hidden'); } });
allMarks = [...document.querySelectorAll('mark.hit')];
currentIndex = 0;

if (allMarks.length > 0) {
  scrollToMatch(0);
}
  
}

function scrollToMatch(i) {
  if (!allMarks.length) return;

  allMarks.forEach(m => m.classList.remove("active"));

  allMarks[i].classList.add("active");

  allMarks[i].scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}
}
``
  function clearSearch(){ if(!input) return; input.value=''; sections.forEach(sec=>{ sec.classList.remove('hidden'); clearMarks(sec); }); }
  input?.addEventListener('keydown', (e)=>{
  if(e.key==='Enter'){
    e.preventDefault();

    if (allMarks.length === 0) {
      runSearch();
    } else {
      currentIndex = (currentIndex + 1) % allMarks.length;
      scrollToMatch(currentIndex);
    }
  }
});
  document.body.addEventListener('click',e=>{
    if(e.target.matches('[data-action="search"]')) { runSearch(); }
    if(e.target.matches('[data-action="clear-search"]')) { clearSearch(); }
    if(e.target.matches('[data-action="expand-all"]')) { sections.forEach(d=>d.open=true); }
    if(e.target.matches('[data-action="collapse-all"]')) { sections.forEach(d=>d.open=false); }
  });
});
