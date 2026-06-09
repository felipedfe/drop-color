/**
 * Creates a simple interactive button (rectangle + label).
 * Returns { btn, text } so callers can further customize or destroy them.
 */
export function createButton(scene, x, y, label, callback, options = {}) {
  const {
    width = 220,
    height = 55,
    color = 0x3a7bd5,
    hoverColor = 0x5599ee,
    pressColor = 0x2255aa,
    textStyle = {},
  } = options;

  const btn = scene.add
    .rectangle(x, y, width, height, color)
    .setInteractive({ useHandCursor: true });

  const text = scene.add
    .text(x, y, label, {
      fontSize: '22px',
      fontFamily: 'Arial Black, Arial',
      color: '#ffffff',
      ...textStyle,
    })
    .setOrigin(0.5);

  btn.on('pointerover', () => btn.setFillStyle(hoverColor));
  btn.on('pointerout', () => btn.setFillStyle(color));
  btn.on('pointerdown', () => btn.setFillStyle(pressColor));
  btn.on('pointerup', () => {
    btn.setFillStyle(color);
    callback();
  });

  return { btn, text };
}
