/* ROCKET · Cotizador — lógica
   No es necesario editar este archivo para cambiar precios: usa config.js */
(function () {
  "use strict";

  const CFG = window.ROCKET_CONFIG;
  const $ = (sel, root = document) => root.querySelector(sel);

  // Iconos de línea (stroke = currentColor) por id de servicio
  const ICONS = {
    sdr: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    meta: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    google: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    tech: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    seo: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/><path d="M15 8h5v5"/>',
    web: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8M12 18v4"/>',
    estrategia: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    auditoria: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    playbook: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    acompanamiento: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    cmo: '<path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7z"/>',
    _default: '<circle cx="12" cy="12" r="9"/>',
  };
  const icon = (id) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[id] || ICONS._default}</svg>`;

  // ---------- Datos ----------
  const services = {};
  CFG.divisions.forEach((d) => d.services.forEach((s) => (services[s.id] = { ...s, division: d.name, divisionId: d.id })));

  const isPriced = (s) => s.type === "monthly" || s.type === "oneTime";
  const fmt = (n) =>
    new Intl.NumberFormat(CFG.locale, { style: "currency", currency: CFG.currency, maximumFractionDigits: 0 }).format(n);
  const unit = (s) => (s.type === "monthly" ? "/mes" : s.type === "oneTime" ? "pago único" : "");

  // ---------- Estado ----------
  // levelChoice: nivel visible en cada tarjeta. selected: servicios agregados (id -> índice de nivel)
  const levelChoice = {};
  const selected = new Map();
  Object.values(services).forEach((s) => (levelChoice[s.id] = 0));

  // ---------- Render catálogo ----------
  function renderCatalog() {
    const root = $("#catalog");
    root.innerHTML = CFG.divisions
      .map(
        (d) => `
      <section class="division division--${d.theme || "light"}" id="${d.id}" aria-labelledby="div-${d.id}">
        <div class="division__head">
          <h2 id="div-${d.id}">${d.name}</h2>
          <p>${d.tagline || ""}</p>
        </div>
        <div class="grid">${d.services.map(cardHTML).join("")}</div>
      </section>`
      )
      .join("");

    root.addEventListener("click", onCatalogClick);
  }

  function cardHTML(s) {
    return `<article class="card" data-id="${s.id}">${cardInner(s)}</article>`;
  }

  function cardInner(s) {
    const lvl = levelChoice[s.id];
    const isSel = selected.has(s.id);
    const head = `
      <div class="card__top">
        <div class="card__icon">${icon(s.id)}</div>
        <div>
          <h3 class="card__title">${s.name}</h3>
          <p class="card__desc">${s.description || ""}</p>
          ${s.type === "oneTime" ? '<span class="tag">Pago único</span>' : ""}
          ${s.type === "quote" ? '<span class="tag tag--orange">Precio a la medida</span>' : ""}
        </div>
      </div>`;

    if (s.type === "quote") {
      const req = s.requires && services[s.requires] ? `<p class="card__note">Requiere: ${services[s.requires].name}</p>` : "";
      const cta = s.cta
        ? `<a class="btn btn--cta" href="${bookingHref()}" target="_blank" rel="noopener">${s.cta}</a>`
        : "";
      return `${head}
        <p class="card__quote">${s.quoteMessage}</p>
        ${req}
        <div class="card__foot">
          ${cta || '<span class="price__unit">Se estima después</span>'}
          <button type="button" class="btn ${isSel ? "btn--added" : "btn--add"}" data-action="toggle" aria-pressed="${isSel}">
            ${isSel ? "✓ Incluido" : "+ Incluir"}
          </button>
        </div>`;
    }

    const level = s.levels[lvl];
    const levelsUI =
      s.levels.length > 1
        ? `<div class="levels" role="group" aria-label="Nivel de ${s.name}">
            ${s.levels
              .map((l, i) => `<button type="button" data-action="level" data-level="${i}" aria-pressed="${i === lvl}">${l.name}</button>`)
              .join("")}
          </div>`
        : "";
    return `${head}
      ${levelsUI}
      <ul class="features">${(level.features || []).map((f) => `<li>${f}</li>`).join("")}</ul>
      ${s.note ? `<p class="card__note">${s.note}</p>` : ""}
      <div class="card__foot">
        <div class="price">
          ${level.from ? '<span class="price__from">Desde</span>' : ""}
          <span class="price__value">${fmt(level.price)}</span>
          <span class="price__unit">${unit(s)}</span>
        </div>
        <button type="button" class="btn ${isSel ? "btn--added" : "btn--add"}" data-action="toggle" aria-pressed="${isSel}">
          ${isSel ? "✓ Agregado" : "+ Agregar"}
        </button>
      </div>`;
  }

  function refreshCard(id) {
    const el = $(`.card[data-id="${id}"]`);
    if (!el) return;
    el.innerHTML = cardInner(services[id]);
    el.classList.toggle("is-selected", selected.has(id));
  }

  function onCatalogClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const id = btn.closest(".card").dataset.id;
    if (btn.dataset.action === "level") {
      levelChoice[id] = Number(btn.dataset.level);
      if (selected.has(id)) selected.set(id, levelChoice[id]);
    } else if (btn.dataset.action === "toggle") {
      if (selected.has(id)) selected.delete(id);
      else selected.set(id, levelChoice[id]);
    }
    update(id);
  }

  // ---------- Cálculo ----------
  function compute() {
    const items = [...selected.entries()].map(([id, lvl]) => {
      const s = services[id];
      return { s, lvl, level: isPriced(s) ? s.levels[lvl] : null };
    });
    const priced = items.filter((i) => i.level);
    const monthly = priced.filter((i) => i.s.type === "monthly").reduce((a, i) => a + i.level.price, 0);
    const oneTime = priced.filter((i) => i.s.type === "oneTime").reduce((a, i) => a + i.level.price, 0);
    const bundle = priced.length >= CFG.bundle.minServices;
    const k = bundle ? 1 - CFG.bundle.discountPct / 100 : 1;
    return {
      items,
      pricedCount: priced.length,
      quoteItems: items.filter((i) => !i.level),
      hasFrom: priced.some((i) => i.level.from),
      bundle,
      monthly,
      oneTime,
      monthlyFinal: Math.round(monthly * k),
      oneTimeFinal: Math.round(oneTime * k),
    };
  }

  // ---------- Render resumen ----------
  function renderSummary() {
    const r = compute();
    const { minServices, discountPct } = CFG.bundle;

    // Medidor de bundle
    const meter = $("#bundleMeter");
    meter.classList.toggle("is-active", r.bundle);
    $("#bundleFill").style.width = Math.min(100, (r.pricedCount / minServices) * 100) + "%";
    const missing = minServices - r.pricedCount;
    $("#bundleText").innerHTML = r.bundle
      ? `<strong>¡Bundle activado!</strong> Tienes ${discountPct}% de descuento en tus servicios.`
      : `Agrega <strong>${missing} servicio${missing === 1 ? "" : "s"} más</strong> para activar el bundle y ahorrar <strong>${discountPct}%</strong>.`;

    // Lista
    $("#summaryEmpty").hidden = r.items.length > 0;
    $("#summaryList").innerHTML = r.items
      .map(({ s, level }) => {
        const warn = s.requires && !selected.has(s.requires) ? `<span class="item-warn">Requiere ${services[s.requires].name}</span>` : "";
        const price = level
          ? `${level.from ? "Desde " : ""}${fmt(level.price)}<small>${unit(s)}</small>`
          : `A cotizar<small>${s.id === "web" ? "brief call" : "posterior"}</small>`;
        return `<li>
          <div><span class="item-name">${s.name}</span>
            <span class="item-level"><i class="dot dot--${s.divisionId}"></i>${level && s.levels.length > 1 ? "Nivel " + level.name + " · " : ""}${s.division}</span>${warn}</div>
          <div style="display:flex;align-items:flex-start">
            <span class="item-price">${price}</span>
            <button type="button" class="item-remove" data-remove="${s.id}" aria-label="Quitar ${s.name}">×</button>
          </div>
        </li>`;
      })
      .join("");

    // Totales
    const T = $("#totals");
    if (!r.pricedCount) {
      T.innerHTML = r.quoteItems.length
        ? `<p class="totals__quote">Los servicios seleccionados se cotizan a la medida. Solicita tu propuesta y te contactamos.</p>`
        : "";
    } else {
      const from = r.hasFrom ? "Desde " : "";
      const mainIsMonthly = r.monthly > 0;
      const mainFinal = mainIsMonthly ? r.monthlyFinal : r.oneTimeFinal;
      const mainUnit = mainIsMonthly ? "/mes" : "pago único";
      let rows = "";
      if (r.bundle) {
        if (r.monthly) rows += `<div class="totals__row"><span>Precio individual mensual</span><s>${fmt(r.monthly)}</s></div>`;
        if (r.oneTime) rows += `<div class="totals__row"><span>Precio individual pago único</span><s>${fmt(r.oneTime)}</s></div>`;
        const save = r.monthly - r.monthlyFinal + (r.oneTime - r.oneTimeFinal);
        rows += `<div class="totals__row totals__row--save"><span>Ahorro bundle (${discountPct}%)</span><span>−${fmt(save)}</span></div>`;
      } else {
        const potential = Math.round((r.monthly * discountPct) / 100);
        if (potential > 0)
          rows += `<div class="totals__row"><span>Con bundle ahorrarías</span><span>${fmt(potential)}/mes</span></div>`;
      }
      const sub = mainIsMonthly && r.oneTime ? `<div class="sub">+ ${fmt(r.oneTimeFinal)} pago único</div>` : "";
      T.innerHTML = `${rows}
        <div class="totals__main">
          <div class="label">${r.bundle ? "Tu precio bundle" : "Tu inversión"}</div>
          <div class="amount">${from ? '<small>Desde </small>' : ""}${fmt(mainFinal)} <small>${mainUnit}</small></div>
          ${sub}
        </div>
        ${r.quoteItems.length ? `<p class="totals__quote">+ ${r.quoteItems.map((i) => i.s.name).join(", ")}: a cotizar.</p>` : ""}`;
    }

    // Barra móvil
    $("#barTotal").textContent = r.monthly
      ? `${fmt(r.monthlyFinal)}/mes`
      : r.oneTime
      ? `${fmt(r.oneTimeFinal)} único`
      : r.quoteItems.length
      ? "A cotizar"
      : fmt(0);
  }

  // ---------- Resumen en texto / link ----------
  function summaryText() {
    const r = compute();
    const lines = ["Hola ROCKET, me interesa esta cotización:", ""];
    r.items.forEach(({ s, level }) => {
      lines.push(
        level
          ? `• ${s.name}${s.levels.length > 1 ? " (" + level.name + ")" : ""}: ${level.from ? "desde " : ""}${fmt(level.price)} ${unit(s)}`
          : `• ${s.name}: a cotizar`
      );
    });
    if (r.pricedCount) {
      lines.push("");
      if (r.bundle) lines.push(`Bundle ${CFG.bundle.discountPct}% aplicado.`);
      if (r.monthly) lines.push(`Total mensual: ${r.hasFrom ? "desde " : ""}${fmt(r.monthlyFinal)}`);
      if (r.oneTime) lines.push(`Pago único: ${fmt(r.oneTimeFinal)}`);
    }
    lines.push("", `Ver cotización: ${shareUrl()}`);
    return lines.join("\n");
  }

  function shareUrl() {
    const q = [...selected.entries()].map(([id, l]) => (isPriced(services[id]) ? `${id}.${l}` : id)).join(",");
    return `${location.origin}${location.pathname}${q ? "#s=" + q : ""}`;
  }

  function loadFromHash() {
    const m = location.hash.match(/s=([^&]+)/);
    if (!m) return;
    decodeURIComponent(m[1])
      .split(",")
      .forEach((tok) => {
        const [id, l] = tok.split(".");
        const s = services[id];
        if (!s) return;
        const lvl = isPriced(s) ? Math.min(Math.max(Number(l) || 0, 0), s.levels.length - 1) : 0;
        levelChoice[id] = lvl;
        selected.set(id, lvl);
      });
  }

  async function copy(text, msg) {
    try {
      await navigator.clipboard.writeText(text);
      toast(msg);
    } catch {
      window.prompt("Copia el texto:", text);
    }
  }

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-visible"), 2600);
  }

  const waLink = (text) => `https://wa.me/${CFG.contact.whatsapp}?text=${encodeURIComponent(text)}`;

  // Agendar llamada: usa el calendario si está configurado; si no, pide la llamada por WhatsApp
  function bookingHref() {
    return CFG.contact.bookingUrl || waLink("Hola ROCKET, me gustaría agendar una llamada para conocer sus servicios.");
  }

  // Enlace (no window.open) para que WhatsApp abra también dentro de iframes/previews
  function quoteHref() {
    return waLink(selected.size ? summaryText() : "Hola ROCKET, me gustaría recibir una cotización de sus servicios.");
  }

  // ---------- Update ----------
  function update(changedId) {
    if (changedId) refreshCard(changedId);
    else Object.keys(services).forEach(refreshCard);
    renderSummary();
    $("#requestBtn").href = quoteHref();
    const url = shareUrl();
    history.replaceState(null, "", url.slice(url.indexOf(location.pathname)));
  }

  // ---------- Init ----------
  function init() {
    document.querySelectorAll("[data-bundle-pct]").forEach((el) => (el.textContent = CFG.bundle.discountPct));
    document.querySelectorAll("[data-bundle-min]").forEach((el) => (el.textContent = CFG.bundle.minServices));
    document.querySelectorAll("[data-currency]").forEach((el) => (el.textContent = CFG.currency));
    document.querySelectorAll("[data-booking]").forEach((el) => (el.href = bookingHref()));

    loadFromHash();
    renderCatalog();
    update();

    $("#summaryList").addEventListener("click", (e) => {
      const b = e.target.closest("[data-remove]");
      if (!b) return;
      selected.delete(b.dataset.remove);
      update(b.dataset.remove);
    });
    $("#clearAll").addEventListener("click", () => {
      selected.clear();
      update();
    });
    $("#copyBtn").addEventListener("click", () => copy(summaryText(), "Resumen copiado"));
    $("#shareBtn").addEventListener("click", () => copy(shareUrl(), "Link copiado: compártelo con tu cliente"));
    $("#toggleSummary").addEventListener("click", (e) => {
      const open = $("#summary").classList.toggle("is-open");
      e.currentTarget.setAttribute("aria-expanded", open);
      e.currentTarget.textContent = open ? "Ocultar" : "Ver resumen";
    });
  }

  init();
})();
