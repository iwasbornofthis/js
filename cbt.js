window.onload = function () {

    let startTime = Date.now();
    let timerId;
    let elapsedTime;
    let minutes;
    let seconds;

    // 시간 업데이트 함수
    function updateTime() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime; // 밀리초 단위 시간 차이

        // 분과 초로 변환
        minutes = Math.floor(elapsedTime / 60000);
        seconds = Math.floor((elapsedTime % 60000) / 1000);

        // 시간 표시
        document.getElementById("timer").innerText = `시간: ${minutes} 분 ${seconds} 초`;
    }

    // 1초마다 시간 업데이트
    timerId = setInterval(updateTime, 1000);

    // 시간 표시
   


    const cbtForm = document.getElementById('cbtForm');
    const questionContainer = document.getElementById('question-container');
    let currentQuestionIndex = 0;
    let answeredQuestions = {};
    let wrongAnswers = {};

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function displayQuestion(questionIndex) {
        const currentQuestion = quiz[questionIndex];
        if (currentQuestion) {
            const shuffledChoices = shuffleArray(Object.entries(currentQuestion.choices));


            questionContainer.innerHTML = `<div class="question-header">${currentQuestion.question}</div>`;

            shuffledChoices.forEach(([key, value], index) => {
                const delay = index * 0.2;
                questionContainer.innerHTML += `
            <div class="choice-container" style="animation-delay: ${delay}s">
              <input type="radio" name="answer" value="${key}" id="${key}">
              <label class="option" for="${key}">${value}</label>
            </div>
          `;
            });

            document.querySelectorAll('.choice-container').forEach(function (container, index) {
                container.style.opacity = 0;
                container.classList.add('visible');
            });
        }
    }

    function displayRandomQuestion() {
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = ((elapsedTime % 60000) / 1000).toFixed(0);
        const questionIndexes = Object.keys(quiz);
        const unansweredQuestions = questionIndexes.filter(q => !answeredQuestions[q]);

        if (unansweredQuestions.length !== 0) {
            currentQuestionIndex = unansweredQuestions[Math.floor(Math.random() * unansweredQuestions.length)];
            displayQuestion(currentQuestionIndex);
        } else {
            clearInterval(timerId);
            const answeredCount = Object.keys(answeredQuestions).length;
            questionContainer.innerHTML = `
            <p>시간: ${minutes} 분 ${seconds} 초</p>초
          <p>모든 문제를 완료하였습니다. 감사합니다!</p>
          <p>총 ${answeredCount}개의 문제를 풀었습니다.</p>
          <button id="restart-button" onclick="restartQuiz()">다시 시작</button>
        `;
        }
    }



    function handleAnswer(selectedAnswer, currentQuestion) {
        if (selectedAnswer.value === currentQuestion.correctChoice) {
            answeredQuestions[currentQuestionIndex] = 'correct';
        } else {
            answeredQuestions[currentQuestionIndex] = 'wrong';
            wrongAnswers[currentQuestionIndex] = selectedAnswer.value;
        }
    }

    cbtForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            const currentQuestion = quiz[currentQuestionIndex];
            handleAnswer(selectedAnswer, currentQuestion);
            const allQuestionsAnswered = Object.keys(quiz).length === Object.keys(answeredQuestions).length;
            if (allQuestionsAnswered) {
                calculateAndShowResults();
            } else {
                displayRandomQuestion();
            }
        } else {
            alert('답변을 선택해 주세요.');
        }
    });

    function calculateAndShowResults() {
        const wrongNoteContainer = document.getElementById('wrong-note-container');
        const resultsContainer = document.getElementById('results-container');
        const totalQuestions = Object.keys(quiz).length;
        const wrongCount = Object.values(answeredQuestions).filter(val => val === 'wrong').length;

        if (wrongCount === 0) {
            alert('축하합니다! 모든 문제를 맞췄습니다.');
            clearInterval(timerId);

        } else {
            alert(`총 ${totalQuestions}문제 중 ${wrongCount}문제를 틀렸습니다.`);
            clearInterval(timerId);

        }

        // 결과 컨테이너 내용 설정
        resultsContainer.innerHTML = `
        문제를 푸는데 걸린 시간: ${minutes} 분 ${seconds} 초
          ${wrongCount > 0 ? '<button id="review-wrong-answers">오답노트 보기</button>' : ''}
          <button id="restart-button">다시 시작</button>
        `;
        if (wrongCount > 0) {
            const reviewWrongAnswersButton = document.getElementById('review-wrong-answers');
            reviewWrongAnswersButton.addEventListener('click', displayWrongAnswers);
        }
        // 이벤트 리스너 설정
        const restartButton = document.getElementById('restart-button');
        restartButton.addEventListener('click', restartQuiz);

        // wrongNoteContainer를 다시 추가하기 전에 기존 부모 노드에서 제거
        if (wrongNoteContainer && wrongNoteContainer.parentNode) {
            wrongNoteContainer.parentNode.removeChild(wrongNoteContainer);
        }

        // resultsContainer에 wrongNoteContainer를 추가
        if (wrongNoteContainer) {
            resultsContainer.appendChild(wrongNoteContainer);
        }

        resultsContainer.classList.remove('hidden');
        resultsContainer.classList.add('slide-in-text');
    }




    function restartQuiz() {
        answeredQuestions = {};
        wrongAnswers = {};
        const resultsContainer = document.getElementById('results-container');
        const wrongNoteContainer = document.getElementById('wrong-note-container');

        if (resultsContainer) {
            resultsContainer.innerHTML = '';
            resultsContainer.classList.add('hidden');
        }

        if (wrongNoteContainer) {
            wrongNoteContainer.style.display = 'none';
            wrongNoteContainer.classList.add('hidden');
        }
        startTime = Date.now();
       
        displayRandomQuestion();
        document.getElementById('timer').innerText = `시간: 0초`
        timerId = setInterval(updateTime, 1000);
    }


    function displayWrongAnswers() {
        // 매번 새로운 wrongNoteContainer를 생성합니다.
        let wrongNoteContainer = document.createElement('div');
        wrongNoteContainer.id = 'wrong-note-container';
        wrongNoteContainer.innerHTML = '<h2>오답노트</h2>';

        Object.keys(wrongAnswers).forEach(questionIndex => {
            const question = quiz[questionIndex];
            wrongNoteContainer.innerHTML += `<p><strong>문제: </strong>${question.question}</p>`;
            Object.keys(question.choices).forEach(choiceKey => {
                const choiceValue = question.choices[choiceKey];
                const isCorrect = choiceKey === question.correctChoice;
                const isWrong = choiceKey === wrongAnswers[questionIndex];
                const divClass = isCorrect ? 'correct-answer' : isWrong ? 'wrong-answer' : 'normal-answer';
                wrongNoteContainer.innerHTML += `<div class="${divClass}">${choiceValue}</div><br>`;
            });
        });

        const resultsContainer = document.getElementById('results-container');
        // 기존에 wrongNoteContainer가 존재한다면 제거합니다.
        const existingContainer = document.getElementById('wrong-note-container');
        if (existingContainer) {
            resultsContainer.removeChild(existingContainer);
        }
        // 새로운 wrongNoteContainer를 추가합니다.
        resultsContainer.appendChild(wrongNoteContainer);
    }

    displayRandomQuestion();

}