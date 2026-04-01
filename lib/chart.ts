export function buildSvgPaths(
  ratings: number[],
  width = 360,
  height = 80
): { linePath: string; fillPath: string; lastX: number; lastY: number } {
  if (ratings.length < 2) {
    return { linePath: "", fillPath: "", lastX: width, lastY: height / 2 };
  }

  const min = Math.min(...ratings);
  const max = Math.max(...ratings);
  const range = (max - min) || 1;

  const padTop = 10;
  const padBot = 10;
  const usableH = height - padTop - padBot;

  const pts = ratings.map((r, i) => ({
    x: (i / (ratings.length - 1)) * width,
    y: padTop + usableH - ((r - min) / range) * usableH,
  }));

  // Smooth cubic bezier
  let line = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1];
    const c = pts[i];
    const cpx = ((p.x + c.x) / 2).toFixed(1);
    line += ` C${cpx},${p.y.toFixed(1)} ${cpx},${c.y.toFixed(1)} ${c.x.toFixed(1)},${c.y.toFixed(1)}`;
  }

  const last = pts[pts.length - 1];
  const fill = `${line} L${width},${height} L0,${height} Z`;

  return { linePath: line, fillPath: fill, lastX: last.x, lastY: last.y };
}
