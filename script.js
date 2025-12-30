$(document).ready(function () {
  let score = 0;
  let currentProblem = 0;
  let problems = [];
  let operationsList = [];
  let startTime;
  let timerInterval;

  // Iniciar el juego al hacer clic en el botón "Start"
  $("#start").click(function () {
    let level = parseInt($("#level").val());
    if (level >= 1 && level <= 6) {  // Poner aquí número de niveles
      resetGame();
      startTimer();
      generateProblems(level);
      showProblem();
    }
  });

  // Reiniciar variables y elementos del juego
  function resetGame() {
    score = 0;
    currentProblem = 0;
    problems = [];
    operationsList = [];
    console.log("Called")
    $("#progress-bar, #timer").show();
    $("#progress").css("width", "0%");
    $("#figlet").html(""); // Limpiar mensaje anterior
    $("#score").html("");
  }

  // Generar problemas según el nivel seleccionado
  function generateProblems(level) {
    var aleatorio = level;
    for (let i = 0; i < 120; i++) {     // Poner aquí número de operaciones
     if (aleatorio === 6)
      {  level = Math.floor(Math.random() * 5) + 1  };
      let x = generateIntegerX(level);
      let y = generateIntegerY(level);
      let correctAnswer = x * y / 100;
      problems.push({ x, y, correctAnswer });
    }  
  }

  // 1º NÚMERO: Generar números enteros según el nivel
  function generateIntegerX(level) {
    if (level === 1) return (Math.floor(Math.random() * 49) + 1)*2;
    if (level === 2) return (Math.floor(Math.random() * 49) + 1)*4;
    if (level === 3) return (Math.floor(Math.random() * 49) + 1)*5;
    if (level === 4) return (Math.floor(Math.random() * 49) + 1)*10;
    if (level === 5) return (Math.floor(Math.random() * 49) + 1);
  }
  
  // 2º NÚMERO: Generar números enteros según el nivel
  function generateIntegerY(level) {
    if (level === 1) return 50;
    if (level === 2) return 25;
    if (level === 3) return 20;
    if (level === 4) return 10;
    if (level === 5) return 200;
  }

  // Mostrar el problema actual
  function showProblem() {
    if (currentProblem >= problems.length) {
      endGame();
      return;
    }

    updateProgressBar();
    let problem = problems[currentProblem];
    $("#problems").html(`
      <div class="problemStyle">
        <p class="h4">${problem.y}% de ${problem.x} = </p>
          <form id="problemForm">
            <input type="number" id="answer" class="form-control text-center" placeholder="Tu respuesta" inputmode="numeric">
            <button type="submit" class="btn btn-success mt-2">Enviar</button>
        </form>
      </div>
    `) 
    $("#answer").focus();

    // Manejar la respuesta del usuario
 $("#problemForm").on("submit", function(e) {
   event.preventDefault();
      let userAnswer = parseInt($("#answer").val());
      if (userAnswer === problem.correctAnswer) {
        handleCorrectAnswer(problem);
      } else {
        handleIncorrectAnswer(problem, userAnswer);
      }
      $("#score").html(`<div class="alert alert-success"> Puntuación: ${score}/${currentProblem}</div>`
  );
      updateOperationsList();
    });
  }

  // Manejar respuesta correcta
  function handleCorrectAnswer(problem) {
    if (currentProblem < problems.length) {
    score++;
    operationsList.push({
      text: `${problem.y}% de ${problem.x} = ${problem.correctAnswer}`,
      correct: true
    });
    currentProblem++;
    showProblem();
  }}

  // Manejar respuesta incorrecta
  function handleIncorrectAnswer(problem, userAnswer) {
      if (currentProblem < problems.length) {
        operationsList.push({
        text: `${problem.y}% de ${problem.x} = ${userAnswer} (Correcta: ${problem.correctAnswer})`,
        correct: false
      });
      currentProblem++;
      showProblem();
  }}

  // Actualizar la lista de operaciones
  function updateOperationsList() {
    let listHtml = '<div class="operations-list">';
    operationsList.forEach((operation) => {
      listHtml += `
        <div class="operation-item ${
          operation.correct ? "correct" : "incorrect"
        }">
          ${operation.correct ? "✅" : "❌"} ${operation.text}
        </div>
      `;
    });
    listHtml += "</div>";
    $("#operations-list").html(listHtml);
  }

  // Finalizar el juego
  function endGame() {
    clearInterval(timerInterval);
    $("#score").html(
      `<div class="alert alert-success">🏆 Puntuación: ${score}/${problems.length}</div>`
    );
    $("#score").append(
      `<div class="mt-2">⏱️ Tiempo total: <span id="total-time"></span></div>`
    );
    $("#total-time").text(
      formatTime(Math.floor((Date.now() - startTime) / 1000))
    );

    // Mostrar mensaje especial con estilo llamativo
    showSpecialMessage("¡Enhorabuena!");
  }

  // Mostrar mensaje especial con estilo llamativo
  function showSpecialMessage(message) {
    $("#figlet").html(`
      <div class="special-message">
        ${message}
      </div>
    `);
  }

  // Iniciar el temporizador
  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      $("#time").text(formatTime(elapsedTime));
    }, 1000);
  }

  // Formatear el tiempo en minutos y segundos
  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Actualizar la barra de progreso
  function updateProgressBar() {
    let progress = ((currentProblem + 1) / problems.length) * 100;
    $("#progress").css("width", `${progress}%`);
  }
});
