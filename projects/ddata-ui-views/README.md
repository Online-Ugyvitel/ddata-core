# DData UI Views

`@netdjw/ddata-ui-views` – több komponensből álló, komplex képernyők (nézetek) a `ddata` világban.
Az alap UI-elemek (`@netdjw/ddata-ui-common`, `-input`, `-dialog`, `-file`) külön csomagokban vannak.

| Nézet | Szelektor | Leírás |
| --- | --- | --- |
| `ViewKanbanComponent` | `dd-view-kanban` | Kanban tábla státuszoszlopokkal, drag & drop és billentyűzetes áthelyezéssel |
| `ViewDateSeparatedListComponent` | `dd-view-date-separated-list` | Határidő (naptári nap) szerint csoportosított lista |

## Telepítés

```bash
npm install @netdjw/ddata-ui-views
```

Peer dependency-k: `@angular/common`, `@angular/core` (22), `@fortawesome/angular-fontawesome`,
`@fortawesome/free-solid-svg-icons`, `@netdjw/ddata-core`, `@netdjw/ddata-ui-common`.

## Importálás

A nézetek standalone komponensek:

```typescript
import { ViewKanbanComponent, ViewDateSeparatedListComponent } from '@netdjw/ddata-ui-views';

@Component({
  imports: [ViewKanbanComponent, ViewDateSeparatedListComponent],
  // ...
})
export class CasefilesComponent {}
```

NgModule alapú alkalmazásban a `DdataUiViewsModule` importálható, ez mindkét nézetet exportálja.

## Kanban nézet

```html
<dd-view-kanban
  title="Ügyek"
  [data]="casefiles$ | async"
  [statuses]="statuses$ | async"
  [heightOffset]="189"
  (openCasefile)="open($event)"
  (updateCasefile)="save($event)"
></dd-view-kanban>
```

| Bemenet | Típus | Alapérték | Leírás |
| --- | --- | --- | --- |
| `data` | `CasefileInterface[] \| null` | `[]` | Az ügyek |
| `statuses` | `CasefileStatusInterface[] \| null` | `[]` | Az oszlopok sorrendje |
| `title` | `string` | `'Kanban nézet'` | Cím |
| `heightOffset` | `number \| null` | `189` | Az ablak magasságából ennyi pixel marad ki; `null`: nincs fix magasság |
| `texts` | `Partial<ViewKanbanTextsInterface>` | `{}` | Felülírt szövegek (`viewKanbanTexts` az alapértelmezés) |

| Kimenet | Leírás |
| --- | --- |
| `openCasefile` | Az eredeti ügy, kattintásra vagy Enterre |
| `updateCasefile` | Az eredeti ügy az új `status_id`-val és `status`-szal, ha másik oszlopba került |

Működés:

- Az oszlopok a `statuses` sorrendjében jelennek meg. Ismeretlen státuszú ügyhöz új oszlop nyílik
  (a státusz neve, vagy `#<id>`), a státusz nélküli ügyek a „Státusz nélkül” oszlopba kerülnek.
- Az oszlop fejlécében az ügyek száma és a becsült idők (`H:mm:ss`) összege látható órában és percben,
  24 óra felett is (pl. `30ó 30p`). A hiányzó vagy hibás formátumú becsült idő nem számít bele.
- Drag & drop: egy kártyára ejtve elé, az oszlop üres részére ejtve az oszlop végére kerül az ügy.
  Ugyanazon az oszlopon belül csak a sorrend változik (nincs `updateCasefile`). Az Esc-kel vagy a táblán
  kívül elengedett húzás semmit nem módosít. Több tábla egy oldalon nem zavarja egymást.
- Billentyűzet (a kártyán): Enter / Szóköz – megnyitás; Balra / Jobbra nyíl – áthelyezés a szomszédos
  oszlop végére; Fel / Le nyíl – áthelyezés az oszlopon belül. Az áthelyezést a képernyőolvasó felolvassa.
- Az áthelyezések a következő bemenetváltozásig maradnak meg; ekkor a tábla a `data` alapján újraépül.

## Dátum szerint csoportosított lista

```html
<dd-view-date-separated-list
  [data]="casefiles$ | async"
  locale="hu"
  timeZone="Europe/Budapest"
  (openCasefile)="open($event)"
  (deleteCasefile)="delete($event)"
></dd-view-date-separated-list>
```

| Bemenet | Típus | Alapérték | Leírás |
| --- | --- | --- | --- |
| `data` | `CasefileInterface[] \| null` | `[]` | Az ügyek |
| `title` | `string` | `'Dátum szerint csoportosított nézet'` | Cím |
| `locale` | `string` | `'hu'` | A relatív nevek és a dátumok nyelve (`Intl`) |
| `noDeadlineText` | `string` | `'Határidő nélküli feladatok'` | A határidő nélküli csoport neve |
| `timeZone` | `string \| undefined` | a felhasználó helyi időzónája | IANA időzóna, ennek a naptári napjai szerint csoportosít |
| `now` | `Date \| string \| number \| null` | `null` | A „most” időpont; `null` esetén a `ddataViewsNow` token |
| `heightOffset` | `number \| null` | `189` | Mint a kanbannál |
| `texts` | `Partial<ViewDateSeparatedListTextsInterface>` | `{}` | Felülírt szövegek (`viewDateSeparatedListTexts` az alapértelmezés) |

Kimenetek: `openCasefile`, `deleteCasefile` – mindkettő az eredeti ügyet küldi; ismeretlen ügyre nem küld eseményt.

Működés:

- A csoportok a határidő **naptári napja** szerint képződnek (a felhasználó helyi napja, vagy `timeZone`),
  időrendben; a csoporton belül a határidő szerint rendezve. A hiányzó, üres vagy érvénytelen határidejű
  ügyek az utolsó, határidő nélküli csoportba kerülnek.
- Az idő nélküli dátum (`2026-01-15`) maga a naptári nap, nem tolódik el az UTC-től nyugatra.
- A csoport neve a mai naphoz viszonyított relatív név (`ma`, `holnap`, `3 nappal ezelőtt`, `5 hónap múlva`),
  mellette a dátum. A napok különbsége a nyári időszámítás váltásakor is pontos.
- A „most” időpont a `now` bemenettel vagy a `ddataViewsNow` tokennel adható meg (tesztek, SSR, szerveridő):

```typescript
providers: [{ provide: ddataViewsNow, useValue: () => serverTime() }]
```

## Szövegek

Minden felirat felülírható a `texts` bemenettel, a `{name}` helyőrzők behelyettesítődnek:

```html
<dd-view-kanban
  title="Board"
  [texts]="{ casefileCount: 'casefiles', hour: 'h', minute: 'm', openCasefile: 'Open {casefile}' }"
></dd-view-kanban>
```

## Segédfüggvények

A csomag exportálja a csoportosítás függvényeit is: `relativeTime()`, `relativeDay()`, `toDayKey()`,
`parseDeadline()`, `formatDay()`.

## Átállás a `ddata-ui` csomagból

- A nézetek a `ddata-ui` csomagból ide költöztek; a `CasefileInterface`, `KanbanStatus`, `ViewKanban`
  és `ViewDateSeparatedList` modellekkel együtt innen importálandók.
- A `data` és `statuses` bemenet `BehaviorSubject` helyett tömböt vár: `[data]="subject"` helyett
  `[data]="subject | async"` (az `async` pipe a komponens megszűnésekor leiratkozik).
- A `KanbanStatus` modellnek nincs `is_drag_over` mezője, az állapotot a komponens kezeli.

## Fejlesztés

```bash
npm run build:core && npm run build:ui-common   # a függőségek
npm run build:ui-views
npx ng test ddata-ui-views --no-watch --coverage   # lefedettség-küszöb: 98%
npx ng lint ddata-ui-views
```
