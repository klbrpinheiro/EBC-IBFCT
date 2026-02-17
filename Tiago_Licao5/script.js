const defaultConfig = {
  study_title: "Estudos Bíblicos em Comunidade - Tiago Lição 5",
  study_subtitle: "Fé e Luta",
  memory_verse: '"Portanto, submetam-se a Deus. Resistam ao Diabo, e ele fugirá de vocês". Tiago 4:7.',
  footer_text: "Seus estudos bíblicos são salvos automaticamente 📖✨",
  background_color: "#667eea",
  surface_color: "#ffffff",
  text_color: "#2d3748",
  primary_action_color: "#48bb78",
  secondary_action_color: "#764ba2"
};

const STORAGE_KEY = 'tiago_licao5_answers';
const FONT_SIZE_KEY = 'tiago_licao5_font_size';
let allAnswers = [];
let currentFontSizeMultiplier = 1;
const FONT_SIZE_STEP = 0.1;
const FONT_SIZE_MIN = 0.7;
const FONT_SIZE_MAX = 2.0;

const questions = {
  "q1-1": "O que Tiago disse ser a fonte de conflito nos relacionamentos?",
  "q1-2": "Como os desejos podem destruir relacionamentos?",
  "q1-3": "Quais razões Tiago deu para não termos as coisas que desejamos?",
  "q2-4": "Como a amizade com o mundo afeta nosso relacionamento com Deus?",
  "q2-5": "Por que você acha que é impossível ser amigo do mundo e de Deus ao mesmo tempo?",
  "q2-6": "Como o orgulho e a humildade afetam o relacionamento de uma pessoa com Deus? Você já experimentou os efeitos do orgulho ou da humildade em seu próprio relacionamento com Deus? Explique.",
  "q3-7": "Qual resposta a Deus 4:7 ordena?",
  "q3-8": "Quais são algumas maneiras práticas de obedecer ao mandamento de “resistir ao diabo”?",
  "q3-9": "Quais respostas para Deus 4:8-10 ordenam? Em suas próprias palavras, descreva cada uma delas.",
  "q3-10": "Qual dos comandos em 4:7-10 é mais significativo para você agora? Por quê?",
  "q4-11": "Quando falamos uns contra os outros, o que Tiago disse que estamos realmente fazendo?",
  "q4-12": "Se criticarmos a lei, o que isso diz sobre o que pensamos do legislador?",
  "q4-13": "Como uma atitude adequada em relação a Deus nos ajuda a ter uma atitude adequada em relação aos outros?",
  "q5-14": "Quais atitudes contrastantes sobre o futuro Tiago descreveu?",
  "q5-15": "As Escrituras não proíbem fazer planos. Mas o que devemos sempre lembrar quando fazemos nossos planos?",
  "q5-16": "Como humanos finitos, há muito que não podemos saber. Mas Tiago disse que há algumas coisas que sabemos e devemos planejar fazer. O que deveríamos fazer? Qual é o resultado se não o fizermos?",
  "q6-19": "Prepare-se para compartilhar com seu grupo: Qual foi o maior desafio desta lição para você? O que Deus tem ensinado através do estudo de Tiago 4?"
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
