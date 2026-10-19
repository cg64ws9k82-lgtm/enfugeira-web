// Fotos de los partidos desde Google Drive.
// Dentro de la carpeta DRIVE_CARPETA_FOTOS hay una subcarpeta por partido,
// con nombre "AAAA-MM-DD Rival" (ej. "2026-07-12 La Costa"). El sitio lista
// esas subcarpetas y las fotos de cada una con la API de Drive.

const DRIVE_API = "https://www.googleapis.com/drive/v3/files";

function driveId(valor) {
  // Acepta el ID solo o el link completo de la carpeta.
  const match = String(valor || "").match(/folders\/([\w-]+)/);
  return match ? match[1] : String(valor || "").trim();
}

async function driveListar(q, fields) {
  const archivos = [];
  let pageToken = "";
  do {
    const params = new URLSearchParams({
      q,
      key: DRIVE_API_KEY,
      pageSize: "1000",
      fields: `nextPageToken, files(${fields})`
    });
    if (pageToken) params.set("pageToken", pageToken);
    const res = await fetch(`${DRIVE_API}?${params}`);
    if (!res.ok) throw new Error(`Drive respondió ${res.status}: ${await res.text()}`);
    const json = await res.json();
    archivos.push(...json.files);
    pageToken = json.nextPageToken;
  } while (pageToken);
  return archivos;
}

// "2026-07-12 La Costa", "2026-07-12 - La Costa" o solo "2026-07-12".
function leerNombreCarpeta(nombre) {
  const match = nombre.trim().match(/^(\d{4}-\d{2}-\d{2})[\s_-]*(.*)$/);
  return match ? { fecha: match[1], rival: match[2].trim() } : null;
}

// Imagen achicada que arma Google. Las <img> que la usan llevan
// referrerpolicy="no-referrer": con referer de localhost Google la rechaza.
function urlMiniatura(id, ancho) {
  return `https://lh3.googleusercontent.com/d/${id}=w${ancho}`;
}

async function loadFotosDrive() {
  if (!DRIVE_API_KEY || !DRIVE_CARPETA_FOTOS) return [];

  const raiz = driveId(DRIVE_CARPETA_FOTOS);
  const carpetas = (await driveListar(
    `'${raiz}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    "id, name"
  ))
    .map(c => ({ id: c.id, ...leerNombreCarpeta(c.name) }))
    .filter(c => c.fecha);

  if (!carpetas.length) return [];

  // Pedimos las fotos de varias carpetas por consulta, en tandas para no
  // pasarnos del largo máximo de la URL.
  const porCarpeta = Object.fromEntries(carpetas.map(c => [c.id, c]));
  const fotos = [];
  for (let i = 0; i < carpetas.length; i += 30) {
    const tanda = carpetas.slice(i, i + 30);
    const padres = tanda.map(c => `'${c.id}' in parents`).join(" or ");
    const archivos = await driveListar(
      `(${padres}) and mimeType contains 'image/' and trashed = false`,
      "id, name, parents"
    );
    archivos.forEach(a => {
      const carpeta = porCarpeta[a.parents.find(p => porCarpeta[p])];
      fotos.push({
        fecha: carpeta.fecha,
        rival: carpeta.rival,
        nombre: a.name,
        thumb: urlMiniatura(a.id, 800),
        src: urlMiniatura(a.id, 2000)
      });
    });
  }

  return fotos.sort((a, b) => a.nombre.localeCompare(b.nombre, undefined, { numeric: true }));
}
