# FrontierLife — dodawanie gazet

Od tej wersji dane gazet są oddzielone od logiki strony. Nie trzeba edytować `index.html` ani CSS, żeby dodać kolejne wydanie.

## 1. Gdzie dodawać gazetę?

Edytuj tylko:

`newspapers.js`

W pliku znajduje się tablica `window.FRONTIER_NEWSPAPERS = [...]`.

Każdy obiekt `{ ... }` to jedno wydanie gazety.

## 2. Minimalny przykład nowej gazety

```js
{
  title: "THE BLACKWATER HERALD",
  meta: "BLACKWATER · NOVEMBER 1905 · VOL. IV · NO. 01",
  issue: "VOL. IV · NO. 01",
  dateLabel: "NOVEMBER · 1905",
  description: "Krótki opis wydania widoczny pod okładką.",
  coverClass: "edition-cover-1",
  pages: [
    {
      kicker: "WIADOMOŚCI · BLACKWATER",
      title: "GŁÓWNY NAGŁÓWEK",
      body: `
        <p class="lead">Pierwszy, najważniejszy fragment artykułu.</p>
        <p>Treść artykułu. Można używać kilku akapitów, list, ramek i elementów stylowanych przez CSS.</p>
      `
    },
    {
      kicker: "KRONIKA",
      title: "DRUGI ARTYKUŁ",
      body: `
        <p>Treść drugiego artykułu.</p>
      `
    }
  ]
}
```

## 3. Strony

Każdy element `pages` jest jedną stroną. Czytnik automatycznie łączy je w rozkładówki:

- `pages[0]` + `pages[1]` → strony 01–02
- `pages[2]` + `pages[3]` → strony 03–04
- itd.

Możesz mieć 2, 4, 6, 8, 10... stron.

## 4. Obrazek w artykule

Jeśli chcesz użyć ilustracji, wrzuć ją do folderu strony i w artykule dodaj:

```js
{
  kicker: "KRYMINAŁ",
  title: "NAPAD NA POCIĄG",
  image: "train-robbery",
  body: `<p class="lead">...</p>`
}
```

Obecny renderer tworzy dla `image` blok ilustracji. Docelowo możemy rozbudować to do zwykłego pliku JPG/PNG z podpisem, bez zmiany systemu gazet.

## 5. Co robi strona automatycznie?

Po dodaniu obiektu:

- gazeta pojawia się w karuzeli,
- generuje się jej numer,
- dostaje własną okładkę,
- pojawia się jako środkowa / boczna karta zależnie od wyboru,
- dostaje własne kropki/numer wydania,
- przycisk `OTWÓRZ GAZETĘ` otwiera czytnik,
- strony są przewracane po 2,
- działa klawiatura oraz swipe.

Dzięki temu dodanie kolejnego wydania nie wymaga zmian w `index.html`.
