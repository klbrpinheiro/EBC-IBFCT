const defaultConfig = {
  study_title: "Estudos Bíblicos em Comunidade - Tiago Lição 6",
  study_subtitle: "Fé e Prática",
  memory_verse: '"Portanto, irmãos, sejam pacientes até a vinda do Senhor. Vejam como o agricultor aguarda que a terra produza a preciosa colheita e como espera com paciência até virem as chuvas do outono e da primavera". Tiago 5:7.',
  footer_text: "Seus estudos bíblicos são salvos automaticamente 📖✨",
  background_color: "#667eea",
  surface_color: "#ffffff",
  text_color: "#2d3748",
  primary_action_color: "#48bb78",
  secondary_action_color: "#764ba2"
};

const STORAGE_KEY = 'tiago_licao6_answers';
const FONT_SIZE_KEY = 'tiago_licao6_font_size';
let allAnswers = [];
let currentFontSizeMultiplier = 1;
const FONT_SIZE_STEP = 0.1;
const FONT_SIZE_MIN = 0.7;
const FONT_SIZE_MAX = 2.0;

const questions = {
  "q1-1": "Tiago disse que problemas esperam certas pessoas ricas. O que essas pessoas ricas fizeram para merecer um futuro conturbado?",
  "q1-2": "Como Tiago contrastava o que os ricos estavam desfrutando e o que seus funcionários estavam suportando?",
  "q1-3": "Qual encorajamento uma pessoa oprimida poderia encontrar em 5:4?",
  "q1-4": "O apóstolo Paulo escreveu que Jesus 'sendo rico, se fez pobre por amor de vocês, para que por meio de sua pobreza vocês se tornassem ricos' 2 Coríntios 8:9. Como podemos seguir o exemplo de Jesus independentemente de sermos ricos ou pobres?",
  "q2-5": "O que Tiago instou seus leitores a esperar pacientemente? Por que eles poderiam ter sido tentados a ser impacientes?",
  "q2-6": "Quais são algumas maneiras que os agricultores demonstram paciência?",
  "q2-7": "De 5:8-9, que ação positiva Tiago nos estimula a ter enquanto esperamos o retorno do Senhor? Contra qual atitude negativa ele nos advertiu? Qual destas é mais desafiadora para você?",
  "q3-8": "Que tipo de discurso Tiago proibiu? Você pode pensar em um exemplo desse tipo de discurso?",
  "q3-9": "Como nosso testemunho cristão poderia ser prejudicado quando não fazemos o que prometemos fazer?",
  "q4-10": "Quais circunstâncias diferentes Tiago mencionou e o que ele disse para fazer em cada uma?",
  "q4-11": "Se um cristão está doente e quer orar, quais passos Tiago lhe disse para tomar?",
  "q4-12": "Elias era um profeta no Antigo Testamento. Como o exemplo dele o encoraja? Como o desafia?",
  "q5-13": "Qual Tiago disse ser a nossa responsabilidade para com aqueles que se afastam da verdade?",
  "q5-14": "O que pode levar alguém a se perder, de acordo com Tiago?",
  "q5-15": "O que a preocupação de Deus com a pessoa que se desviou da verdade o diz sobre o caráter de Deus?",
  "q6-16": "Prepare-se para compartilhar com seu grupo: Qual foi o maior desafio desta lição para você? O que Deus tem ensinado através do estudo de Tiago 5?"
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
