/* ════════════════════════════════════════════════
   axel-site / js/main.js
   ────────────────────────────────────────────────
   ÍNDICE:
   01. Canvas BG (estrellas + telaraña)
   02. Cursor pixel + aura
   03. Reloj en tiempo real
   04. Partículas flotantes
   05. Lluvia pixel (sección vibes)
   06. Stars canvas (sección vibes)
   07. Barra de progreso scroll
   08. Intro → Minecraft loader → Main
   09. Minecraft loader (espiral cuadrada)
   10. ScrollTrigger animations (GSAP)
   11. Typewriter effect
   12. Glitch text effect
   13. Ghost cursor (arrastra elementos)
   14. Web explosion (touch móvil)
   15. CMD Windows draggables
   16. Pixel trail (rastro cursor)
   17. Pet explosion & ciclo
   18. Glitch flash aleatorio
   19. Pet drag (click derecho / long press)
   20. Pet sleep (idle 30s)
   21. Scroll secret (fondo 5s)
   22. 2am secret message
   23. Easter egg (patrón swipes + baile)
   24. 2am pet behavior
   25. Polaroid photo viewer
   26. Context menu custom
   27. Mirror pet (horas espejo)
   28. Buzón → Notion via Vercel
   ────────────────────────────────────────────────
   Deps CDN: GSAP 3.12.5 + ScrollTrigger
   Fonts: Cormorant Garamond, DM Mono, VT323
════════════════════════════════════════════════ */

let lastTime = 0;

gsap.registerPlugin(ScrollTrigger);

/* ════════════════════════
   CANVAS: STARS + WEB
════════════════════════ */
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  stars,
  nodes,
  mouse = { x: null, y: null };

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initParticles();
}

function initParticles() {
  // stars
  stars = Array.from(
    { length: Math.min(120, Math.floor((W * H) / 8000)) },
    () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.15,
      a: Math.random() * 0.7 + 0.15,
      spd: Math.random() * 0.004 + 0.001,
      t: Math.random() * Math.PI * 2,
    }),
  );
  // web nodes
  nodes = Array.from(
    { length: Math.min(40, Math.floor((W * H) / 18000)) },
    () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }),
  );
}

function drawBg(t) {
  ctx.clearRect(0, 0, W, H);

  // stars (twinkle)
  stars.forEach((s) => {
    s.t += s.spd;
    const a = s.a * (0.55 + 0.45 * Math.sin(s.t * 60));
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(185,158,232,${a})`;
    ctx.fill();
  });

  // web / spider connections
  nodes.forEach((n) => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });

  const mx = mouse.x,
    my = mouse.y;
  const maxDist = Math.min(W, H) * 0.18;
  const maxDistMouse = Math.min(W, H) * 0.22;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x,
        dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) {
        const a = (1 - d / maxDist) * 0.18;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(92,63,160,${a})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
    // connect to mouse
    if (mx !== null) {
      const dx = nodes[i].x - mx,
        dy = nodes[i].y - my;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDistMouse) {
        const a = (1 - d / maxDistMouse) * 0.35;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(139,104,204,${a})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    // node dot
    ctx.beginPath();
    ctx.arc(nodes[i].x, nodes[i].y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(139,104,204,.3)";
    ctx.fill();
  }

  requestAnimationFrame(drawBg);
}
resize();
window.addEventListener("resize", resize);
requestAnimationFrame(drawBg);

/* ════════════════════════
   CURSOR + AURA (desktop)
════════════════════════ */
const curEl = document.getElementById("cur");
const ringEl = document.getElementById("cur-ring");
const auraEl = document.getElementById("aura");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
const isTouch = !window.matchMedia("(hover:hover)").matches;

if (!isTouch) {
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    mouse.x = mx;
    mouse.y = my;
    curEl.style.transform = `translate(${mx - 2}px,${my - 2}px)`;
    gsap.to(auraEl, {
      x: mx,
      y: my,
      duration: 0.9,
      ease: "power2.out",
      overwrite: "auto",
    });
  });
  document.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });
  (function loopRing() {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    ringEl.style.left = rx + "px";
    ringEl.style.top = ry + "px";
    requestAnimationFrame(loopRing);
  })();
  document.addEventListener("mousedown", () =>
    gsap.to(ringEl, { scale: 0.6, duration: 0.15 }),
  );
  document.addEventListener("mouseup", () =>
    gsap.to(ringEl, { scale: 1, duration: 0.2 }),
  );
  document
    .querySelectorAll("a,.wbtn,.wd,.tag,.game-card,.artist-card,.lnk")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => ringEl.classList.add("big"));
      el.addEventListener("mouseleave", () => ringEl.classList.remove("big"));
    });
} else {
  // touch ripple
  // touch: ripple + telaraña explosion
  document.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      const r = document.createElement("div");
      r.className = "ripple";
      r.style.left = t.clientX + "px";
      r.style.top = t.clientY + "px";
      document.body.appendChild(r);
      setTimeout(() => r.remove(), 700);
      // web explosion
      const tx = t.clientX,
        ty = t.clientY;
      const explR = Math.min(W, H) * 0.3;
      nodes.forEach((n) => {
        const dx = n.x - tx,
          dy = n.y - ty,
          d = Math.sqrt(dx * dx + dy * dy);
        if (d < explR) {
          const force = (1 - d / explR) * 18,
            angle = Math.atan2(dy, dx);
          n._ox = n.x;
          n._oy = n.y;
          n._bursting = true;
          gsap.to(n, {
            x: n.x + Math.cos(angle) * force,
            y: n.y + Math.sin(angle) * force,
            duration: 0.25,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(n, {
                x: n._ox,
                y: n._oy,
                duration: 0.8,
                ease: "elastic.out(1,.5)",
                onComplete: () => {
                  n._bursting = false;
                },
              });
            },
          });
        }
      });
    },
    { passive: true },
  );
  document.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      mouse.x = t.clientX;
      mouse.y = t.clientY;
    },
    { passive: true },
  );
  document.addEventListener(
    "touchend",
    () => {
      setTimeout(() => {
        mouse.x = null;
        mouse.y = null;
      }, 1200);
    },
    { passive: true },
  );
}

/* ════════════════════════
   CLOCK
════════════════════════ */
function tick() {
  const d = new Date(),
    h = d.getHours(),
    m = d.getMinutes();
  const ap = h >= 12 ? "pm" : "am",
    hh = h % 12 || 12;
  const s = `${hh}:${String(m).padStart(2, "0")}${ap}`;
  const ft = document.getElementById("ft");
  if (ft) ft.textContent = s;
}
tick();
setInterval(tick, 30000);

/* ════════════════════════
   PROGRESS BAR
════════════════════════ */
gsap.to("#prog", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: { scrub: true, start: "top top", end: "bottom bottom" },
});

/* ════════════════════════
   INTRO → MAIN
════════════════════════ */
const introEl = document.getElementById("intro");
const mainEl = document.getElementById("main");
const audio = document.getElementById("audio");
const badge = document.getElementById("mbadge");
let started = false;

function enter() {
  document.body.classList.add("no-scroll");
  if (started) return;
  started = true;

  // ── START AUDIO immediately (fade in slowly during loader) ──
  // check if audio has a source (not just empty src)
  const audioHasSrc = audio.querySelector
    ? audio.querySelector("source")
    : null;
  if (
    audioHasSrc ||
    (audio.src &&
      audio.src !== window.location.href &&
      !audio.src.endsWith("/"))
  ) {
    audio.volume = 0;
    audio
      .play()
      .then(() => {
        gsap.to(audio, { volume: 0.42, duration: 4, ease: "power2.out" });
        gsap.to(badge, { opacity: 1, duration: 0.6, delay: 2 });
      })
      .catch(() => {
        // autoplay blocked — try on first user interaction
        document.addEventListener(
          "click",
          function tryPlay() {
            audio
              .play()
              .then(() => {
                gsap.to(audio, { volume: 0.42, duration: 2 });
                gsap.to(badge, { opacity: 1, duration: 0.6 });
              })
              .catch(() => {});
            document.removeEventListener("click", tryPlay);
          },
          { once: true },
        );
      });
  }

  // blur out intro
  gsap.to(introEl, {
    filter: "blur(22px)",
    scale: 1.07,
    opacity: 0,
    duration: 0.7,
    ease: "power3.inOut",
    onComplete: () => {
      introEl.style.display = "none";
      // show minecraft loader
      runMCLoader(() => {
        // after mc done → fade in main
        // show mascot + pet after loader
        const mascotEl = document.getElementById("mascot");
        const petEl = document.getElementById("pet");
        const petBub = document.getElementById("pet-bubble");
        if (mascotEl) {
          mascotEl.style.display = "block";
          gsap.fromTo(
            mascotEl,
            { opacity: 0, scale: 0.5 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: 0.4,
              ease: "back.out(2)",
            },
          );
        }
        if (petEl) {
          petEl.style.display = "block";
          gsap.fromTo(
            petEl,
            { opacity: 0, scale: 0.5 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              delay: 0.7,
              ease: "back.out(2)",
            },
          );
        }
        if (petBub) {
          petBub.style.display = "block";
        }

        gsap.to(mainEl, {
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          onStart: () => mainEl.classList.add("on"),
        });
        document.body.classList.remove("no-scroll");
        window.scrollTo(0, 0);
        // audio already started during loader
      });
    },
  });
}
introEl.addEventListener("click", enter);
introEl.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    enter();
  },
  { passive: false },
);

/* ════════════════════════
   MINECRAFT LOADING SCREEN
════════════════════════ */
const MC_TIPS = [
  "// cargando chunks...",
  "// porque demora tanto?",
  "// ta buena la música eh",
  "// compilandoooooo",
  "// git clone Waa.github.com",
  "// instalando virus.exe",
  "// bien lindo el pollito de la intro no?",
  "// debug: todo ok?",
  "// SE VIENEEEEEEEEEE",
  "// SIX SEVENN XDXDXDUWUWUWU676767",
  "// :v",
];
const MC_CHUNK_COLORS = [
  "#3d7a28",
  "#4a8f30",
  "#5ea83a",
  "#2d6020",
  "#6ab840",
  "#3d7a28",
  "#527e30",
];

function runMCLoader(onDone) {
  const mcEl = document.getElementById("mcload");
  const pctTxt = document.getElementById("mc-pct-txt");
  const tipEl = document.getElementById("mc-tip");
  const canvas = document.getElementById("mc-spiral-canvas");

  const SZ = Math.min(
    Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.72),
    280,
  );
  canvas.width = SZ;
  canvas.height = SZ;
  canvas.style.width = SZ + "px";
  canvas.style.height = SZ + "px";

  const ctx = canvas.getContext("2d");
  mcEl.classList.add("show");

  // ── PET APARECE DURANTE EL LOADER ────────────────────
  // Spawn a random mini pet that wanders during loading
  (function spawnLoaderPet() {
    const LOADER_PET_SVGS = [
      // gato negro
      `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated" width="48" height="48">
        <rect x="3" y="5" width="10" height="9" fill="#1a1a1a"/>
        <rect x="3" y="3" width="2" height="3" fill="#1a1a1a"/>
        <rect x="11" y="3" width="2" height="3" fill="#1a1a1a"/>
        <rect x="5" y="7" width="2" height="2" fill="#8b68cc"/>
        <rect x="9" y="7" width="2" height="2" fill="#8b68cc"/>
        <rect x="5" y="7" width="1" height="1" fill="#d0c0ff"/>
        <rect x="9" y="7" width="1" height="1" fill="#d0c0ff"/>
        <rect x="7" y="10" width="2" height="1" fill="#3a3a3a"/>
        <rect x="13" y="9" width="2" height="2" fill="#1a1a1a"/>
        <rect x="14" y="7" width="1" height="2" fill="#1a1a1a"/>
      </svg>`,
      // fantasmita
      `<svg viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated" width="44" height="48">
        <rect x="4" y="2" width="8" height="2" fill="#c4acee"/>
        <rect x="3" y="4" width="10" height="9" fill="#c4acee"/>
        <rect x="2" y="5" width="12" height="7" fill="#c4acee"/>
        <rect x="3" y="13" width="2" height="2" fill="#c4acee"/>
        <rect x="7" y="13" width="2" height="3" fill="#c4acee"/>
        <rect x="11" y="13" width="2" height="2" fill="#c4acee"/>
        <rect x="5" y="7" width="2" height="3" fill="#5c3fa0"/>
        <rect x="9" y="7" width="2" height="3" fill="#5c3fa0"/>
        <rect x="5" y="7" width="1" height="1" fill="#fff" opacity=".8"/>
        <rect x="9" y="7" width="1" height="1" fill="#fff" opacity=".8"/>
      </svg>`,
      // ranita
      `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated" width="48" height="48">
        <rect x="2" y="1" width="4" height="4" fill="#4a8a3a"/>
        <rect x="10" y="1" width="4" height="4" fill="#4a8a3a"/>
        <rect x="3" y="2" width="2" height="2" fill="#1a1a1a"/>
        <rect x="11" y="2" width="2" height="2" fill="#1a1a1a"/>
        <rect x="2" y="4" width="12" height="9" fill="#5aaa46"/>
        <rect x="4" y="6" width="8" height="6" fill="#8dcc70"/>
        <rect x="5" y="9" width="6" height="1" fill="#3a6a2a"/>
      </svg>`,
    ];

    const svg =
      LOADER_PET_SVGS[Math.floor(Math.random() * LOADER_PET_SVGS.length)];
    const pet = document.createElement("div");
    Object.assign(pet.style, {
      position: "fixed",
      zIndex: "8600",
      bottom: "30px",
      left: 20 + Math.random() * 40 + "%",
      imageRendering: "pixelated",
      opacity: "0",
      pointerEvents: "none",
      filter: "drop-shadow(0 0 8px rgba(139,104,204,.5))",
      transition: "transform .3s",
    });
    pet.innerHTML = svg;
    document.body.appendChild(pet);

    // fade in
    gsap.to(pet, { opacity: 1, y: -8, duration: 0.6, ease: "back.out(2)" });

    // walk side to side during load
    let px = parseFloat(pet.style.left);
    let dir = 1;
    const walk = setInterval(() => {
      px += dir * (1.5 + Math.random());
      if (px > 70) {
        px = 70;
        dir = -1;
        pet.style.transform = "scaleX(-1)";
      }
      if (px < 10) {
        px = 10;
        dir = 1;
        pet.style.transform = "scaleX(1)";
      }
      pet.style.left = px + "%";
    }, 80);

    // bob
    gsap.to(pet, {
      y: -16,
      duration: 0.5,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });

    // disappear when loader ends (onDone callback)
    window.__loaderPet = pet;
    window.__loaderPetWalk = walk;
  })();

  const COLS = 25,
    ROWS = 25;
  const CW = Math.floor(SZ / COLS);
  const OX = Math.floor((SZ - COLS * CW) / 2);
  const OY = Math.floor((SZ - ROWS * CW) / 2);
  const CX = Math.floor(COLS / 2); // center col
  const CY = Math.floor(ROWS / 2); // center row

  // Colors
  const C_VOID = [0, 0, 0];
  const C_STONE = [110, 110, 115];
  const C_DIAMOND = [78, 220, 210];
  const C_GOLD = [230, 188, 50];
  const C_REDSTONE = [200, 40, 40];
  const C_DIRT = [121, 85, 54];
  const C_GRASS = [54, 110, 40];

  // Build "expanding square ring" order:
  // ring 0 = just center cell, ring 1 = cells 1 away, etc.
  // All cells in the same ring get scheduled together (with tiny jitter)
  const maxRing = Math.max(CX, CY, COLS - 1 - CX, ROWS - 1 - CY);
  const rings = []; // rings[r] = array of cell indices at manhattan-ish ring r
  for (let r = 0; r <= maxRing; r++) rings.push([]);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      // Chebyshev distance = max(|dx|,|dy|) → perfect square expansion
      const ring = Math.max(Math.abs(col - CX), Math.abs(row - CY));
      rings[ring].push(row * COLS + col);
    }
  }

  // Decide mineral & grass cells
  const mineralMap = {};
  for (let i = 0; i < COLS * ROWS; i++) {
    if (Math.random() < 0.07) {
      const m = Math.random();
      mineralMap[i] = m < 0.33 ? C_DIAMOND : m < 0.66 ? C_GOLD : C_REDSTONE;
    }
  }
  // Outer 35% of rings get grass
  const grassRingThreshold = Math.floor(maxRing * 0.62);
  const grassSet = new Set();
  for (let r = grassRingThreshold; r <= maxRing; r++) {
    rings[r].forEach((ci) => {
      if (Math.random() < 0.6) grassSet.add(ci);
    });
  }

  // Cell display state
  const cells = Array.from({ length: COLS * ROWS }, () => ({
    r: 0,
    g: 0,
    b: 0,
    tr: 0,
    tg: 0,
    tb: 0,
    t: 1,
  }));

  function setCell(i, rgb) {
    const c = cells[i];
    c.tr = rgb[0];
    c.tg = rgb[1];
    c.tb = rgb[2];
    c.t = 0;
  }

  // Draw loop
  let animRunning = true;
  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      if (c.t < 1) {
        c.t += 0.22;
        if (c.t > 1) c.t = 1;
        c.r = Math.round(c.r + (c.tr - c.r) * c.t);
        c.g = Math.round(c.g + (c.tg - c.g) * c.t);
        c.b = Math.round(c.b + (c.tb - c.b) * c.t);
      }
      const col = i % COLS,
        row = Math.floor(i / COLS);
      ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctx.fillRect(OX + col * CW, OY + row * CW, CW, CW);
    }
    if (animRunning) requestAnimationFrame(drawFrame);
  }
  requestAnimationFrame(drawFrame);

  // Tip rotation
  let tipIdx = 0;
  const tipIv = setInterval(() => {
    tipIdx = (tipIdx + 1) % MC_TIPS.length;
    tipEl.style.opacity = "0";
    setTimeout(() => {
      tipEl.textContent = MC_TIPS[tipIdx];
      tipEl.style.opacity = "1";
    }, 200);
  }, 1400);

  // ── WAVE RUNNER ───────────────────────────────────────────────────
  // Each wave applies a color to all rings in sequence
  // ring delay: base + ring_index * ringStep (ms), with tiny random jitter per cell
  let doneCells = 0;
  const total = COLS * ROWS;

  function runWave(colorFn, ringBaseDelay, ringStep, onWaveDone) {
    let ringsLeft = rings.length;
    rings.forEach((ring, ri) => {
      const ringDelay = ringBaseDelay + ri * ringStep;
      setTimeout(() => {
        ring.forEach((ci) => {
          const jitter = Math.random() * 18;
          setTimeout(() => {
            setCell(ci, colorFn(ci));
          }, jitter);
        });
        if (ri === rings.length - 1) {
          // wait for last ring + jitter + lerp to finish
          setTimeout(onWaveDone, 80);
        }
      }, ringDelay);
    });
  }

  // WAVE 1: STONE (fast, ~600ms total)
  let stoneSettled = 0;
  runWave(
    (ci) => (mineralMap[ci] ? mineralMap[ci] : C_STONE),
    0,
    650,
    () => {
      pctTxt.textContent = "33%";
      // WAVE 2: DIRT
      setTimeout(() => {
        runWave(
          () => C_DIRT,
          0,
          350,
          () => {
            pctTxt.textContent = "67%";
            // WAVE 3: GRASS (only grassSet cells)
            let gi = 0;
            const grassCells = [...grassSet];
            // group grass by ring too
            const grassByRing = [];
            rings.forEach((ring, ri) => {
              grassByRing.push(ring.filter((ci) => grassSet.has(ci)));
            });
            let grDone = 0;
            grassByRing.forEach((ring, ri) => {
              if (!ring.length) {
                grDone++;
                if (grDone === grassByRing.length) finish();
                return;
              }
              const d = ri * 120;
              setTimeout(() => {
                ring.forEach((ci) => {
                  setTimeout(() => setCell(ci, C_GRASS), Math.random() * 20);
                });
                grDone++;
                const gpct =
                  67 + Math.round((grDone / grassByRing.length) * 33);
                pctTxt.textContent = Math.min(gpct, 99) + "%";
                if (grDone === grassByRing.length) setTimeout(finish, 100);
              }, d);
            });
          },
        );
      }, 120);
    },
  );

  // Live pct update during stone wave
  let stonePct = 0;
  const stoneTick = setInterval(() => {
    stonePct = Math.min(stonePct + 1, 33);
    if (stonePct < 33) pctTxt.textContent = stonePct + "%";
    else clearInterval(stoneTick);
  }, 150);

  function finish() {
    clearInterval(tipIv);
    clearInterval(stoneTick);
    pctTxt.textContent = "100%";
    // remove loader pet
    if (window.__loaderPet) {
      clearInterval(window.__loaderPetWalk);
      gsap.to(window.__loaderPet, {
        opacity: 0,
        y: 20,
        duration: 0.4,
        onComplete: () => window.__loaderPet.remove(),
      });
    }
    setTimeout(() => {
      animRunning = false;
      gsap.to(mcEl, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          mcEl.classList.remove("show");
          mcEl.style.opacity = "";
          onDone();
        },
      });
    }, 450);
  }
}

/* ════════════════════════
   IMAGE ENTRANCE ANIMATIONS
   (photo-slot, gif-slot, game-card images)
════════════════════════ */
const IMG_ANIMS = ["glitch", "bounce", "drag", "slide", "pixelate"];

function animateImage(el, type) {
  el.style.opacity = "1";
  switch (type) {
    case "glitch":
      // rapid offset flicker then settle
      gsap
        .timeline()
        .fromTo(
          el,
          { opacity: 0, filter: "brightness(3) hue-rotate(90deg)", x: -8 },
          {
            opacity: 1,
            filter: "brightness(1) hue-rotate(0deg)",
            x: 0,
            duration: 0.12,
          },
        )
        .to(el, { x: 6, filter: "brightness(2)", duration: 0.06 })
        .to(el, { x: -4, duration: 0.06 })
        .to(el, { x: 0, filter: "none", duration: 0.1 });
      break;
    case "bounce":
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.5, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(2)" },
      );
      break;
    case "drag":
      // appears as if dragged in by cursor
      const fromX = Math.random() < 0.5 ? -120 : 120;
      gsap
        .timeline()
        .fromTo(
          el,
          { opacity: 0, x: fromX, rotation: fromX > 0 ? 12 : -12 },
          { opacity: 1, x: 0, rotation: 0, duration: 0.6, ease: "power3.out" },
        )
        .to(el, { y: -8, duration: 0.12, ease: "power1.out" })
        .to(el, { y: 0, duration: 0.2, ease: "bounce.out" });
      break;
    case "slide":
      gsap.fromTo(
        el,
        { opacity: 0, clipPath: "inset(0 100% 0 0)" },
        {
          opacity: 1,
          clipPath: "inset(0 0% 0 0)",
          duration: 0.65,
          ease: "power3.out",
        },
      );
      break;
    case "pixelate":
      // scale up from tiny pixelated
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.1, filter: "blur(12px)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.55,
          ease: "back.out(1.7)",
        },
      );
      break;
  }
}

// assign random animation to each image container on scroll
document
  .querySelectorAll(".hero-photo,.hero-photo-sm,.gif-slot")
  .forEach((el, i) => {
    const anim = IMG_ANIMS[i % IMG_ANIMS.length];
    gsap.set(el, { opacity: 0 });
    ScrollTrigger.create({
      trigger: el.closest(".scene") || el,
      start: "top 88%",
      end: "bottom 5%",
      onEnter: () => animateImage(el, anim),
      onLeaveBack: () =>
        gsap.set(el, { opacity: 0, clearProps: "transform,filter,clipPath" }),
    });
  });

// game cards: stagger fade+scale, stay visible while scene is on screen
document.querySelectorAll(".game-card").forEach((card, i) => {
  gsap.fromTo(
    card,
    { opacity: 0, y: 24, scale: 0.93 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      delay: i * 0.08,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: card.closest(".scene"),
        start: "top 88%",
        end: "bottom 5%",
        toggleActions: "play reverse play reverse",
      },
    },
  );
});

/* ════════════════════════
   TYPEWRITER UTILITY
════════════════════════ */
function typewriter(el, duration = 1.4) {
  const txt = el.textContent;
  el.textContent = "";
  el.style.opacity = 1;
  let i = 0;
  const chars = txt.split("");
  const delay = (duration / chars.length) * 1000;
  function next() {
    if (i >= chars.length) return;
    el.textContent += chars[i++];
    setTimeout(next, delay + Math.random() * 30 - 15);
  }
  next();
}

/* text glitch-in utility */
const GLITCH_CHARS = "█▓▒░#@&%$!?";
function glitchIn(el, duration = 900) {
  const txt = el.textContent;
  el.style.opacity = 1;
  const steps = 10;
  let step = 0;
  const iv = setInterval(() => {
    const progress = step / steps;
    el.textContent = txt
      .split("")
      .map((c, i) => {
        if (c === " ") return " ";
        if (i / txt.length < progress) return c;
        return Math.random() > 0.5
          ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          : c;
      })
      .join("");
    step++;
    if (step > steps) {
      el.textContent = txt;
      clearInterval(iv);
    }
  }, duration / steps);
}

/* slide-in from side utility */
function slideIn(el, fromLeft = true) {
  gsap.fromTo(
    el,
    { opacity: 0, x: fromLeft ? -40 : 40, filter: "blur(4px)" },
    {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      duration: 0.75,
      ease: "power3.out",
    },
  );
}

/* ════════════════════════
   SCROLL ANIMATIONS
   (bidireccional + animaciones de texto mixtas)
════════════════════════ */
// scene blur transition — longer visible window
document.querySelectorAll(".scene").forEach((scene) => {
  const isFinal = scene.classList.contains("scene-final");
  gsap.fromTo(
    scene,
    { filter: "blur(7px)", opacity: 0.55 },
    {
      filter: "blur(0px)",
      opacity: 1,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: scene,
        start: "top 95%",
        end: isFinal ? "bottom bottom" : "bottom 5%",
        toggleActions: isFinal
          ? "play none none none"
          : "play reverse play reverse",
      },
    },
  );
});

// per-element reveal — each element has its own animation style
document.querySelectorAll(".scene").forEach((scene, si) => {
  const isFinal = scene.classList.contains("scene-final");

  // s-eye: typewriter
  scene.querySelectorAll(".s-eye").forEach((el) => {
    const txt = el.textContent;
    gsap.set(el, { opacity: 0 });
    ScrollTrigger.create({
      trigger: scene,
      start: "top 78%",
      end: "top -30%",
      onEnter: () => {
        typewriter(el, 1.1);
      },
      onLeaveBack: () => {
        gsap.set(el, { opacity: 0 });
        el.textContent = txt;
      },
    });
  });

  // s-h: glitch-in alternating left/right
  scene.querySelectorAll(".s-h").forEach((el, i) => {
    const txt = el.innerHTML;
    gsap.set(el, { opacity: 0 });
    ScrollTrigger.create({
      trigger: scene,
      start: "top 75%",
      end: "top -30%",
      onEnter: () => {
        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50,
            skewX: i % 2 === 0 ? -4 : 4,
          },
          {
            opacity: 1,
            x: 0,
            skewX: 0,
            duration: 0.8,
            ease: "power3.out",
            onComplete: () => {
              /* brief glitch flash */ gsap.fromTo(
                el,
                { filter: "blur(2px)" },
                { filter: "blur(0px)", duration: 0.15 },
              );
            },
          },
        );
      },
      onLeaveBack: () => {
        gsap.to(el, { opacity: 0, x: i % 2 === 0 ? -30 : 30, duration: 0.35 });
      },
    });
  });

  // s-p: fade up with blur, staggered words
  scene.querySelectorAll(".s-p").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 24, filter: "blur(5px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: scene,
          start: "top 72%",
          end: "top -45%",
          toggleActions: "play reverse play reverse",
        },
      },
    );
  });

  // other elements: normal stagger
  const others = scene.querySelectorAll(
    ".s-div,.tags,.np,.artist-grid,.game-grid,.wbtns,.lstack,footer,.quote-block,.video-slot,.hero-layout",
  );
  gsap.fromTo(
    others,
    { opacity: 0, y: 30, filter: "blur(4px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.75,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: scene,
        start: "top 70%",
        end: "bottom 8%",
        toggleActions: "play reverse play reverse",
      },
    },
  );
});

// decorative labels: appear with tilt wiggle, reverse back
document.querySelectorAll(".label-sticker").forEach((el) => {
  const rot = parseFloat(
    (el.style.transform.match(/rotate\(([-\d.]+)deg\)/) || [0, 0])[1],
  );
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.6, rotation: rot - 10, y: 10 },
    {
      opacity: 1,
      scale: 1,
      rotation: rot,
      y: 0,
      duration: 0.6,
      ease: "back.out(2)",
      scrollTrigger: {
        trigger: el.closest(".scene"),
        start: "top 88%",
        end: "bottom 8%",
        toggleActions: "play reverse play reverse",
      },
    },
  );
});

// game cards stagger — slide in from bottom alternating
document.querySelectorAll(".game-card").forEach((card, i) => {
  gsap.fromTo(
    card,
    { opacity: 0, y: 35, scale: 0.9, rotation: i % 2 === 0 ? -2 : 2 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.6,
      delay: i * 0.08,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: card.closest(".scene"),
        start: "top 85%",
        end: "bottom 8%",
        toggleActions: "play reverse play reverse",
      },
    },
  );
});

// artist cards slide alternating
document.querySelectorAll(".artist-card").forEach((card, i) => {
  gsap.fromTo(
    card,
    { opacity: 0, x: i % 2 === 0 ? -30 : 30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.55,
      delay: i * 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card.closest(".scene"),
        start: "top 85%",
        end: "bottom 8%",
        toggleActions: "play reverse play reverse",
      },
    },
  );
});

/* ════════════════════════
   GHOST CURSOR (fantasma)
   Aparece solo, arrastra elementos, desaparece
════════════════════════ */
const ghost = document.createElement("div");
ghost.id = "ghost-cursor";
Object.assign(ghost.style, {
  position: "fixed",
  width: "14px",
  height: "16px",
  pointerEvents: "none",
  zIndex: "9997",
  imageRendering: "pixelated",
  opacity: "0",
  transition: "opacity .4s",
  top: "0",
  left: "0",
  // mini cursor pixelado fantasma (más tenue)
  background: `url("data:image/svg+xml,%3Csvg width='14' height='16' viewBox='0 0 14 16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='1' y='0' width='2' height='2' fill='rgba(185,158,232,0.6)'/%3E%3Crect x='1' y='2' width='2' height='2' fill='rgba(185,158,232,0.6)'/%3E%3Crect x='1' y='4' width='2' height='2' fill='rgba(185,158,232,0.6)'/%3E%3Crect x='1' y='6' width='2' height='2' fill='rgba(185,158,232,0.4)'/%3E%3Crect x='3' y='2' width='2' height='2' fill='rgba(185,158,232,0.5)'/%3E%3Crect x='3' y='4' width='2' height='2' fill='rgba(185,158,232,0.4)'/%3E%3Crect x='5' y='4' width='2' height='2' fill='rgba(185,158,232,0.3)'/%3E%3Crect x='3' y='6' width='2' height='2' fill='rgba(185,158,232,0.35)'/%3E%3Crect x='3' y='8' width='2' height='2' fill='rgba(185,158,232,0.3)'/%3E%3Crect x='5' y='8' width='2' height='2' fill='rgba(185,158,232,0.25)'/%3E%3C/svg%3E") no-repeat`,
  backgroundSize: "contain",
  willChange: "transform",
});
document.body.appendChild(ghost);

// ghost cursor "trail" dot
const ghostTrail = document.createElement("div");
Object.assign(ghostTrail.style, {
  position: "fixed",
  width: "20px",
  height: "20px",
  border: "1px solid rgba(185,158,232,.3)",
  borderRadius: "50%",
  pointerEvents: "none",
  zIndex: "9996",
  opacity: "0",
  transition: "opacity .4s",
  transform: "translate(-50%,-50%)",
  top: "0",
  left: "0",
});
document.body.appendChild(ghostTrail);

let ghostActive = false;
let ghostRaf;

function runGhost() {
  if (ghostActive) return;
  ghostActive = true;

  // pick a random draggable target visible in viewport
  const candidates = [
    ...document.querySelectorAll(".label-sticker,.tag,.game-card,.artist-card"),
  ].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.top > 0 && r.bottom < window.innerHeight && r.left > 0;
  });

  if (!candidates.length) {
    ghostActive = false;
    return;
  }
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  const tr = target.getBoundingClientRect();

  // start ghost at random edge of screen
  let gx = Math.random() < 0.5 ? -40 : window.innerWidth + 40;
  let gy = Math.random() * window.innerHeight * 0.7 + window.innerHeight * 0.1;

  ghost.style.opacity = "1";
  ghostTrail.style.opacity = "1";

  const targetX = tr.left + tr.width / 2;
  const targetY = tr.top + tr.height / 2;

  // move ghost to target
  gsap.to(
    { x: gx, y: gy },
    {
      x: targetX,
      y: targetY,
      duration: 1.8 + Math.random() * 0.8,
      ease: "power2.inOut",
      onUpdate: function () {
        gx = this.targets()[0].x;
        gy = this.targets()[0].y;
        ghost.style.transform = `translate(${gx}px,${gy}px)`;
        ghostTrail.style.left = gx + "px";
        ghostTrail.style.top = gy + "px";
      },
      onComplete: () => {
        // "grab" — wiggle the target
        gsap
          .timeline()
          .to(target, {
            scale: 1.06,
            rotation: "+=3",
            duration: 0.15,
            ease: "power2.out",
          })
          .to(target, { scale: 1, rotation: "-=3", duration: 0.12 })
          // drag it a little
          .to(target, {
            x: (Math.random() - 0.5) * 40,
            y: (Math.random() - 0.5) * 20,
            duration: 0.6,
            ease: "power2.inOut",
          })
          .to(target, { x: 0, y: 0, duration: 0.5, ease: "back.out(1.5)" });

        // ghost moves away
        setTimeout(() => {
          const exitX = Math.random() < 0.5 ? -60 : window.innerWidth + 60;
          const exitY = Math.random() * window.innerHeight;
          gsap.to(
            { x: gx, y: gy },
            {
              x: exitX,
              y: exitY,
              duration: 1.4,
              ease: "power2.in",
              onUpdate: function () {
                ghost.style.transform = `translate(${this.targets()[0].x}px,${this.targets()[0].y}px)`;
                ghostTrail.style.left = this.targets()[0].x + "px";
                ghostTrail.style.top = this.targets()[0].y + "px";
              },
              onComplete: () => {
                ghost.style.opacity = "0";
                ghostTrail.style.opacity = "0";
                ghostActive = false;
              },
            },
          );
        }, 800);
      },
    },
  );
}

// trigger ghost every 7-14 seconds, only when main is visible
function scheduleGhost() {
  setTimeout(
    () => {
      if (mainEl.classList.contains("on")) runGhost();
      scheduleGhost();
    },
    7000 + Math.random() * 7000,
  );
}
scheduleGhost();

/* ════════════════════════
   DRAGGABLE CMD WINDOWS
════════════════════════ */
let zTop = 5000;
function openW(id, btn) {
  const win = document.getElementById(id);
  if (win.classList.contains("open")) {
    closeW(id);
    return;
  }
  const r = btn.getBoundingClientRect();
  const left = Math.min(r.left, window.innerWidth - 360);
  const top = r.top - 310 < 20 ? r.bottom + 10 : r.top - 310;
  win.style.left = left + "px";
  win.style.top = Math.max(10, top) + "px";
  win.classList.add("open");
  bringTop(win);
}
function closeW(id) {
  document.getElementById(id).classList.remove("open");
}
function bringTop(w) {
  w.style.zIndex = ++zTop;
}

document.querySelectorAll(".wbar").forEach((bar) => {
  let drag = false,
    ox = 0,
    oy = 0;
  bar.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("wd")) return;
    drag = true;
    const win = bar.parentElement;
    bringTop(win);
    const r = win.getBoundingClientRect();
    ox = e.clientX - r.left;
    oy = e.clientY - r.top;
    e.preventDefault();
  });
  document.addEventListener("mousemove", (e) => {
    if (!drag) return;
    const win = bar.parentElement;
    win.style.left = e.clientX - ox + "px";
    win.style.top = Math.max(0, e.clientY - oy) + "px";
  });
  document.addEventListener("mouseup", () => (drag = false));
  // touch drag
  bar.addEventListener(
    "touchstart",
    (e) => {
      if (e.target.classList.contains("wd")) return;
      drag = true;
      const win = bar.parentElement;
      bringTop(win);
      const t = e.touches[0],
        r = win.getBoundingClientRect();
      ox = t.clientX - r.left;
      oy = t.clientY - r.top;
    },
    { passive: true },
  );
  document.addEventListener(
    "touchmove",
    (e) => {
      if (!drag) return;
      const t = e.touches[0],
        win = bar.parentElement;
      win.style.left = t.clientX - ox + "px";
      win.style.top = Math.max(0, t.clientY - oy) + "px";
    },
    { passive: true },
  );
  document.addEventListener("touchend", () => (drag = false));
});
document
  .querySelectorAll(".cmdw")
  .forEach((w) => w.addEventListener("mousedown", () => bringTop(w)));

/* ════════════════════════
   MINI PET AI — 3 pets, one chosen at random
════════════════════════ */
(function () {
  const pet = document.getElementById("pet");
  const bubble = document.getElementById("pet-bubble");
  if (!pet) return;

  // ── PET DEFINITIONS ──────────────────────────────────────────────
  const PETS = {
    // 🐱 gato negro
    cat: {
      size: 54,
      svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated">
        <rect x="3" y="5" width="10" height="9" fill="#1a1a1a"/>
        <rect x="3" y="3" width="2" height="3" fill="#1a1a1a"/>
        <rect x="11" y="3" width="2" height="3" fill="#1a1a1a"/>
        <rect x="4" y="3" width="1" height="2" fill="#3a3a3a"/>
        <rect x="11" y="3" width="1" height="2" fill="#3a3a3a"/>
        <rect x="5" y="7" width="2" height="2" fill="#8b68cc"/>
        <rect x="9" y="7" width="2" height="2" fill="#8b68cc"/>
        <rect x="5" y="7" width="1" height="1" fill="#d0c0ff"/>
        <rect x="9" y="7" width="1" height="1" fill="#d0c0ff"/>
        <rect x="7" y="10" width="2" height="1" fill="#3a3a3a"/>
        <rect x="13" y="9" width="2" height="2" fill="#1a1a1a"/>
        <rect x="14" y="7" width="1" height="2" fill="#1a1a1a"/>
        <rect x="4" y="14" width="2" height="1" fill="#111"/>
        <rect x="10" y="14" width="2" height="1" fill="#111"/>
        <rect x="4" y="10" width="1" height="1" fill="#e8a0c0" opacity="0.5"/>
        <rect x="11" y="10" width="1" height="1" fill="#e8a0c0" opacity="0.5"/>
        <rect x="5" y="5" width="1" height="1" fill="#222"/>
        <rect x="10" y="5" width="1" height="1" fill="#222"/>
      </svg>`,
      messages: [
        "nyaa~",
        "..zZz",
        "*te mira*",
        "waa!",
        ":3",
        "*ronronea*",
        "<3",
        "uwu",
        "miau",
        "*le ojos brillan*",
      ],
      reactMsgs: ["AH!", "OwO!!", "miau!!", "waa~", "eek!"],
      idleAnim(el) {
        el.style.marginBottom = Math.sin(Date.now() * 0.003) * 3 + "px";
      },
    },
    // 🐭 ratoncito blanco
    mouse: {
      size: 40,
      svg: `<svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated">
        <!-- ears -->
        <rect x="3" y="0" width="4" height="4" fill="#f0f0f0"/>
        <rect x="11" y="0" width="4" height="4" fill="#f0f0f0"/>
        <rect x="4" y="1" width="2" height="2" fill="#ffb0c0"/>
        <rect x="12" y="1" width="2" height="2" fill="#ffb0c0"/>
        <!-- body -->
        <rect x="2" y="4" width="14" height="9" fill="#f5f5f5"/>
        <!-- belly -->
        <rect x="5" y="6" width="8" height="6" fill="#ffe0e8"/>
        <!-- eyes -->
        <rect x="5" y="6" width="2" height="2" fill="#ff6090"/>
        <rect x="11" y="6" width="2" height="2" fill="#ff6090"/>
        <rect x="5" y="6" width="1" height="1" fill="#fff" opacity=".6"/>
        <rect x="11" y="6" width="1" height="1" fill="#fff" opacity=".6"/>
        <!-- nose -->
        <rect x="8" y="9" width="2" height="1" fill="#ff8080"/>
        <!-- whiskers -->
        <rect x="2" y="8" width="3" height="1" fill="#ccc" opacity=".7"/>
        <rect x="13" y="8" width="3" height="1" fill="#ccc" opacity=".7"/>
        <rect x="1" y="9" width="4" height="1" fill="#ccc" opacity=".5"/>
        <rect x="13" y="9" width="4" height="1" fill="#ccc" opacity=".5"/>
        <!-- legs -->
        <rect x="3" y="13" width="2" height="2" fill="#f0c0c8"/>
        <rect x="13" y="13" width="2" height="2" fill="#f0c0c8"/>
        <!-- tail (pink) -->
        <rect x="15" y="10" width="2" height="1" fill="#ffb0c0"/>
        <rect x="16" y="9" width="1" height="2" fill="#ffb0c0"/>
        <rect x="16" y="8" width="1" height="1" fill="#ffb0c0"/>
      </svg>`,
      messages: [
        "squeak!",
        "*olfatea*",
        "🧀?",
        "...",
        "*corre*",
        "chiuu~",
        "hola!",
        "*tiembla*",
        "squeak squeak",
        "eek!",
      ],
      reactMsgs: ["SQUEAK!", "eeeek!", "!", "chiuu!", "😱"],
      idleAnim(el) {
        const t = Date.now() * 0.005;
        el.style.marginBottom = Math.sin(t) * 2 + "px";
        // wiggle nose effect — subtle scale
        el.style.transform =
          (el.style.transform || "").replace(/scaleX\([^)]+\)/, "").trim() +
          ` scaleX(${el._facingRight === false ? -1 : 1})`;
      },
    },
    // 👻 fantasmita
    ghost: {
      size: 54,
      svg: `<svg viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated">
        <rect x="4" y="2" width="8" height="2" fill="#c4acee"/>
        <rect x="3" y="4" width="10" height="9" fill="#c4acee"/>
        <rect x="2" y="5" width="12" height="7" fill="#c4acee"/>
        <rect x="3" y="13" width="2" height="2" fill="#c4acee"/>
        <rect x="7" y="13" width="2" height="3" fill="#c4acee"/>
        <rect x="11" y="13" width="2" height="2" fill="#c4acee"/>
        <rect x="5" y="7" width="2" height="3" fill="#5c3fa0"/>
        <rect x="9" y="7" width="2" height="3" fill="#5c3fa0"/>
        <rect x="5" y="7" width="1" height="1" fill="#fff" opacity=".8"/>
        <rect x="9" y="7" width="1" height="1" fill="#fff" opacity=".8"/>
        <rect x="6" y="11" width="4" height="1" fill="#5c3fa0"/>
      </svg>`,
      messages: [
        "boo~",
        "...",
        "wooOoo",
        "👻",
        "im free",
        "spooky?",
        "hola?",
        "boo!",
        "*flota*",
        "UuuU",
      ],
      reactMsgs: ["BOO!", "!!", "aaaa", "woooo", "!?"],
      idleAnim(el) {
        const t = Date.now() * 0.002;
        el.style.marginBottom = Math.sin(t) * 5 + "px";
        el.style.opacity = 0.75 + Math.sin(t * 0.7) * 0.25 + "";
      },
    },
    // 🐸 ranita lo-fi
    frog: {
      size: 54,
      svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated">
        <rect x="2" y="1" width="4" height="4" fill="#4a8a3a"/>
        <rect x="10" y="1" width="4" height="4" fill="#4a8a3a"/>
        <rect x="3" y="2" width="2" height="2" fill="#1a1a1a"/>
        <rect x="11" y="2" width="2" height="2" fill="#1a1a1a"/>
        <rect x="3" y="2" width="1" height="1" fill="#fff" opacity=".8"/>
        <rect x="11" y="2" width="1" height="1" fill="#fff" opacity=".8"/>
        <rect x="2" y="4" width="12" height="9" fill="#5aaa46"/>
        <rect x="4" y="6" width="8" height="6" fill="#8dcc70"/>
        <rect x="0" y="11" width="3" height="2" fill="#4a8a3a"/>
        <rect x="13" y="11" width="3" height="2" fill="#4a8a3a"/>
        <rect x="0" y="13" width="4" height="1" fill="#4a8a3a"/>
        <rect x="12" y="13" width="4" height="1" fill="#4a8a3a"/>
        <rect x="5" y="9" width="6" height="1" fill="#3a6a2a"/>
        <rect x="6" y="10" width="4" height="1" fill="#3a6a2a"/>
        <rect x="3" y="7" width="2" height="1" fill="#f0a0a0" opacity=".5"/>
        <rect x="11" y="7" width="2" height="1" fill="#f0a0a0" opacity=".5"/>
      </svg>`,
      messages: [
        "ribbit",
        "...",
        "🐸",
        "*piensa*",
        "croac",
        "ribbit!",
        "*splash*",
        "zzz",
      ],
      reactMsgs: ["RIBBIT!", "!", "croac!", "!!", "rana.exe"],
      idleAnim(el) {
        el.style.marginBottom = Math.sin(Date.now() * 0.0015) * 2 + "px";
      },
    },
  };

  // pick random pet
  const petKeys = Object.keys(PETS);
  const chosen = PETS[petKeys[Math.floor(Math.random() * petKeys.length)]];
  pet.innerHTML = chosen.svg;
  pet.style.width = chosen.size + "px";

  const MESSAGES = chosen.messages;
  const REACT_MSGS = chosen.reactMsgs;

  // ── PET STATE MACHINE ─────────────────────────────────────────────
  let petX = 80,
    petY = window.innerHeight - 160;
  let targetX = petX,
    targetY = petY;
  let vx = 0,
    vy = 0;
  let facingRight = true;
  let state = "wander";
  let stateTimer = 0;
  let bubbleTimer = null;
  let isMainOn = false;
  let lastMx = window.innerWidth / 2,
    lastMy = window.innerHeight / 2;

  function setPetPos(x, y) {
    petX = x;
    petY = y;
    pet.style.left = x + "px";
    pet.style.bottom = window.innerHeight - y - chosen.size + "px";
    bubble.style.left = x + (facingRight ? chosen.size + 4 : -116) + "px";
    bubble.style.bottom = window.innerHeight - y - 18 + "px";
  }
  function flip(right) {
    if (facingRight === right) return;
    facingRight = right;
    pet._facingRight = right;
    pet.style.transform = right ? "scaleX(1)" : "scaleX(-1)";
  }
  function showBubble(msg, dur = 1800) {
    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubble.textContent = msg;
    bubble.style.opacity = "1";
    bubbleTimer = setTimeout(() => (bubble.style.opacity = "0"), dur);
  }
  function squish() {
    gsap
      .timeline()
      .to(pet, { scaleY: 0.7, scaleX: 1.2, duration: 0.08 })
      .to(pet, { scaleY: 1.1, scaleX: 0.9, duration: 0.1 })
      .to(pet, {
        scaleY: 1,
        scaleX: 1,
        duration: 0.14,
        ease: "elastic.out(1,.4)",
      });
  }
  function bounce() {
    gsap.to(pet, {
      y: -16,
      duration: 0.2,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  }

  function newTarget() {
    const margin = 60;
    targetX = margin + Math.random() * (window.innerWidth - margin * 2);
    targetY =
      window.innerHeight * 0.35 + Math.random() * (window.innerHeight * 0.55);
    stateTimer = 2500 + Math.random() * 5000;
  }

  let lastTime = 0;
  function loop(ts) {
    if (!isMainOn) {
      requestAnimationFrame(loop);
      return;
    }
    const dt = Math.min(ts - lastTime, 80);
    lastTime = ts;

    // respect hover freeze
    if (window.__petFrozen) {
      requestAnimationFrame(loop);
      return;
    }

    // external scared trigger (from hover reaction)
    if (window.__petScared && state !== "scared") {
      state = "scared";
      stateTimer = 1500 + Math.random() * 500;
      window.__petScared = false;
    }

    stateTimer -= dt;
    chosen.idleAnim(pet);

    if (state === "wander") {
      const dx = targetX - petX,
        dy = targetY - petY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 8 || stateTimer < 0) {
        state = "idle";
        stateTimer = 1200 + Math.random() * 3500;
        vx = 0;
        vy = 0;
        squish();
        if (Math.random() < 0.45)
          showBubble(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]);
      } else {
        const spd = 1.3;
        vx += ((dx / dist) * spd - vx) * 0.16;
        vy += ((dy / dist) * spd - vy) * 0.16;
        flip(dx > 0);
      }
    } else if (state === "idle") {
      vx *= 0.82;
      vy *= 0.82;
      if (stateTimer < 0) {
        state = "wander";
        newTarget();
        if (Math.random() < 0.3) bounce();
      }
    } else if (state === "scared") {
      const cx = lastMx,
        cy = window.innerHeight - lastMy;
      const dx = petX - cx,
        dy = petY - cy,
        d = Math.sqrt(dx * dx + dy * dy) || 1;
      vx += ((dx / d) * 3.2 - vx) * 0.2;
      vy += ((dy / d) * 3.2 - vy) * 0.2;
      flip(vx > 0);
      if (stateTimer < 0) {
        state = "wander";
        newTarget();
      }
    }

    petX += vx;
    petY += vy;
    petX = Math.max(10, Math.min(window.innerWidth - chosen.size - 10, petX));
    petY = Math.max(
      window.innerHeight * 0.28,
      Math.min(window.innerHeight - 54, petY),
    );
    setPetPos(petX, petY);

    requestAnimationFrame(loop);
  }

  document.addEventListener("mousemove", (e) => {
    lastMx = e.clientX;
    lastMy = e.clientY;
  });
  setInterval(() => {
    if (!isMainOn) return;
    const cx = lastMx,
      cy = window.innerHeight - lastMy;
    const d = Math.sqrt((petX - cx) ** 2 + (petY - cy) ** 2);
    if (d < 75 && state !== "scared") {
      state = "scared";
      stateTimer = 1000 + Math.random() * 700;
      showBubble(
        REACT_MSGS[Math.floor(Math.random() * REACT_MSGS.length)],
        900,
      );
      squish();
    }
  }, 200);

  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const s = window.scrollY;
    if (Math.abs(s - lastScroll) > 50) {
      squish();
      if (Math.random() < 0.3)
        showBubble(MESSAGES[Math.floor(Math.random() * MESSAGES.length)], 1200);
    }
    lastScroll = s;
  });

  document.addEventListener("click", (e) => {
    if (!isMainOn) return;
    squish();
    const dx = e.clientX - petX,
      dy = window.innerHeight - e.clientY - petY;
    if (Math.sqrt(dx * dx + dy * dy) < 130) {
      showBubble(
        REACT_MSGS[Math.floor(Math.random() * REACT_MSGS.length)],
        1000,
      );
      bounce();
    }
  });
  document.addEventListener(
    "touchstart",
    (e) => {
      if (!isMainOn) return;
      squish();
      if (Math.random() < 0.3)
        showBubble(MESSAGES[Math.floor(Math.random() * MESSAGES.length)], 1200);
    },
    { passive: true },
  );

  const waitMain = setInterval(() => {
    const m = document.getElementById("main");
    if (m) {
      clearInterval(waitMain);
      new MutationObserver(() => {
        if (m.classList.contains("on") && !isMainOn) {
          isMainOn = true;
          newTarget();
          requestAnimationFrame(loop);
          setTimeout(() => showBubble(MESSAGES[0], 2200), 900);
        }
      }).observe(m, { attributes: true, attributeFilter: ["class"] });
    }
  }, 100);
  setTimeout(() => {
    if (!isMainOn && mainEl && mainEl.classList.contains("on")) {
      isMainOn = true;
      newTarget();
      requestAnimationFrame(loop);
    }
  }, 6000);
  setInterval(() => {
    if (isMainOn && state === "idle" && Math.random() < 0.55)
      showBubble(MESSAGES[Math.floor(Math.random() * MESSAGES.length)], 2000);
  }, 13000);
  setPetPos(petX, petY);
})();

/* ════════════════════════
   PIXEL TRAIL (mouse fast move)
════════════════════════ */
(function () {
  const TRAIL_COLORS = [
    "#8b68cc",
    "#c4acee",
    "#5c3fa0",
    "#b99ee8",
    "#ddd0ff",
    "#6b4fa8",
  ];
  let lastX = 0,
    lastY = 0,
    lastT = 0;
  let pool = []; // reuse DOM nodes

  function getNode() {
    const n = document.createElement("div");
    n.className = "px-trail";
    document.body.appendChild(n);
    return n;
  }

  function spawnTrail(x, y, speed) {
    // more pixels when faster
    const count = Math.min(Math.floor(speed / 12), 5);
    for (let i = 0; i < count; i++) {
      const el = getNode();
      const ox = (Math.random() - 0.5) * 6;
      const oy = (Math.random() - 0.5) * 6;
      el.style.left = x + ox + "px";
      el.style.top = y + oy + "px";
      el.style.background =
        TRAIL_COLORS[Math.floor(Math.random() * TRAIL_COLORS.length)];
      // randomize size slightly (4 or 6px)
      const sz = Math.random() < 0.4 ? 6 : 4;
      el.style.width = sz + "px";
      el.style.height = sz + "px";
      el.style.animation = "none";
      el.offsetHeight; // reflow
      el.style.animation = "";
      setTimeout(() => {
        el.remove();
      }, 580);
    }
  }

  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dt = Math.max(now - lastT, 1);
    const speed = (Math.sqrt(dx * dx + dy * dy) / dt) * 16;

    if (speed > 8) spawnTrail(e.clientX, e.clientY, speed);

    lastX = e.clientX;
    lastY = e.clientY;
    lastT = now;
  });

  // touch trail too
  document.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      const now = Date.now();
      const dx = t.clientX - lastX;
      const dy = t.clientY - lastY;
      const dt = Math.max(now - lastT, 1);
      const speed = (Math.sqrt(dx * dx + dy * dy) / dt) * 16;
      if (speed > 5) spawnTrail(t.clientX, t.clientY, speed * 0.7);
      lastX = t.clientX;
      lastY = t.clientY;
      lastT = now;
    },
    { passive: true },
  );
})();

/* ════════════════════════
   PET EXPLOSION & CYCLE
   After 10 clicks → explode → spawn next pet
════════════════════════ */
(function () {
  const PET_ORDER = ["cat", "mouse", "ghost", "frog"];
  // shuffle so order is random each session
  for (let i = PET_ORDER.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [PET_ORDER[i], PET_ORDER[j]] = [PET_ORDER[j], PET_ORDER[i]];
  }

  let petClickCount = 0;
  let petIdx = 0; // index into PET_ORDER of current pet

  // We expose a global so the pet AI can register clicks on itself
  window.__petClicked = function () {
    petClickCount++;
    if (petClickCount >= 10) {
      petClickCount = 0;
      explodePet();
    }
  };

  function explodePet() {
    const pet = document.getElementById("pet");
    const bubble = document.getElementById("pet-bubble");
    if (!pet) return;

    // get pet position for particles
    const rect = pet.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // show explosion bubble
    bubble.textContent = "💥 *BOOM*";
    bubble.style.opacity = "1";

    // spawn explosion particles
    const EXPL_COLORS = [
      "#8b68cc",
      "#c4acee",
      "#ff6090",
      "#ffb0c0",
      "#fff",
      "#5c3fa0",
      "#b99ee8",
    ];
    for (let i = 0; i < 22; i++) {
      const p = document.createElement("div");
      p.className = "px-trail";
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 70;
      const tx = cx + Math.cos(angle) * dist;
      const ty = cy + Math.sin(angle) * dist;
      const sz = 4 + Math.floor(Math.random() * 3) * 2;
      p.style.cssText = `
        left:${cx}px; top:${cy}px;
        width:${sz}px; height:${sz}px;
        background:${EXPL_COLORS[Math.floor(Math.random() * EXPL_COLORS.length)]};
        z-index:9994;
        transition: left .4s ease, top .4s ease, opacity .5s ease;
      `;
      document.body.appendChild(p);
      requestAnimationFrame(() => {
        p.style.left = tx + "px";
        p.style.top = ty + "px";
        p.style.opacity = "0";
      });
      setTimeout(() => p.remove(), 520);
    }

    // hide current pet
    gsap.to(pet, {
      scale: 2,
      opacity: 0,
      duration: 0.25,
      ease: "power2.out",
      onComplete: () => {
        // advance to next pet
        petIdx = (petIdx + 1) % PET_ORDER.length;
        const nextKey = PET_ORDER[petIdx];
        spawnNewPet(nextKey, cx, cy);
        setTimeout(() => {
          bubble.style.opacity = "0";
        }, 1200);
      },
    });
  }

  function spawnNewPet(key, fromX, fromY) {
    const pet = document.getElementById("pet");
    const bubble = document.getElementById("pet-bubble");

    // PETS definition must be accessible — we re-define the SVGs here
    const SVGS = {
      cat: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated">
        <rect x="3" y="5" width="10" height="9" fill="#1a1a1a"/>
        <rect x="3" y="3" width="2" height="3" fill="#1a1a1a"/>
        <rect x="11" y="3" width="2" height="3" fill="#1a1a1a"/>
        <rect x="4" y="3" width="1" height="2" fill="#3a3a3a"/>
        <rect x="11" y="3" width="1" height="2" fill="#3a3a3a"/>
        <rect x="5" y="7" width="2" height="2" fill="#8b68cc"/>
        <rect x="9" y="7" width="2" height="2" fill="#8b68cc"/>
        <rect x="5" y="7" width="1" height="1" fill="#d0c0ff"/>
        <rect x="9" y="7" width="1" height="1" fill="#d0c0ff"/>
        <rect x="7" y="10" width="2" height="1" fill="#3a3a3a"/>
        <rect x="13" y="9" width="2" height="2" fill="#1a1a1a"/>
        <rect x="14" y="7" width="1" height="2" fill="#1a1a1a"/>
        <rect x="4" y="14" width="2" height="1" fill="#111"/>
        <rect x="10" y="14" width="2" height="1" fill="#111"/>
        <rect x="4" y="10" width="1" height="1" fill="#e8a0c0" opacity="0.5"/>
        <rect x="11" y="10" width="1" height="1" fill="#e8a0c0" opacity="0.5"/>
      </svg>`,
      mouse: `<svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated">
        <rect x="3" y="0" width="4" height="4" fill="#f0f0f0"/>
        <rect x="11" y="0" width="4" height="4" fill="#f0f0f0"/>
        <rect x="4" y="1" width="2" height="2" fill="#ffb0c0"/>
        <rect x="12" y="1" width="2" height="2" fill="#ffb0c0"/>
        <rect x="2" y="4" width="14" height="9" fill="#f5f5f5"/>
        <rect x="5" y="6" width="8" height="6" fill="#ffe0e8"/>
        <rect x="5" y="6" width="2" height="2" fill="#ff6090"/>
        <rect x="11" y="6" width="2" height="2" fill="#ff6090"/>
        <rect x="5" y="6" width="1" height="1" fill="#fff" opacity=".6"/>
        <rect x="11" y="6" width="1" height="1" fill="#fff" opacity=".6"/>
        <rect x="8" y="9" width="2" height="1" fill="#ff8080"/>
        <rect x="2" y="8" width="3" height="1" fill="#ccc" opacity=".7"/>
        <rect x="13" y="8" width="3" height="1" fill="#ccc" opacity=".7"/>
        <rect x="3" y="13" width="2" height="2" fill="#f0c0c8"/>
        <rect x="13" y="13" width="2" height="2" fill="#f0c0c8"/>
        <rect x="15" y="10" width="2" height="1" fill="#ffb0c0"/>
        <rect x="16" y="9" width="1" height="2" fill="#ffb0c0"/>
      </svg>`,
      ghost: `<svg viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated">
        <rect x="4" y="2" width="8" height="2" fill="#c4acee"/>
        <rect x="3" y="4" width="10" height="9" fill="#c4acee"/>
        <rect x="2" y="5" width="12" height="7" fill="#c4acee"/>
        <rect x="3" y="13" width="2" height="2" fill="#c4acee"/>
        <rect x="7" y="13" width="2" height="3" fill="#c4acee"/>
        <rect x="11" y="13" width="2" height="2" fill="#c4acee"/>
        <rect x="5" y="7" width="2" height="3" fill="#5c3fa0"/>
        <rect x="9" y="7" width="2" height="3" fill="#5c3fa0"/>
        <rect x="5" y="7" width="1" height="1" fill="#fff" opacity=".8"/>
        <rect x="9" y="7" width="1" height="1" fill="#fff" opacity=".8"/>
        <rect x="6" y="11" width="4" height="1" fill="#5c3fa0"/>
      </svg>`,
      frog: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated">
        <rect x="2" y="1" width="4" height="4" fill="#4a8a3a"/>
        <rect x="10" y="1" width="4" height="4" fill="#4a8a3a"/>
        <rect x="3" y="2" width="2" height="2" fill="#1a1a1a"/>
        <rect x="11" y="2" width="2" height="2" fill="#1a1a1a"/>
        <rect x="3" y="2" width="1" height="1" fill="#fff" opacity=".8"/>
        <rect x="11" y="2" width="1" height="1" fill="#fff" opacity=".8"/>
        <rect x="2" y="4" width="12" height="9" fill="#5aaa46"/>
        <rect x="4" y="6" width="8" height="6" fill="#8dcc70"/>
        <rect x="0" y="11" width="3" height="2" fill="#4a8a3a"/>
        <rect x="13" y="11" width="3" height="2" fill="#4a8a3a"/>
        <rect x="0" y="13" width="4" height="1" fill="#4a8a3a"/>
        <rect x="12" y="13" width="4" height="1" fill="#4a8a3a"/>
        <rect x="5" y="9" width="6" height="1" fill="#3a6a2a"/>
        <rect x="6" y="10" width="4" height="1" fill="#3a6a2a"/>
      </svg>`,
    };

    const ENTRY_MSGS = {
      cat: "miau~ :3",
      mouse: "squeak!! 🐭",
      ghost: "boo~ 👻",
      frog: "ribbit! 🐸",
    };

    pet.innerHTML = SVGS[key];
    pet.style.opacity = "0";
    pet.style.transform = "scale(0)";

    // pop in from explosion center
    pet.style.left = fromX + "px";
    pet.style.bottom = window.innerHeight - fromY + "px";

    gsap.to(pet, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(2)",
      onComplete: () => {
        bubble.textContent = ENTRY_MSGS[key];
        bubble.style.opacity = "1";
        setTimeout(() => {
          bubble.style.opacity = "0";
        }, 2000);
      },
    });
  }

  // wire click detection on pet element
  document.addEventListener("click", (e) => {
    const pet = document.getElementById("pet");
    if (!pet) return;
    const r = pet.getBoundingClientRect();
    if (
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom
    ) {
      window.__petClicked();
    }
  });
  document.addEventListener(
    "touchend",
    (e) => {
      const pet = document.getElementById("pet");
      if (!pet) return;
      const t = e.changedTouches[0];
      const r = pet.getBoundingClientRect();
      if (
        t.clientX >= r.left &&
        t.clientX <= r.right &&
        t.clientY >= r.top &&
        t.clientY <= r.bottom
      ) {
        window.__petClicked();
      }
    },
    { passive: true },
  );
})();

/* ══════════════════════════════════════════════════
   FEATURE 1: RANDOM GLITCH FLASH
══════════════════════════════════════════════════ */
(function () {
  const flash = document.getElementById("glitch-flash");
  function doGlitch() {
    if (!document.getElementById("main").classList.contains("on")) {
      scheduleGlitch();
      return;
    }
    // random scanline position
    const pct = 20 + Math.random() * 60;
    flash.style.background = `linear-gradient(180deg,transparent ${pct - 2}%,rgba(139,104,204,.18) ${pct}%,rgba(0,0,0,.25) ${pct + 1}%,transparent ${pct + 3}%)`;
    // quick flash sequence
    gsap
      .timeline()
      .to(flash, { opacity: 1, duration: 0.04 })
      .to(flash, { opacity: 0, duration: 0.04, delay: 0.05 })
      .to(flash, { opacity: 0.7, duration: 0.03, delay: 0.02 })
      .to(flash, { opacity: 0, duration: 0.06 });
    // also briefly offset body
    gsap.to("#main", {
      x: Math.random() * 6 - 3,
      duration: 0.04,
      yoyo: true,
      repeat: 3,
      ease: "none",
      onComplete: () => gsap.set("#main", { x: 0 }),
    });
    scheduleGlitch();
  }
  function scheduleGlitch() {
    setTimeout(doGlitch, 12000 + Math.random() * 20000);
  }
  scheduleGlitch();
})();

/* ══════════════════════════════════════════════════
   FEATURE 2: PET DRAG & THROW (desktop + touch)
══════════════════════════════════════════════════ */
(function () {
  const pet = document.getElementById("pet");
  if (!pet) return;

  let dragging = false,
    ox = 0,
    oy = 0;
  let vx = 0,
    vy = 0,
    lastX = 0,
    lastY = 0,
    lastT = 0;
  let physicsActive = false;
  let petPhysX = 0,
    petPhysY = 0;

  function startDrag(cx, cy) {
    dragging = true;
    pet.classList.add("dragging");
    const r = pet.getBoundingClientRect();
    ox = cx - r.left;
    oy = cy - r.top;
    vx = 0;
    vy = 0;
    lastX = cx;
    lastY = cy;
    lastT = Date.now();
    physicsActive = false;
  }

  function moveDrag(cx, cy) {
    if (!dragging) return;
    const now = Date.now();
    const dt = Math.max(now - lastT, 1);
    vx = ((cx - lastX) / dt) * 16;
    vy = ((cy - lastY) / dt) * 16;
    lastX = cx;
    lastY = cy;
    lastT = now;
    pet.style.left = cx - ox + "px";
    pet.style.bottom = window.innerHeight - cy - oy + "px";
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    pet.classList.remove("dragging");
    petPhysX = parseFloat(pet.style.left) || 0;
    petPhysY = window.innerHeight - (parseFloat(pet.style.bottom) || 0) - 54;
    physicsActive = true;
    runPhysics();
  }

  // ── HOVER: freeze briefly then react ──────────────────────────────
  let hoverFreezeTimer = null;
  let frozen = false;

  pet.addEventListener("mouseenter", () => {
    if (dragging) return;
    frozen = true;
    // expose freeze to pet AI via global flag
    window.__petFrozen = true;

    // show grab hint bubble after 300ms
    hoverFreezeTimer = setTimeout(() => {
      const petBub = document.getElementById("pet-bubble");
      if (petBub && !dragging) {
        petBub.textContent = "*se congela*";
        petBub.style.opacity = "1";
      }
    }, 300);

    // after 2s → unfreeze + react (scared or curious randomly)
    setTimeout(() => {
      if (!frozen) return;
      frozen = false;
      window.__petFrozen = false;
      const petBub = document.getElementById("pet-bubble");
      if (petBub) {
        const reactions = ["AH!!", "eek!", "👀", "*corre*", "!?", "waa~"];
        petBub.textContent =
          reactions[Math.floor(Math.random() * reactions.length)];
        petBub.style.opacity = "1";
        setTimeout(() => (petBub.style.opacity = "0"), 1200);
      }
      // trigger scared state in pet AI
      window.__petScared = true;
      setTimeout(() => (window.__petScared = false), 2000);
    }, 2000);
  });

  pet.addEventListener("mouseleave", () => {
    if (dragging) return;
    clearTimeout(hoverFreezeTimer);
    // only unfreeze if not yet in the 2s window
    setTimeout(() => {
      if (!dragging) {
        frozen = false;
        window.__petFrozen = false;
      }
    }, 100);
  });

  function runPhysics() {
    if (!physicsActive) return;
    vy += 0.6; // gravity
    petPhysX += vx;
    petPhysY += vy;
    // bounce walls
    const maxX = window.innerWidth - 54,
      maxY = window.innerHeight - 54;
    if (petPhysX < 0) {
      petPhysX = 0;
      vx = Math.abs(vx) * 0.7;
    }
    if (petPhysX > maxX) {
      petPhysX = maxX;
      vx = -Math.abs(vx) * 0.7;
    }
    if (petPhysY < window.innerHeight * 0.2) {
      petPhysY = window.innerHeight * 0.2;
      vy = Math.abs(vy) * 0.6;
    }
    if (petPhysY >= maxY) {
      petPhysY = maxY;
      vy = -Math.abs(vy) * 0.55;
      vx *= 0.85;
      if (Math.abs(vy) < 1) {
        physicsActive = false;
        return;
      }
    }
    pet.style.left = petPhysX + "px";
    pet.style.bottom = window.innerHeight - petPhysY - 54 + "px";
    requestAnimationFrame(runPhysics);
  }

  // RIGHT-click drag — mousedown button===2 (fires on press, not release)
  pet.addEventListener("mousedown", (e) => {
    if (e.button !== 2) return; // only right button
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });
  document.addEventListener("mousemove", (e) => {
    moveDrag(e.clientX, e.clientY);
  });
  document.addEventListener("mouseup", (e) => {
    if (e.button === 2) endDrag();
  });
  // block context menu always on pet, and globally while dragging
  pet.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("contextmenu", (e) => {
    if (dragging) e.preventDefault();
  });
  // touch: long-press (400ms) to drag on mobile
  let touchHoldTimer = null;
  let touchFrozen = false;

  pet.addEventListener(
    "touchstart",
    (e) => {
      const t = e.touches[0];
      // visual feedback: scale up
      pet.style.transition = "transform .15s";
      pet.style.transform = "scale(1.35)";

      touchHoldTimer = setTimeout(() => {
        touchFrozen = true;
        // haptic if supported
        if (navigator.vibrate) navigator.vibrate(30);
        startDrag(t.clientX, t.clientY);
        pet.style.transform = "scale(1.2)";
      }, 380);
    },
    { passive: true },
  );

  pet.addEventListener(
    "touchend",
    (e) => {
      clearTimeout(touchHoldTimer);
      pet.style.transform = "";
      if (touchFrozen) {
        touchFrozen = false;
        endDrag();
      } else {
        // short tap → pet reacts
        const petBub = document.getElementById("pet-bubble");
        if (petBub) {
          const taps = ["uwu", "*toque*", "hola!", "eek!"];
          petBub.textContent = taps[Math.floor(Math.random() * taps.length)];
          petBub.style.opacity = "1";
          setTimeout(() => (petBub.style.opacity = "0"), 1200);
        }
      }
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!dragging) return;
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    },
    { passive: true },
  );
  document.addEventListener(
    "touchend",
    () => {
      if (dragging) endDrag();
    },
    { passive: true },
  );
})();

/* ══════════════════════════════════════════════════
   FEATURE 3: PET SLEEP (30s idle)
══════════════════════════════════════════════════ */
(function () {
  let idleTimer = null,
    sleeping = false;
  let zzzEls = [];

  function resetIdle() {
    if (sleeping) wakeUp();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (document.getElementById("main").classList.contains("on")) goSleep();
    }, 30000);
  }

  function goSleep() {
    sleeping = true;
    const pet = document.getElementById("pet");
    if (!pet) return;
    gsap.to(pet, {
      scaleY: 0.7,
      scaleX: 1.1,
      duration: 0.4,
      ease: "power2.out",
    });
    // spawn ZZZs periodically
    spawnZzz();
  }

  function spawnZzz() {
    if (!sleeping) return;
    const pet = document.getElementById("pet");
    if (!pet) return;
    const r = pet.getBoundingClientRect();
    const z = document.createElement("div");
    z.className = "pet-zzz";
    z.textContent = ["z", "zz", "zzZ", "Zzz"][Math.floor(Math.random() * 4)];
    z.style.left = r.left + r.width / 2 + Math.random() * 20 + "px";
    z.style.bottom = window.innerHeight - r.top + 4 + "px";
    z.style.opacity = "0";
    document.body.appendChild(z);
    gsap.to(z, {
      opacity: 0.85,
      duration: 0.2,
      onComplete: () => {
        gsap.to(z, {
          opacity: 0,
          y: -20,
          duration: 1.5,
          delay: 0.5,
          ease: "power1.in",
          onComplete: () => z.remove(),
        });
      },
    });
    if (sleeping) setTimeout(spawnZzz, 1400 + Math.random() * 800);
  }

  function wakeUp() {
    if (!sleeping) return;
    sleeping = false;
    const pet = document.getElementById("pet");
    if (!pet) return;
    gsap.to(pet, { scaleY: 1, scaleX: 1, duration: 0.2, ease: "back.out(2)" });
    // scare bounce
    gsap.to(pet, { y: -20, duration: 0.15, yoyo: true, repeat: 1 });
  }

  ["mousemove", "click", "touchstart", "keydown", "scroll"].forEach((ev) => {
    document.addEventListener(ev, resetIdle, { passive: true });
  });
  resetIdle();
})();

/* ══════════════════════════════════════════════════
   FEATURE 4: SCROLL SECRET (bottom 5 seconds)
══════════════════════════════════════════════════ */
(function () {
  const el = document.getElementById("scroll-secret");
  let secretTimer = null,
    shown = false;
  window.addEventListener("scroll", () => {
    const scrolled =
      (window.scrollY + window.innerHeight) / document.body.scrollHeight;
    if (scrolled > 0.96) {
      if (!secretTimer && !shown) {
        secretTimer = setTimeout(() => {
          shown = true;
          gsap.to(el, { opacity: 1, duration: 0.8, ease: "power2.out" });
        }, 5000);
      }
    } else {
      clearTimeout(secretTimer);
      secretTimer = null;
    }
  });
})();

/* ══════════════════════════════════════════════════
   FEATURE 5: 2AM SECRET MESSAGE
══════════════════════════════════════════════════ */
(function () {
  const el = document.getElementById("secret-2am");
  function check2am() {
    const h = new Date().getHours(),
      m = new Date().getMinutes();
    if (h === 2) {
      // show message after 30s on page
      setTimeout(() => {
        gsap.to(el, { opacity: 1, duration: 1, ease: "power2.out" });
        setTimeout(() => gsap.to(el, { opacity: 0, duration: 1.5 }), 8000);
      }, 30000);
      // darken body slightly
      document.body.style.filter = "brightness(.88)";
      // pet says something different
      window.__is2am = true;
    }
  }
  // run after main loads
  document.addEventListener("mainLoaded", check2am);
  setTimeout(check2am, 3000);
})();

/* ══════════════════════════════════════════════════
   FEATURE 6: MASCOT EASTER EGG HINT FLOW
   Mascot clicks → pets hint → hint overlay → pattern → DANCE
══════════════════════════════════════════════════ */
(function () {
  // ── MASCOT CLICK COUNTER ──────────────────────────────────────
  const mascot = document.getElementById("mascot");
  const hintBub = document.getElementById("mascot-hint");
  let mascotClicks = 0,
    hintShown = false;

  if (mascot) {
    mascot.style.pointerEvents = "auto";
    mascot.addEventListener("click", () => {
      mascotClicks++;
      // After 3 clicks → pets start hinting
      if (mascotClicks === 3 && !hintShown) {
        showPetHint();
      }
      if (mascotClicks >= 5 && !hintShown) {
        hintShown = true;
        showHintOverlay();
      }
    });
    mascot.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault();
        mascotClicks++;
        if (mascotClicks === 3 && !hintShown) showPetHint();
        if (mascotClicks >= 5 && !hintShown) {
          hintShown = true;
          showHintOverlay();
        }
      },
      { passive: false },
    );
  }

  // pets move toward mascot and show bubble
  function showPetHint() {
    const pet = document.getElementById("pet");
    const petBub = document.getElementById("pet-bubble");
    const mascotEl = document.getElementById("mascot");
    if (!pet || !mascotEl) return;
    const r = mascotEl.getBoundingClientRect();
    // move pet toward mascot
    gsap.to(pet, {
      left: r.left - 60 + "px",
      bottom: window.innerHeight - r.bottom - 20 + "px",
      duration: 0.8,
      ease: "power2.out",
    });
    if (petBub) {
      petBub.textContent = "¡hazle click 5 veces al muñequito! 👆";
      petBub.style.opacity = "1";
      setTimeout(() => (petBub.style.opacity = "0"), 3500);
    }
    // mascot hint bubble
    if (hintBub) {
      const mr = mascotEl.getBoundingClientRect();
      hintBub.style.left = mr.left - 120 + "px";
      hintBub.style.bottom = window.innerHeight - mr.top + 8 + "px";
      gsap.to(hintBub, { opacity: 1, duration: 0.3 });
      setTimeout(() => gsap.to(hintBub, { opacity: 0, duration: 0.4 }), 3000);
    }
  }

  // ── HINT OVERLAY ─────────────────────────────────────────────
  const hintOverlay = document.getElementById("hint-overlay");
  const inputDisplay = document.getElementById("hint-input-display");

  // Secret pattern: ↓ ↓ ↑ → ←
  const SECRET = [
    "ArrowDown",
    "ArrowDown",
    "ArrowUp",
    "ArrowRight",
    "ArrowLeft",
  ];
  // Swipe mapping for touch
  const SWIPE_MAP = {
    down: "ArrowDown",
    up: "ArrowUp",
    right: "ArrowRight",
    left: "ArrowLeft",
  };
  const DISPLAY_MAP = {
    ArrowDown: "↓",
    ArrowUp: "↑",
    ArrowRight: "→",
    ArrowLeft: "←",
  };

  let inputSeq = [];
  let hintActive = false;

  function showHintOverlay() {
    hintActive = true;
    inputSeq = [];
    updateInputDisplay();
    gsap.to(hintOverlay, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      onStart: () => hintOverlay.classList.add("active"),
    });
    // screen blur
    gsap.to("#main", { filter: "blur(4px)", duration: 0.4 });
  }

  window.closeHint = function () {
    hintActive = false;
    hintShown = false;
    mascotClicks = 0;
    gsap.to(hintOverlay, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => hintOverlay.classList.remove("active"),
    });
    gsap.to("#main", { filter: "none", duration: 0.4 });
  };

  function updateInputDisplay() {
    const blanks = SECRET.map((_, i) => {
      if (i < inputSeq.length) return DISPLAY_MAP[inputSeq[i]];
      return "_";
    });
    inputDisplay.textContent = blanks.join(" ");
  }

  function pushInput(key) {
    if (!hintActive) return;
    if (!SECRET.includes(key)) return;
    inputSeq.push(key);
    updateInputDisplay();
    // check match so far
    for (let i = 0; i < inputSeq.length; i++) {
      if (inputSeq[i] !== SECRET[i]) {
        inputSeq = [];
        updateInputDisplay();
        return;
      }
    }
    if (inputSeq.length === SECRET.length) {
      // SUCCESS
      closeHint();
      setTimeout(launchEasterEgg, 300);
    }
  }

  // keyboard input
  document.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft"].includes(e.key)) {
      e.preventDefault();
      pushInput(e.key);
    }
  });

  // swipe input
  let swipeSX = 0,
    swipeSY = 0;
  document.addEventListener(
    "touchstart",
    (e) => {
      if (!hintActive) return;
      swipeSX = e.touches[0].clientX;
      swipeSY = e.touches[0].clientY;
    },
    { passive: true },
  );
  document.addEventListener(
    "touchend",
    (e) => {
      if (!hintActive) return;
      const dx = e.changedTouches[0].clientX - swipeSX;
      const dy = e.changedTouches[0].clientY - swipeSY;
      const adx = Math.abs(dx),
        ady = Math.abs(dy);
      if (Math.max(adx, ady) < 30) return;
      let dir;
      if (adx > ady) dir = dx > 0 ? "right" : "left";
      else dir = dy > 0 ? "down" : "up";
      pushInput(SWIPE_MAP[dir]);
    },
    { passive: true },
  );

  // ── EASTER EGG DANCE ─────────────────────────────────────────
  const DANCE_SVGS = {
    cat: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated" width="80" height="80">
      <rect x="3" y="5" width="10" height="9" fill="#1a1a1a"/>
      <rect x="3" y="3" width="2" height="3" fill="#1a1a1a"/>
      <rect x="11" y="3" width="2" height="3" fill="#1a1a1a"/>
      <rect x="5" y="7" width="2" height="2" fill="#8b68cc"/>
      <rect x="9" y="7" width="2" height="2" fill="#8b68cc"/>
      <rect x="5" y="7" width="1" height="1" fill="#d0c0ff"/>
      <rect x="9" y="7" width="1" height="1" fill="#d0c0ff"/>
      <rect x="7" y="10" width="2" height="1" fill="#3a3a3a"/>
      <rect x="4" y="10" width="1" height="1" fill="#e8a0c0" opacity="0.5"/>
      <rect x="11" y="10" width="1" height="1" fill="#e8a0c0" opacity="0.5"/>
    </svg>`,
    mouse: `<svg viewBox="0 0 18 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated" width="80" height="80">
      <rect x="3" y="0" width="4" height="4" fill="#f0f0f0"/>
      <rect x="11" y="0" width="4" height="4" fill="#f0f0f0"/>
      <rect x="4" y="1" width="2" height="2" fill="#ffb0c0"/>
      <rect x="12" y="1" width="2" height="2" fill="#ffb0c0"/>
      <rect x="2" y="4" width="14" height="9" fill="#f5f5f5"/>
      <rect x="5" y="6" width="8" height="6" fill="#ffe0e8"/>
      <rect x="5" y="6" width="2" height="2" fill="#ff6090"/>
      <rect x="11" y="6" width="2" height="2" fill="#ff6090"/>
      <rect x="8" y="9" width="2" height="1" fill="#ff8080"/>
    </svg>`,
    ghost: `<svg viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated" width="80" height="80">
      <rect x="4" y="2" width="8" height="2" fill="#c4acee"/>
      <rect x="3" y="4" width="10" height="9" fill="#c4acee"/>
      <rect x="2" y="5" width="12" height="7" fill="#c4acee"/>
      <rect x="3" y="13" width="2" height="2" fill="#c4acee"/>
      <rect x="7" y="13" width="2" height="3" fill="#c4acee"/>
      <rect x="11" y="13" width="2" height="2" fill="#c4acee"/>
      <rect x="5" y="7" width="2" height="3" fill="#5c3fa0"/>
      <rect x="9" y="7" width="2" height="3" fill="#5c3fa0"/>
      <rect x="5" y="7" width="1" height="1" fill="#fff" opacity=".8"/>
      <rect x="9" y="7" width="1" height="1" fill="#fff" opacity=".8"/>
      <rect x="6" y="11" width="4" height="1" fill="#5c3fa0"/>
    </svg>`,
    frog: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" image-rendering="pixelated" width="80" height="80">
      <rect x="2" y="1" width="4" height="4" fill="#4a8a3a"/>
      <rect x="10" y="1" width="4" height="4" fill="#4a8a3a"/>
      <rect x="3" y="2" width="2" height="2" fill="#1a1a1a"/>
      <rect x="11" y="2" width="2" height="2" fill="#1a1a1a"/>
      <rect x="2" y="4" width="12" height="9" fill="#5aaa46"/>
      <rect x="4" y="6" width="8" height="6" fill="#8dcc70"/>
      <rect x="5" y="9" width="6" height="1" fill="#3a6a2a"/>
    </svg>`,
  };

  function launchEasterEgg() {
    const overlay = document.getElementById("easter-overlay");
    const title = document.getElementById("easter-title");
    const sub = document.getElementById("easter-subtitle");
    const danceAudio = document.getElementById("dance-audio");

    // fade to black
    gsap.to(overlay, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
      onStart: () => overlay.classList.add("active"),
    });

    // title appears
    setTimeout(() => {
      gsap.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.5)",
      });
      gsap.to(sub, { opacity: 1, duration: 0.5, delay: 0.2 });
    }, 700);

    // spawn all 4 dancing pets — drop from top, bounce, walk center area
    const DANCE_MSGS = {
      cat: ["nyaa~", "miau!", "uwu", "< 3", "*baila*"],
      mouse: ["squeak!", "🧀!", "chiuu~", "eek!", "*gira*"],
      ghost: ["boo~!", "wooOoo", "👻", "*flota*", "UuuU"],
      frog: ["ribbit!", "🐸", "croac!", "*salta*", "EH EH EH"],
    };

    const PET_KEYS = ["cat", "mouse", "ghost", "frog"];
    // Remove any leftover dance elements
    document
      .querySelectorAll(".dance-pet-live,.dance-bubble")
      .forEach((e) => e.remove());

    setTimeout(() => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      // land positions: evenly spaced, centered
      const petW = 80;
      const total = PET_KEYS.length;
      const band = Math.min(W * 0.8, 400);
      const startL = (W - band) / 2;

      PET_KEYS.forEach((k, i) => {
        if (!DANCE_SVGS[k]) {
          console.warn("missing svg for", k);
          return;
        }

        // ── PET ─────────────────────────────────────────────────
        const d = document.createElement("div");
        d.className = "dance-pet-live";
        d.innerHTML = DANCE_SVGS[k];
        Object.assign(d.style, {
          position: "fixed",
          width: petW + "px",
          height: petW + "px",
          imageRendering: "pixelated",
          pointerEvents: "none",
          zIndex: "29000", // above EVERYTHING
          top: "0px",
          left: "0px",
          opacity: "0",
          transform: "translate(0px,-120px)",
        });
        document.body.appendChild(d);

        // land X, land Y (center-ish vertically)
        const landX = startL + (band / (total - 1 || 1)) * i;
        const landY = H * 0.42;

        // drop from top with bounce
        gsap.to(d, {
          opacity: 1,
          x: landX,
          y: landY,
          duration: 0.75,
          delay: i * 0.2,
          ease: "bounce.out",
          onComplete: () => startWalkLive(k, d, landX, landY, W, H),
        });

        // ── BUBBLE ───────────────────────────────────────────────
        const bub = document.createElement("div");
        bub.className = "dance-bubble";
        Object.assign(bub.style, {
          position: "fixed",
          zIndex: "29001",
          opacity: "0",
          background: "rgba(10,8,24,.92)",
          border: "2px solid #9b78d4",
          borderRadius: "6px 6px 6px 0",
          padding: "4px 10px",
          fontFamily: "'VT323',monospace",
          fontSize: "14px",
          color: "#c4acee",
          letterSpacing: ".08em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        });
        document.body.appendChild(bub);

        function showMsg() {
          if (!d.isConnected) return;
          const msgs = DANCE_MSGS[k] || ["hi!"];
          bub.textContent = msgs[Math.floor(Math.random() * msgs.length)];
          const dr = d.getBoundingClientRect();
          bub.style.left = Math.max(4, dr.left) + "px";
          bub.style.top = Math.max(4, dr.top - 30) + "px";
          gsap.to(bub, {
            opacity: 1,
            duration: 0.2,
            onComplete: () => {
              gsap.to(bub, { opacity: 0, duration: 0.3, delay: 1.3 });
            },
          });
          setTimeout(showMsg, 2000 + Math.random() * 1500);
        }
        setTimeout(showMsg, 2200 + i * 500);
      });
    }, 900);

    function startWalkLive(k, d, startX, startY, W, H) {
      if (!d.isConnected) return;
      let posX = startX;
      const minX = Math.max(10, W / 2 - 200);
      const maxX = Math.min(W - 90, W / 2 + 200);
      let dirX = k === "cat" || k === "frog" ? 1 : -1;

      // bob up/down
      gsap.to(d, {
        y: startY - 14,
        duration: 0.3 + Math.random() * 0.1,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
      });

      function step() {
        if (!d.isConnected) return;
        posX += dirX * (18 + Math.random() * 10);
        if (posX >= maxX) {
          posX = maxX;
          dirX = -1;
          d.style.transform = `translate(${posX}px,0) scaleX(-1)`;
        } else if (posX <= minX) {
          posX = minX;
          dirX = 1;
          d.style.transform = `translate(${posX}px,0) scaleX(1)`;
        }
        gsap.to(d, { x: posX, duration: 0.4, ease: "none", onComplete: step });
      }
      step();
    }

    // confetti
    setTimeout(() => {
      const CONFETTI_C = [
        "#8b68cc",
        "#c4acee",
        "#ff6090",
        "#ffb0c0",
        "#fff",
        "#5c3fa0",
        "#b99ee8",
        "#54c000",
        "#ffbd2e",
      ];
      for (let i = 0; i < 40; i++) {
        const p = document.createElement("div");
        p.className = "confetti-px";
        p.style.left = Math.random() * 100 + "vw";
        p.style.top = "-10px";
        p.style.background =
          CONFETTI_C[Math.floor(Math.random() * CONFETTI_C.length)];
        const dur = 1.5 + Math.random() * 2;
        p.style.animationDuration = dur + "s";
        p.style.animationDelay = Math.random() * 2 + "s";
        const sz = 4 + Math.floor(Math.random() * 3) * 2;
        p.style.width = sz + "px";
        p.style.height = sz + "px";
        overlay.appendChild(p);
        setTimeout(() => p.remove(), (dur + 2.5) * 1000);
      }
    }, 1200);

    // play dance audio
    if (
      danceAudio &&
      danceAudio.querySelector &&
      danceAudio.querySelector("source")
    ) {
      const mainAudio = document.getElementById("audio");

      if (mainAudio) {
        lastTime = mainAudio.currentTime;
        gsap.to(mainAudio, {
          volume: 0,
          duration: 0.5,
          onComplete: () => {
            mainAudio.pause();
          },
        });
      }
      danceAudio.currentTime = 0;
      danceAudio.volume = 0;
      danceAudio
        .play()
        .then(() => gsap.to(danceAudio, { volume: 0.7, duration: 0.5 }))
        .catch(() => {});
    }

    // after 10 seconds → dream fade out
    setTimeout(() => {
      // fade out pets & confetti
      overlay.querySelectorAll(".dance-pet,.confetti-px").forEach((el) => {
        gsap.to(el, { opacity: 0, y: -30, duration: 0.8, ease: "power2.in" });
      });
      gsap.to([title, sub], { opacity: 0, duration: 0.6, delay: 0.3 });

      // white flash "dream" effect
      const dreamFlash = document.createElement("div");
      Object.assign(dreamFlash.style, {
        position: "fixed",
        inset: 0,
        background: "#fff",
        zIndex: 19003,
        opacity: 0,
        pointerEvents: "none",
      });
      document.body.appendChild(dreamFlash);
      gsap.to(dreamFlash, {
        opacity: 1,
        duration: 0.6,
        delay: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          // stop dance audio, restore main
          if (danceAudio) {
            gsap.to(danceAudio, {
              volume: 0,
              duration: 0.5,
              onComplete: () => danceAudio.pause(),
            });
          }
          
          const mainAudio = document.getElementById("audio");

if (mainAudio) {

  if (mainAudio.readyState < 2) {

    mainAudio.addEventListener("loadedmetadata", () => {

      mainAudio.currentTime = lastTime;

      mainAudio.play().then(() => {
        gsap.to(mainAudio, {
          volume: 0.42,
          duration: 1
        });
      }).catch(()=>{});

    }, { once: true });

  } else {

    mainAudio.currentTime = lastTime;

    mainAudio.play().then(() => {
      gsap.to(mainAudio, {
        volume: 0.42,
        duration: 1
      });
    }).catch(()=>{});
  }

          }
          // clean up
          overlay
            .querySelectorAll(".dance-pet,.confetti-px")
            .forEach((el) => el.remove());
          document
            .querySelectorAll(".dance-pet-live,.dance-bubble")
            .forEach((el) => el.remove());
          overlay.classList.remove("active");
          gsap.set(overlay, { opacity: 0 });
          gsap.set([title, sub], { opacity: 0 });
          // fade out white flash = return to page
          gsap.to(dreamFlash, {
            opacity: 0,
            duration: 1,
            delay: 0.1,
            onComplete: () => {
              dreamFlash.remove();
              hintShown = false;
              mascotClicks = 0;
            },
          });
        },
      });
    }, 10000);
  }
})();

/* ══════════════════════════════════════════════════
   FEATURE 7: 2AM PET BEHAVIOR
══════════════════════════════════════════════════ */
(function () {
  const h = new Date().getHours();
  if (h !== 2) return;
  // extra messages for pets at 2am
  window.__is2am = true;
  // override pet bubble messages after main loads
  setTimeout(() => {
    const petBub = document.getElementById("pet-bubble");
    const pet = document.getElementById("pet");
    if (!petBub || !pet) return;
    // show special 2am message after 20s
    setTimeout(() => {
      petBub.textContent = "oye... también tú? 🌙";
      petBub.style.opacity = "1";
      setTimeout(() => (petBub.style.opacity = "0"), 3500);
    }, 20000);
    // star shooting across screen
    setTimeout(() => {
      const star = document.createElement("div");
      Object.assign(star.style, {
        position: "fixed",
        top: "15%",
        left: "-40px",
        width: "3px",
        height: "3px",
        background: "#fff",
        borderRadius: "50%",
        boxShadow: "0 0 6px #c4acee, 0 0 12px #8b68cc",
        zIndex: 9999,
        pointerEvents: "none",
      });
      document.body.appendChild(star);
      gsap.to(star, {
        left: "110vw",
        top: "25%",
        duration: 1.8,
        ease: "power1.in",
        onComplete: () => star.remove(),
      });
    }, 8000);
  }, 3000);
})();

/* ══════════════════════════════════════════════════
   BUZÓN — Notion via Vercel API
══════════════════════════════════════════════════ */
(function () {
  const API_URL = "https://buzon-api.vercel.app/api/mensaje";

  const selectEl = document.getElementById("buzon-quien");
  const nameEl = document.getElementById("buzon-name");
  const msgEl = document.getElementById("buzon-msg");
  const charsEl = document.getElementById("buzon-chars");
  const sendBtn = document.getElementById("buzon-send");
  const statusEl = document.getElementById("buzon-status");

  if (!selectEl) return;

  // ── COMBO: show/hide name input ──────────────────
  selectEl.addEventListener("change", () => {
    if (selectEl.value === "custom") {
      nameEl.classList.remove("hidden");
      nameEl.focus();
    } else {
      nameEl.classList.add("hidden");
      nameEl.value = "";
    }
  });

  // ── CHAR COUNTER ─────────────────────────────────
  msgEl.addEventListener("input", () => {
    const len = msgEl.value.length;
    charsEl.textContent = len;
    charsEl.style.color = len > 450 ? "#ff5f57" : "";
  });

  // ── SEND ─────────────────────────────────────────
  sendBtn.addEventListener("click", async () => {
    const msg = msgEl.value.trim();
    if (!msg) {
      showStatus("// escribe algo primero", "err");
      return;
    }

    // build nombre string
    let nombre = selectEl.value;
    if (nombre === "custom") {
      nombre = nameEl.value.trim() || "Alguien";
    }

    sendBtn.disabled = true;
    sendBtn.querySelector("span").textContent = "▶ enviando...";
    hideStatus();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: msg, nombre }),
      });
      const data = await res.json();
      if (data.ok) {
        showStatus("// mensaje enviadooo ✓ ", "ok");
        msgEl.value = "";
        charsEl.textContent = "0";
        nameEl.value = "";
        selectEl.value = "Yo";
        nameEl.classList.add("hidden");
        spawnBuzonConfetti();
        // pet reacts
        const petBub = document.getElementById("pet-bubble");
        if (petBub) {
          petBub.textContent = "¡llegó un mensaje! 📨";
          petBub.style.opacity = "1";
          setTimeout(() => (petBub.style.opacity = "0"), 2500);
        }
      } else {
        showStatus("// algo falló, intenta de nuevo", "err");
      }
    } catch (e) {
      showStatus("// error de conexión", "err");
    } finally {
      sendBtn.disabled = false;
      sendBtn.querySelector("span").textContent = "▶ enviar";
    }
  });

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = `buzon-status ${type} show`;
    setTimeout(() => statusEl.classList.remove("show"), 5000);
  }
  function hideStatus() {
    statusEl.className = "buzon-status";
  }

  // mini confetti burst on success
  function spawnBuzonConfetti() {
    const wrap = document.querySelector(".buzon-wrap");
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    const COLORS = [
      "#8b68cc",
      "#c4acee",
      "#54c000",
      "#ffbd2e",
      "#ff6090",
      "#fff",
    ];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("div");
      p.className = "px-trail";
      const sz = 4 + Math.floor(Math.random() * 3) * 2;
      Object.assign(p.style, {
        left: r.left + Math.random() * r.width + "px",
        top: r.top + Math.random() * r.height * 0.5 + "px",
        width: sz + "px",
        height: sz + "px",
        background: COLORS[Math.floor(Math.random() * COLORS.length)],
        zIndex: "19010",
        animationDuration: 1 + Math.random() + "s",
        animationDelay: Math.random() * 0.3 + "s",
      });
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1800);
    }
  }
})();

/* ══════════════════════════════════════════════════
   POLAROID PHOTO VIEWER
   Click on any <img> inside .photo-frame, .hero-photo,
   .hero-photo-sm → fullscreen polaroid reveal
══════════════════════════════════════════════════ */
(function () {
  const overlay = document.getElementById("polaroid-overlay");
  const frameImg = document.getElementById("polaroid-img");
  const caption = document.getElementById("polaroid-caption");
  if (!overlay) return;

  function openPolaroid(src, alt) {
    frameImg.src = src;
    frameImg.style.filter = "brightness(0) sepia(0)";
    caption.textContent = alt || "// axel";
    overlay.classList.add("active");
    // trigger reveal after tiny delay so transition fires
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        frameImg.style.filter = "";
      }),
    );
  }

  window.closePolaroid = function () {
    overlay.classList.remove("active");
    setTimeout(() => {
      frameImg.src = "";
    }, 500);
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePolaroid();
  });

  // wire up all photo images on DOM (and future ones)
  function wirePhotos() {
    document
      .querySelectorAll(
        ".hero-photo img, .hero-photo-sm img, .photo-frame img, .game-card img",
      )
      .forEach((img) => {
        if (img.dataset.polaroidWired) return;
        img.dataset.polaroidWired = "1";
        img.addEventListener("click", () => {
          // skip gifs
          if (img.src.endsWith(".gif") || img.src.includes("giphy")) return;
          openPolaroid(
            img.src,
            img.alt || img.closest("[data-caption]")?.dataset.caption || "",
          );
        });
      });
  }
  wirePhotos();
  // re-wire after any DOM mutation (in case images load late)
  new MutationObserver(wirePhotos).observe(document.body, {
    childList: true,
    subtree: true,
  });
})();

/* ══════════════════════════════════════════════════
   CUSTOM RIGHT-CLICK CONTEXT MENU
══════════════════════════════════════════════════ */
(function () {
  const menu = document.getElementById("ctx-menu");
  if (!menu) return;

  // block native context menu and show custom one
  document.addEventListener("contextmenu", (e) => {
    // allow on pet (for drag) — but pet blocks it itself
    // allow on polaroid overlay
    if (e.target.closest("#polaroid-overlay")) return;

    e.preventDefault();
    showMenu(e.clientX, e.clientY);
  });

  function showMenu(x, y) {
    // position so it doesn't go off screen
    const W = window.innerWidth,
      H = window.innerHeight;
    const mw = 210,
      mh = 240;
    menu.style.left = Math.min(x, W - mw - 8) + "px";
    menu.style.top = Math.min(y, H - mh - 8) + "px";
    menu.classList.add("show");
  }

  function hideMenu() {
    menu.classList.remove("show");
  }

  document.addEventListener("click", hideMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideMenu();
  });
  document.addEventListener("scroll", hideMenu, { passive: true });

  // menu actions
  window.ctxAction = function (action) {
    hideMenu();
    switch (action) {
      case "inspect":
        // show a fake inspector bubble
        const tip = document.createElement("div");
        Object.assign(tip.style, {
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(9,8,20,.97)",
          border: "1px solid var(--b2)",
          borderRadius: "6px",
          padding: "12px 20px",
          fontFamily: "'VT323',monospace",
          fontSize: "13px",
          color: "var(--p3)",
          letterSpacing: ".1em",
          zIndex: "21001",
          pointerEvents: "none",
          textAlign: "center",
          lineHeight: "1.8",
          boxShadow: "0 0 20px rgba(92,63,160,.3)",
        });
        tip.innerHTML = `
          &lt;axel&gt;<br>
          &nbsp;&nbsp;En: <span style="color:#54c000">mi cuarto</span><br>
          &nbsp;&nbsp;Con: <span style="color:#ffbd2e">lasvocesenmicabeza</span><br>
          &nbsp;&nbsp;Nivel de estrés: <span style="color:#ff5f57">solo un poco</span><br>
          &lt;/axel&gt;
        `;
        document.body.appendChild(tip);
        gsap.fromTo(
          tip,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3 },
        );
        setTimeout(
          () =>
            gsap.to(tip, {
              opacity: 0,
              duration: 0.4,
              onComplete: () => tip.remove(),
            }),
          3500,
        );
        break;

      case "copy":
        navigator.clipboard
          ?.writeText("vibra: chill ∞ — axel.exe")
          .catch(() => {});
        const petBub = document.getElementById("pet-bubble");
        if (petBub) {
          petBub.textContent = "¡vibra copiada! ✨";
          petBub.style.opacity = "1";
          setTimeout(() => (petBub.style.opacity = "0"), 2000);
        }
        break;

      case "source":
        // glitch flash then show message
        gsap
          .timeline()
          .to("#glitch-flash", { opacity: 1, duration: 0.05 })
          .to("#glitch-flash", { opacity: 0, duration: 0.08 })
          .to("#glitch-flash", { opacity: 0.6, duration: 0.04 })
          .to("#glitch-flash", { opacity: 0, duration: 0.1 });
        const src2 = document.createElement("div");
        Object.assign(src2.style, {
          position: "fixed",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(9,8,20,.97)",
          border: "1px solid var(--b2)",
          borderRadius: "6px",
          padding: "14px 22px",
          fontFamily: "'VT323',monospace",
          fontSize: "13px",
          color: "var(--p3)",
          letterSpacing: ".1em",
          zIndex: "21001",
          pointerEvents: "none",
          textAlign: "center",
          lineHeight: "2",
          boxShadow: "0 0 20px rgba(92,63,160,.3)",
          maxWidth: "300px",
        });

      case "sleep":
        // force 2am mode temporarily
        document.body.style.filter = "brightness(.82)";
        const moonMsg = document.createElement("div");
        Object.assign(moonMsg.style, {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          fontFamily: "'VT323',monospace",
          fontSize: "clamp(18px,5vw,28px)",
          color: "var(--p3)",
          letterSpacing: ".2em",
          zIndex: "21001",
          pointerEvents: "none",
          textAlign: "center",
          lineHeight: "1.8",
        });
        moonMsg.innerHTML = "🌙<br>Para que no te ardan los ojoss";
        document.body.appendChild(moonMsg);
        gsap.fromTo(moonMsg, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        setTimeout(() => {
          gsap.to(moonMsg, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => moonMsg.remove(),
          });
          document.body.style.filter = "";
        }, 7000);
        break;

      case "pet":
        // teleport pet to center of screen
        const pet = document.getElementById("pet");
        if (pet) {
          gsap.to(pet, {
            left: window.innerWidth / 2 - 27 + "px",
            bottom: window.innerHeight / 2 - 27 + "px",
            duration: 0.5,
            ease: "back.out(2)",
          });
          const pb = document.getElementById("pet-bubble");
          if (pb) {
            pb.textContent = "¡me llamaron! 🐾";
            pb.style.opacity = "1";
            setTimeout(() => (pb.style.opacity = "0"), 2000);
          }
        }
        break;

      case "close":
      default:
        break;
    }
  };
})();

/* ══════════════════════════════════════════════════
   MIRROR HOURS PET (tu pixel art — placeholder)
   Aparece solo en horas espejo: 01:01, 01:11,
   02:02, 11:11, 12:21, etc.
══════════════════════════════════════════════════ */
(function () {
  const MIRROR_HOURS = [
    "01:01",
    "01:11",
    "02:02",
    "03:03",
    "04:04",
    "05:05",
    "06:06",
    "07:07",
    "08:08",
    "09:09",
    "10:01",
    "11:11",
    "12:12",
    "12:21",
    "13:13",
    "14:14",
    "15:15",
    "16:16",
    "17:17",
    "18:18",
    "19:19",
    "20:02",
    "21:12",
    "22:22",
    "23:23",
    "00:00",
  ];

  function checkMirrorHour() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const time = `${hh}:${mm}`;
    if (MIRROR_HOURS.includes(time)) spawnMirrorPet(time);
  }

  function spawnMirrorPet(time) {
    if (document.getElementById("mirror-pet")) return; // already shown

    const el = document.createElement("div");
    el.id = "mirror-pet";
    Object.assign(el.style, {
      position: "fixed",
      bottom: "100px",
      left: (Math.random() * 0.6 + 0.2) * window.innerWidth + "px",
      zIndex: "9975",
      pointerEvents: "none",
      imageRendering: "pixelated",
      filter: "drop-shadow(0 0 12px rgba(185,158,232,.8))",
      opacity: "0",
    });

    el.innerHTML = `
  <img src="assets/gif/mirror-pet.gif" 
       alt="sprite" 
       width="48" 
       height="72" 
       style="image-rendering: pixelated; display: block;">
`;

    document.body.appendChild(el);

    // speech bubble
    const bub = document.createElement("div");
    Object.assign(bub.style, {
      position: "fixed",
      fontFamily: "'VT323',monospace",
      fontSize: "13px",
      color: "var(--p3)",
      background: "rgba(9,8,20,.92)",
      border: "1px solid var(--b2)",
      borderRadius: "6px 6px 6px 0",
      padding: "5px 10px",
      letterSpacing: ".08em",
      zIndex: "9976",
      pointerEvents: "none",
      opacity: "0",
      whiteSpace: "nowrap",
    });
    bub.textContent = `son las ${time} que gott`;
    document.body.appendChild(bub);

    // position bubble above pet
    const r = el.getBoundingClientRect();
    bub.style.left = el.style.left;
    bub.style.bottom = parseInt(el.style.bottom) + 80 + "px";

    // animate in
    gsap.to(el, {
      opacity: 1,
      y: -10,
      duration: 0.6,
      ease: "back.out(2)",
      onComplete: () => {
        gsap.to(bub, { opacity: 1, duration: 0.3 });
        // bob
        gsap.to(el, {
          y: 0,
          duration: 0.8,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      },
    });

    // disappear after 20 seconds
    setTimeout(() => {
      gsap.to([el, bub], {
        opacity: 0,
        y: 20,
        duration: 0.8,
        onComplete: () => {
          el.remove();
          bub.remove();
        },
      });
    }, 20000);
  }

  window.openVideo = function () {
  const overlay = document.getElementById("video-overlay");
  const video = document.getElementById("p-video-player");
  const mainAudio = document.getElementById("audio");

  if (!overlay || !video) {
    console.log("❌ No se encontró overlay o video");
    return;
  }

  console.log("✅ openVideo ejecutado");

  // 🪟 mostrar overlay (FORZADO)
  overlay.style.display = "flex";
  overlay.style.opacity = "1";
  overlay.style.zIndex = "9999";

  if (mainAudio) {
    lastTime = mainAudio.currentTime;

    mainAudio.volume = 0;
    mainAudio.pause();
  }

  video.muted = false;
  video.defaultMuted = false;
  video.volume = 1;
  video.currentTime = 0;

  video
    .play()
    .then(() => {
      console.log("🎬 video reproduciendo");
    })
    .catch((err) => {
      console.log("❌ error al reproducir:", err);
    });
};

const video = document.getElementById("p-video-player");

function resumeMainAudio() {
  const mainAudio = document.getElementById("audio");

  if (!mainAudio) return;

  mainAudio.volume = 0;
  mainAudio.currentTime = lastTime || 0;

  mainAudio
    .play()
    .then(() => {
      gsap.to(mainAudio, {
        volume: 0.42,
        duration: 1,
      });
    })
    .catch(() => {});
}

if (video) {
  video.addEventListener("ended", () => {
    resumeMainAudio();
  });
}

const overlay = document.getElementById("video-overlay");

if (overlay) {
  const observer = new MutationObserver(() => {
    if (overlay.style.display === "none") {
      resumeMainAudio();
    }
  });

  observer.observe(overlay, { attributes: true, attributeFilter: ["style"] });
}

  // check every minute
  setInterval(checkMirrorHour, 60000);
  // also check on load (in case page loads at mirror hour)
  setTimeout(checkMirrorHour, 4000);
})();
