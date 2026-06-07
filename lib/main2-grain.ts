/** Paint every `.main2-grain-surface` with tiny repeating film grain (40px tile). */
export function paintMain2GrainSurfaces() {
  const tile = 40;

  const buildGrainTile = () => {
    const canvas = document.createElement("canvas");
    canvas.width = tile;
    canvas.height = tile;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return "";

    const image = ctx.createImageData(tile, tile);
    const pixels = image.data;

    for (let i = 0; i < pixels.length; i += 4) {
      if (Math.random() > 0.82) continue;

      const light = Math.random() > 0.5;
      const lum = light
        ? 235 + Math.floor(Math.random() * 20)
        : 22 + Math.floor(Math.random() * 30);

      pixels[i] = lum;
      pixels[i + 1] = lum;
      pixels[i + 2] = lum;
      pixels[i + 3] = 4 + Math.floor(Math.random() * 10);
    }

    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL("image/png");
  };

  const tilePx = `${tile}px`;
  const offsetPx = `${tile / 2}px`;
  const urlA = buildGrainTile();
  const urlB = buildGrainTile();

  document.querySelectorAll<HTMLElement>(".main2-grain-surface").forEach((layer) => {
    layer.style.backgroundImage = `url(${urlA}), url(${urlB})`;
    layer.style.backgroundSize = `${tilePx} ${tilePx}, ${tilePx} ${tilePx}`;
    layer.style.backgroundPosition = `0 0, ${offsetPx} ${offsetPx}`;
    layer.style.backgroundRepeat = "repeat";
  });
}
