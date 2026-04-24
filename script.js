document.querySelectorAll(".ticker-slider").forEach((e) => {
  let c = e.querySelector(".track");
  if (c) {
    let d = e.dataset.direction === "right" ? 1 : -1,
      f = Array.from(c.children),
      h = 0,
      s = null;

    function t() {
      for (; c.scrollWidth < 2.5 * e.clientWidth; ) {
        f.forEach((item) => c.appendChild(item.cloneNode(true)));
        f = Array.from(c.children);
      }
    }

    window.addEventListener("resize", () => {
      h = 0;
      s = null;
      t();
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) s = null;
    });

    t();

    requestAnimationFrame(function loop(time) {
      let delta = (time - (s === null ? time : s)) / 1000;
      s = time;
      delta = Math.min(delta, 0.05);
      h += 80 * d * delta;

      const gap = Number.parseFloat(getComputedStyle(c).gap) || 0;

      if (d === -1) {
        for (; f.length; ) {
          const first = f[0];
          const width = first.offsetWidth + gap;
          if (!(h <= -width)) break;
          h += width;
          c.appendChild(first);
          f.push(f.shift());
        }
      } else {
        for (; f.length; ) {
          const last = f[f.length - 1];
          const width = last.offsetWidth + gap;
          if (!(h >= width)) break;
          h -= width;
          c.insertBefore(last, f[0]);
          f.unshift(f.pop());
        }
      }

      c.style.transform = `translateX(${h}px)`;
      requestAnimationFrame(loop);
    });
  }
});
