// Carga de datos: desde Google Sheets (CSV publicado) o desde data/sample.json como fallback local.

function parseCsv(text) {
  const result = Papa.parse(text.trim(), { header: true, skipEmptyLines: true });
  return result.data;
}

async function fetchCsv(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`No se pudo leer la hoja: ${url}`);
  return parseCsv(await res.text());
}

function normalizeRow(row) {
  const out = {};
  for (const key in row) {
    out[key.trim().toLowerCase()] = typeof row[key] === "string" ? row[key].trim() : row[key];
  }
  return out;
}

async function loadFromGoogleSheets() {
  const [jugadoresRaw, partidosRaw, golesRaw, tarjetasRaw, posicionesRaw] = await Promise.all([
    fetchCsv(SHEETS_CONFIG.jugadores),
    fetchCsv(SHEETS_CONFIG.partidos),
    fetchCsv(SHEETS_CONFIG.goles),
    fetchCsv(SHEETS_CONFIG.tarjetas),
    fetchCsv(SHEETS_CONFIG.posiciones)
  ]);

  const jugadores = jugadoresRaw.map(normalizeRow).map(r => ({
    nombre: r.nombre,
    numero: Number(r.numero) || 0,
    posicion: r.posicion,
    foto: r.fotourl || r.foto || ""
  }));

  const partidos = partidosRaw.map(normalizeRow).map(r => ({
    fecha: r.fecha,
    rival: r.rival,
    condicion: r.condicion,
    golesFavor: r.golesfavor === "" ? null : Number(r.golesfavor),
    golesContra: r.golescontra === "" ? null : Number(r.golescontra),
    torneo: r.torneo,
    estado: r.estado
  }));

  const goles = golesRaw.map(normalizeRow).map(r => ({
    fecha: r.fecha,
    jugador: r.jugador,
    rival: r.rival,
    minuto: Number(r.minuto) || null,
    torneo: r.torneo || ""
  }));

  const tarjetas = tarjetasRaw.map(normalizeRow).map(r => ({
    fecha: r.fecha,
    jugador: r.jugador,
    tipo: r.tipo,
    rival: r.rival,
    torneo: r.torneo || ""
  }));

  const posiciones = posicionesRaw.map(normalizeRow).map(r => ({
    equipo: r.equipo,
    torneo: r.torneo || "",
    pj: Number(r.pj) || 0,
    pg: Number(r.pg) || 0,
    pe: Number(r.pe) || 0,
    pp: Number(r.pp) || 0,
    gf: Number(r.gf) || 0,
    gc: Number(r.gc) || 0,
    pts: Number(r.pts) || 0
  }));

  let equipo = {
    nombre: "En Fugeira FC",
    fundacion: 2026,
    torneo: "Liga Amateur",
    estadio: "",
    instagram: "",
    whatsapp: ""
  };

  if (SHEETS_CONFIG.equipo) {
    const equipoRaw = (await fetchCsv(SHEETS_CONFIG.equipo)).map(normalizeRow)[0] || {};
    equipo = { ...equipo, ...equipoRaw };
  }

  return { equipo, jugadores, partidos, goles, tarjetas, posiciones };
}

async function loadFromSampleData() {
  const res = await fetch("data/sample.json", { cache: "no-store" });
  return res.json();
}

async function loadTeamData() {
  if (USE_GOOGLE_SHEETS) {
    try {
      return await loadFromGoogleSheets();
    } catch (err) {
      console.error("Error cargando Google Sheets, uso datos de ejemplo.", err);
      return loadFromSampleData();
    }
  }
  return loadFromSampleData();
}
