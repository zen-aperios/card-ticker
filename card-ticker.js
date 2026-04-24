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

  function t() {
    while (c.scrollWidth < 2.5 * e.clientWidth) {
      f.forEach((item) => c.appendChild(item.cloneNode(true)));
      f = Array.from(c.children);
    }
  }

  function normalize() {
    const gap = Number.parseFloat(getComputedStyle(c).gap) || 0;

    if (d === -1) {
      while (f.length) {
        const first = f[0];
        const width = first.offsetWidth + gap;
        if (!(h <= -width)) break;
        h += width;
        c.appendChild(first);
        f.push(f.shift());
      }
    } else {
      // Recycle as soon as we reach/past zero to prevent left-side gap.
      while (f.length) {
        const last = f[f.length - 1];
        const width = last.offsetWidth + gap;
        if (!(h >= 0)) break;
        h -= width;
        c.insertBefore(last, f[0]);
        f.unshift(f.pop());
      }
    }
  }

  function render() {
    normalize();
    c.style.transform = `translateX(${h}px)`;
  }

  window.addEventListener("resize", () => {
    h = 0;
    s = null;
    t();
    render();
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) s = null;
  });

  e.style.touchAction = "pan-y";

  e.addEventListener("pointerdown", (ev) => {
    if (ev.button !== 0) return;
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

  t();
  render();

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
