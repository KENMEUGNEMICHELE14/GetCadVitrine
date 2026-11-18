/* GetCad BTP – comportement du site (sans dépendance, sauf EmailJS pour le formulaire) */
(function () {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Année du pied de page ---------- */
  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Menu mobile ---------- */
  var burger = $(".burger");
  var nav = $("#menu");
  var header = $(".site-header");

  function setMenu(open) {
    nav.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.classList.toggle("menu-open", open);
  }
  burger.addEventListener("click", function () {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });
  $$("#menu a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); burger.focus(); }
  });
  window.matchMedia("(min-width: 861px)").addEventListener("change", function (m) {
    if (m.matches) setMenu(false);
  });

  /* ---------- Ombre de l’en-tête au défilement ---------- */
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Lien actif dans le menu ---------- */
  if ("IntersectionObserver" in window) {
    var links = {};
    $$("#menu ul a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
          links[en.target.id].setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Filtres des réalisations ---------- */
  var chips = $$(".chip");
  var projs = $$(".proj");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-on", on);
        c.setAttribute("aria-pressed", String(on));
      });
      projs.forEach(function (p) {
        p.hidden = !(f === "all" || p.getAttribute("data-cat") === f);
      });
    });
  });

  /* ---------- Visionneuse photos ---------- */
  var viewer = $("#viewer");
  var vImg = $("#viewerImg");
  var vTitle = $("#viewerTitle");
  var vCount = $("#viewerCount");
  var list = [];
  var idx = 0;
  var opener = null;

  function show(i) {
    idx = (i + list.length) % list.length;
    vImg.src = "assets/img/" + list[idx];
    vImg.alt = vTitle.textContent + " – image " + (idx + 1) + " sur " + list.length;
    vCount.textContent = (idx + 1) + " / " + list.length;
    var next = new Image();
    next.src = "assets/img/" + list[(idx + 1) % list.length];
  }
  function openViewer(btn) {
    opener = btn;
    list = btn.getAttribute("data-photos").split("|");
    vTitle.textContent = btn.getAttribute("data-title");
    var multi = list.length > 1;
    $("#vPrev").hidden = !multi;
    $("#vNext").hidden = !multi;
    show(0);
    if (typeof viewer.showModal === "function") viewer.showModal();
    else viewer.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  }
  function closeViewer() {
    if (viewer.open) viewer.close();
  }
  viewer.addEventListener("close", function () {
    document.body.style.overflow = "";
    vImg.removeAttribute("src");
    if (opener) opener.focus();
  });

  $$(".proj-photo").forEach(function (b) {
    b.addEventListener("click", function () { openViewer(b); });
  });
  $("#vClose").addEventListener("click", closeViewer);
  $("#vPrev").addEventListener("click", function () { show(idx - 1); });
  $("#vNext").addEventListener("click", function () { show(idx + 1); });
  viewer.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  viewer.addEventListener("click", function (e) {
    if (e.target === viewer || e.target.classList.contains("viewer-stage")) closeViewer();
  });
  var x0 = null;
  viewer.addEventListener("touchstart", function (e) { x0 = e.changedTouches[0].clientX; }, { passive: true });
  viewer.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50 && list.length > 1) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  }, { passive: true });

  /* ---------- Formulaire de contact ---------- */
  var EMAILJS_PUBLIC_KEY = "U4JW4K5mpqpjbcV3s";
  var EMAILJS_SERVICE = "service_gmail";
  var EMAILJS_TEMPLATE = "template_bnjfujv";
  var WHATSAPP = "237699869089";

  var form = $("#contactForm");
  var status = $("#formStatus");
  var emailjsReady = false;

  function initEmailJS() {
    if (emailjsReady || !window.emailjs) return emailjsReady;
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    emailjsReady = true;
    return true;
  }

  function setStatus(kind, text, html) {
    status.className = "status " + kind;
    if (html) status.innerHTML = html; else status.textContent = text;
  }

  var rules = {
    name: function (v) { return v.trim().length < 2 ? "Indiquez votre nom." : ""; },
    telephone: function (v) { return v.replace(/\D/g, "").length < 8 ? "Indiquez un numéro de téléphone valide." : ""; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Indiquez une adresse email valide."; },
    message: function (v) { return v.trim().length < 10 ? "Décrivez votre projet en quelques mots." : ""; }
  };

  function check(name) {
    var field = form.elements[name];
    var msg = rules[name](field.value);
    var out = $('.err[data-for="' + name + '"]');
    out.textContent = msg;
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) field.setAttribute("aria-describedby", out.id || (out.id = "err-" + name));
    else field.removeAttribute("aria-describedby");
    return !msg;
  }
  Object.keys(rules).forEach(function (n) {
    form.elements[n].addEventListener("blur", function () { check(n); });
    form.elements[n].addEventListener("input", function () {
      if (form.elements[n].getAttribute("aria-invalid") === "true") check(n);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "status"; status.textContent = "";

    // Robot : le champ caché est rempli → on fait semblant que tout va bien
    if (form.elements.website.value) { setStatus("ok", "Merci, votre message a bien été envoyé."); form.reset(); return; }

    var first = null;
    Object.keys(rules).forEach(function (n) { if (!check(n) && !first) first = form.elements[n]; });
    if (first) { first.focus(); return; }

    var btn = form.querySelector('button[type="submit"]');
    var label = btn.querySelector(".btn-text");
    var original = label.textContent;
    label.textContent = "Envoi en cours…";
    btn.disabled = true;

    var wa = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(
      "Bonjour GetCad BTP, je suis " + form.elements.name.value.trim() +
      " (" + form.elements.telephone.value.trim() + "). " + form.elements.message.value.trim());
    var fallback = 'Le message n’a pas pu être envoyé. Écrivez-nous directement sur <a href="' + wa +
      '" target="_blank" rel="noopener">WhatsApp</a> ou à <a href="mailto:getcadbe@gmail.com">getcadbe@gmail.com</a>.';

    function done() { label.textContent = original; btn.disabled = false; }

    if (!initEmailJS()) { setStatus("ko", "", fallback); done(); return; }

    window.emailjs.sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, form)
      .then(function () {
        setStatus("ok", "Merci, votre message a bien été envoyé. Nous vous rappelons très vite.");
        form.reset();
        Object.keys(rules).forEach(function (n) { form.elements[n].setAttribute("aria-invalid", "false"); });
      })
      .catch(function (err) {
        if (window.console) console.error("EmailJS :", err);
        setStatus("ko", "", fallback);
      })
      .then(done);
  });
})();
