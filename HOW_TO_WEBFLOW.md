# Card Ticker Mini Guide (Webflow)

## 1) Add Script

In `Project Settings -> Custom Code -> Footer` (before `</body>`):

```html
<script src="https://cdn.jsdelivr.net/gh/zen-aperios/card-ticker@main/card-ticker.min.js"></script>
```

## 2) Build Structure

Use this structure in Designer:

```html
<div class="ticker-slider" data-direction="left" data-speed="80">
  <div class="track">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
  </div>
</div>
```

- `.ticker-slider` is wrapper
- `.track` is moving row
- `data-direction="left"` or `data-direction="right"`
- `data-speed="80"` is optional (pixels per second)

## 3) CSS Must-Haves

```css
.ticker-slider { overflow: hidden; touch-action: pan-y; }
.track { display: flex; gap: 12px; width: max-content; will-change: transform; }
```

## 4) Drag Support

Desktop and touch drag are built in:

- Drag left/right directly on `.ticker-slider`
- Auto-scroll resumes after release

## 5) Publish

Publish and hard refresh.
