
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

const regExtra = {
  faq: {
    title: "NAJWAŻNIEJSZE ZASADY",
    html: `
      <h4>01 · ZANIM WEJDZIESZ NA SERWER</h4>
      <p>Zapoznaj się z pełnym regulaminem, zasadami RolePlay oraz zasadami społeczności. Graj tak, aby rozwijać historię — nie tylko wygrywać sytuacje.</p>
      <ul>
        <li>Szanuj innych graczy i ich rozgrywkę.</li>
        <li>Oddzielaj wiedzę gracza od wiedzy postaci.</li>
        <li>Nie wymuszaj nierealnych zachowań na innych.</li>
        <li>Dbaj o ciągłość i sens swojej postaci.</li>
      </ul>
      <h4>02 · ZASADA ZDROWEGO ROZSĄDKU</h4>
      <p>Jeżeli sytuacja nie została opisana w regulaminie, kieruj się logiką świata, realizmem epoki i dobrem wspólnej rozgrywki.</p>
    `
  },
  rp: {
    title: "STANDARD ROLEPLAY",
    html: `
      <h4>METAGAMING</h4>
      <p>Nie wykorzystuj informacji zdobytych poza grą, jeśli Twoja postać nie mogła ich zdobyć w świecie gry.</p>
      <h4>POWERGAMING</h4>
      <p>Nie wymuszaj na innych graczach rezultatu interakcji i nie podejmuj działań, których postać nie mogłaby wiarygodnie wykonać.</p>
      <h4>RDM / VDM</h4>
      <p>Atakowanie lub zabijanie bez odpowiedniej podstawy fabularnej oraz wykorzystywanie pojazdu jako broni powinno mieć uzasadnienie zgodne z zasadami serwera.</p>
      <h4>CHARACTER FIRST</h4>
      <p>Twoja postać powinna mieć charakter, cele, słabości i konsekwencje swoich decyzji. Historia jest ważniejsza niż wynik pojedynczej sceny.</p>
    `
  },
  punishments: {
    title: "KARY I ODPOWIEDZIALNOŚĆ",
    html: `
      <h4>DLACZEGO STOSUJEMY KARY?</h4>
      <p>System kar ma chronić jakość rozgrywki i pomagać utrzymać spójne środowisko dla całej społeczności.</p>
      <ul>
        <li>Upomnienie / ostrzeżenie — przy drobnych naruszeniach.</li>
        <li>Kara czasowa — przy poważniejszych lub powtarzających się naruszeniach.</li>
        <li>Ban — przy ciężkich naruszeniach regulaminu lub działaniu na szkodę serwera.</li>
      </ul>
      <p>Ostateczna kwalifikacja zależy od okoliczności, historii gracza oraz decyzji administracji zgodnie z pełnym regulaminem.</p>
    `
  },
  appeal: {
    title: "ODWOŁANIA I ZGŁOSZENIA",
    html: `
      <h4>ODWOŁANIE OD KARY</h4>
      <p>Przygotuj numer kary, opis sytuacji oraz materiały, które mogą pomóc administracji odtworzyć przebieg zdarzenia.</p>
      <h4>ZGŁOSZENIE GRACZA</h4>
      <p>Opisz sytuację rzeczowo. Podaj czas, miejsce, nicki oraz — jeżeli jest to możliwe — dowody.</p>
      <h4>WAŻNE</h4>
      <p>Nie publikuj prywatnych danych innych osób. Sprawy administracyjne prowadź w wyznaczonych kanałach społeczności.</p>
    `
  }
};

$$("[data-reg-extra]").forEach(btn => btn.addEventListener("click", () => {
  const data = regExtra[btn.dataset.regExtra];
  if (!data) return;
  $("#regExtraTitle").textContent = data.title;
  $("#regExtraText").innerHTML = data.html;
  openModal("regExtraModal");
}));

// Regulation scrolling fallback: always route wheel input to the active paper.
const rulesModalEl = $("#rulesModal");
if (rulesModalEl) {
  rulesModalEl.addEventListener("wheel", (e) => {
    const page = $(".rule-page.active", rulesModalEl);
    if (!page) return;
    if (page.scrollHeight > page.clientHeight) {
      page.scrollTop += e.deltaY;
      e.preventDefault();
    }
  }, {passive:false});
}
