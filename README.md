# En Fugeira FC — Sitio web del club

Sitio estático (HTML/CSS/JS, sin frameworks) para el equipo. Lee las estadísticas
desde Google Sheets, así que actualizarlo después de cada fecha es tan simple
como editar una planilla desde el celular.

## Cómo probarlo en tu compu

No hace falta instalar nada. Con Python (ya viene en Mac):

```bash
cd enfugeira-web
python3 -m http.server 8080
```

Y abrís http://localhost:8080

## 1. Crear el Google Sheet

Creá una planilla nueva en Google Sheets con **5 hojas (tabs)**, con estos nombres
de columna exactos en la primera fila:

### Hoja "Jugadores"
| nombre | numero | posicion | fotoURL | descripcion |
|---|---|---|---|---|
| Gorriarán | 9 | Delantero | (opcional, link a una foto) | (opcional, 1-2 frases sobre el jugador) |

`descripcion` es opcional: si la dejás vacía, el modal del jugador simplemente
no muestra esa parte.

### Hoja "Partidos"
| fecha | rival | condicion | golesFavor | golesContra | torneo | estado |
|---|---|---|---|---|---|---|
| 2026-07-19 | Unión Norte | Visitante | | | Liga Amateur | proximo |
| 2026-06-14 | Los Pinos FC | Local | 3 | 1 | Liga Amateur | jugado |

- `fecha` siempre en formato AAAA-MM-DD
- `estado` es `proximo` o `jugado` (para partidos jugados, dejá golesFavor/golesContra vacíos hasta tener el resultado)
- Los cuadraditos de récord (PJ/PG/PE/PP/Pts) de arriba de todo se calculan solos
  a partir de esta hoja — no hace falta tocar nada más para que se actualicen.

### Hoja "Goles"
| fecha | jugador | rival | minuto |
|---|---|---|---|
| 2026-06-14 | Gorriarán | Los Pinos FC | 23 |

Una fila por gol. El sitio cuenta automáticamente el ranking de goleadores.
`minuto` es opcional, pero si lo cargás, ese gol aparece ubicado correctamente
en la cronología del partido (ver más abajo).

Si querés que también aparezca el gol de un jugador rival en la cronología del
partido, cargá la fila igual pero con el nombre del jugador rival en `jugador`
— como ese nombre no está en la hoja de Jugadores, el sitio lo reconoce solo
como del equipo contrario y lo muestra del otro lado.

### Hoja "Tarjetas"
| fecha | jugador | tipo | rival | minuto |
|---|---|---|---|---|
| 2026-06-14 | Fernández | Amarilla | Los Pinos FC | 40 |

Una fila por tarjeta (`Amarilla` o `Roja`). Si un jugador llega a 3 amarillas
**dentro del mismo torneo**, el sitio le muestra automáticamente un aviso de
"riesgo de suspensión". `minuto` es opcional, igual que en Goles, y también
funciona el mismo truco para cargar tarjetas de jugadores rivales.

### Hoja "Posiciones"
| equipo | torneo | pj | pg | pe | pp | gf | gc | pts |
|---|---|---|---|---|---|---|---|---|
| En Fugeira FC | Torneo Apertura | 3 | 2 | 1 | 0 | 6 | 3 | 7 |

Esta la cargás manualmente con la tabla completa de cada torneo (no la calcula
el sitio, porque incluye a los rivales). Necesita la columna `torneo` para
poder mostrar una tabla separada por cada campeonato.

## Ver el detalle de un partido

Tocando cualquier partido del Fixture se abre un modal con el resultado y la
cronología de goles y tarjetas ordenada por minuto (los eventos sin minuto
cargado aparecen al final, agrupados aparte).

### Hoja "Equipo" (opcional)
Una sola fila con estos datos generales:

| nombre | fundacion | torneo | estadio | instagram | whatsapp |
|---|---|---|---|---|---|
| En Fugeira FC | 2026 | Liga Amateur | Cancha del barrio | https://instagram.com/... | https://wa.me/59897135368 |

## 2. Publicar cada hoja como CSV

Por cada una de las hojas de arriba:

1. Abrí la hoja específica (el tab de abajo, ej. "Jugadores")
2. Archivo → Compartir → **Publicar en la web**
3. En "Vincular", elegí esa hoja puntual (no "Todo el documento")
4. En el formato, elegí **Valores separados por comas (.csv)**
5. Publicar → copiá la URL que te da

Repetí esto para las 5 (o 6) hojas.

## 3. Conectar el sitio a las URLs

Abrí [js/config.js](js/config.js) y pegá cada URL:

```js
const USE_GOOGLE_SHEETS = true;

const SHEETS_CONFIG = {
  jugadores: "https://docs.google.com/.../pub?output=csv",
  partidos: "https://docs.google.com/.../pub?output=csv",
  goles: "https://docs.google.com/.../pub?output=csv",
  tarjetas: "https://docs.google.com/.../pub?output=csv",
  posiciones: "https://docs.google.com/.../pub?output=csv",
  equipo: "https://docs.google.com/.../pub?output=csv" // opcional
};
```

Guardá, refrescá el sitio y ya debería mostrar tus datos reales. Mientras
`USE_GOOGLE_SHEETS` esté en `false`, el sitio usa los datos de ejemplo en
[data/sample.json](data/sample.json).

**Importante:** cualquiera con el link puede leer una hoja "publicada en la
web". No pongas ahí información sensible — solo estadísticas del equipo.

## 4. Escudo y foto de la camiseta

Por ahora [assets/crest.svg](assets/crest.svg) es un placeholder generado con
los colores del club. Cuando me pases el archivo real del escudo (PNG/SVG),
lo reemplazo y actualizo las referencias en `index.html`.

## 5. Deploy en Netlify

**Opción rápida (drag & drop):**
1. Andá a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastrá la carpeta `enfugeira-web` completa
3. Netlify te da una URL al instante (ej. `enfugeira.netlify.app`)

**Opción con deploy automático (recomendada a largo plazo):**
1. Subí esta carpeta a un repositorio de GitHub
2. En Netlify: "Add new site" → "Import an existing project" → conectá el repo
3. Build command: (vacío, no hace falta) — Publish directory: `.`
4. Cada vez que hagas push a GitHub, Netlify actualiza el sitio solo

Después podés conectar un dominio propio (ej. `enfugeirafc.com`) desde
Netlify → Domain settings, si en algún momento quieren comprar uno.
