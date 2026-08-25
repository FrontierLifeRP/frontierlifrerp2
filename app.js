
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
function showCity(i){ renderCityLore(i); }

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



// ===== GUARMA JOURNAL — KANON SEZONU II =====
// Start serwera: LUTY 1905.
// Wpisy po styczniu 1905 z pierwotnego dziennika zostały skompresowane
// do końcówki 1904 / stycznia 1905, zachowując kolejność wydarzeń.
// Treść wydarzeń pozostaje kanoniczna; zmieniana jest wyłącznie data scenariuszowa.
const guarmaJournalCanon = [
  {original:"17 listopada 1900", date:"17 listopada 1900", title:"NOWY POCZĄTEK", type:"journal",
   text:"Pierwsze spojrzenie na Guarmę: ruiny, odbudowa i ludzie, którzy mimo zniszczeń próbują zacząć od nowa."},
  {original:"3 marca 1901", date:"3 marca 1901", title:"ODBUDOWA PORTU", type:"journal",
   text:"Praca przy odbudowie magazynu. Do Guarmy przybywają statki, ludzie, towary i nowe nadzieje."},
  {original:"21 września 1901", date:"21 września 1901", title:"WŁASNY POKÓJ", type:"journal",
   text:"Pierwsze poczucie stabilizacji i plan, by kiedyś kupić kawałek ziemi."},
  {original:"14 maja 1902", date:"14 maja 1902", title:"MIASTO OŻYWA", type:"journal",
   text:"Sklepy, warsztaty, restauracje i port pełne ludzi. Guarma zaczyna przypominać prawdziwe miasto."},
  {original:"29 grudnia 1902", date:"29 grudnia 1902", title:"PRZYSZŁOŚĆ GUARMY", type:"journal",
   text:"Rozmowy o handlu, niezależności i polityce. Ludzie zaczynają mieć coś do stracenia."},
  {original:"8 sierpnia 1903", date:"8 sierpnia 1903", title:"DOM", type:"journal",
   text:"Rozwój miasta, własna ziemia i przekonanie, że Guarma może być nowym domem."},
  {original:"31 grudnia 1903", date:"31 grudnia 1903", title:"GUARMA JEST DOMEM", type:"journal",
   text:"Świętowanie. Światła, statki, ludzie i życie zastąpiły ruiny oraz popiół."},
  {original:"12 lutego 1904", date:"12 lutego 1904", title:"PIERWSZY POŻAR", type:"journal",
   text:"Spłonął magazyn przy porcie. Oficjalnie mówi się o zwarciu, ale pojawia się świadek widzący uciekającego człowieka."},
  {original:"7 czerwca 1904", date:"7 czerwca 1904", title:"SABOTAŻ PORTU", type:"journal",
   text:"Zniszczono część infrastruktury portowej. Pojawiają się pierwsze podejrzenia, kto stoi za atakami."},
  {original:"19 września 1904", date:"19 września 1904", title:"KOLEJNY POŻAR", type:"journal",
   text:"Kolejny magazyn płonie. Ludzie zaczynają znikać, sklepy zamykają się wcześniej, a ulice pustoszeją."},
  {original:"2 listopada 1904", date:"2 listopada 1904", title:"WRÓG", type:"journal",
   text:"Pojawiają się ulotki oskarżające obcych i Amerykę o wykorzystywanie Guarmy. Coraz częściej pada słowo „wróg”."},
  {original:"28 grudnia 1904", date:"28 grudnia 1904", title:"WSZYSTKO SIĘ ŁĄCZY", type:"journal",
   text:"Rząd, gazety i mieszkańcy przedstawiają różne wersje wydarzeń. Sabotaże zaczynają wyglądać jak jeden plan."},
  {original:"4 stycznia 1905", date:"4 stycznia 1905", title:"ZAMKNIĘTY PORT", type:"journal",
   text:"Port zostaje zamknięty. Uzbrojeni ludzie w nowych mundurach zajmują budynek administracji."},
  {original:"6 stycznia 1905", date:"6 stycznia 1905", title:"KONTROLA", type:"journal",
   text:"Kontrolowane są drogi, statki i informacje. Aresztowani zostają ludzie związani z dawną administracją."},
  {original:"15 stycznia 1905", date:"15 stycznia 1905", title:"NOWY ROZDZIAŁ", type:"journal",
   text:"Na głównym placu ogłoszono, że Guarma będzie wolna. Przemówienie wskazuje Amerykę jako wspólnego wroga."},

  // Korekta chronologii pod start serwera w lutym 1905:
  {original:"3 marca 1905", date:"19 stycznia 1905", title:"NIE POZNAJĘ ULICY", type:"journal",
   text:"Sklepy są zamykane, ludzie znikają, na rogach stoją strażnicy. Mieszkańcy zaczynają bać się mówić."},
  {original:"18 czerwca 1905", date:"22 stycznia 1905", title:"NIE MA DROGI WYJŚCIA", type:"journal",
   text:"Próba dotarcia do portu kończy się odkryciem, że każdy statek i każdy człowiek jest kontrolowany."},
  {original:"2 września 1905", date:"26 stycznia 1905", title:"ODEBRANY DOM", type:"journal",
   text:"Wspomnienie odbudowanej Guarmy i świadomość, że przyszłość mieszkańców została im odebrana."},
  {original:"19 października 1905", date:"29 stycznia 1905", title:"SPALONE DOKUMENTY", type:"journal",
   text:"Większość dokumentów zostaje spalona. Pamiętnik pozostaje jedynym śladem czasów, gdy mieszkańcy czuli się wolni."},
  {original:"31 grudnia 1905", date:"31 stycznia 1905", title:"OSTATNIA STRONA", type:"journal",
   text:"Ostatni wpis przed rozpoczęciem sezonu. Guarma była domem. Mieszkańcy nie rozpoczęli wojny — chcieli tylko mieć dom. Na końcu pojawia się zdanie: „A jednak wojna przyjdzie.”"}
];


// Full journal reader. The original late-1905 entries are displayed with the
// server chronology moved into January 1905; the original date is retained as a note.
const guarmaJournalReader = [
  {date:"17 LISTOPADA 1900", title:"NOWY POCZĄTEK", text:`Dzisiaj po raz pierwszy zobaczyłem Guarmę.\n\nNie wiem, czego się spodziewałem.\nMoże pięknych plaż. Może palm i słońca. Na pewno nie ruin.\n\nZ portu prowadziła droga, przy której stały wypalone budynki. Niektóre domy nie miały dachów. W kilku miejscach zostały tylko kamienne ściany.\n\nA jednak ludzie tutaj nie wyglądali na pokonanych. Wręcz przeciwnie. Widziałem mężczyzn wynoszących gruz z zawalonych domów. Kobiety sprzedające jedzenie przy drodze. Dzieci biegające między ruinami.\n\nWszyscy coś robili. Wszyscy coś budowali.\n\nPowiedziano mi, że właśnie dlatego powinienem tutaj zostać. „Tutaj możesz zacząć od nowa.” I chyba właśnie tego potrzebowałem.\n\nZostawiłem w Stanach wszystko, co przypominało mi o dawnym życiu. Nie wiem jeszcze, co znajdę na tej wyspie. Ale pierwszy raz od dawna mam wrażenie, że mogę coś zbudować. Może nawet dom.`},
  {date:"03 MARCA 1901", title:"ODBUDOWA PORTU", text:`Minęło kilka miesięcy. Mam już pracę. Nie jest to nic wielkiego, ale wystarcza. Pomagam przy odbudowie jednego z magazynów niedaleko portu.\n\nCodziennie przybywają nowe statki. Nowi ludzie. Nowe towary. Nowe pomysły.\n\nCzasami patrzę na port i trudno mi uwierzyć, że jeszcze rok temu większość tego miejsca była ruiną. Mówią, że Guarma się zmienia. Chyba rzeczywiście tak jest.\n\nCoraz więcej ludzi przyjeżdża tutaj z Ameryki. Niektórzy są bogaci. Niektórzy nie mają prawie nic. Ale wszyscy przyjeżdżają z tym samym wyrazem twarzy. Z nadzieją.\n\nMoże to właśnie jest największą siłą tej wyspy. Każdy przyjeżdża tutaj z przeszłością, ale nikt nie musi o niej mówić.`},
  {date:"21 WRZEŚNIA 1901", title:"WŁASNY POKÓJ", text:`Dostałem własny pokój. To może wydawać się głupie, ale nigdy wcześniej nie cieszyłem się tak bardzo z czterech ścian i łóżka.\n\nZacząłem odkładać pieniądze. Jeżeli wszystko pójdzie dobrze, za rok będę mógł kupić kawałek ziemi. Może kiedyś postawię tam dom.\n\nCzasami zastanawiam się, czy dobrze zrobiłem, opuszczając Stany. Brakuje mi kilku rzeczy. Rodziny. Starych ulic. Znajomych.\n\nAle kiedy patrzę na to, co tutaj powstaje... wydaje mi się, że podjąłem właściwą decyzję.`},
  {date:"14 MAJA 1902", title:"MIASTO OŻYWA", text:`Guarma zaczyna wyglądać jak prawdziwe miasto. Jeszcze niedawno wszędzie były ruiny. Teraz nie można przejść ulicą, żeby nie zobaczyć nowego sklepu albo warsztatu.\n\nPort jest pełen ludzi. Kupcy kłócą się o ceny. Robotnicy pracują od rana do nocy. Wieczorami restauracje są pełne. Są nawet miejsca, w których można posłuchać muzyki.\n\nNigdy nie sądziłem, że napiszę to w tym pamiętniku, ale... chyba naprawdę zaczynam lubić to miejsce.`},
  {date:"29 GRUDNIA 1902", title:"PRZYSZŁOŚĆ GUARMY", text:`Dzisiaj rozmawiałem z pewnym kupcem. Powiedział mi, że za kilka lat Guarma może być jednym z najważniejszych portów w tej części świata. Jeszcze rok temu uznałbym go za szaleńca. Dzisiaj? Nie jestem już taki pewien.\n\nWszyscy tutaj zaczynają mówić o przyszłości. O pieniądzach. O nowych interesach. O polityce. Powstają grupy ludzi, którzy mają różne pomysły na to, jak powinna wyglądać Guarma.\n\nJedni chcą większego handlu z Ameryką. Inni chcą, żeby wyspa była całkowicie niezależna. Niektórzy twierdzą, że powinniśmy przestać oglądać się na innych.\n\nNie znam się na polityce. Wiem tylko, że pierwszy raz od bardzo dawna ludzie mają o co się kłócić. Bo mają coś do stracenia.`},
  {date:"08 SIERPNIA 1903", title:"DOM", text:`Nie poznaję tego miejsca. Miasto żyje. Naprawdę żyje.\n\nW porcie nie ma już miejsca dla kolejnych statków. Na ulicach jest gwar. Wszędzie słychać rozmowy. Ludzie kupują domy. Zakładają rodziny. Budują firmy.\n\nDzisiaj kupiłem własny kawałek ziemi. Mały. Prawie nic. Ale jest mój.\n\nCałe życie marzyłem o czymś takim. Dom. Ziemia. Spokój. Nowy początek. Może jednak znaleźliśmy tutaj to, czego szukaliśmy.`},
  {date:"31 GRUDNIA 1903", title:"GUARMA JEST DOMEM", text:`Ostatni dzień roku. W mieście odbywa się świętowanie. Muzyka. Alkohol. Śmiech. Ludzie tańczą na ulicach.\n\nPatrzyłem dzisiaj na port i pomyślałem o dniu, w którym tutaj przybyłem. Ruiny. Popiół. Zniszczone domy.\n\nA teraz? Światła. Statki. Ludzie. Życie.\n\nJeżeli ktoś zapytałby mnie dzisiaj, czy warto było opuścić Amerykę... odpowiedziałbym bez zastanowienia. Tak.\n\nGuarma jest moim domem.`},
  {date:"12 LUTEGO 1904", title:"PIERWSZY POŻAR", text:`Stało się coś dziwnego. W nocy spłonął jeden z magazynów przy porcie. Podobno zwarcie. Tak przynajmniej mówią.\n\nStraty są ogromne. Kilku ludzi straciło cały towar. Dziwne, bo podobno ktoś widział człowieka uciekającego z magazynu chwilę przed pożarem.\n\nPolicja twierdzi, że niczego nie znaleziono. Pewnie nic z tego nie będzie.`},
  {date:"07 CZERWCA 1904", title:"SABOTAŻ PORTU", text:`Znowu coś się stało. Tym razem zniszczono część infrastruktury portowej. Kilka statków nie mogło wejść do portu. Straty są ogromne.\n\nLudzie zaczynają być nerwowi. Wczoraj w tawernie słyszałem, jak dwóch mężczyzn kłóciło się o to, kto za tym stoi. Jeden twierdził, że to Amerykanie. Drugi, że miejscowi politycy.\n\nTrzeci powiedział tylko: „To nie jest przypadek.” Nie wiem, co miał na myśli.`},
  {date:"19 WRZEŚNIA 1904", title:"KOLEJNY POŻAR", text:`Kolejny pożar. Kolejny magazyn. Tym razem niedaleko mojego domu.\n\nCoraz częściej słyszę o ludziach, którzy znikają. Niektórzy podobno wyjechali. Inni zostali napadnięci. Niektórzy po prostu nie wrócili do domu.\n\nMiasto zaczyna się zmieniać. Ludzie zamykają sklepy wcześniej. Wieczorami ulice są coraz bardziej puste. A przecież jeszcze rok temu o tej porze wszędzie było pełno ludzi.`},
  {date:"02 LISTOPADA 1904", title:"WRÓG", text:`Dzisiaj pierwszy raz poczułem strach. Nie taki, jak wtedy, gdy ktoś próbuje cię okraść. Inny. Większy. Mam wrażenie, że ktoś patrzy. Nie wiem kto.\n\nW ostatnich tygodniach zaczęły pojawiać się ulotki. Piszą o tym, że Guarma jest wykorzystywana. Że obcy przyjeżdżają tutaj tylko po pieniądze. Że Ameryka nigdy nie pozwoli wyspie być naprawdę wolną.\n\nNiektórzy ludzie zaczynają w to wierzyć. Coraz częściej słyszę słowo: „wróg”. Nie podoba mi się to.`},
  {date:"28 GRUDNIA 1904", title:"WSZYSTKO SIĘ ŁĄCZY", text:`Nie wiem już, komu wierzyć. Rząd mówi jedno. Gazety mówią drugie. Ludzie mówią trzecie. Każdy ma swoją prawdę.\n\nWczoraj ktoś powiedział mi, że wszystkie zeszłoroczne sabotaże były ze sobą powiązane. Nie chciałem w to wierzyć. Ale kiedy spojrzałem na ostatnie miesiące... magazyny. Port. Towary. Ludzie. Politycy.\n\nWszystko zaczęło się od siebie łączyć. Jeżeli to prawda... to ktoś robi to od bardzo dawna.`},
  {date:"04 STYCZNIA 1905", title:"ZAMKNIĘTY PORT", text:`Dzisiaj rano port został zamknięty. Nikt nie wie dlaczego.\n\nNa ulicach pojawili się uzbrojeni ludzie. Nie są to zwykli policjanci. Mają własne mundury. Własne symbole. Zajęli budynek administracji.\n\nNikt nie stawia oporu. Jeszcze nie.`},
  {date:"06 STYCZNIA 1905", title:"KONTROLA", text:`Wszystko się zmieniło. Nie można opuścić miasta. Nie można swobodnie korzystać z portu. Kontrolują drogi. Kontrolują statki. Kontrolują informacje.\n\nWczoraj aresztowano kilku ludzi związanych z dawną administracją. Dzisiaj zabrano kolejnych. Nikt nie wie dokąd.\n\nLudzie zaczynają szeptać. Ale nikt nie mówi głośno.`},
  {date:"15 STYCZNIA 1905", title:"NOWY ROZDZIAŁ", text:`Dzisiaj wygłoszono przemówienie na głównym placu. Powiedziano nam, że rozpoczął się nowy rozdział. Że Guarma będzie wolna. Że nie będziemy już służyć obcym interesom.\n\nŻe musimy się zjednoczyć. Wszyscy. Przeciwko jednemu wrogowi. Ameryce.\n\nLudzie wokół mnie bili brawo. Ja też. Nie dlatego, że wierzę. Dlatego, że obok mnie stało sześciu uzbrojonych ludzi.`},
  {date:"19 STYCZNIA 1905", original:"03 MARCA 1905", title:"NIE POZNAJĘ ULICY", note:"ORYGINALNA DATA WPISU: 3 MARCA 1905 · PRZENIESIONO DO ARCHIWUM PRZED STARTEM SERWERA", text:`Nie poznaję już mojej ulicy. Sklep sąsiada zamknięto. Jego samego zabrano kilka dni temu. Podobno zadawał zbyt wiele pytań.\n\nNa każdym rogu stoją strażnicy. Każdy ma uważać na każdego. Ludzie zaczęli znikać. A potem pojawiają się inni.\n\nCi, którzy mówią dokładnie to, co trzeba. Ci, którzy patrzą w ziemię, kiedy przechodzą obok żołnierzy. Ci, którzy nagle mają więcej pieniędzy. Nie wiem, komu ufać.`},
  {date:"22 STYCZNIA 1905", original:"18 CZERWCA 1905", title:"NIE MA DROGI WYJŚCIA", note:"ORYGINALNA DATA WPISU: 18 CZERWCA 1905 · PRZENIESIONO DO ARCHIWUM PRZED STARTEM SERWERA", text:`Próbowałem dzisiaj dostać się do portu. Chciałem sprawdzić, czy istnieje jakikolwiek sposób na opuszczenie wyspy. Nie ma.\n\nKażdy statek jest kontrolowany. Każdy człowiek jest sprawdzany. Powiedziano mi, że nie mam pozwolenia na podróż.\n\nZapytałem: „A kiedy będę mógł wyjechać?” Nikt mi nie odpowiedział.`},
  {date:"26 STYCZNIA 1905", original:"02 WRZEŚNIA 1905", title:"ODEBRANY DOM", note:"ORYGINALNA DATA WPISU: 2 WRZEŚNIA 1905 · PRZENIESIONO DO ARCHIWUM PRZED STARTEM SERWERA", text:`Minęło prawie pięć lat od dnia, w którym przybyłem na tę wyspę. Pamiętam tamten dzień. Ruiny. Gruzy. Ludzi odbudowujących swoje domy.\n\nPamiętam, jak wierzyłem, że właśnie tutaj zacznie się moje nowe życie. I zaczęło się. Naprawdę. Przez pewien czas byliśmy szczęśliwi.\n\nZbudowaliśmy coś. Zbudowaliśmy miasto. Zbudowaliśmy domy. Zbudowaliśmy przyszłość. A potem ktoś postanowił nam ją odebrać.\n\nNajgorsze jest to, że nie wiem, czy powinniśmy walczyć. Czy powinniśmy uciekać. Czy w ogóle mamy dokąd uciec.`},
  {date:"29 STYCZNIA 1905", original:"19 PAŹDZIERNIKA 1905", title:"SPALONE DOKUMENTY", note:"ORYGINALNA DATA WPISU: 19 PAŹDZIERNIKA 1905 · PRZENIESIONO DO ARCHIWUM PRZED STARTEM SERWERA", text:`Dzisiaj spaliłem większość swoich dokumentów. Nie chcę, żeby ktoś znalazł ten pamiętnik. Ale nie potrafię go wyrzucić.\n\nTo jedyna rzecz, która przypomina mi, że kiedyś było inaczej. Że byliśmy wolni. Że ludzie przyjeżdżali tutaj z nadzieją. Że w 1903 roku wierzyliśmy, że przyszłość należy do nas.\n\nTeraz przyszłość należy do tych, którzy mają broń.`},
  {date:"31 STYCZNIA 1905", original:"31 GRUDNIA 1905", title:"OSTATNIA STRONA", note:"ORYGINALNA DATA WPISU: 31 GRUDNIA 1905 · PRZENIESIONO DO ARCHIWUM PRZED STARTEM SERWERA", text:`Ostatni dzień roku. Nie wiem, czy powinienem dalej pisać. Jeżeli ktoś znajdzie ten pamiętnik... chcę, żeby wiedział jedno.\n\nNie przyjechałem tutaj po wojnę. Nie przyjechałem tutaj walczyć z Ameryką. Nie przyjechałem tutaj po pieniądze. Przyjechałem tutaj, ponieważ obiecano mi nowy początek. I przez pewien czas naprawdę go miałem.\n\nGuarma była naszym domem. To my ją odbudowaliśmy. To my postawiliśmy pierwsze domy. To my otworzyliśmy sklepy. To my zbudowaliśmy port. To my daliśmy tej wyspie życie.\n\nA teraz mówią nam, że nigdy nie była nasza. Nie wiem, co wydarzy się jutro. Może przyjdzie wojna. Może ktoś w końcu odpowie na nasze wołanie. A może po prostu pewnego dnia ktoś znajdzie ten zeszyt wśród ruin i zastanowi się, kim byliśmy.\n\nJeżeli tak się stanie... niech zapamięta jedno. Nie zaczęliśmy tej wojny. Chcieliśmy tylko mieć dom.\n\n„A jednak wojna przyjdzie.”`}
];

const guarmaJournalByYear = guarmaJournalCanon.reduce((acc, entry) => {
  const year = Number(entry.date.slice(-4));
  (acc[year] ||= []).push(entry);
  return acc;
}, {});

// ===== CITY DOSSIER DATA =====
const cityLoreArchive = [
  {index:0,name:"ARMADILLO",caseNo:1,themes:["ODRODZENIE", "WPŁYWY MEKSYKAŃSKIE", "KONFLIKT O TOŻSAMOŚĆ"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"ARMADILLO",text:"Armadillo – od miasta widma do meksykańskiego feniksa. Armadillo jeszcze nie dawno niemal przestało istnieć. Straszliwa epidemia pustoszyła ulice, a ci, którzy przeżyli, uciekli w głąb lądu lub porzucili swoje domy. Miasto wyglądało jak cmentarz – porzucone wozy, zrujnowane budynki, cisza przerywana tylko przez wiatr i krakanie kruków. Jednak w roku 1900 wydarzyło się coś, co odmieniło oblicze tej krainy. Na zachód dotarli Meksykanie – handlarze, rzemieślnicy, robotnicy i całe rodziny, które postanowiły osiedlić się na zgliszczach Armadillo. Niektórzy byli potomkami dawnych mieszkańców północnego Meksyku, inni uciekali przed biedą i konfliktami, jakie targały ich ojczyzną. Pod ich rękami miasto zaczęło powstawać na nowo – ale już nie jako kopia dawnych osad pogranicza, lecz jako miasto z duszą meksykańską. Wznoszono nowe domy w adobe, place ozdabiano kolorowymi tkaninami, a na ulicach rozbrzmiewała muzyka. Dawny saloon zamieniono w głośną cantinę, a rynek wypełniły stragany z przyprawami i owocami sprowadzanymi z południa. Armadillo, jeszcze niedawno przeklęte, zaczęło tętnić życiem – stało się punktem spotkań handlarzy, podróżników i rewolwerowców. Meksykańska kultura nadała mu barwy i ciepło, jakich brakowało w surowym klimacie pogranicza. Ale ta przemiana nie obyła się bez konfliktów – niektórzy dawni mieszkańcy, którzy wrócili po latach, patrzyli z niechęcią na nowych osadników, a Amerykańskie władze z niepokojem śledziły wzrastające wpływy południowych sąsiadów. W roku 1900 Armadillo stało się jednak symbolem odrodzenia – feniksem, który powstał z popiołów zarazy, łącząc w sobie dziedzictwo pogranicza i energię nowego życia wniesioną przez Meksykanów."}}},
  {index:1,name:"BLACKWATER",caseNo:2,themes:["NOWOCZESNOŚĆ", "HANDEL I PRZEMYSŁ", "NAPIĘCIA Z VALENTINE"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"BLACKWATER",text:"Blackwater – miasto przyszłości. Blackwater wyrastało na symbol nowej Ameryki. W 1900 roku ulice tętniły gwarem, gazowe latarnie rozświetlały noc. Dla wielu było to miejsce marzeń – bogaci kupcy inwestowali w handel rzeczny i przemysł, a młodzi ludzie wierzyli, że właśnie tu mogą zacząć nowe życie. Ale Blackwater miało też swoje cienie – rosnące nierówności, biedne dzielnice zamieszkiwane przez przybyszy, oraz wspomnienia krwawych wydarzeń sprzed kilku lat, gdy gangi i bandyci rzuciły wyzwanie rodzącemu się „cywilizowanemu” światu. Do dawnych traum dochodziły też nowe napięcia – w 1900 roku mieszkańcy Blackwater coraz otwarciej wyrażali niechęć wobec ludzi z Valentine. Uważano ich za dzikich ranczerów i pijanych awanturników, którzy stoją na drodze postępowi i marzeniom o nowoczesnej przyszłości. Niechęć ta szybko przeradzała się w otwarte spory, które groziły rozpaleniem dawno wygasłych płomieni przemocy."}}},
  {index:2,name:"COLTER",caseNo:3,themes:["ODOSOBNIENIE", "GÓRY I LÓD", "POGŁOSKI O BANDYTACH"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"COLTER",text:"Colter – Serce skute lodem. W wysokich, skutej lodem górach północy leży Colter – dawna osada, która w 1900 roku była już tylko cieniem ludzkich marzeń. Drewniane chaty, przytulone do zboczy, stały opuszczone, skrzypiące na wietrze, a zaspy śniegu zakrywały dawne ścieżki i drogi... A przynajmniej tak mówili dotychczas ludzie. Krązą pogłoski, że teraz mieszkają tam dawniej bardzo sławni bandyci, którzy uciekli od jakiejkolwiek cywilizacji żeby odsapnąć od ciągłych strzelanin, bójek i kradzieży. Przecież każdy, nawet najbrutalniejszy z bandytów potrzebuje chwili spokoju... Prawda? Nikt nie wie czy te plotki są prawdziwe, ponieważ jest niewiele śmiałków, którzy mają na tyle odwagi by wyruszyć w tak srogą podróż do tej zimnej krainy ale kto wie? Może kiedyś znajdzie się parę odważnych by potwierdzić tą historię..."}}},
  {index:3,name:"STRAWBERRY",caseNo:4,themes:["SPOKÓJ", "TURYSTYKA", "SPÓR O ROZWÓJ"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"STRAWBERRY",text:"Strawberry – zielony azyl. Strawberry, choć niewielkie, wyróżniało się malowniczym położeniem. Drewniane domy otoczone górami i lasami sprawiały, że miasteczko miało niemal bajkowy urok. W 1900 roku przyciągało turystów i wędrowców szukających wytchnienia od zgiełku wielkich miast. Mówiono, że Strawberry to miasto relaksu – ludzie przyjeżdżali tu, by pooddychać świeżym, górskim powietrzem i odpocząć od dymu i hałasu Saint Denis czy Blackwater. Goście zatrzymywali się w niewielkich gospodach, chodzili na długie spacery leśnymi ścieżkami i podziwiali piękno dzikiej przyrody. Jednak nie wszyscy patrzyli na Strawberry jak na spokojny raj – bogaci inwestorzy chcieli uczynić z niego górskie uzdrowisko, podczas gdy lokalni mieszkańcy obawiali się, że stracą swój skromny, lecz wolny sposób życia. W cieniu zielonych wzgórz toczyła się więc cicha walka o to, czy Strawberry pozostanie małym miasteczkiem, czy stanie się kolejnym symbolem cywilizacji i chciwości."}}},
  {index:4,name:"SAINT DENIS",caseNo:5,themes:["PORT", "NOWOCZESNOŚĆ", "MAFIA"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"SAINT DENIS",text:"Saint Denis – brama na świat. Saint Denis wciąż pozostawało największym, najbardziej kosmopolitycznym miastem regionu. Port był zatłoczony statkami, które przywoziły towary z Europy i Karaibów, a ulice wypełniały wozy pełne robotników i dorożki bogaczy. Dźwięki języków z całego świata mieszały się w hałasie tego tętniącego życiem miejsca. Choć z zewnątrz Saint Denis wydawało się symbolem nowoczesności, w rzeczywistości miasto było kontrolowane z cienia przez mafię. Organizacje przestępcze, powiązane z dokami, saloonami i hazardem, decydowały o tym, kto mógł prowadzić interes, a kto znikał bez śladu. Kupcy i politycy często byli tylko marionetkami w rękach bossów, którzy nigdy nie pokazali się publicznie, ale których wpływy sięgały od portu aż po najwyższe piętra ratusza.W ciasnych, ciemnych uliczkach miasta kwitł nielegalny handel – od przemycanych trunków i opium, po broń i egzotyczne towary, które nigdy nie trafiały na oficjalne rejestry portowe. W roku 1900 Saint Denis było więc zarówno oknem Ameryki na świat, jak i mrocznym labiryntem intryg, gdzie każdy krok mógł sprowadzić na człowieka zgubę."}}},
  {index:5,name:"VALENTINE",caseNo:6,themes:["BYDŁO", "POGRANICZE", "AWANTURY"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"VALENTINE",text:"Valentine – brudne serce stanu. Valentine było surowym miasteczkiem pogranicza. Tu, w 1900 roku, codzienność wciąż pachniała sianem, potem i alkoholem. Farmerzy i hodowcy bydła przyjeżdżali tu sprzedawać swoje towary, a kowboje przepijali zarobek w dusznych saloonach. Miasto było znane z bójek i awantur – szeryf miał pełne ręce roboty, a każdy, kto chciał tam prowadzić interes, musiał liczyć się z tym, że prędzej czy później ktoś wpadnie do jego drzwi z rewolwerem u boku. Mieszkańcy Valentine darzyli też wyraźną niechęcią ludzi z Blackwater, których uważali za zadufanych mieszczuchów, chcących wykupić ich ziemię i zniszczyć stary, kowbojski porządek. W saloonach często słychać było, że „Blackwater sprzedaje duszę za pieniądze, a Valentine wciąż walczy o swoją wolność”. Mimo chaosu i biedy, Valentine przyciągało ludzi – jako miejsce, gdzie można było spróbować szczęścia, choć ryzykowało się wszystko."}}},
  {index:6,name:"TUMBLEWEED",caseNo:7,themes:["ODRODZENIE", "HANDEL", "WPŁYWY MEKSYKAŃSKIE"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"TUMBLEWEED",text:"Tumbleweed – zapomniane miasto na nowo odkryte. Na dalekim zachodzie, w skąpanym słońcem i pyłem regionie New Austin, Tumbleweed przez lata uchodziło za miasteczko zapomniane przez świat. Choć niegdyś tętniło handlem i kowbojskim życiem, z czasem coraz więcej ludzi przenosiło się do sąsiednich osad, a Tumbleweed traciło znaczenie. Jednak w roku 1900 na jego ulice zajechali Meksykanie – kupcy, rzemieślnicy i rodziny, które szukały nowego początku. Z pustych budynków zaczęły rodzić się tawerny, sklepy i warsztaty. Dawny, zaniedbany rynek rozbrzmiał gwarem, a w powietrzu czuć było zapach przypraw i pieczonej kukurydzy. Pod ich rękami Tumbleweed odżyło – stało się miejscem, gdzie kultura pogranicza spotykała się z żywiołowością Meksyku. Uliczkami niesiono muzykę gitar i trąbek, a nocami cantiny tętniły życiem do samego świtu. Miasto, które kiedyś chyliło się ku upadkowi, znów przyciągało handlarzy, podróżników i rewolwerowców. W roku 1900 Tumbleweed stało się więc miastem odrodzonym, żywym dowodem, że nawet na zapomnianych rubieżach można odnaleźć nowe życie."}}},
  {index:7,name:"RHODES",caseNo:8,themes:["DZIEDZICTWO POŁUDNIA", "PLANTACJE", "KONFLIKTY"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"RHODES",text:"Rhodes - Dziedzictwo Południa. Rhodes to niewielkie miasteczko w sercu hrabstwa Lemoyne, które do dziś nosi piętno wojny secesyjnej. W latach 60. XIX wieku większość jego mieszkańców poparła sprawę Konfederacji. Po klęsce Południa miasto nigdy w pełni nie podniosło się z ruiny – dawne plantacje uległy zniszczeniu, a wielu weteranów powróciło z frontu bez majątku, z goryczą w sercach. Miasto na rozdrożu Na początku XX wieku Rhodes wydaje się zwykłym, spokojnym miasteczkiem z targiem, kościołem i kilkoma odnowionymi plantacjami. Jednak pod powierzchnią wciąż buzują napięcia: część mieszkańców pragnie budować nowe życie w zgodzie z prawem federalnym, inni pielęgnują pamięć o dawnym porządku i marzą o „odrodzeniu Południa”. Codzienność w cieniu strachu Na co dzień życie toczy się zwyczajnym rytmem – na rynku słychać nawoływania kupców, a w saloonie przy głównym placu zbierają się mieszkańcy, by omawiać nowiny. Jednak każdy wie, że w nocy okolice miasteczka stają się niebezpieczne. Plotki o spotkaniach tajnych bractw, o nieznajomych na drogach i o znikających podróżnych krążą niemal w każdej rozmowie. Rhodes w 1900 roku Miasteczko stoi na granicy dwóch światów: z jednej strony – cywilizacja, handel i powolny rozwój, z drugiej – cień wojny, wrogość i stare urazy, które nigdy nie wygasły."}}},
  {index:8,name:"ANNESBURG",caseNo:9,themes:["WĘGIEL", "KOPALNIA", "CIĘŻKA PRACA"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"ANNESBURG",text:"Annesburg – miasto węgla i ciężkiej pracy. Na północnym wschodzie, nad rzeką Kamassa, leży Annesburg – miasteczko zbudowane na węglu. W 1900 roku życie mieszkańców kręciło się wokół kopalni, gdzie mężczyźni, kobiety i dzieci spędzali długie godziny pod ziemią. Pył, głód i częste wypadki były codziennością. Nieopodal działała też mała kopalnia, która początkowo dawała nadzieję na lepsze warunki, lecz szybko stała się źródłem rywalizacji i konfliktów z potężnymi właścicielami głównych szybów. Annesburg był miejscem ciężkiej pracy i biedy – miastem, do którego rzadko kto przybywał z własnej woli."}}},
  {index:9,name:"VAN HORN",caseNo:10,themes:["BEZPRAWIE", "PRZEMYT", "PRZEMOC"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"VAN HORN",text:"Van Horn – Przekleństwo pogranicza. W 1900 roku sława tego miejsca była tak ponura, że nawet doświadczeni podróżnicy ostrzegali przed wyruszeniem w jego stronę. Van Horn to miasteczko bez prawa. Szeryf nigdy tu nie zawitał, a wszelka władza spoczywała w rękach bandytów i złodziei, którzy zrobili z ulic przystań dla swoich interesów. Nielegalny handel kwitł na każdym rogu – broń, alkohol, opium i skradzione towary przechodziły z rąk do rąk w dusznych, zadymionych saloonach. Na dokach, gdzie rzeka stykała się z zapadłymi magazynami, można było znaleźć wszystko – od przemytniczych skrzyń po zaginionych ludzi, którzy odważyli się wejść do Van Horn bez eskorty. Nocami rozbrzmiewały tam strzały i pijackie krzyki, a każdy, kto się potknął, ryzykował, że już nigdy nie ujrzy poranka. Mieszkańcy mówili półgłosem, że w Van Horn życie warte jest mniej niż kula. Kupcy i podróżni wiedzieli, że jeśli już muszą tędy przejechać, powinni trzymać się z dala od uliczek, nie patrzeć nikomu w oczy i nie zadawać pytań. Van Horn było więc symbolem upadku – miejscem, gdzie nie rządziło prawo ani sprawiedliwość, lecz chciwość i przemoc. Każdy, kto wyruszał w drogę ku tej osadzie, musiał wiedzieć jedno: to podróż w serce ciemności, z której nie każdy powracał."}}},
  {index:10,name:"INDIANIE",caseNo:11,themes:["CZEREŃOWIE", "ŚWIĘTE ZIEMIE", "OCHRONA NATURY"],years:{1900:{status:"AKTA OPUBLIKOWANE · 1900",title:"INDIANIE",text:"Plemię Czerenów Plemię Czerenów było niegdyś jednym z najbardziej dumnych i samowystarczalnych ludów tych ziem. Przez pokolenia żyliśmy w harmonii z naturą, szanując jej rytm, zwierzęta oraz duchy przodków. Ziemia dawała nam wszystko, czego potrzebowaliśmy, a my braliśmy tylko tyle, ile było konieczne do przetrwania.W wierzeniach Czerenów zwierzęta nie są jedynie pożywieniem. Są darem duchów, źródłem życia i równowagi świata. Każde zabite zwierzę oddaje część swojej duszy plemieniu, dlatego polowanie zawsze odbywa się z umiarem i szacunkiem. Po każdym udanym łowie odprawiany jest rytuał pożegnania, który ma zapewnić, że dusza zwierzęcia bezpiecznie opuści świat żywych i powróci do kręgu natury. Wraz z rozwojem Stanów Zjednoczonych nasz świat zaczął się rozpadać. Linie kolejowe, osady białych ludzi i niepohamowana chciwość sprawiły, że Czerenowie zostali zepchnięci na margines istnienia. Nasze tereny łowieckie zostały odebrane, święte miejsca zbezczeszczone, a całe wioski zniszczone.Dziś, w roku 1900, po dawnym plemieniu pozostały jedynie dwie wioski ostatnie bastiony naszej kultury i tradycji. Ich istnienie jest kruche, a każdy dzień to walka o przetrwanie. Zmuszeni sytuacją, polujemy na zwierzęta, by wykarmić nasze rodziny i utrzymać przy życiu resztki plemienia.Największą raną dla Czerenów jest jednak to, jak przybysze traktują naturę. Zwierzęta są masowo zabijane dla pieniędzy, bez szacunku, bez umiaru i bez jakichkolwiek konsekwencji. Dla obcych są one jedynie towarem dla nas są życiem.Początkowo próbowaliśmy negocjować. Starszyzna wielokrotnie podejmowała rozmowy z osadnikami i myśliwymi, prosząc o zachowanie równowagi i szacunek wobec ziemi. Nasze słowa zostały jednak zignorowane, a dane obietnice nigdy nie zostały spełnione.Po tych nieudanych próbach Czerenowie sięgnęli po inne środki. Zaczęliśmy stosować taktyki partyzanckie, działając w cieniu lasów i gór. Okradamy myśliwych z broni, amunicji oraz zdobytych łupów, by ograniczyć bezmyślne zabijanie i bronić świętych ziem plemienia.Dla świata zewnętrznego jesteśmy bandytami. Dla siebie samych strażnikami równowagi, którą inni dawno utracili."}}}
];

// ===== FRONTIER CHRONICLE YEAR ARCHIVE =====
// 1900 contains the existing published lore. Years 1901–1905 are deliberately
// separate archive slots so their lore can be filled independently later.
const loreYears = [1900,1901,1902,1903,1904,1905];
let selectedLoreYear = 1905;

const yearSlider = $("#loreYearSlider");
const yearDisplay = $("#loreYearDisplay");
const mapYearLabel = $("#mapYearLabel");
const mapYearFooter = $("#mapYearFooter");
const yearStatus = $("#loreYearStatus");
const cityYearRibbon = $("#cityYearRibbon");
const yearMarks = $$(".year-mark");
const cityYearLabels = $$(".city-file-year");

// Snapshot the current 1900 city lore before switching years.
const publishedLore1900 = {};
cityFiles.forEach((file, i) => {
  publishedLore1900[i] = {
    title: $("h3", file)?.textContent || "",
    text: $("p", file)?.textContent || ""
  };
});

function setLoreYear(year, refreshCity=true){
  selectedLoreYear = Number(year);
  const published = selectedLoreYear === 1900;

  if(yearSlider) yearSlider.value = selectedLoreYear;
  if(yearDisplay) yearDisplay.textContent = selectedLoreYear;
  if(mapYearLabel) mapYearLabel.textContent = selectedLoreYear;
  if(mapYearFooter) mapYearFooter.textContent = selectedLoreYear;
  if(cityYearRibbon) cityYearRibbon.textContent = selectedLoreYear;

  yearMarks.forEach(mark => mark.classList.toggle("active", Number(mark.dataset.year) === selectedLoreYear));

  if(yearStatus){
    yearStatus.textContent = selectedLoreYear === 1905
      ? "AKTA OTWARTE · 1905"
      : `ARCHIWUM ${selectedLoreYear} · WCZEŚNIEJSZY ROK SEZONU II`;
  }

  cityYearLabels.forEach(label => label.textContent = selectedLoreYear);

  // Keep the map itself stable, but change its archival context.
  document.documentElement.style.setProperty("--lore-year", `"${selectedLoreYear}"`);

  // If a city is already open, refresh its contents to the selected year.
  if(refreshCity && $("#cityModal")?.classList.contains("open")){
    const active = $(".city-file.active");
    const cityIndex = active ? active.dataset.cityFile : null;
    if(cityIndex !== null) renderCityLore(cityIndex, false);
  }
}

function renderCityLore(index, open=true){
  const file = cityFiles.find(f => Number(f.dataset.cityFile) === Number(index));
  const data = cityLoreArchive[Number(index)];
  if(!file || !data) return;

  cityFiles.forEach((f,idx)=>f.classList.toggle("active",idx===Number(index)));

  const title = $("h3", file);
  const paragraph = $("p", file);
  const meta = $(".file-meta", file);

  const year = Number(selectedLoreYear);
  const archive = data.years[year];

  const dossierTitle = $("#dossierTitle");
  const dossierCase = $("#dossierCase");
  const dossierStatus = $("#dossierStatus");
  const dossierYear = $("#dossierYear");
  const dossierText = $("#dossierText");
  const dossierThemes = $("#dossierThemes");
  const dossierSource = $("#dossierSource");
  const dossierIndex = $("#dossierIndex");

  if(dossierTitle) dossierTitle.textContent = data.name;
  if(dossierCase) dossierCase.textContent = `CASE FILE · ${String(data.caseNo).padStart(2,"0")}`;
  if(dossierYear) dossierYear.textContent = year;
  if(dossierIndex) dossierIndex.textContent = `${String(data.caseNo).padStart(2,"0")} / ${String(cityLoreArchive.length).padStart(2,"0")}`;

  if(archive){
    if(dossierStatus) dossierStatus.textContent = archive.status;
    if(dossierText) dossierText.textContent = archive.text;
    if(dossierSource) dossierSource.textContent = year === 1900
      ? "ŹRÓDŁO · PIERWOTNY LORE FRONTIERLIFE"
      : "ROCZNIK PRZYGOTOWANY · BRAK OPUBLIKOWANEGO LORE W PLIKU";
  } else {
    if(dossierStatus) dossierStatus.textContent = `AKTA ${year} · DO UZUPEŁNIENIA`;
    if(dossierText) dossierText.textContent =
      `Dla roku ${year} nie ma jeszcze opublikowanego materiału w aktualnym archiwum. ` +
      `Miejsce jest przygotowane na wydarzenia, postacie, konflikty i zmiany dotyczące ${data.name}.`;
    if(dossierSource) dossierSource.textContent = "ROCZNIK PRZYGOTOWANY · OCZEKUJE NA MATERIAŁ LORE";
  }

  if(dossierThemes){
    dossierThemes.innerHTML = data.themes.map(tag => `<span>${tag}</span>`).join("");
  }

  // Keep legacy source cards synchronized for existing controls.
  if(title) title.textContent = data.name;
  if(paragraph) paragraph.textContent = archive?.text || "";
  if(meta){
    const label = $(".city-file-year", meta);
    if(label) label.textContent = year;
  }

  updateDossierNavigation(index);

  if(open) openModal("cityModal");
}


function updateDossierNavigation(index){
  const total = cityLoreArchive.length;
  const current = Number(index);
  const prev = $("#dossierPrev");
  const next = $("#dossierNext");
  if(prev){
    prev.disabled = current <= 0;
    prev.onclick = () => current > 0 && renderCityLore(current - 1);
  }
  if(next){
    next.disabled = current >= total - 1;
    next.onclick = () => current < total - 1 && renderCityLore(current + 1);
  }
}

const chronicleArchive = {
  1900: {
    status: "ARCHIWUM · OPUBLIKOWANE",
    title: "FRONTIER STATE · 1900",
    text: "Początek archiwum FrontierLife. Opublikowane akta opisują stan pogranicza, który stanowi punkt wyjścia dla dalszej historii.",
  },
  1901: {
    status: "ARCHIWUM · ROCZNIK 1901",
    title: "FRONTIER STATE · 1901",
    text: "Osobny rocznik wydarzeń. W tym miejscu można prowadzić historię zmian, które wynikają bezpośrednio z rozgrywki.",
  },
  1902: {
    status: "ARCHIWUM · ROCZNIK 1902",
    title: "FRONTIER STATE · 1902",
    text: "Osobny rocznik wydarzeń. Każde ważne wydarzenie może zostać przypisane do konkretnego miasta i później odnalezione na mapie.",
  },
  1903: {
    status: "ARCHIWUM · ROCZNIK 1903",
    title: "FRONTIER STATE · 1903",
    text: "Osobny rocznik wydarzeń. To miejsce na konflikty, rozwój organizacji, zmiany gospodarcze i historie mieszkańców.",
  },
  1904: {
    status: "ARCHIWUM · ROCZNIK 1904",
    title: "FRONTIER STATE · 1904",
    text: "Osobny rocznik wydarzeń. Historia może być rozwijana niezależnie od wcześniejszych lat i powiązana z aktami konkretnych miast.",
  },
  1905: {
    status: "AKTA OTWARTE",
    title: "FRONTIER STATE · 1905",
    text: "Bieżący rok sezonu II. To tutaj trafiają wydarzenia, które zmieniają sytuację na pograniczu — nowe osoby, konflikty, interesy i konsekwencje działań mieszkańców.",
  }
};

function updateChroniclePanel(year){
  const data = chronicleArchive[Number(year)] || chronicleArchive[1905];
  const yearNum = Number(year);
  const yearEl = $("#chronicleYear");
  const stamp = $("#chronicleStampYear");
  const status = $("#chronicleStatus");
  const title = $("#chronicleTitle");
  const text = $("#chronicleText");
  const cityCount = $("#chroniclePrimaryCount");
  const index = $("#chronicleYearIndex");

  if(yearEl) yearEl.textContent = yearNum;
  if(stamp) stamp.textContent = yearNum;

  const activeMap = document.querySelector(".map-board")?.dataset.mapView || "guarma";
  if(activeMap === "guarma"){
    if(status) status.textContent = "GUARMA · AKTA OTWARTE";
    if(title) title.textContent = "GUARMA · DZIENNIK WYPRAWY";
    if(text) text.textContent = "Rocznik wskazuje moment historii, do którego należą wpisy pamiętnika Guarmy. Punkty na mapie prowadzą do odpowiadających im zapisów.";
    if(cityCount) cityCount.textContent = document.querySelectorAll(".guarma-pin").length;
  }else{
    if(status) status.textContent = data.status;
    if(title) title.textContent = data.title;
    if(text) text.textContent = data.text;
    if(cityCount) cityCount.textContent = cityFiles.length;
  }

  if(index) index.textContent = String(yearNum - 1899).padStart(2,"0");

  const journalCount = $("#chronicleJournalCount");
  if(journalCount) journalCount.textContent = (guarmaJournalByYear[yearNum] || []).length;
}

const originalSetLoreYear = setLoreYear;
setLoreYear = function(year, refreshCity=true){
  originalSetLoreYear(year, refreshCity);
  updateChroniclePanel(year);
  try { localStorage.setItem("frontierlifeLoreYear", String(year)); } catch(e) {}
};

let savedLoreYear = 1905;
try {
  const stored = Number(localStorage.getItem("frontierlifeLoreYear"));
  if(stored >= 1900 && stored <= 1905) savedLoreYear = stored;
} catch(e) {}

yearSlider?.addEventListener("input", e => setLoreYear(e.target.value));
yearMarks.forEach(mark => mark.addEventListener("click", () => setLoreYear(mark.dataset.year)));

$$(".lore-card[data-city]").forEach(el => {
  el.addEventListener("click", () => renderCityLore(el.dataset.city));
});

setLoreYear(savedLoreYear, false);


// ============================================================
// GUARMA MAP + JOURNAL READER
// ============================================================
(() => {
  const mapBoard = document.querySelector('.map-board');
  const mapTools = $$('.map-tool[data-map-view]');
  const guarmaArt = document.querySelector('.guarma-map-art');
  const rdrArt = document.querySelector('.rdr2-map-art');
  const guarmaPins = $$('.guarma-pin');
  const frontierPins = $$('.map-pin');

  const mapLoreGrid = $('#mapLoreGrid');
  const mapFooter = $('#mapYearFooter');

  // Lower cards mirror the currently selected map.
  // Each Guarma card is tied to the same journal entry as its map pin.
  const guarmaMapPoints = [
    {name:"CINCO TORRES", pin:".gp-cinco", entry:0, label:"WPIS DZIENNIKA", note:"Miejsce związane z początkiem historii na wyspie."},
    {name:"PORT", pin:".gp-port", entry:1, label:"WPIS DZIENNIKA", note:"Port — pierwszy punkt odbudowy i napływu nowych mieszkańców."},
    {name:"AGUASDULCES", pin:".gp-aguas", entry:3, label:"WPIS DZIENNIKA", note:"Miasto, które z czasem zaczęło naprawdę żyć."}
  ];

  function setMapView(view){
    if(!mapBoard) return;

    const normalized = view === 'rdr2' ? 'rdr2' : 'guarma';
    mapBoard.dataset.mapView = normalized;

    mapTools.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mapView === normalized);
    });

    const isGuarma = normalized === 'guarma';

    if(guarmaArt) guarmaArt.style.display = isGuarma ? 'block' : 'none';
    if(rdrArt) rdrArt.style.display = isGuarma ? 'none' : 'block';

    guarmaPins.forEach(pin => {
      pin.style.display = isGuarma ? 'block' : 'none';
    });
    frontierPins.forEach(pin => {
      pin.style.display = isGuarma ? 'none' : 'block';
    });

    renderMapLoreCards(normalized);

    const eyebrow = $('#mapContextEyebrow');
    const contextTitle = $('#mapContextTitle');
    const contextText = $('#mapContextText');
    const panelTitle = $('#chronicleTitle');
    const panelStatus = $('#chronicleStatus');
    const primaryCount = $('#chroniclePrimaryCount');
    const primaryLabel = $('#chroniclePrimaryLabel');
    const journalLabel = $('#chronicleJournalLabel');
    const sourceLabel = $('#chronicleSourceLabel');

    if(isGuarma){
      if(eyebrow) eyebrow.textContent = 'GUARMA · LORE CONNECTION';
      if(contextTitle) contextTitle.textContent = 'Każdy punkt prowadzi do właściwego wpisu dziennika.';
      if(contextText) contextText.textContent = 'Mapa Guarmy pokazuje miejsca związane z historią sezonu II. Kliknij znacznik, aby otworzyć odpowiadający mu wpis.';
      if(panelTitle) panelTitle.textContent = 'GUARMA · DZIENNIK WYPRAWY';
      if(panelStatus) panelStatus.textContent = 'GUARMA · AKTA OTWARTE';
      if(primaryCount) primaryCount.textContent = guarmaPins.length;
      if(primaryLabel) primaryLabel.textContent = 'PUNKTY GUARMY';
      if(journalLabel) journalLabel.textContent = 'WPISÓW DZIENNIKA';
      if(sourceLabel) sourceLabel.textContent = 'GUARMA · SEASON II';
    }else{
      const year = $('#chronicleYear')?.textContent || '1905';
      if(eyebrow) eyebrow.textContent = 'FRONTIER STATE · LORE CONNECTION';
      if(contextTitle) contextTitle.textContent = 'Każdy punkt prowadzi do właściwego aktu miasta.';
      if(contextText) contextText.textContent = 'Mapa RDR2 pokazuje miejsca, o których mowa w historii FrontierLife. Lista aktów poniżej jest zsynchronizowana z punktami na mapie.';
      if(panelTitle) panelTitle.textContent = `FRONTIER STATE · ${year}`;
      if(panelStatus) panelStatus.textContent = Number(year) === 1905 ? 'AKTA OTWARTE' : 'ARCHIWUM';
      if(primaryCount) primaryCount.textContent = cityFiles.length;
      if(primaryLabel) primaryLabel.textContent = 'AKTÓW MIAST';
      if(journalLabel) journalLabel.textContent = 'WPISÓW GUARMA';
      if(sourceLabel) sourceLabel.textContent = 'FRONTIER STATE · SEASON II';
    }
  }

  function renderMapLoreCards(view){
    if(!mapLoreGrid) return;

    if(view === 'guarma'){
      mapLoreGrid.classList.add('guarma-lore-grid');
      mapLoreGrid.innerHTML = guarmaMapPoints.map((point, i) => {
        const entry = guarmaJournalReader[point.entry];
        return `<button class="lore-card guarma-lore-card" type="button"
          data-guarma-card="${i}" data-journal-entry="${point.entry}">
          <span class="lore-card-index">${String(i+1).padStart(2,'0')}</span>
          <span><strong>${point.name}</strong><small>${entry?.date || ''} · ${point.label}</small></span>
          <span class="lore-arrow">→</span>
        </button>`;
      }).join("");

      $$(".guarma-lore-card", mapLoreGrid).forEach(card => {
        card.addEventListener("mouseenter", () => {
          const point = guarmaMapPoints[Number(card.dataset.guarmaCard)];
          if(point) $(point.pin)?.classList.add("is-linked");
        });
        card.addEventListener("mouseleave", () => {
          guarmaMapPoints.forEach(point => $(point.pin)?.classList.remove("is-linked"));
        });
        card.addEventListener("click", () => {
          const entry = Number(card.dataset.journalEntry || 0);
          renderJournal(entry);
          openModal('guarmaJournalModal');
        });
      });
    } else {
      mapLoreGrid.classList.remove('guarma-lore-grid');

      // RDR2: dolne karty mają korzystać z właściwego źródła lore,
      // a nie z kolekcji elementów DOM (.city-file). Dzięki temu nazwy
      // miast nigdy nie wyświetlą się jako "undefined".
      mapLoreGrid.innerHTML = cityLoreArchive.map((city, i) => `
        <button class="lore-card" type="button" data-city="${i}">
          <span class="lore-card-index">${String(i+1).padStart(2,'0')}</span>
          <span><strong>${city.name}</strong><small>OPEN CITY FILE</small></span>
          <span class="lore-arrow">→</span>
        </button>`).join("");

      $$(".lore-card[data-city]", mapLoreGrid).forEach(card => {
        card.addEventListener("click", () => renderCityLore(card.dataset.city));
      });
    }

    // Re-run the existing reveal observer for newly created cards.
    $$(".lore-card", mapLoreGrid).forEach(el => {
      try { observer?.observe(el); } catch(e) {}
    });
  }

  mapTools.forEach(btn => btn.addEventListener('click', () => setMapView(btn.dataset.mapView)));
  setMapView('guarma');

  const journalIndexEntries = $('#journalIndexEntries');
  if (journalIndexEntries) {
    const monthMap = {
      'STYCZNIA':'I','LUTEGO':'II','MARCA':'III','KWIETNIA':'IV',
      'MAJA':'V','CZERWCA':'VI','LIPCA':'VII','SIERPNIA':'VIII',
      'WRZEŚNIA':'IX','PAŹDZIERNIKA':'X','LISTOPADA':'XI','GRUDNIA':'XII'
    };
    journalIndexEntries.innerHTML = guarmaJournalReader.map((entry, i) => {
      const parts = entry.date.toUpperCase().split(' ');
      const day = parts[0] || '';
      const month = monthMap[parts[1]] || '';
      const year = parts[2] || '';
      return `<button data-journal-entry="${i}">${year} · ${day.padStart(2,'0')} ${month}</button>`;
    }).join('');
  }

  const journalModal = $('#guarmaJournalModal');
  const date = $('#journalEntryDate');
  const no = $('#journalEntryNo');
  const title = $('#journalEntryTitle');
  const note = $('#journalEntryNote');
  const text = $('#journalEntryText');
  const prev = $('#journalPrev');
  const next = $('#journalNext');
  const indexButtons = $$('#guarmaJournalModal [data-journal-entry]');
  let journalIndex = 0;

  function renderJournal(i){
    journalIndex = Math.max(0, Math.min(guarmaJournalReader.length - 1, Number(i)));
    const entry = guarmaJournalReader[journalIndex];
    if(date) date.textContent = entry.date;
    if(no) no.textContent = `${String(journalIndex+1).padStart(2,'0')} / ${String(guarmaJournalReader.length).padStart(2,'0')}`;
    if(title) title.textContent = entry.title;
    if(note){ note.textContent = entry.note || ''; note.style.display = entry.note ? 'block' : 'none'; }
    if(text) text.innerHTML = entry.text.split(/\\n\\n|\n\n/).map(p => `<p>${p.replace(/\\n|\n/g,' ')}</p>`).join('');
    indexButtons.forEach(btn => btn.classList.toggle('active', Number(btn.dataset.journalEntry) === journalIndex));
    if(prev) prev.disabled = journalIndex === 0;
    if(next) next.disabled = journalIndex === guarmaJournalReader.length - 1;
  }
  indexButtons.forEach(btn => btn.addEventListener('click', () => renderJournal(btn.dataset.journalEntry)));

  // Guarma blipy działają tak samo jak punkty na mapie RDR2:
  // kliknięcie otwiera właściwy wpis dziennika.
  guarmaPins.forEach(pin => pin.addEventListener('click', () => {
    const entry = Number(pin.dataset.journalEntry || 0);
    guarmaPins.forEach(p => p.classList.remove('is-linked'));
    pin.classList.add('is-linked');
    $$(".guarma-lore-card", mapLoreGrid).forEach(card => {
      card.classList.toggle('is-linked', Number(card.dataset.journalEntry) === entry);
    });
    renderJournal(entry);
    openModal('guarmaJournalModal');
  }));

  prev?.addEventListener('click', () => renderJournal(journalIndex-1));
  next?.addEventListener('click', () => renderJournal(journalIndex+1));
  $$('[data-open-journal]').forEach(btn => btn.addEventListener('click', () => { renderJournal(0); openModal('guarmaJournalModal'); }));
  renderJournal(0);
})();

// Open the full RDR2 reference map from the lore map.
$$("[data-open-map]").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.dataset.openMap === "rdr2") openModal("rdr2MapModal");
  });
});


// ============================================================
// FRONTIERLIFE — MAP ZOOM
// ============================================================
(() => {
  const board = document.querySelector(".map-board");
  const layer = document.getElementById("frontierMapZoomLayer");
  const zoomIn = document.getElementById("mapZoomIn");
  const zoomOut = document.getElementById("mapZoomOut");
  const zoomReset = document.getElementById("mapZoomReset");

  if (!board || !layer) return;

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3.2;
  const STEP = 0.2;

  let zoom = 1;
  let offsetX = 0;
  let offsetY = 0;

  function renderZoom(){
    layer.style.setProperty(
      "transform",
      `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${zoom})`,
      "important"
    );
    if (zoomReset) zoomReset.textContent = `${Math.round(zoom * 100)}%`;
  }

  function clampPan(){
    const maxX = (board.clientWidth * (zoom - 1)) / 2;
    const maxY = (board.clientHeight * (zoom - 1)) / 2;
    offsetX = Math.max(-maxX, Math.min(maxX, offsetX));
    offsetY = Math.max(-maxY, Math.min(maxY, offsetY));
  }

  function setZoom(next, focusX = board.clientWidth / 2, focusY = board.clientHeight / 2){
    const oldZoom = zoom;
    zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));

    if (zoom === 1) {
      offsetX = 0;
      offsetY = 0;
    } else if (oldZoom !== zoom) {
      // Keep the point under the cursor approximately stationary.
      const ratio = zoom / oldZoom;
      offsetX = focusX - (focusX - offsetX) * ratio;
      offsetY = focusY - (focusY - offsetY) * ratio;
      clampPan();
    }

    renderZoom();
  }

  zoomIn?.addEventListener("click", (e) => {
    e.stopPropagation();
    setZoom(zoom + STEP);
  });

  zoomOut?.addEventListener("click", (e) => {
    e.stopPropagation();
    setZoom(zoom - STEP);
  });

  zoomReset?.addEventListener("click", (e) => {
    e.stopPropagation();
    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    renderZoom();
  });

  board.addEventListener("wheel", (e) => {
    // Do not zoom when the user is scrolling over a marker or the controls.
    if (e.target.closest(".map-pin,.map-zoom-controls")) return;

    e.preventDefault();

    const rect = board.getBoundingClientRect();
    const focusX = e.clientX - rect.left;
    const focusY = e.clientY - rect.top;

    setZoom(zoom + (e.deltaY < 0 ? STEP : -STEP), focusX, focusY);
  }, {passive:false});

  board.addEventListener("dblclick", (e) => {
    if (e.target.closest(".map-pin,.map-zoom-controls")) return;
    e.preventDefault();

    const rect = board.getBoundingClientRect();
    const focusX = e.clientX - rect.left;
    const focusY = e.clientY - rect.top;

    setZoom(zoom < 2 ? 2 : 1, focusX, focusY);
  });

  // When zoomed in, drag the map with the left mouse button.
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startOffsetX = 0;
  let startOffsetY = 0;

  board.addEventListener("pointerdown", (e) => {
    if (zoom <= 1 || e.target.closest(".map-pin,.map-zoom-controls")) return;

    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startOffsetX = offsetX;
    startOffsetY = offsetY;
    layer.classList.add("is-dragging");
    board.setPointerCapture?.(e.pointerId);
  });

  board.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    offsetX = startOffsetX + (e.clientX - startX);
    offsetY = startOffsetY + (e.clientY - startY);
    clampPan();
    renderZoom();
  });

  function stopDragging(){
    dragging = false;
    layer.classList.remove("is-dragging");
  }

  board.addEventListener("pointerup", stopDragging);
  board.addEventListener("pointercancel", stopDragging);
  board.addEventListener("pointerleave", () => {
    if (dragging) stopDragging();
  });

  renderZoom();
})();
