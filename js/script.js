
const WORDS_LIST = ['KATT',
  'HUND',
  'FÅGEL',
  'FISK',
  'KO',
  'HÄST',
  'ILLER',
  'HAMSTER',
  'GRIS',
  'ORM',
  'ÖDLA',
  'ZEBRA',
  'RÅDJUR'
];

const HANGMAN_IMG = document.getElementById('hangman');
const AVAILABLE_NUMBER_OF_GUESSES = 6;

// Lists for the available letter buttons and the empty boxes where the matched (correctly guessed) letters will appear.
const LETTER_BUTTONS = document.querySelectorAll('ul#letterButtons > li > button');
const MATCHED_LETTER_BOXES = document.getElementById('matchedLettersContainer');

const START_GAME_BUTTON = document.getElementById('startGameBtn');
START_GAME_BUTTON.addEventListener('click', () => {
  startGame();
});

function startGame() {
  let gameOver = false;
  let failedGuesses = 0;
  let correctGuesses = 0;
  let hiddenWord = randomizeWord(WORDS_LIST);

  restoreGameboard();
  addMatchingLetterBoxes();
  handleGuess();

  function handleGuess() {
    for (let i = 0; i < LETTER_BUTTONS.length; i++) {
      let letterBtn = LETTER_BUTTONS[i];

      if (correctGuesses != hiddenWord.length && failedGuesses < 6) {
        letterBtn.onclick = () => {
          tryMatchLetter(letterBtn.value);
          letterBtn.setAttribute('disabled', 'true');
        }
      }
    }
  }

  function tryMatchLetter(letterBtnValue) {
    let isLetterFound = false;

    for (let i = 0; i < hiddenWord.length; i++) {
      if (letterBtnValue == hiddenWord[i]) {
        let letterBoxes = document.querySelectorAll('.letterBox > input');
        letterBoxes[i].value = hiddenWord[i];
        isLetterFound = true;
        correctGuesses++;
        checkIfWon(correctGuesses);
      }
    }

    if (correctGuesses != hiddenWord.length && isLetterFound == false) {
      failedGuesses++;

      if (failedGuesses <= AVAILABLE_NUMBER_OF_GUESSES) {
        updateHangmanImg();
      }

      checkIfLost(failedGuesses);
    }
  }

  function restoreGameboard() {
    START_GAME_BUTTON.style.display = "none";
    MATCHED_LETTER_BOXES.innerHTML = '';
    message.innerHTML = '';
    HANGMAN_IMG.setAttribute('src', 'images/h0.png');
    restoreLetterButtons();
  }

  function restoreLetterButtons() {
    for (let i = 0; i < LETTER_BUTTONS.length; i++) {
      let letterBtn = LETTER_BUTTONS[i];
      letterBtn.disabled = false;
    }
  }

  function addMatchingLetterBoxes() {
    for (let i = 0; i < hiddenWord.length; i++) {
      let matchingLetterBox = document.createElement('li');
      let matchingLetter = document.createElement('input');

      matchingLetterBox.setAttribute('class', 'letterBox');
      matchingLetter.setAttribute('type', 'text');
      matchingLetter.setAttribute('disabled', 'true');

      MATCHED_LETTER_BOXES.appendChild(matchingLetterBox);
      matchingLetterBox.appendChild(matchingLetter);
    }
  }

  function updateHangmanImg() {
    HANGMAN_IMG.setAttribute('src', `images/h${failedGuesses}.png`);
  }

  function randomizeWord(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function checkIfWon(correctGuesses) {
    if (correctGuesses == hiddenWord.length) {
      message.innerHTML = 'Grattis! Du gissade rätt och kom undan från hängningen!';
      gameOver = true;
      generateRestartButton();
    }
  }

  function checkIfLost(failedGuesses) {
    if (failedGuesses == AVAILABLE_NUMBER_OF_GUESSES) {
      showLosingMessage();
      gameOver = true;
      generateRestartButton();
    }
  }

  function showLosingMessage() {
    MATCHED_LETTER_BOXES.innerHTML = `<h2>Det rätta ordet var: ${hiddenWord}</h2>`;
    let message = document.getElementById('message');
    message.innerHTML = '<p>Du förlorade</p>';

  }

  function generateRestartButton() {
    let restartBtnEl = document.createElement('button');
    restartBtnEl.className = 'restartBtn';
    restartBtnEl.innerHTML = "SPELA IGEN";
    message.appendChild(restartBtnEl);
    restartBtnEl.addEventListener('click', startGame);
  }
}
