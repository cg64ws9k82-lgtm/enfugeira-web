const USE_GOOGLE_SHEETS = true;

const SHEET_BASE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3IkP6AlOzo2IS9NngL-BzMm5_UTUTYJ6g6qePtKEy2yf9sgk9KwFzp3LcnhA_I_eVCJ2GTk2dhiye/pub";

const SHEETS_CONFIG = {
  jugadores: `${SHEET_BASE}?gid=0&single=true&output=csv`,
  partidos: `${SHEET_BASE}?gid=309464419&single=true&output=csv`,
  goles: `${SHEET_BASE}?gid=292550917&single=true&output=csv`,
  tarjetas: `${SHEET_BASE}?gid=853307763&single=true&output=csv`,
  posiciones: `${SHEET_BASE}?gid=1691899206&single=true&output=csv`,
  equipo: `${SHEET_BASE}?gid=2067035770&single=true&output=csv`
};

// Galería desde Google Drive (ver README, sección "Fotos de los partidos").
// DRIVE_CARPETA_FOTOS: link de la carpeta "Fotos En Fugeira".
// DRIVE_API_KEY: clave de Google Cloud, restringida a este sitio.
// Si alguna queda vacía, la galería muestra solo las fotos de data/galeria.json.
const DRIVE_CARPETA_FOTOS = "https://drive.google.com/drive/folders/1jKOtnkzpwJ3bpyQK1BmzjF-L0DkWCx6f";
const DRIVE_API_KEY = "AIzaSyAlMLSiGjNOp1kZMNN-dxhaQzSX6Lo_Yhw";

// Fotos que van rotando de fondo en la portada (en este orden).
// Para cambiarlas, poné acá la ruta de cualquier foto de assets/.
const HERO_FOTOS = [
  "assets/galeria/2026-07-12-la-costa/foto-01.jpg",
  "assets/galeria/2026-06-14-porte/foto-11.jpg",
  "assets/galeria/2026-06-14-porte/foto-09.jpg",
  "assets/galeria/2026-07-12-la-costa/foto-13.jpg",
  "assets/galeria/2026-07-12-la-costa/foto-03.jpg"
];
