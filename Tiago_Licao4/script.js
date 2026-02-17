const defaultConfig = {
  study_title: "Estudos Bíblicos em Comunidade - Tiago Lição 4",
  study_subtitle: "Fé e Fala",
  memory_verse: '"Todos tropeçamos de muitas maneiras. Se alguém não tropeça no falar, tal homem é perfeito, sendo também capaz de dominar todo o seu corpo." Tiago 3:2.',
  footer_text: "Seus estudos bíblicos são salvos automaticamente 📖✨",
  background_color: "#667eea",
  surface_color: "#ffffff",
  text_color: "#2d3748",
  primary_action_color: "#48bb78",
  secondary_action_color: "#764ba2"
};

const STORAGE_KEY = 'tiago_licao4_answers';
const FONT_SIZE_KEY = 'tiago_licao4_font_size';
let allAnswers = [];
let currentFontSizeMultiplier = 1;
const FONT_SIZE_STEP = 0.1;
const FONT_SIZE_MIN = 0.7;
const FONT_SIZE_MAX = 2.0;

const questions = {
  "q1-1": "Que aviso Tiago deu às pessoas que querem ser mestres? Por que ensinar a Palavra de Deus é uma responsabilidade tão séria?",
  "q1-2": "Que maneira específica de tropeçar Tiago advertiu? Por que isso é especialmente importante para os mestres estarem cientes?",
  "q1-3": "Muitas vezes pensamos nos mestres como pessoas que discursam diante de um grupo. De que outras maneiras as pessoas ensinam umas às outras? De qual maneira você é mestre?",
  "q2-4": "Quais imagens Tiago usou para descrever a língua? Para você, qual é mais significativa? Por quê?",
  "q2-5": "Provérbios 18:21 diz que tanto “a língua tem poder sobre a vida e sobre a morte”. Quais são alguns exemplos de como podemos usar nossas palavras para produzir a morte?",
  "q2-6": "Como podemos usar nossas palavras para produzir vida?",
  "q3-7": "Quais contradições Tiago apontou nesses versículos?",
  "q3-8": "O que você acha que Tiago quis dizer quando disse que uma língua descontrolada é \"incontrolável\" (versículo 8)?",
  "q3-9": "Quais são algumas maneiras de “bendizemos nosso Senhor e Pai” com nossas palavras?",
  "q3-10": "Quais são algumas maneiras de abençoar as pessoas com nossas palavras?",
  "q4-11": "De acordo com Tiago, quais qualidades estão presentes em uma pessoa sábia?",
  "q4-12": "Quais atitudes estão presentes no coração de uma pessoa imprudente?",
  "q4-13": "Quais são alguns resultados dessa sabedoria \"não espiritual\" (3:15-16)?",
  "q5-14": "Como Tiago descreveu a sabedoria que vem de Deus?",
  "q5-15": "Qual é a colheita dessa sabedoria? Como esta colheita é diferente da colheita que Tiago descreveu em 3:16?",
  "q5-16": "Qual das qualidades em 3:17 você mais gostaria de ver Deus desenvolver em sua vida? Como viver de acordo com essa qualidade resultaria em uma colheita de paz?",
  "q6-19": "Prepare-se para compartilhar com seu grupo: Qual foi o maior desafio desta lição para você? O que Deus tem ensinado através do estudo de Tiago 2?"
};

function loadAnswersToForm() {
  allAnswers.forEach(answer => {
    const textarea = document.getElementById(`q${answer.day}-${answer.question_number}`);
    if (textarea) {
      textarea.value = answer.answer;
    }
  });
}

function saveAnswersToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allAnswers));
  showToast('✓ Resposta salva automaticamente');
}

function loadAnswersFromLocalStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    allAnswers = JSON.parse(savedData);
    loadAnswersToForm();
    renderSummary();
  }
}

// Controle de tamanho de fonte
function updateFontSize(multiplier) {
  // Limitar entre mínimo e máximo
  if (multiplier < FONT_SIZE_MIN) multiplier = FONT_SIZE_MIN;
  if (multiplier > FONT_SIZE_MAX) multiplier = FONT_SIZE_MAX;
  
  currentFontSizeMultiplier = multiplier;
  document.documentElement.style.setProperty('--font-size-multiplier', multiplier);
  localStorage.setItem(FONT_SIZE_KEY, multiplier);
  
  // Atualizar display de porcentagem
  const percentage = Math.round(multiplier * 100);
  document.getElementById('font-size-display').textContent = percentage + '%';
  
  // Atualizar estado dos botões (desabilitar se no limite)
  document.getElementById('decrease-font').disabled = multiplier <= FONT_SIZE_MIN;
  document.getElementById('increase-font').disabled = multiplier >= FONT_SIZE_MAX;
}

function increaseFontSize() {
  updateFontSize(currentFontSizeMultiplier + FONT_SIZE_STEP);
}

function decreaseFontSize() {
  updateFontSize(currentFontSizeMultiplier - FONT_SIZE_STEP);
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
        <p>Comece respondendo as questões dos dias de estudo!</p>
      </div>
    `;
    return;
  }

  const answersByDay = {};
  allAnswers.forEach(answer => {
    if (!answersByDay[answer.day]) {
      answersByDay[answer.day] = [];
    }
    answersByDay[answer.day].push(answer);
  });

  let html = '';
  for (let day = 1; day <= 6; day++) {
    const dayAnswers = answersByDay[day.toString()] || [];
    if (dayAnswers.length > 0) {
      dayAnswers.sort((a, b) => parseInt(a.question_number) - parseInt(b.question_number));
      
      html += `
        <div class="summary-day">
          <h3 class="summary-day-title">Dia ${day}</h3>
      `;
      
      dayAnswers.forEach(answer => {
        html += `
          <div class="summary-item">
            <div class="summary-question">Questão ${answer.question_number}: ${answer.question_text}</div>
            <div class="summary-answer">${answer.answer}</div>
          </div>
        `;
      });
      
      html += `</div>`;
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

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const view = btn.dataset.view;
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('.day-section, .summary-section').forEach(section => {
      section.classList.remove('active');
    });
    
    document.getElementById(view).classList.add('active');
  });
});

// Salvamento automático ao sair do campo de texto
document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('blur', () => {
    const answer = textarea.value.trim();
    const questionId = textarea.id;
    const day = textarea.dataset.day;
    const questionNumber = textarea.dataset.number;
    const questionText = questions[questionId];

    const existingAnswerIndex = allAnswers.findIndex(
      a => a.day === day && a.question_number === questionNumber
    );

    if (answer) {
      if (existingAnswerIndex !== -1) {
        allAnswers[existingAnswerIndex].answer = answer;
      } else {
        allAnswers.push({
          day: day,
          question_number: questionNumber,
          question_text: questionText,
          answer: answer,
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

// Event listeners para controle de tamanho de fonte
document.getElementById('decrease-font').addEventListener('click', () => {
  decreaseFontSize();
});

document.getElementById('increase-font').addEventListener('click', () => {
  increaseFontSize();
});

document.querySelectorAll('.save-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    const questionId = btn.dataset.question;
    const textarea = document.getElementById(questionId);
    const answer = textarea.value.trim();

    if (!answer) {
      showToast('Por favor, escreva uma resposta antes de salvar', true);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Salvando...';

    const day = textarea.dataset.day;
    const questionNumber = textarea.dataset.number;
    const questionText = questions[questionId];

    const existingAnswerIndex = allAnswers.findIndex(
      a => a.day === day && a.question_number === questionNumber
    );

    if (existingAnswerIndex !== -1) {
      allAnswers[existingAnswerIndex].answer = answer;
    } else {
      allAnswers.push({
        day: day,
        question_number: questionNumber,
        question_text: questionText,
        answer: answer,
        created_at: new Date().toISOString()
      });
    }

    saveAnswersToLocalStorage();
    renderSummary();
    
    btn.disabled = false;
    btn.textContent = 'Salvar Resposta';
  });
});

async function initApp() {
  initFontSize();
  loadAnswersFromLocalStorage();
}

initApp();
