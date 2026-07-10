const ICONS = {
  whatsapp: `<svg class="icon" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.6 6.6 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.3-1.7c-.1-.2 0-.4.1-.5s.2-.3.4-.4a1.6 1.6 0 0 0 .2-.4.4.4 0 0 0 0-.4c-.1-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8s1.7 2.7 4.2 3.7a5 5 0 0 0 3 .6 2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c-.1-.1-.2-.2-.5-.3Z"/></svg>`,
  instagram: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  ball: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="m12 3 2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5Z"/></svg>`
};

const POSICION_ORDEN = ["Arquero", "Defensor", "Mediocampista", "Delantero"];
const POSICION_PLURAL = {
  Arquero: "Arqueros",
  Defensor: "Defensores",
  Mediocampista: "Mediocampistas",
  Delantero: "Delanteros"
};

function fmtFecha(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function renderHero(data) {
  const { equipo } = data;
  document.getElementById("team-name").textContent = equipo.nombre;
  document.getElementById("team-meta").textContent =
    `Fundado en ${equipo.fundacion} · ${equipo.torneo}`;

  const proximo = data.partidos
    .filter(p => p.estado === "proximo")
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  const box = document.getElementById("next-match");
  if (proximo) {
    box.innerHTML = `
      <span class="tag">Próximo partido</span>
      <p class="next-match-teams">En Fugeira FC vs ${proximo.rival}</p>
      <p class="next-match-info">${fmtFecha(proximo.fecha)} · ${proximo.condicion} · ${proximo.torneo}</p>
    `;
  } else {
    box.innerHTML = `<span class="tag">Sin partidos programados</span>`;
  }

  let socialHtml = "";
  if (equipo.whatsapp) {
    socialHtml += `<a href="${equipo.whatsapp}" target="_blank" rel="noopener">${ICONS.whatsapp} WhatsApp</a>`;
  }
  if (equipo.instagram) {
    socialHtml += `<a href="${equipo.instagram}" target="_blank" rel="noopener">${ICONS.instagram} Instagram</a>`;
  }
  document.getElementById("social-links").innerHTML = socialHtml;
  document.getElementById("social-links-footer").innerHTML = socialHtml;
}

function renderRecord(data) {
  const cont = document.getElementById("team-record");
  const propio = data.posiciones.find(p => p.equipo.toLowerCase().includes("en fugeira"));

  let chipsHtml = "";
  if (propio) {
    chipsHtml = `
      <div class="record-chip"><span class="value">${propio.pj}</span><span class="label">PJ</span></div>
      <div class="record-chip"><span class="value">${propio.pg}</span><span class="label">PG</span></div>
      <div class="record-chip"><span class="value">${propio.pe}</span><span class="label">PE</span></div>
      <div class="record-chip"><span class="value">${propio.pp}</span><span class="label">PP</span></div>
      <div class="record-chip"><span class="value">${propio.pts}</span><span class="label">Pts</span></div>
    `;
  }

  const ultimos = data.partidos
    .filter(p => p.estado === "jugado")
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .slice(-5);

  const dotsHtml = ultimos.map(p => {
    const gano = p.golesFavor > p.golesContra;
    const perdio = p.golesFavor < p.golesContra;
    const clase = gano ? "win" : perdio ? "loss" : "draw";
    const letra = gano ? "G" : perdio ? "P" : "E";
    return `<span class="form-dot ${clase}" title="${p.rival}: ${p.golesFavor}-${p.golesContra}">${letra}</span>`;
  }).join("");

  cont.innerHTML = chipsHtml + (dotsHtml ? `<div class="form-dots">${dotsHtml}</div>` : "");
}

function renderPlantel(jugadores) {
  const cont = document.getElementById("plantel-grid");
  const grupos = POSICION_ORDEN
    .map(pos => ({ pos, jugadores: jugadores.filter(j => j.posicion === pos).sort((a, b) => a.numero - b.numero) }))
    .filter(g => g.jugadores.length);

  const otros = jugadores.filter(j => !POSICION_ORDEN.includes(j.posicion));
  if (otros.length) grupos.push({ pos: "Otros", jugadores: otros.sort((a, b) => a.numero - b.numero) });

  cont.innerHTML = grupos.map(g => `
    <div class="position-group">
      <p class="position-title">${POSICION_PLURAL[g.pos] || g.pos}</p>
      <div class="plantel-grid">
        ${g.jugadores.map(j => `
          <div class="player-card">
            <div class="player-photo">
              ${j.foto ? `<img src="${j.foto}" alt="${j.nombre}">` : `<span>${j.numero}</span>`}
            </div>
            <p class="player-number">#${j.numero}</p>
            <p class="player-name">${j.nombre}</p>
            <p class="player-position">${j.posicion}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("") || "<p class='empty'>Todavía no hay jugadores cargados.</p>";
}

function renderFixture(partidos) {
  const jugados = partidos.filter(p => p.estado === "jugado").sort((a, b) => b.fecha.localeCompare(a.fecha));
  const proximos = partidos.filter(p => p.estado === "proximo").sort((a, b) => a.fecha.localeCompare(b.fecha));

  const resultadosCont = document.getElementById("resultados-list");
  resultadosCont.innerHTML = jugados.map(p => {
    const gano = p.golesFavor > p.golesContra;
    const perdio = p.golesFavor < p.golesContra;
    const claseResultado = gano ? "win" : perdio ? "loss" : "draw";
    return `
      <div class="match-row ${claseResultado}">
        <span class="match-date">${fmtFecha(p.fecha)}</span>
        <span class="match-teams">En Fugeira FC ${p.golesFavor} - ${p.golesContra} ${p.rival}</span>
        <span class="match-cond">${p.condicion}</span>
      </div>
    `;
  }).join("") || "<p class='empty'>Todavía no hay resultados cargados.</p>";

  const proximosCont = document.getElementById("proximos-list");
  proximosCont.innerHTML = proximos.map(p => `
    <div class="match-row upcoming">
      <span class="match-date">${fmtFecha(p.fecha)}</span>
      <span class="match-teams">En Fugeira FC vs ${p.rival}</span>
      <span class="match-cond">${p.condicion}</span>
    </div>
  `).join("") || "<p class='empty'>Sin próximos partidos por ahora.</p>";
}

function renderGoleadores(goles) {
  const conteo = {};
  goles.forEach(g => { conteo[g.jugador] = (conteo[g.jugador] || 0) + 1; });
  const ranking = Object.entries(conteo).sort((a, b) => b[1] - a[1]);

  const cont = document.getElementById("goleadores-list");
  cont.innerHTML = ranking.map(([jugador, cant], i) => `
    <div class="stat-row">
      <span class="stat-rank">${i + 1}</span>
      <span class="stat-name">${jugador}</span>
      <span class="stat-value">${cant} ${ICONS.ball}</span>
    </div>
  `).join("") || "<p class='empty'>Todavía no hay goles cargados.</p>";
}

function renderTarjetas(tarjetas) {
  const conteo = {};
  tarjetas.forEach(t => {
    if (!conteo[t.jugador]) conteo[t.jugador] = { amarillas: 0, rojas: 0 };
    if (t.tipo.toLowerCase().startsWith("amar")) conteo[t.jugador].amarillas++;
    if (t.tipo.toLowerCase().startsWith("roj")) conteo[t.jugador].rojas++;
  });

  const ranking = Object.entries(conteo).sort((a, b) => {
    const totalA = a[1].amarillas + a[1].rojas * 2;
    const totalB = b[1].amarillas + b[1].rojas * 2;
    return totalB - totalA;
  });

  const cont = document.getElementById("tarjetas-list");
  cont.innerHTML = ranking.map(([jugador, c]) => `
    <div class="stat-row">
      <span class="stat-name">${jugador}</span>
      <span class="stat-value">
        ${c.amarillas ? `<span class="card-badge yellow">${c.amarillas}</span>` : ""}
        ${c.rojas ? `<span class="card-badge red">${c.rojas}</span>` : ""}
        ${c.amarillas >= 3 ? `<span class="suspension-warning">⚠ riesgo de suspensión</span>` : ""}
      </span>
    </div>
  `).join("") || "<p class='empty'>Todavía no hay tarjetas cargadas.</p>";
}

function renderPosiciones(posiciones) {
  const ordenado = [...posiciones].sort((a, b) => b.pts - a.pts || (b.gf - b.gc) - (a.gf - a.gc));
  const cont = document.getElementById("posiciones-table");
  const filas = ordenado.map((e, i) => `
    <tr class="${e.equipo.toLowerCase().includes('en fugeira') ? 'highlight' : ''}">
      <td>${i + 1}</td>
      <td>${e.equipo}</td>
      <td>${e.pj}</td>
      <td>${e.pg}</td>
      <td>${e.pe}</td>
      <td>${e.pp}</td>
      <td>${e.gf}</td>
      <td>${e.gc}</td>
      <td><strong>${e.pts}</strong></td>
    </tr>
  `).join("");

  cont.innerHTML = `
    <table>
      <thead>
        <tr><th>#</th><th>Equipo</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>Pts</th></tr>
      </thead>
      <tbody>${filas}</tbody>
    </table>
  `;
}

function initNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

async function init() {
  initNav();
  const data = await loadTeamData();
  renderHero(data);
  renderRecord(data);
  renderPlantel(data.jugadores);
  renderFixture(data.partidos);
  renderGoleadores(data.goles);
  renderTarjetas(data.tarjetas);
  renderPosiciones(data.posiciones);
  document.getElementById("year").textContent = new Date().getFullYear();
}

init();
