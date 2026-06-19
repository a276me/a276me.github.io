/* =========================================================================
   Huajian Yang — site interactions (vanilla JS, no dependencies)
   - twinkling starfield canvas
   - sticky nav state + mobile menu
   - scroll-reveal animations
   - gallery lightbox with keyboard + swipe navigation
   ========================================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------- Starfield ------------------------------ */
  const canvas = document.getElementById("stars");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w, h, stars, raf;

    const makeStars = () => {
      const count = Math.min(260, Math.floor((w * h) / 7000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.25,
        base: Math.random() * 0.5 + 0.25,
        amp: Math.random() * 0.5,
        speed: Math.random() * 0.0016 + 0.0004,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.18 ? 205 : (Math.random() < 0.5 ? 260 : 0)
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeStars();
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const tw = reduceMotion ? s.base : s.base + s.amp * Math.sin(t * s.speed + s.phase);
        const a = Math.max(0, Math.min(1, tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.hue === 0
          ? `rgba(255,255,255,${a})`
          : `hsla(${s.hue}, 80%, 80%, ${a})`;
        ctx.fill();
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(raf);
      resize();
      if (reduceMotion) draw(0); else raf = requestAnimationFrame(draw);
    });
    if (reduceMotion) draw(0); else raf = requestAnimationFrame(draw);
  }

  /* --------------------------- Nav behaviour ---------------------------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* --------------------------- Scroll reveal ---------------------------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.transitionDelay = (e.target.dataset.delay || "0") + "ms";
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ------------------------------ Lightbox ------------------------------ */
  const shots = Array.from(document.querySelectorAll(".shot[data-full]"));
  const lb = document.getElementById("lightbox");
  if (shots.length && lb) {
    const lbImg = lb.querySelector(".lightbox-img img");
    const lbCat = lb.querySelector(".cat");
    const lbTitle = lb.querySelector("h3");
    const lbDesc = lb.querySelector(".desc");
    const lbSpecs = lb.querySelector(".lb-specs");
    const lbFull = lb.querySelector(".lb-full");
    let index = 0;

    const specRow = (k, v) =>
      `<div class="lb-spec"><span class="k">${k}</span><span class="v">${v}</span></div>`;

    const render = (i) => {
      const el = shots[i];
      const d = el.dataset;
      lbImg.src = d.src || el.querySelector("img").src;
      lbImg.alt = d.title || "";
      lbCat.textContent = d.cat || "";
      lbTitle.textContent = d.title || "";
      lbDesc.textContent = d.desc || "";
      lbFull.href = d.full;
      const specs = [];
      if (d.catalog) specs.push(specRow("Catalog", d.catalog));
      if (d.constellation) specs.push(specRow("Constellation", d.constellation));
      if (d.type) specs.push(specRow("Type", d.type));
      if (d.distance) specs.push(specRow("Distance", d.distance));
      lbSpecs.innerHTML = specs.join("");
      index = i;
    };

    const open = (i) => {
      render(i);
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };
    const step = (dir) => render((index + dir + shots.length) % shots.length);

    shots.forEach((el, i) => {
      el.addEventListener("click", () => open(i));
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });

    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", () => step(-1));
    lb.querySelector(".lb-next").addEventListener("click", () => step(1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    });

    // touch swipe
    let sx = 0;
    lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ----------------------- Footer year (auto) --------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
