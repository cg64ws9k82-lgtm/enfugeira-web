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

// Fotos que van rotando de fondo en la portada (en este orden).
// Para cambiarlas, poné acá la ruta de cualquier foto de assets/.
const HERO_FOTOS = [
  "assets/galeria/2026-07-12-la-costa/foto-01.jpg",
  "assets/galeria/2026-06-14-porte/foto-11.jpg",
  "assets/galeria/2026-06-14-porte/foto-09.jpg",
  "assets/galeria/2026-07-12-la-costa/foto-13.jpg",
  "assets/galeria/2026-07-12-la-costa/foto-03.jpg"
];
