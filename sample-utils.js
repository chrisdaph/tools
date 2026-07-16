// Builds a notebook-paper demo image from an array of text lines.
// Each line: { t: text, x, y, s: font size, b: bold }
function buildSampleDataUrl(lines) {
  const c = document.createElement('canvas');
  c.width = 600; c.height = 370;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#faf7f2'; ctx.fillRect(0, 0, 600, 370);
  ctx.strokeStyle = '#ddd5c0'; ctx.lineWidth = 1;
  for (let y = 48; y < 370; y += 30) { ctx.beginPath(); ctx.moveTo(10, y); ctx.lineTo(590, y); ctx.stroke(); }
  ctx.strokeStyle = '#f0aaaa'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(56, 0); ctx.lineTo(56, 370); ctx.stroke();
  lines.forEach(({ t, x, y, s, b }) => {
    ctx.font = (b ? 'bold ' : '') + (s || 16) + 'px Georgia, serif';
    ctx.fillStyle = '#1c1410';
    ctx.fillText(t, x, y);
  });
  return c.toDataURL('image/png');
}
