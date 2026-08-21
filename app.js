
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const door = $("#doorSound");
const music = $("#bgMusic");
music.volume = 0.015;
door.volume = 0.18;

function playDoor(){
  door.currentTime = 0;
  door.play().catch(()=>{});
}
function openModal(id){
  const modal = document.getElementById(id);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  playDoor();
}
function closeModal(modal){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  if(!$$(".modal.open").length) document.body.style.overflow="";
}
$$("[data-close]").forEach(btn => btn.addEventListener("click", e => closeModal(e.target.closest(".modal"))));
$$(".modal").forEach(m => m.addEventListener("click", e => { if(e.target===m) closeModal(m); }));
document.addEventListener("keydown", e => { if(e.key==="Escape") $$(".modal.open").forEach(closeModal); });

document.addEventListener("click", () => {
  if(music.paused) music.play().catch(()=>{});
}, {once:true});

$("#openRules").addEventListener("click", () => openModal("rulesModal"));

const rulePages = $$(".rule-page");
const ruleTabs = $$(".rule-tabs button");
const counter = $("#ruleCounter");
let currentRule = 0;

function showRule(i){
  currentRule = Math.max(0, Math.min(rulePages.length-1, i));
  rulePages.forEach((p,idx)=>p.classList.toggle("active",idx===currentRule));
  ruleTabs.forEach((t,idx)=>t.classList.toggle("active",idx===currentRule));
  counter.textContent = `PAGE ${String(currentRule+1).padStart(2,"0")} / ${String(rulePages.length).padStart(2,"0")}`;
  const page = $(".book-pages");
  if(page) page.scrollTop = 0;
}
ruleTabs.forEach((tab,i)=>tab.addEventListener("click",()=>showRule(i)));
$("[data-prev]").addEventListener("click",()=>showRule(currentRule-1));
$("[data-next]").addEventListener("click",()=>showRule(currentRule+1));
showRule(0);

const cityFiles = $$(".city-file");
function showCity(i){
  cityFiles.forEach((f,idx)=>f.classList.toggle("active",idx===Number(i)));
  openModal("cityModal");
}
$$(".lore-card,.map-pin").forEach(el=>el.addEventListener("click",()=>showCity(el.dataset.city)));

const fileTexts = {
  "Sheriff Office":"Akta Sheriff Office. Stróże prawa odpowiadają za utrzymanie porządku, prowadzenie śledztw i ochronę mieszkańców Frontier State.",
  "Territorial Medical Service":"Akta Territorial Medical Service. Medycy niosą pomoc rannym, prowadzą leczenie i wspierają mieszkańców w najtrudniejszych sytuacjach.",
  "U.S. Army":"Akta U.S. Army. Wojskowa obecność na pograniczu jest elementem ochrony terytorium i wydarzeń fabularnych.",
  "Crime":"Akta Crime. Bandy i organizacje przestępcze działają poza prawem, budując własne wpływy, interesy i konflikty."
};
$$("[data-file]").forEach(btn=>btn.addEventListener("click",()=>{
  const title=btn.dataset.file;
  $("#fileTitle").textContent=title;
  $("#fileText").textContent=fileTexts[title] || "Akta organizacji FrontierLife Roleplay.";
  openModal("fileModal");
}));

$$("[data-expand]").forEach(btn=>btn.addEventListener("click",()=>{
  const card=btn.closest(".archive-card");
  card.classList.toggle("expanded");
  const body=$(".archive-body",card);
  if(card.classList.contains("expanded")) body.style.maxHeight="none";
  else body.style.maxHeight="105px";
}));

$$("[data-toast]").forEach(btn=>btn.addEventListener("click",()=>{
  const old=btn.textContent;
  btn.textContent="ARCHIWUM OTWARTE ✓";
  setTimeout(()=>btn.textContent=old,1800);
}));

// Subtle reveal on scroll.
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("revealed"); });
},{threshold:.12});
$$(".section,.file-card,.archive-card,.lore-card").forEach(el=>observer.observe(el));
