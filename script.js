// display the boxes
// start typing only on a line

// detect how much the user clicked on keyboard
// replace the tile number by the keybaord typed
// if you type on delete remove the step before
// if you type enter check matching cases and switch to second line

// choose a word
// check if the chars typed have some cases matched

window.onload = function() {
    startGame()
}

async function check_if_word_exists (word) {
    const url = "https://api.wordnik.com/v4/word.json/" + word + "/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5";
    const fetchUrl = await fetch(url)
    const data = await fetchUrl.json()
    
    if(data.length > 0) {
        return true
    } else {
        return false
    }
}

function startGame() {
    const cols = 5
    const rows = 5
    const board = []
    const choosenWord = 'peace'
    let firstWord = []
    let row = 0
    let rowCols = 0
    let gamewon = false

    const boardContainer = document.querySelector('#board-container')
    const msg = document.querySelector('#show-msg')
    const answer = document.querySelector('#answer')
    
    boardContainer.classList.add('container')
    boardContainer.style.width = `${cols * 62}px`;

    for( let i = 0; i < rows; i++ ) {
        const row = []
        for ( let j = 0; j < cols; j++) {
            const cell = document.createElement('div')
            cell.classList.add('tile')
            boardContainer.append(cell)
            row.push(cell)
        }
        board.push(row)
    }

    document.addEventListener('keyup', startTyping)
    let typingNum = 0

    async function startTyping(e) {
        if(gamewon) return;
        let numOfCorrect = 0
        if(typingNum < 0) return
        if(e.key === 'Backspace' && typingNum <= rows && typingNum > 0) {
            board[row][typingNum - 1].innerText = ''
            typingNum--
            return
        }

        if(typingNum < rows && e.key.length === 1 && e.key.toLowerCase().charCodeAt(0) >= 97 && e.key.toLowerCase().charCodeAt(0) <= 122) {
            board[row][typingNum].innerText = e.key
            typingNum++
        }

        if(typingNum === rows && e.key === 'Enter') {
            firstWord = []
            const firstRow = document.querySelectorAll('#board-container .tile')
            for(let i = rowCols; i <( 5 + rowCols); i++) {
                firstWord.push(firstRow[i].innerText)
            }
            const firstWordText = firstWord.join('').toLowerCase()

            const wordExists = await check_if_word_exists(firstWordText)

            if(wordExists) {
                for(let i = 0; i < firstWordText.length; i++) {
                    if(firstWordText[i] === choosenWord[i]) {
                        board[row][i].classList.add('green')
                        numOfCorrect++
                    } else if(choosenWord.includes(firstWordText[i])) {
                        board[row][i].classList.add('orange')
                    } else {
                        board[row][i].classList.add('black')
                    }
                }
                if(numOfCorrect === 5) {
                    gamewon = true
                    alert('Congratulations u have guessed the word')
                }
                row++
                rowCols += 5
                typingNum = 0
                firstWord = []
                msg.innerText = ''
            } else {
                msg.innerText = 'word not found'
            }

            if(row === 5 && !gamewon) answer.innerText = 'The chosen word is ' + choosenWord
        }
    }
}
