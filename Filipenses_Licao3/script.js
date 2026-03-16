const STORAGE_KEY = document.body.dataset.storageKey || 'filipenses_answers';
const FONT_SIZE_KEY = document.body.dataset.fontKey || 'filipenses_font_size';

let allAnswers = [];
let currentFontSizeMultiplier = 1;
const FONT_SIZE_STEP = 0.1;
const FONT_SIZE_MIN = 0.7;
const FONT_SIZE_MAX = 2.0;

function getQuestionText(textarea) {
  const block = textarea.closest('.question-block');
  const questionTextEl = block ? block.querySelector('.question-text') : null;
  return questionTextEl ? questionTextEl.textContent.trim() : '';
}

function loadAnswersToForm() {
  allAnswers.forEach((answer) => {
    const textarea = document.getElementById(`q${answer.day}-${answer.question_number}`);
    if (textarea) {
      textarea.value = answer.answer;
    }
  });
}

function saveAnswersToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allAnswers));
  showToast('Resposta salva automaticamente');
}

function loadAnswersFromLocalStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    allAnswers = JSON.parse(savedData);
    loadAnswersToForm();
    renderSummary();
  }
}

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

function renderSummary() {
  const summaryContent = document.getElementById('summary-content');
  if (!summaryContent) return;

  if (allAnswers.length === 0) {
    summaryContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">R</div>
        <h3>Nenhuma resposta ainda</h3>
        <p>Comece respondendo as questoes dos dias de estudo.</p>
      </div>
    `;
    return;
  }

  const answersByDay = {};
  allAnswers.forEach((answer) => {
    if (!answersByDay[answer.day]) {
      answersByDay[answer.day] = [];
    }
    answersByDay[answer.day].push(answer);
  });

  const availableDays = Object.keys(answersByDay)
    .map((d) => parseInt(d, 10))
    .sort((a, b) => a - b);

  let html = '';
  availableDays.forEach((day) => {
    const dayAnswers = answersByDay[String(day)] || [];
    dayAnswers.sort((a, b) => parseInt(a.question_number, 10) - parseInt(b.question_number, 10));

    html += `<div class="summary-day"><h3 class="summary-day-title">Dia ${day}</h3>`;
    dayAnswers.forEach((answer) => {
      html += `
        <div class="summary-item">
          <div class="summary-question">Questao ${answer.question_number}: ${answer.question_text}</div>
          <div class="summary-answer">${answer.answer}</div>
        </div>
      `;
    });
    html += '</div>';
  });

  summaryContent.innerHTML = html;
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

document.querySelectorAll('.nav-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;

    document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.day-section, .summary-section').forEach((section) => {
      section.classList.remove('active');
    });

    const target = document.getElementById(view);
    if (target) target.classList.add('active');
  });
});

document.querySelectorAll('textarea').forEach((textarea) => {
  textarea.addEventListener('blur', () => {
    const answer = textarea.value.trim();
    const day = textarea.dataset.day;
    const questionNumber = textarea.dataset.number;
    const questionText = getQuestionText(textarea);

    const existingAnswerIndex = allAnswers.findIndex(
      (a) => a.day === day && a.question_number === questionNumber
    );

    if (answer) {
      if (existingAnswerIndex !== -1) {
        allAnswers[existingAnswerIndex].answer = answer;
      } else {
        allAnswers.push({
          day,
          question_number: questionNumber,
          question_text: questionText,
          answer,
          created_at: new Date().toISOString()
        });
      }
    } else if (existingAnswerIndex !== -1) {
      allAnswers.splice(existingAnswerIndex, 1);
    }

    saveAnswersToLocalStorage();
    renderSummary();
  });
});

document.getElementById('decrease-font').addEventListener('click', () => {
  updateFontSize(currentFontSizeMultiplier - FONT_SIZE_STEP);
});

document.getElementById('increase-font').addEventListener('click', () => {
  updateFontSize(currentFontSizeMultiplier + FONT_SIZE_STEP);
});

function initApp() {
  initFontSize();
  loadAnswersFromLocalStorage();
}

initApp();

