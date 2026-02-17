const defaultConfig = {
  study_title: "Estudos Bíblicos em Comunidade - Tiago Lição 3",
  study_subtitle: "Fé e Sociedade",
  memory_verse: '"Assim como o corpo sem espírito está morto, também a fé sem obras está morta." Tiago 2:26.',
  footer_text: "Seus estudos bíblicos são salvos automaticamente 📖✨",
  background_color: "#667eea",
  surface_color: "#ffffff",
  text_color: "#2d3748",
  primary_action_color: "#48bb78",
  secondary_action_color: "#764ba2"
};

const STORAGE_KEY = 'tiago_licao3_answers';
const FONT_SIZE_KEY = 'tiago_licao3_font_size';
let allAnswers = [];
let currentFontSizeMultiplier = 1;
const FONT_SIZE_STEP = 0.1;
const FONT_SIZE_MIN = 0.7;
const FONT_SIZE_MAX = 2.0;

const questions = {
  "q1-1": "Que comportamento Tiago advertiu contra?",
  "q1-2": "Qual exemplo Tiago usou para ajudar seus leitores a reconhecer esse tipo de comportamento?",
  "q1-3": "Além dos ricos e poderosos, quem mais poderia receber atenção especial entre as reuniões de cristãos hoje? Como mostrar favoritismo pode trazer problemas para o povo de Deus?",
  "q2-4": "De acordo com Tiago, qual é a 'lei real' para relacionamentos?",
  "q2-5": "Como você acha que favorecer um grupo de pessoas ao em vez de outro grupo viola a lei real?",
  "q2-6": "Tiago nos exortou a mostrar misericórdia em vez de julgamento (2:13). Quais são algumas maneiras que você já observou as pessoas mostrando misericórdia para os outros?",
  "q3-7": "Qual é o valor da fé que não é acompanhada por ações?",
  "q3-8": "Leia Tiago 2:17 juntamente com as palavras de Paulo em Romanos 3:28: 'Pois sustentamos que o homem é justificado pela fé, independente da obediência à Lei'. Ambas as afirmações são a Palavra de Deus e são verdadeiras. Como você explicaria como eles se relacionam?",
  "q3-9": "Que exemplo Tiago deu para provar que a fé sem as obras é morta? Como esse exemplo esclarece o que ele quis dizer?",
  "q4-10": "O que a disposição de Abraão em obedecer provou sobre sua fé?",
  "q4-11": "Por que Tiago disse que Abraão era o amigo de Deus? O que a confiança tem a ver com amizade?",
  "q4-12": "Por que você acha que Deus valoriza nossa confiança nEle? Como você pode aprofundar sua amizade com Deus?",
  "q5-13": "De acordo com Tiago 2:25, como as ações de Raabe provaram sua fé?",
  "q5-14": "A que Tiago comparou a fé sem obras em 2:26?",
  "q5-15": "Tiago falou sobre favoritismo, julgamento, fé e boas obras. Onde esta lição te desafiou mais? Por quê?",
  "q6-16": "Como você pode aplicar o ensinamento sobre imparcialidade e amor ao próximo em sua vida diária? Cite exemplos práticos.",
  "q6-17": "Reflita sobre a 'lei real' de amar o próximo. De que forma você tem demonstrado amor e misericórdia aos que estão ao seu redor?",
  "q6-18": "Como sua fé tem se manifestado em ações concretas? Que oportunidades Deus tem colocado em seu caminho para demonstrar compaixão e misericórdia?",
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
