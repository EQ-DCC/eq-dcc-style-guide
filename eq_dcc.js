
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
  function clearMarks(root){ root.querySelectorAll('mark').forEach(m=>{ const t=document.createTextNode(m.textContent); m.replaceWith(t); }); }
  function highlight(el, q){
    const re=new RegExp(q.replace(/[.*+?^${}()|[\]\]/g,'\$&'),'gi');
    const walker=document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode:n=> n.nodeValue.trim()? NodeFilter.FILTER_ACCEPT: NodeFilter.FILTER_REJECT});
    const hits=[]; while(walker.nextNode()){ const n=walker.currentNode; let m; re.lastIndex=0; const txt=n.nodeValue; while((m=re.exec(txt))){ hits.push({n,start=m.index,end=m.index+m[0].length}); } }
    for(let i=hits.length-1;i>=0;i--){ const h=hits[i]; const n=h.n; const before=n.nodeValue.slice(0,h.start); const mid=n.nodeValue.slice(h.start,h.end); const after=n.nodeValue.slice(h.end); const frag=document.createDocumentFragment(); if(before) frag.appendChild(document.createTextNode(before)); const mark=document.createElement('mark'); mark.textContent=mid; frag.appendChild(mark); if(after) frag.appendChild(document.createTextNode(after)); n.parentNode.replaceChild(frag,n); }
  }
  function runSearch(){
    const q=(input?.value||'').trim();
    sections.forEach(sec=>{ sec.classList.remove('hidden'); clearMarks(sec); });
    if(!q){ return; }
    sections.forEach(sec=>{ if(sec.textContent.toLowerCase().includes(q.toLowerCase())){ sec.open=true; highlight(sec,q);} else { sec.classList.add('hidden'); } });
  }
  function clearSearch(){ if(!input) return; input.value=''; sections.forEach(sec=>{ sec.classList.remove('hidden'); clearMarks(sec); }); }
  input?.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); runSearch(); }});
  document.body.addEventListener('click',e=>{
    if(e.target.matches('[data-action="search"]')) { runSearch(); }
    if(e.target.matches('[data-action="clear-search"]')) { clearSearch(); }
    if(e.target.matches('[data-action="expand-all"]')) { sections.forEach(d=>d.open=true); }
    if(e.target.matches('[data-action="collapse-all"]')) { sections.forEach(d=>d.open=false); }
  });
});
