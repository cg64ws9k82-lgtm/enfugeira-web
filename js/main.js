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
    socialHtml += `<a href="${equipo.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>`;
  }
  if (equipo.instagram) {
    socialHtml += `<a href="${equipo.instagram}" target="_blank" rel="noopener">Instagram</a>`;
  }
  document.getElementById("social-links").innerHTML = socialHtml;
  document.getElementById("social-links-footer").innerHTML = socialHtml;
}

function renderPlantel(jugadores) {
  const cont = document.getElementById("plantel-grid");
  const ordenados = [...jugadores].sort((a, b) => a.numero - b.numero);
  cont.innerHTML = ordenados.map(j => `
    <div class="player-card">
      <div class="player-photo">
        ${j.foto ? `<img src="${j.foto}" alt="${j.nombre}">` : `<span>${j.numero}</span>`}
      </div>
      <p class="player-number">#${j.numero}</p>
      <p class="player-name">${j.nombre}</p>
      <p class="player-position">${j.posicion}</p>
    </div>
  `).join("");
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
      <span class="stat-value">${cant} ⚽</span>
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

async function init() {
  const data = await loadTeamData();
  renderHero(data);
  renderPlantel(data.jugadores);
  renderFixture(data.partidos);
  renderGoleadores(data.goles);
  renderTarjetas(data.tarjetas);
  renderPosiciones(data.posiciones);
  document.getElementById("year").textContent = new Date().getFullYear();
}

init();
