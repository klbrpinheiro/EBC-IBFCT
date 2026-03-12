const FONT_SIZE_KEY = 'tiago_licao1_font_size';
let currentFontSizeMultiplier = 1;
const FONT_SIZE_STEP = 0.1;
const FONT_SIZE_MIN = 0.7;
const FONT_SIZE_MAX = 2.0;

function updateFontSize(multiplier) {
  if (multiplier < FONT_SIZE_MIN) multiplier = FONT_SIZE_MIN;
  if (multiplier > FONT_SIZE_MAX) multiplier = FONT_SIZE_MAX;

  currentFontSizeMultiplier = multiplier;
  document.documentElement.style.setProperty('--font-size-multiplier', multiplier);
  localStorage.setItem(FONT_SIZE_KEY, multiplier);

  const percentage = Math.round(multiplier * 100);
  document.getElementById('font-size-display').textContent = percentage + '%';

  document.getElementById('decrease-font').disabled = multiplier <= FONT_SIZE_MIN;
  document.getElementById('increase-font').disabled = multiplier >= FONT_SIZE_MAX;
}

function initFontSize() {
  const savedFontSize = localStorage.getItem(FONT_SIZE_KEY);
  if (savedFontSize) {
    updateFontSize(parseFloat(savedFontSize));
  } else {
    updateFontSize(1);
  }
}

document.getElementById('decrease-font').addEventListener('click', () => {
  updateFontSize(currentFontSizeMultiplier - FONT_SIZE_STEP);
});

document.getElementById('increase-font').addEventListener('click', () => {
  updateFontSize(currentFontSizeMultiplier + FONT_SIZE_STEP);
});

initFontSize();
