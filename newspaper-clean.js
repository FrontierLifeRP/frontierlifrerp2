/* ============================================================
   FRONTIERLIFE — CLEAN NEWSPAPER MODULE
   Completely self-contained. Does not use app.js newspaper logic.
   ============================================================ */
(() => {
  "use strict";

  const editions = Array.isArray(window.FRONTIER_NEWSPAPERS)
    ? window.FRONTIER_NEWSPAPERS : [];

  let currentEdition = 0;
  let currentSpread = 0;

  const qs = (s, root=document) => root.querySelector(s);

  function init(){
    const track=qs("#editionTrack");
    const dots=qs("#editionDots");
    const reader=qs("#newspaperReader");
    if(!track || !dots || !reader || !editions.length) return;

    renderLibrary(track,dots);
    bindReader(reader);
    showEdition(0);
  }

  function renderLibrary(track,dots){
    track.innerHTML=editions.map((ed,i)=>{
      const city=String(ed.meta||"FRONTIER STATE").split(" · ")[0];
      return `
        <article class="fl-edition-card" data-fl-edition="${i}">
          <button class="fl-paper-cover ${ed.coverClass||""}" type="button"
                  data-fl-open="${i}" aria-label="Otwórz ${esc(ed.title)}">
            <span class="fl-cover-city">${esc(city)}</span>
            <span class="fl-cover-name">${esc(ed.title||"FRONTIER PRESS")}</span>
            <span class="fl-cover-rule"></span>
            <span class="fl-cover-date">${esc(ed.dateLabel||"1905")}</span>
            <span class="fl-cover-sub">${esc(ed.issue||"SPECIAL EDITION")}</span>
            <span class="fl-cover-seal">FL</span>
          </button>
          <div class="fl-edition-info">
            <span>WYDANIE ${String(i+1).padStart(2,"0")}</span>
            <h3>${esc(ed.title||"FRONTIER PRESS")}</h3>
            <p>${esc(ed.description||"Wydanie Frontier Press.")}</p>
            <button class="fl-open-button" type="button" data-fl-open="${i}">OTWÓRZ GAZETĘ <b>→</b></button>
          </div>
        </article>`;
    }).join("");

    dots.innerHTML=editions.map((ed,i)=>
      `<button type="button" class="${i===0?"active":""}" data-fl-dot="${i}" aria-label="Wydanie ${i+1}">${String(i+1).padStart(2,"0")}</button>`
    ).join("");

    track.addEventListener("click",e=>{
      const b=e.target.closest("[data-fl-open]");
      if(b){e.preventDefault();e.stopPropagation();openReader(Number(b.dataset.flOpen));}
    });

    dots.addEventListener("click",e=>{
      const b=e.target.closest("[data-fl-dot]");
      if(b) showEdition(Number(b.dataset.flDot));
    });

    const prev=qs("#editionPrev"), next=qs("#editionNext");
    prev?.addEventListener("click",()=>showEdition(currentEdition-1));
    next?.addEventListener("click",()=>showEdition(currentEdition+1));
  }

  function showEdition(index){
    if(!editions.length) return;
    currentEdition=(index+editions.length)%editions.length;
    const cards=[...document.querySelectorAll(".fl-edition-card")];
    cards.forEach((c,i)=>{
      c.classList.remove("is-active","is-left","is-right","is-hidden");
      const n=editions.length;
      if(i===currentEdition)c.classList.add("is-active");
      else if(i===(currentEdition-1+n)%n)c.classList.add("is-left");
      else if(i===(currentEdition+1)%n)c.classList.add("is-right");
      else c.classList.add("is-hidden");
    });
    document.querySelectorAll("[data-fl-dot]").forEach((d,i)=>d.classList.toggle("active",i===currentEdition));
  }

  function bindReader(reader){
    reader.addEventListener("click",e=>{
      if(e.target.closest("[data-close-reader]")) closeReader();
      else if(e.target.closest("#readerPrev")) previousSpread();
      else if(e.target.closest("#readerNext")) nextSpread();
    });

    document.addEventListener("keydown",e=>{
      if(!reader.classList.contains("open")) return;
      if(e.key==="Escape") closeReader();
      if(e.key==="ArrowLeft") previousSpread();
      if(e.key==="ArrowRight") nextSpread();
    });
  }

  function openReader(index){
    currentEdition=(Number(index)+editions.length)%editions.length;
    currentSpread=0;
    renderSpread();
    const reader=qs("#newspaperReader");
    reader?.classList.add("open");
    reader?.setAttribute("aria-hidden","false");
    document.body.classList.add("fl-reader-open");
  }

  function closeReader(){
    const reader=qs("#newspaperReader");
    reader?.classList.remove("open");
    reader?.setAttribute("aria-hidden","true");
    document.body.classList.remove("fl-reader-open");
  }

  function renderSpread(){
    const ed=editions[currentEdition];
    const pages=Array.isArray(ed?.pages)?ed.pages:[];
    const left=qs("#readerPageLeft"), right=qs("#readerPageRight");
    if(!left || !right) return;

    // Every opening is a real two-page spread: odd page on the left,
    // even page on the right. Never leave the second half visually empty
    // when the edition contains the next page.
    const leftIndex=currentSpread;
    const rightIndex=currentSpread+1;

    left.className="paper-page newspaper-page-left";
    right.className="paper-page newspaper-page-right";

    left.innerHTML=makePage(pages[leftIndex],leftIndex+1,ed);
    right.innerHTML=makePage(pages[rightIndex],rightIndex+1,ed);

    // Force the two pages to participate in the same spread even if
    // another stylesheet from the main site tries to override them.
    left.style.display="block";
    right.style.display="block";
    left.style.visibility="visible";
    right.style.visibility="visible";
    left.style.opacity="1";
    right.style.opacity="1";

    const last=Math.min(currentSpread+2,pages.length);
    const title=qs("#readerEditionTitle"), meta=qs("#readerEditionMeta");
    const count=qs("#readerPageCount"), bar=qs("#readerProgress");

    if(title) title.textContent=ed.title||"FRONTIER PRESS";
    if(meta) meta.textContent=ed.meta||"FRONTIER STATE · 1905";
    if(count) count.textContent=`STRONY ${String(leftIndex+1).padStart(2,"0")}–${String(last).padStart(2,"0")} / ${String(pages.length).padStart(2,"0")}`;
    if(bar) bar.style.width=`${pages.length ? last/pages.length*100 : 0}%`;

    const prev=qs("#readerPrev"), next=qs("#readerNext");
    if(prev) prev.disabled=currentSpread<=0;
    if(next) next.disabled=currentSpread>=Math.max(0,pages.length-2);
  }

  function nextSpread(){
    const pages=editions[currentEdition]?.pages||[];
    if(currentSpread<pages.length-2){currentSpread+=2;animateTurn("next");renderSpread();}
  }

  function previousSpread(){
    if(currentSpread>0){currentSpread=Math.max(0,currentSpread-2);animateTurn("prev");renderSpread();}
  }

  function animateTurn(dir){
    const book=qs("#bookSheet");
    if(!book)return;
    book.classList.remove("fl-turn-next","fl-turn-prev");
    void book.offsetWidth;
    book.classList.add(dir==="next"?"fl-turn-next":"fl-turn-prev");
  }

  function makePage(p,num,ed){
    if(!p) return `<div class="fl-empty-page"><b>FRONTIER PRESS</b><span>KONIEC WYDANIA</span></div>`;
    const type=p.type||"standard";
    const img=p.image&&String(p.image).includes("/")?`<div class="fl-page-image" style="background-image:url('${String(p.image).replace(/'/g,"%27")}')"></div>`:"";
    return `<div class="fl-page-inner fl-template-${type}">
      <header><span>${esc(ed.title)}</span><b>FRONTIER STATE · 1905</b><small>${String(num).padStart(2,"0")}</small></header>
      <main>
        ${type==="hero"?`<div class="fl-kicker">${esc(p.kicker)}</div><h1>${esc(p.title)}</h1>${img}<div class="fl-copy fl-columns">${p.body||""}</div>`:
          type==="crime"?`<div class="fl-crime">KRYMINAŁ · AKTA PUBLICZNE</div><div class="fl-kicker">${esc(p.kicker)}</div><h2>${esc(p.title)}</h2>${img}<div class="fl-copy fl-columns">${p.body||""}</div>`:
          type==="advert"?`<div class="fl-advert"><span>${esc(p.kicker)}</span><h2>${esc(p.title)}</h2>${img}<div>${p.body||""}</div><b>1905</b></div>`:
          type==="notices"?`<div class="fl-kicker">${esc(p.kicker)}</div><h2>${esc(p.title)}</h2><div class="fl-notices">${p.body||""}</div>`:
          type==="editorial"?`<div class="fl-kicker">${esc(p.kicker)}</div><h2>${esc(p.title)}</h2><div class="fl-rule"></div><div class="fl-copy">${p.body||""}</div>`:
          `<div class="fl-kicker">${esc(p.kicker)}</div><h2>${esc(p.title)}</h2>${img}<div class="fl-copy">${p.body||""}</div>`}
      </main>
      <footer class="fl-page-folio" aria-label="Numer strony"><span>${String(num).padStart(2,"0")}</span></footer>
    </div>`;
  }

  function esc(v){
    return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  }

  window.FrontierNewspaper = { open: openReader, close: closeReader, refresh: init };

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();
