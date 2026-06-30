(function () {
  const key = 'mit-reader-scale';
  const steps = [0.9, 1, 1.12, 1.25, 1.4];

  function clampIndex(index) {
    return Math.max(0, Math.min(steps.length - 1, index));
  }

  function getIndex() {
    const raw = window.localStorage.getItem(key);
    const saved = raw === null ? NaN : Number(raw);
    if (Number.isInteger(saved)) return clampIndex(saved);
    return 1;
  }

  function applyScale(index) {
    const safeIndex = clampIndex(index);
    document.documentElement.style.setProperty('--reader-scale', String(steps[safeIndex]));
    window.localStorage.setItem(key, String(safeIndex));
    document.querySelectorAll('.reader-size-control button').forEach((button) => {
      button.setAttribute('aria-pressed', button.textContent === 'A' && safeIndex === 1 ? 'true' : 'false');
    });
  }

  function buildControl() {
    if (document.querySelector('.reader-size-control')) return;

    const wrap = document.createElement('div');
    wrap.className = 'reader-size-control';
    wrap.setAttribute('aria-label', 'Ukuran teks pembaca');

    [
      ['A-', 'Perkecil teks', -1],
      ['A', 'Ukuran normal', 0],
      ['A+', 'Perbesar teks', 1],
    ].forEach(([label, title, delta]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.title = title;
      button.setAttribute('aria-label', title);
      button.addEventListener('click', () => {
        const current = getIndex();
        applyScale(delta === 0 ? 1 : current + Number(delta));
      });
      wrap.appendChild(button);
    });

    document.body.appendChild(wrap);
    applyScale(getIndex());
  }

  function start() {
    window.setTimeout(buildControl, 350);
  }

  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start, { once: true });
  }
})();
