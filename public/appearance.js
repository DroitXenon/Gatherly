// Runs before CSS is painted so a saved/system dark theme never flashes light.
(() => {
  const key = 'gatherly-appearance';
  const valid = value => ['system', 'light', 'dark'].includes(value);
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = 'system';
  try {
    const saved = localStorage.getItem(key);
    if (valid(saved)) preference = saved;
  } catch {}

  function apply() {
    const theme = preference === 'system' ? (system.matches ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0c10' : '#f5f5f7');
    const control = document.querySelector('#appearance');
    if (control) control.value = preference;
  }

  function choose(value) {
    if (!valid(value)) return;
    preference = value;
    try { localStorage.setItem(key, value); } catch {}
    apply();
  }

  apply();
  system.addEventListener('change', () => { if (preference === 'system') apply(); });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) {
      preference = valid(event.newValue) ? event.newValue : 'system';
      apply();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelector('#appearance')?.addEventListener('change', event => choose(event.target.value));
  });
})();
