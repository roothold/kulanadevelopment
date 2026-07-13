/* Kulana Development — interactions */
(function () {
  "use strict";

  /* Header scroll state */
  var header = document.querySelector(".site-header");
  var onLight = header && header.classList.contains("on-light");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var burger = document.querySelector(".burger");
  var menu = document.querySelector(".mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      burger.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        burger.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* Count-up stats */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var decimals = (target % 1 !== 0) ? 1 : 0;
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.firstChild ? null : null;
      el.childNodes[0].nodeValue = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.childNodes[0].nodeValue = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* Footer year */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();

  /* Contact form (front-end only demo) */
  var form = document.querySelector("#inquiry-form");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var note = form.querySelector(".form-note");
      if (note) {
        note.textContent = "Thank you — your inquiry has been received. A member of our team will be in touch shortly.";
        note.style.display = "block";
      }
      form.reset();
    });
  }
})();

/* Scroll progress bar */
(function () {
  var bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  function upd() {
    var h = document.documentElement;
    var st = h.scrollTop || document.body.scrollTop;
    var sh = (h.scrollHeight - h.clientHeight) || 1;
    bar.style.width = (st / sh * 100) + "%";
  }
  window.addEventListener("scroll", upd, { passive: true });
  window.addEventListener("resize", upd);
  upd();
})();

/* Amenity gallery filtering */
(function () {
  var filters = document.querySelector(".amenity-filters");
  if (!filters) return;
  var tiles = [].slice.call(document.querySelectorAll(".afeat[data-cat]"));
  filters.addEventListener("click", function (e) {
    var b = e.target.closest(".afilter");
    if (!b) return;
    filters.querySelectorAll(".afilter").forEach(function (x) { x.classList.remove("active"); });
    b.classList.add("active");
    var cat = b.getAttribute("data-filter");
    tiles.forEach(function (t) {
      var cats = (t.getAttribute("data-cat") || "").split(" ");
      var show = cat === "all" || cats.indexOf(cat) > -1;
      t.classList.toggle("hide", !show);
    });
  });
})();

/* World-class mobile menu: logo, close button, CTA, Escape-to-close */
(function () {
  var menu = document.querySelector(".mobile-menu");
  var burger = document.querySelector(".burger");
  if (!menu) return;

  var bar = document.createElement("div");
  bar.className = "mm-top";
  var logo = document.createElement("img");
  logo.src = "logo.png";
  logo.className = "mm-logo";
  logo.alt = "Kulana Development";
  var close = document.createElement("button");
  close.className = "mm-close";
  close.setAttribute("aria-label", "Close menu");
  close.innerHTML = "<span></span><span></span>";
  bar.appendChild(logo);
  bar.appendChild(close);
  menu.insertBefore(bar, menu.firstChild);

  var cta = document.createElement("a");
  cta.href = "contact.html";
  cta.className = "mm-cta";
  cta.textContent = "Start a Conversation";
  menu.appendChild(cta);

  function closeMenu() {
    menu.classList.remove("open");
    if (burger) burger.classList.remove("open");
    document.body.style.overflow = "";
  }
  close.addEventListener("click", closeMenu);
  cta.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
  });
})();

/* Animated timeline: scroll-fill + node activation */
(function () {
  var tl = document.querySelector(".timeline");
  if (!tl) return;
  var fill = tl.querySelector(".timeline__fill");
  var items = [].slice.call(tl.querySelectorAll(".tl-item"));
  function upd() {
    var r = tl.getBoundingClientRect();
    var vh = window.innerHeight;
    var progressed = Math.min(Math.max(vh * 0.72 - r.top, 0), r.height);
    if (fill) fill.style.height = progressed + "px";
    items.forEach(function (it) {
      if (it.getBoundingClientRect().top < vh * 0.78) it.classList.add("in");
    });
  }
  window.addEventListener("scroll", upd, { passive: true });
  window.addEventListener("resize", upd);
  upd();
})();

/* Cinematic statement parallax */
(function () {
  var bgs = [].slice.call(document.querySelectorAll(".statement__bg"));
  if (!bgs.length) return;
  function upd() {
    bgs.forEach(function (bg) {
      var s = bg.closest(".statement").getBoundingClientRect();
      var off = (window.innerHeight - s.top) * 0.05;
      bg.style.transform = "translateY(" + (-off) + "px)";
    });
  }
  window.addEventListener("scroll", upd, { passive: true });
  upd();
})();

/* Newsletter capture (front-end demo) */
(function () {
  var f = document.querySelector("#newsletter-form");
  if (!f) return;
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var n = f.querySelector(".nl-note");
    if (n) { n.textContent = "Thank you — you're on the list. We'll keep you close to the vision."; n.style.display = "block"; }
    f.reset();
  });
})();
