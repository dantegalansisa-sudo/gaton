/* ===== GATÓN · interactividad ===== */
(function () {
  "use strict";

  // ⚙️ CONFIG — cambiar por el WhatsApp real del negocio (formato internacional, sin signos)
  const WHATSAPP = "18494021457";
  const LOGO = "assets/logo-mark.png";        // colored, transparent bg (light surfaces)
  const LOGO_LIGHT = "assets/logo-white.png"; // white mark (dark surfaces)

  // ---- Catálogo (data de ejemplo, editable) ----
  const PRODUCTS = [
    { id: "c1", name: "Collar Árbol de Vida", cat: "Collares", mat: "Plata 925", price: 2450, badge: "Best seller" },
    { id: "c2", name: "Collar Inicial", cat: "Personalizados", mat: "Oro laminado 18k", price: 1890, badge: "Nuevo", gold: true },
    { id: "p1", name: "Pulsera Gotita", cat: "Pulseras", mat: "Plata 925", price: 1250 },
    { id: "a1", name: "Anillo Solitario Esencia", cat: "Anillos", mat: "Baño de oro 18k", price: 1690 },
    { id: "e1", name: "Aretes Hoja de Laurel", cat: "Aretes", mat: "Plata 925", price: 980 },
    { id: "s1", name: "Set Botánico", cat: "Collares", mat: "Collar + aretes · Plata", price: 3200, badge: "Set" },
    { id: "p2", name: "Tobillera Cadena Fina", cat: "Pulseras", mat: "Plata 925", price: 890 },
    { id: "a2", name: "Anillo Naturaleza", cat: "Anillos", mat: "Ajustable · Plata", price: 760 },
    { id: "c3", name: "Collar Nombre Personalizado", cat: "Personalizados", mat: "Oro laminado", price: 2100, badge: "A pedido", gold: true },
    { id: "e2", name: "Aretes Gota de Rocío", cat: "Aretes", mat: "Plata 925 · Circón", price: 1120 },
    { id: "c4", name: "Collar Capas Minimal", cat: "Collares", mat: "Doble cadena · Plata", price: 1780 },
    { id: "a3", name: "Argolla Clásica", cat: "Aretes", mat: "Baño de oro", price: 940 },
  ];

  const FRAGRANCES = [
    { id: "f1", name: "Eau de Parfum · Esencia", cat: "Fragancia", mat: "50ml · Floral amaderado", price: 2950, badge: "Edición limitada", gold: true },
    { id: "f2", name: "Bruma Corporal · Jardín", cat: "Fragancia", mat: "100ml · Fresco floral", price: 1450 },
    { id: "f3", name: "Set Dúo de Fragancias", cat: "Fragancia", mat: "Parfum + bruma", price: 4200, badge: "Set" },
    { id: "f4", name: "Roll-on · Intención", cat: "Fragancia", mat: "10ml · Aceite perfumado", price: 690 },
  ];

  const ALL = [...PRODUCTS, ...FRAGRANCES];
  const money = (n) => "RD$" + n.toLocaleString("es-DO");

  // ---- State ----
  let cart = loadCart();

  function loadCart() {
    try { return JSON.parse(localStorage.getItem("gaton_cart")) || {}; }
    catch { return {}; }
  }
  function saveCart() { localStorage.setItem("gaton_cart", JSON.stringify(cart)); }

  // ---- Render product cards ----
  function cardHTML(p, light) {
    const badge = p.badge
      ? `<span class="card__badge ${p.gold ? "card__badge--gold" : ""}">${p.badge}</span>` : "";
    return `
      <article class="card" data-cat="${p.cat}">
        <div class="card__media">
          ${badge}
          <img src="${light ? LOGO_LIGHT : LOGO}" alt="${p.name}" loading="lazy" />
        </div>
        <div class="card__body">
          <span class="card__cat">${p.cat}</span>
          <h3 class="card__name">${p.name}</h3>
          <span class="card__mat">${p.mat}</span>
          <div class="card__foot">
            <span class="card__price">${money(p.price)}</span>
            <button class="card__add" data-add="${p.id}" aria-label="Agregar ${p.name}">+</button>
          </div>
        </div>
      </article>`;
  }

  const grid = document.getElementById("productGrid");
  const fragGrid = document.getElementById("fragGrid");
  if (grid) grid.innerHTML = PRODUCTS.map((p) => cardHTML(p, false)).join("");
  if (fragGrid) fragGrid.innerHTML = FRAGRANCES.map((p) => cardHTML(p, true)).join("");

  // ---- Add to cart (event delegation) ----
  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    if (add) {
      addToCart(add.getAttribute("data-add"));
      return;
    }
    const coll = e.target.closest(".coll-card[data-filter]");
    if (coll) {
      const f = coll.getAttribute("data-filter");
      if (f !== "Fragancias") applyFilter(f);
    }
  });

  function addToCart(id) {
    const p = ALL.find((x) => x.id === id);
    if (!p) return;
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
    renderCart();
    bumpCount();
    toast(`${p.name} agregado ✦`);
  }

  // ---- Cart count ----
  const countEl = document.getElementById("cartCount");
  function totalQty() { return Object.values(cart).reduce((a, b) => a + b, 0); }
  function bumpCount() {
    const q = totalQty();
    countEl.textContent = q;
    countEl.classList.toggle("show", q > 0);
    countEl.animate(
      [{ transform: "scale(1.5)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "cubic-bezier(.22,.61,.36,1)" }
    );
  }

  // ---- Render cart drawer ----
  const cartEl = document.getElementById("cart");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  function renderCart() {
    const ids = Object.keys(cart).filter((id) => cart[id] > 0);
    cartEl.classList.toggle("empty", ids.length === 0);
    let total = 0;
    itemsEl.innerHTML = ids.map((id) => {
      const p = ALL.find((x) => x.id === id);
      const qty = cart[id];
      const line = p.price * qty;
      total += line;
      return `
        <div class="cart-item">
          <div class="cart-item__img"><img src="${LOGO}" alt="" /></div>
          <div>
            <div class="cart-item__name">${p.name}</div>
            <div class="cart-item__price">${money(p.price)}</div>
            <div class="cart-item__qty">
              <button data-dec="${id}">−</button>
              <span>${qty}</span>
              <button data-inc="${id}">+</button>
            </div>
            <button class="cart-item__remove" data-rem="${id}">Quitar</button>
          </div>
          <div class="cart-item__line">${money(line)}</div>
        </div>`;
    }).join("");
    totalEl.textContent = money(total);
    countEl.textContent = totalQty();
    countEl.classList.toggle("show", totalQty() > 0);
  }

  itemsEl.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    const dec = e.target.closest("[data-dec]");
    const rem = e.target.closest("[data-rem]");
    if (inc) cart[inc.dataset.inc]++;
    if (dec) cart[dec.dataset.dec] = Math.max(0, cart[dec.dataset.dec] - 1);
    if (rem) delete cart[rem.dataset.rem];
    if (dec && cart[dec.dataset.dec] === 0) delete cart[dec.dataset.dec];
    saveCart();
    renderCart();
  });

  // ---- Open / close cart ----
  const backdrop = document.getElementById("cartBackdrop");
  function openCart() { cartEl.classList.add("open"); backdrop.classList.add("open"); cartEl.setAttribute("aria-hidden", "false"); }
  function closeCart() { cartEl.classList.remove("open"); backdrop.classList.remove("open"); cartEl.setAttribute("aria-hidden", "true"); }
  document.getElementById("openCart").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  backdrop.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

  // ---- Checkout → WhatsApp ----
  document.getElementById("checkout").addEventListener("click", () => {
    const ids = Object.keys(cart).filter((id) => cart[id] > 0);
    if (!ids.length) return;
    let total = 0;
    const lines = ids.map((id) => {
      const p = ALL.find((x) => x.id === id);
      const line = p.price * cart[id];
      total += line;
      return `• ${cart[id]}x ${p.name} — ${money(line)}`;
    });
    const msg =
      `¡Hola GATÓN! ✦ Quiero hacer un pedido:\n\n` +
      lines.join("\n") +
      `\n\n*Total: ${money(total)}*` +
      `\n\n¿Me confirman disponibilidad y envío? 🙌`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  // ---- Filters ----
  const filterBar = document.getElementById("filters");
  function applyFilter(f) {
    document.querySelectorAll(".filter").forEach((b) =>
      b.classList.toggle("is-active", b.dataset.filter === f));
    grid.querySelectorAll(".card").forEach((c) => {
      const show = f === "all" || c.dataset.cat === f;
      c.style.display = show ? "" : "none";
    });
    document.getElementById("coleccion").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const b = e.target.closest(".filter");
      if (b) applyFilter(b.dataset.filter);
    });
  }

  // ---- Contact form → WhatsApp ----
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    if (!name || !phone) {
      note.textContent = "Por favor completa tu nombre y teléfono.";
      note.className = "form-note err";
      return;
    }
    const msg =
      `¡Hola GATÓN! Soy *${name}*.\n` +
      `Teléfono: ${phone}\n` +
      `Me interesa: ${form.interest.value}\n` +
      (form.message.value.trim() ? `Mensaje: ${form.message.value.trim()}` : "");
    note.textContent = "Abriendo WhatsApp… ✦";
    note.className = "form-note ok";
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
    form.reset();
  });

  // ---- Toast ----
  const toastEl = document.getElementById("toast");
  let toastTimer;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  // ---- Mobile menu ----
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");
  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });
  mobileMenu.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      burger.classList.remove("open");
      mobileMenu.classList.remove("open");
    }));

  // ---- Nav scroll state ----
  const nav = document.getElementById("nav");
  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // ---- Scroll reveal (cards + sections) ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  function observeReveals() {
    document.querySelectorAll(".card, [data-inview]").forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 0.06 + "s";
      io.observe(el);
    });
  }
  // tag section blocks for reveal
  document.querySelectorAll(".section-head, .story__text, .story__media, .step, .quote, .contact__info, .contact__form, .coll-card")
    .forEach((el) => el.setAttribute("data-inview", ""));
  observeReveals();

  // ---- Init ----
  renderCart();
  bumpCount();
})();
