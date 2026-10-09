// maxlareau.com: small enhancements. The page works without this file.
(() => {
  // 1. Card handoff. The business card QR code goes to /c, which redirects
  //    to /?hi (static/_redirects). Show the welcome line, then drop the
  //    param so a refresh or a shared link looks normal. Nothing is logged.
  const params = new URLSearchParams(window.location.search);
  if (params.has("hi")) {
    const hello = document.querySelector(".hello");
    if (hello) hello.hidden = false;
    params.delete("hi");
    const query = params.toString();
    const url = window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
    window.history.replaceState(null, "", url);
  }

  // 2. ASCII background, drawn as characters on a canvas.
  //    The footer button cycles topo → cumulus → radar → snow → scope → off.
  //    Long-press jumps to "off", which is also the pause control for motion. First visit is always topo; the
  //    choice is remembered. 12 fps, paused when the tab is hidden, one
  //    still frame under prefers-reduced-motion.
  const canvas = document.querySelector(".bg__field");
  const ctx = canvas && canvas.getContext("2d");
  const toggle = document.querySelector(".bg-toggle");
  if (ctx) {
    // Each mode has a still icon and an animated frame that follows the field.
    // Frames keep a fixed width so the button never shifts.
    const TAU = Math.PI * 2;
    const sweepAt = (t) => (t * 0.9) % TAU;
    const wave = "_/^\\_/^\\";
    const MODES = [
      { id: "topo", name: "Topo", icon: "/\\/\\", frame: (t) => (Math.floor(t / 1.2) % 2 ? "\\/\\/" : "/\\/\\") },
      { id: "cumulus", name: "Cumulus", icon: ".Oo ", frame: (t) => [".Oo ", " .Oo", "o .O", "Oo ."][Math.floor(t) % 4] },
      { id: "radar", name: "Radar", icon: "(/)", frame: (t) => `(${stroke(sweepAt(t))})` },
      { id: "snow", name: "Snow", icon: "*.*", frame: (t) => (Math.floor(t / 0.6) % 2 ? ".*." : "*.*") },
      { id: "scope", name: "Scope", icon: "_/^\\", frame: (t) => wave.slice(Math.floor(t / 0.25) % 4, (Math.floor(t / 0.25) % 4) + 4) },
      { id: "off", name: "Off", icon: "[ ]" },
    ];
    const FPS = 12;
    const MAX_ALPHA = 0.14;
    const RAMP = " .\u00b7:-=+*";
    const cellH = 16;

    let stored = null;
    try {
      stored = localStorage.getItem("bg");
    } catch {
      stored = null;
    }
    let modeIndex = Math.max(0, MODES.findIndex((m) => m.id === stored));

    // Value noise, 0..1.
    const hash = (x, y) => {
      let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263);
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
    };
    const noise = (x, y) => {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const xf = x - xi;
      const yf = y - yi;
      const u = xf * xf * (3 - 2 * xf);
      const v = yf * yf * (3 - 2 * yf);
      const a = hash(xi, yi);
      const b = hash(xi + 1, yi);
      const c = hash(xi, yi + 1);
      const d = hash(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
    const smooth = (a, b, x) => {
      const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return k * k * (3 - 2 * k);
    };
    // Stroke character for a direction angle (radians, screen y down).
    const stroke = (a) => "-\\|/"[((Math.round(a / (Math.PI / 4)) % 4) + 4) % 4];

    let cols = 0;
    let rows = 0;
    let cellW = 8;
    let radar = null;
    let flakes = [];
    let grid = new Float32Array(0);

    // Contour modes: a height field drawn as level lines. Heights are sampled
    // on cell corners; a cell gets a stroke when a level crosses it, so lines
    // stay continuous and one cell wide. Every 5th level is an index line.
    // y is scaled 2x in the noise because cells are 2:1.
    const contours = {
      topo: {
        levels: 12,
        min: 0,
        height: (x, y, t) =>
          noise(x * 0.016 + t * 0.004, y * 0.032) * 0.72 + noise(x * 0.04, y * 0.08 - t * 0.003) * 0.28,
      },
      cumulus: {
        levels: 9,
        min: 0.02,
        // A band of cumulus with one flat base: the condensation level.
        height: (x, y, t) => {
          const base = rows * 0.42;
          const tops = rows * 0.08;
          if (y > base + 1 || y < tops - 2) return 0;
          const n = noise(x * 0.035 - t * 0.09, y * 0.09) * 0.7 + noise(x * 0.09 - t * 0.12, y * 0.2) * 0.3;
          const rise = smooth(tops, base - (base - tops) * 0.35, y);
          const cut = smooth(base + 0.6, base - 0.4, y);
          return Math.max(0, n * 1.25 - 0.42) * rise * cut;
        },
      },
    };

    const drawContours = (c, t) => {
      const gw = cols + 1;
      const gh = rows + 1;
      if (grid.length !== gw * gh) grid = new Float32Array(gw * gh);
      for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) grid[y * gw + x] = c.height(x, y, t);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const a = grid[y * gw + x];
          const b = grid[y * gw + x + 1];
          const cc = grid[(y + 1) * gw + x];
          const d = grid[(y + 1) * gw + x + 1];
          const hi = Math.max(a, b, cc, d);
          if (hi <= c.min) continue;
          const kLo = Math.floor(Math.min(a, b, cc, d) * c.levels);
          const kHi = Math.floor(hi * c.levels);
          if (kLo === kHi) continue;
          // Slope in screen pixels; the line runs perpendicular to it.
          const gx = (b + d - a - cc) / (2 * cellW);
          const gy = (cc + d - a - b) / (2 * cellH);
          ctx.globalAlpha = kHi % 5 === 0 ? MAX_ALPHA : MAX_ALPHA * 0.6;
          ctx.fillText(stroke(Math.atan2(gy, gx) + Math.PI / 2), x * cellW, y * cellH);
        }
      }
    };

    // Radar: range rings, a sweep with a fading trail, blips lit by the sweep.
    const drawRadar = (t) => {
      const { cx, cy, r: r0, blips } = radar;
      const sweep = sweepAt(t);
      const ring = r0 / 4;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const dx = (x - cx) * cellW;
          const dy = (y - cy) * cellH;
          const r = Math.hypot(dx, dy);
          if (r > r0) continue;
          let d = (sweep - Math.atan2(dy, dx)) % TAU;
          if (d < 0) d += TAU;
          let v = d < 2.2 ? Math.exp(-d * 2.2) : 0;
          if (Math.abs(r - Math.round(r / ring) * ring) < cellH * 0.35) v = Math.max(v, 0.55);
          let ch = null;
          for (const b of blips) {
            if (Math.abs(x - b.x) < 0.6 && Math.abs(y - b.y) < 0.6) {
              let db = (sweep - b.th) % TAU;
              if (db < 0) db += TAU;
              v = Math.max(v, Math.exp(-db * 0.5));
              ch = "+";
            }
          }
          if (v < 0.12) continue;
          const level = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length));
          ctx.globalAlpha = (level / (RAMP.length - 1)) * MAX_ALPHA;
          ctx.fillText(ch || RAMP[level], x * cellW, y * cellH);
        }
      }
    };

    // Snow: flakes fall at three depths. Far ones are small, slow, and dim.
    let lastT = 0;
    const drawSnow = (t) => {
      const dt = Math.min(0.25, Math.max(0, t - lastT));
      lastT = t;
      for (const f of flakes) {
        f.y += f.v * dt;
        if (f.y > rows + 1) {
          f.y = -1;
          f.x = Math.random() * cols;
        }
        const x = f.x + Math.sin(t * f.sway + f.phase) * 1.2;
        ctx.globalAlpha = MAX_ALPHA * (0.45 + 0.55 * f.depth);
        ctx.fillText(f.depth > 0.75 ? "*" : f.depth > 0.4 ? "+" : ".", x * cellW, f.y * cellH);
      }
    };

    // Scope: graticule plus two traces, drawn by a sweeping beam that leaves
    // a fading phosphor trail.
    const drawScope = (t) => {
      ctx.globalAlpha = MAX_ALPHA * 0.3;
      const gx = 12;
      const gy = 6;
      const midX = Math.round(cols / 2 / gx) * gx;
      const midY = Math.round(rows / 2 / gy) * gy;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const onX = x % gx === 0;
          const onY = y % gy === 0;
          if ((onX && y % 2 === 0) || (onY && x % 2 === 0)) {
            ctx.globalAlpha = MAX_ALPHA * (x === midX || y === midY ? 0.5 : 0.3);
            ctx.fillText(onX && onY ? "+" : "\u00b7", x * cellW, y * cellH);
          }
        }
      }
      const A = rows * 0.08;
      const traces = [
        { y0: rows * 0.35, f: (x) => A * (Math.sin(x * 0.09 - t * 1.1) + 0.35 * Math.sin(x * 0.27 + t * 0.7)) },
        { y0: rows * 0.68, f: (x) => A * 0.8 * Math.tanh(3 * Math.sin(x * 0.05 + t * 0.6)) },
      ];
      const beam = ((t * cols) / 2.5) % cols;
      for (const tr of traces) {
        for (let x = 0; x < cols; x++) {
          const age = (beam - x + cols) % cols;
          ctx.globalAlpha = MAX_ALPHA * Math.max(0.4, Math.exp(-age / (cols * 0.5)));
          const y1 = tr.y0 + tr.f(x);
          const y2 = tr.y0 + tr.f(x + 1);
          const r1 = Math.round(y1);
          const r2 = Math.round(y2);
          const slope = ((y2 - y1) * cellH) / cellW;
          const ch = Math.abs(slope) < 0.4 ? "-" : Math.abs(slope) > 2.5 ? "|" : slope < 0 ? "/" : "\\";
          ctx.fillText(ch, x * cellW, r1 * cellH);
          // Fill steep jumps so the trace stays continuous.
          for (let r = Math.min(r1, r2) + 1; r < Math.max(r1, r2); r++) ctx.fillText("|", x * cellW, r * cellH);
        }
      }
    };

    const seedSnow = () => {
      const n = Math.round((cols * rows) / 30);
      flakes = Array.from({ length: n }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * cols,
          y: Math.random() * rows,
          depth,
          v: 1.2 + depth * 3.2,
          sway: 0.4 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = '13px ui-monospace, "SF Mono", Menlo, Consolas, monospace';
      ctx.textBaseline = "top";
      ctx.fillStyle = "#f0ede6";
      cellW = Math.max(6, ctx.measureText("M").width);
      cols = Math.ceil(w / cellW);
      rows = Math.ceil(h / cellH);
      const cx = cols * 0.5;
      const cy = rows * 0.55;
      const r = Math.min(w, h) * 0.46;
      radar = {
        cx,
        cy,
        r,
        blips: Array.from({ length: 7 }, () => {
          const th = Math.random() * Math.PI * 2;
          const rr = (0.2 + Math.random() * 0.75) * r;
          return { th, x: cx + (Math.cos(th) * rr) / cellW, y: cy + (Math.sin(th) * rr) / cellH };
        }),
      };
      seedSnow();
    };

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const id = MODES[modeIndex].id;
      if (contours[id]) drawContours(contours[id], t);
      else if (id === "radar") drawRadar(t);
      else if (id === "snow") drawSnow(t);
      else if (id === "scope") drawScope(t);
      ctx.globalAlpha = 1;
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const start = performance.now();
    let timer = 0;
    const iconEl = toggle && toggle.querySelector(".bg-toggle__icon");
    const setIcon = (text) => {
      if (iconEl && iconEl.textContent !== text) iconEl.textContent = text;
    };
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      draw(t);
      const m = MODES[modeIndex];
      if (m.frame) setIcon(m.frame(t));
      timer = window.setTimeout(tick, 1000 / FPS);
    };
    const run = () => {
      window.clearTimeout(timer);
      if (MODES[modeIndex].id === "off") draw(0);
      else if (reduce.matches) draw(8);
      else if (!document.hidden) tick();
    };

    const label = () => {
      if (!toggle) return;
      const m = MODES[modeIndex];
      setIcon(m.icon);
      toggle.setAttribute("aria-label", `Background: ${m.name}. Change background.`);
      toggle.title = `Background: ${m.name} (long-press for off)`;
    };

    const setMode = (i) => {
      modeIndex = i;
      try {
        localStorage.setItem("bg", MODES[modeIndex].id);
      } catch {
        // Private mode or storage off: the choice lasts for this page only.
      }
      label();
      run();
    };

    if (toggle) {
      toggle.hidden = false;
      // Tap: next mode. Long-press (550 ms): straight to Off, the pause control.
      const OFF = MODES.findIndex((m) => m.id === "off");
      let pressTimer = 0;
      let longPressed = false;
      const cancelPress = () => window.clearTimeout(pressTimer);
      toggle.addEventListener("pointerdown", () => {
        longPressed = false;
        cancelPress();
        pressTimer = window.setTimeout(() => {
          longPressed = true;
          if (navigator.vibrate) navigator.vibrate(10);
          setMode(OFF);
        }, 550);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((e) => toggle.addEventListener(e, cancelPress));
      toggle.addEventListener("contextmenu", (e) => e.preventDefault());
      toggle.addEventListener("click", () => {
        if (longPressed) {
          longPressed = false;
          return;
        }
        setMode((modeIndex + 1) % MODES.length);
      });
    }

    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        layout();
        run();
      }, 150);
    });
    document.addEventListener("visibilitychange", run);
    reduce.addEventListener("change", run);
    layout();
    label();
    run();
  }

  // 3. Hello to anyone who opens devtools.
  const mark = [
    "    __  _____",
    "   /  |/  / /",
    "  / /|_/ / /",
    " / /  / / /___",
    "/_/  /_/_____/",
  ].join("\n");
  console.log(
    `%c${mark}\n\n%cLooking under the hood? The source is open:\nhttps://github.com/snowboardit/website`,
    "color:#ff4f00;font-weight:bold;line-height:1.2",
    "color:inherit",
  );
})();
