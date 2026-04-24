document.querySelectorAll(".ticker-slider").forEach((e) => {
  const c = e.querySelector(".track");
  if (!c) return;

  const d = e.dataset.direction === "right" ? 1 : -1;
  const speed = Number.parseFloat(e.dataset.speed || "80") || 80;
  let f = Array.from(c.children);
  let h = 0;
  let s = null;
  let dragging = false;
  let pointerId = null;
  let lastPointerX = 0;
  let gap = 0;

  function t() {
    while (c.scrollWidth < 2.5 * e.clientWidth) {
      f.forEach((item) => c.appendChild(item.cloneNode(true)));
      f = Array.from(c.children);
    }
    gap = Number.parseFloat(getComputedStyle(c).gap) || 0;
    f.forEach((item) => {
      item.setAttribute("draggable", "false");
      item.style.userSelect = "none";
      item.style.webkitUserSelect = "none";
    });
  }

  function itemSpan(item) {
    const cs = getComputedStyle(item);
    const marginLeft = Number.parseFloat(cs.marginLeft) || 0;
    const marginRight = Number.parseFloat(cs.marginRight) || 0;
    return item.offsetWidth + marginLeft + marginRight + gap;
  }

  function normalize() {
    if (d === -1) {
      while (f.length) {
        const first = f[0];
        const width = itemSpan(first);
        if (!(h <= -width)) break;
        h += width;
        c.appendChild(first);
        f.push(f.shift());
      }
    } else {
      // Recycle as soon as we reach/past zero to prevent left-side gap.
      while (f.length) {
        const last = f[f.length - 1];
        const width = itemSpan(last);
        if (!(h >= 0)) break;
        h -= width;
        c.insertBefore(last, f[0]);
        f.unshift(f.pop());
      }
    }
  }

  function seedRightBuffer() {
    if (d !== 1 || !f.length) return;

    let covered = 0;
    const target = e.clientWidth * 1.25;
    let safety = 0;

    while (covered < target && f.length && safety < f.length * 4) {
      const last = f[f.length - 1];
      const width = itemSpan(last);
      if (!Number.isFinite(width) || width <= 0) break;
      h -= width;
      covered += width;
      c.insertBefore(last, f[0]);
      f.unshift(f.pop());
      safety += 1;
    }
  }

  function render() {
    normalize();
    c.style.transform = `translateX(${h}px)`;
  }

  function recalc() {
    h = 0;
    s = null;
    t();
    seedRightBuffer();
    render();
  }

  window.addEventListener("resize", recalc);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) s = null;
  });

  e.style.touchAction = "pan-y";
  e.style.userSelect = "none";
  c.style.touchAction = "pan-y";
  c.style.userSelect = "none";
  c.style.webkitUserSelect = "none";

  e.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0) return;
    ev.preventDefault();
    dragging = true;
    pointerId = ev.pointerId;
    lastPointerX = ev.clientX;
    s = null;
    e.setPointerCapture?.(pointerId);
  });

  e.addEventListener("pointermove", (ev) => {
    if (!dragging || ev.pointerId !== pointerId) return;
    const dx = ev.clientX - lastPointerX;
    lastPointerX = ev.clientX;
    h += dx;
    render();
  });

  function endDrag(ev) {
    if (!dragging || ev.pointerId !== pointerId) return;
    dragging = false;
    pointerId = null;
    s = null;
    e.releasePointerCapture?.(ev.pointerId);
  }

  e.addEventListener("pointerup", endDrag);
  e.addEventListener("pointercancel", endDrag);

  recalc();

  // Lightweight one-time first-load corrections.
  window.addEventListener(
    "load",
    () => {
      recalc();
      setTimeout(recalc, 180);
    },
    { once: true }
  );
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(recalc).catch(() => {});
  }

  requestAnimationFrame(function loop(time) {
    let delta = (time - (s === null ? time : s)) / 1000;
    s = time;
    delta = Math.min(delta, 0.05);

    if (!dragging) {
      h += speed * d * delta;
      render();
    }

    requestAnimationFrame(loop);
  });
});
