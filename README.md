# WebAR mākslas vizualizācijas prototips un attēlu galerijas demo

Šis repozitorijs satur pilnfunkcionālu tīmekļa vietni ar lietotāja saskarni un WebAR prototipu, kas ļauj lietotājiem vizualizēt izvēlētos mākslas darbus papildinātajā realitātē, izmantojot tikai mobilo ierīci un pārlūkprogrammu.

Saite uz izstrādāto vietni: https://webart-eta.vercel.app/

## Projekta mērķis

Izstrādāt tīmeklī balstītu WebAR risinājumu, kas uzlabo mākslas darbu iegādes pieredzi tiešsaistē, ļaujot lietotājam vizuāli novērtēt, kā konkrēts darbs izskatīsies viņa telpā.

## Projekts sastāv no:

### 1. Tīmekļa vietnes  interfeiss
- Lietotājs var:
  - Pārlūkot pieejamos mākslas darbus
  - Augšupielādēt savu attēlu no ierīces galerijas
  - Izvēlēties rāmja tipu, krāsu un izmēru
  - Visas izvēles tiek nodotas WebAR modulim caur URL vai `localStorage`

### 2. WebAR prototips
- 3D mākslas darba modelis tiek ģenerēts ar Three.js
- Automātiska izvietošana uz sienas ar WebXR `hit-test`
- Manuāla izvietošana, ja plakne netiek atpazīta
- Reālistisks apgaismojums ar `light-estimation`
- Objektu var pārvietot pa X, Y, Z asīm
- Pilnībā darbojas pārlūkā — nav jāinstalē lietotne

Prototipa fails atrodas: `public\index-webar.html`

## Izmantotās tehnoloģijas

- **HTML / CSS / JavaScript**
- **Three.js** – 3D grafikas renderēšanai
- **WebXR API** – AR funkcionalitātei pārlūkā
- **WebXR Light Estimation** – dinamiskam apgaismojumam
- **TransformControls** – objekta manipulācijai AR vidē

## Tehnoloģijas tīmekļvietnei

- **Frontend**: React 18 ar TypeScript
- **Stilizācija**: Tailwind CSS
- **Maršrutēšana**: React Router DOM
- **Būvēšanas rīks**: Vite
