const defaultConfig = {
  study_title: 'Estudos Biblicos em Comunidade - Tiago Licao 2',
  study_subtitle: 'Fe e Crescimento',
  memory_verse: '"Se algum de voces tem falta de sabedoria, peca-a a Deus, que a todos da livremente, de boa vontade; e lhe sera concedida". Tiago 1:5.',
  footer_text: 'Seus estudos biblicos sao salvos automaticamente',
  background_color: '#667eea',
  surface_color: '#ffffff',
  text_color: '#2d3748',
  primary_action_color: '#48bb78',
  secondary_action_color: '#764ba2'
};

const STORAGE_KEY = 'tiago_licao2_answers';
const FONT_SIZE_KEY = 'tiago_licao2_font_size';
let allAnswers = [];
let currentFontSizeMultiplier = 1;
const FONT_SIZE_STEP = 0.1;
const FONT_SIZE_MIN = 0.7;
const FONT_SIZE_MAX = 2.0;

const questions = {
  'q1-1': 'Qual atitude Tiago exortou os cristaos a ter quando enfrentam as varias provacoes da vida?',
  'q1-2': 'Quais beneficios resultam dessa atitude?',
  'q1-3': 'Como voce acha que a firmeza se parece na pratica? De um exemplo especifico, se puder.',
  'q2-4': 'O que Tiago disse para pedir durante as provacoes da vida?',
  'q2-5': 'Como Tiago descreveu a pessoa que duvida que Deus sera generoso em dar sabedoria?',
  'q2-6': 'Que perspectiva Tiago encorajou os cristaos pobres e ricos a ter sobre sua situacao financeira?',
  'q3-7': 'O que Tiago queria que seus leitores soubessem sobre o carater de Deus (1:13, 17)?',
  'q3-8': 'A partir de suas observacoes, quais desculpas as pessoas usam para ceder a tentacao?',
  'q3-9': 'O que Tiago identificou como a verdadeira fonte de tentacao?',
  'q4-10': 'Quais atitudes e acoes esta passagem encoraja?',
  'q4-11': 'Quais atitudes e acoes essa passagem desencoraja?',
  'q4-12': 'O que e perigoso em apenas ouvir a Palavra de Deus e nao fazer o que ela diz?',
  'q4-13': 'Como voce acha que a liberdade pode vir da "lei perfeita, a lei da liberdade"?',
  'q5-14': 'Quais exemplos de religiao genuina em acao voce ve nesses versiculos?',
  'q5-15': 'Por que voce acha que orfaos e viuvas precisam de atencao especial?',
  'q5-16': 'Quais sao algumas maneiras pelas quais o mundo pode corromper uma pessoa que esta tentando seguir Cristo?',
  'q6-17': 'Prepare-se para compartilhar com seu grupo: qual foi o maior desafio desta licao para voce? O que Deus tem ensinado atraves do estudo de Tiago 1?'
};

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
  }
}

function renderSummary() {
  const summaryContent = document.getElementById('summary-content');

  if (allAnswers.length === 0) {
    summaryContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
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

  let html = '';
  for (let day = 1; day <= 6; day++) {
    const dayAnswers = answersByDay[day.toString()] || [];
    if (dayAnswers.length > 0) {
      dayAnswers.sort((a, b) => parseInt(a.question_number, 10) - parseInt(b.question_number, 10));

      html += `
        <div class="summary-day">
          <h3 class="summary-day-title">Dia ${day}</h3>
      `;

      dayAnswers.forEach((answer) => {
        html += `
          <div class="summary-item">
            <div class="summary-question">Questao ${answer.question_number}: ${answer.question_text}</div>
            <div class="summary-answer">${answer.answer}</div>
          </div>
        `;
      });

      html += '</div>';
    }
  }

  summaryContent.innerHTML = html;
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
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

    document.getElementById(view).classList.add('active');
  });
});

document.querySelectorAll('textarea').forEach((textarea) => {
  textarea.addEventListener('blur', () => {
    const answer = textarea.value.trim();
    const questionId = textarea.id;
    const day = textarea.dataset.day;
    const questionNumber = textarea.dataset.number;
    const questionText = questions[questionId];

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
