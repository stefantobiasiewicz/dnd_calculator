# Kalkulator — Dom na dłoni

Samodzielne demo kalkulatora modelu koncepcyjnego 3D: wybór typu budynku, powierzchni, kondygnacji,
dachu, dodatków i liczby egzemplarzy, z podglądem modelu i orientacyjną ceną.
Cennik jest zahardkodowany — aplikacja nie potrzebuje backendu.

## Uruchomienie

Wymaga Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173/
```

## Komendy

| Komenda | Opis |
|---|---|
| `npm run dev` | serwer deweloperski |
| `npm run build` | typecheck + build statyczny do `dist/` |
| `npm run preview` | podgląd zbudowanej wersji |
| `npm test` | testy wyceny (vitest) |

## Zmiana cennika

Cennik żyje w [`src/pricingConfig.ts`](src/pricingConfig.ts). Ma ten sam kształt co `PricingConfig`
z backoffice, więc nowszy config można wkleić bez przeróbek.

## Stack

Vite, React 18, TypeScript, Tailwind CSS.
