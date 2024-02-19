// Globala variabler

// Array: med spelets alla ord
const wordList = ['KATT',
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
                  'RÅDJUR'];

const lettersInAlphabet = 29;

// Array av DOM-noder: Knapparna för bokstäverna
const letterButtonsNodeList = document.querySelectorAll('ul#letterButtons > li > button'); 

// Array av DOM-noder: Rutorna där bokstäverna ska stå
const matchedLettersEls = document.getElementById('matchedLettersContainer');    

// Knapp som startar spelet
const startGameBtnEl = document.getElementById('startGameBtn'); 
startGameBtnEl.addEventListener('click', startGame);

// Bild som ska uppdateras vid felaktiga gissningar
const hangmanImg = document.getElementById('hangman');

// Funktion som startar spelet vid knapptryckning
function startGame() {
  let gameOver = false;
  let failedGuesses = 0;
  let correctGuesses = 0;
  matchedLettersEls.innerHTML = '';
  message.innerHTML = '';
  hangmanImg.setAttribute('src', 'images/h0.png')
  
  // Startknappen försvinner när man startat spelet
  startGameBtnEl.style.display = "none";

  resetAllLetterButtons(); // Gör alla bokstäver klickbara vid spelets start/omstart

  // Ett ord väljs slumpvis ur wordList och sätts till selectedWord
  let selectedWord = randomizeWord(wordList); 
  
  // Lägg till samma antal rutor som det finns bokstäver i selectedWord
  for (let i = 0; i < selectedWord.length; i++) {
    let selectedWordLetterBox = document.createElement('li');
    let selectedWordLetter = document.createElement('input');

    selectedWordLetterBox.setAttribute('class', 'letterBox');
    selectedWordLetter.setAttribute('type', 'text');
    selectedWordLetter.setAttribute('disabled', 'true');

    matchedLettersEls.appendChild(selectedWordLetterBox);
    selectedWordLetterBox.appendChild(selectedWordLetter);
  }
  
  // Iterera genom nodelist av knapparna för att kunna kalla på funktion när man trycker på en av dem
  for (let i = 0; i < letterButtonsNodeList.length; i++) {
    let letterBtn = letterButtonsNodeList[i];
    if (correctGuesses != selectedWord.length) {
      letterBtn.onclick = function() {  
        // funktion när man klickar på en letterBtn
        if (failedGuesses < 6 && gameOver == false) {
          findLetterInSelectedWord(letterBtn.value);
          letterBtn.setAttribute('disabled', 'true');
        }
      }
    }
  }

  // Funktion som körs när man klickar på en letterBtn
  function findLetterInSelectedWord(letterBtnValue) {
    let isLetterFound = false;
    for (let i = 0; i < selectedWord.length; i++) {
      // Kollar om bokstaven på knappen matchar bokstav på platsen i rätta ordet
      if (letterBtnValue == selectedWord[i]) {
        let letterBoxes = document.querySelectorAll('.letterBox > input');
        // Lägger till bokstaven som finns i selectedWord på rätt plats i boxarna
        letterBoxes[i].value = selectedWord[i];
        isLetterFound = true;
        correctGuesses++; // Öka correctGuesses med 1 för varje gång de matchar
        }

      // Om man gissat alla bokstäver i selectedWord
      if (correctGuesses == selectedWord.length) {
        message.innerHTML = 'Grattis! Du gissade rätt och kom undan från hängningen!';
        gameOver = true;
      }
    }
 
    // Om man gissar fel bokstav och inte har gissat alla rätta bokstäver
    if (correctGuesses != selectedWord.length && isLetterFound == false) {
      failedGuesses++;
      if (failedGuesses <= 6) {
        updateHangmanImg();
        
      } 

      if (failedGuesses == 6) {
        matchedLettersEls.innerHTML = `<h2>Det rätta ordet var: ${selectedWord}</h2>`;
        let message = document.getElementById('message');
        message.innerHTML = '<p>Du förlorade</p>';
        gameOver = true;
      }
    }

    if (gameOver == true) {
      let restartBtnEl = document.createElement('button');
      restartBtnEl.className = 'restartBtn';
      restartBtnEl.innerHTML = "SPELA IGEN";
      message.appendChild(restartBtnEl);
      restartBtnEl.addEventListener('click', startGame);
    }
  }

  function updateHangmanImg() {
    hangmanImg.setAttribute('src', `images/h${failedGuesses}.png`);
  }
}

function randomizeWord(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function resetAllLetterButtons() {
  for (let i = 0; i < letterButtonsNodeList.length; i++) {
    let letterBtn = letterButtonsNodeList[i];
    letterBtn.disabled = false;
  }
}