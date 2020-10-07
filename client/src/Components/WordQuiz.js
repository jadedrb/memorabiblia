import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WordQuiz(props) {
    let [wordBank, setWordBank] = useState([])
    let [choices, setChoices] = useState([])
    let [currentWord, setCurrentWord] = useState('whatever')
    let [currentDef, setCurrentDef] = useState('')
    let [seize, setSeize] = useState(false)
    let [score, setScore] = useState([0,0])
    let [otherBoxes, setOtherBoxes] = useState([])
    let [wrongWords, setWrongWords] = useState([])
    let [searchWord, setSearchWord] = useState('')
    let [filteredWords, setFilteredWords] = useState([])

    useEffect(() => {
        // Convert all words for all book entries into one big array of strings
        let bank = ''
        props.books.forEach(b => bank += b.words + '. ')
        let tempBank = bank.split(/[.,\-\s]\s/).filter(w => w.toLowerCase() !== 'words')
        console.log(tempBank)
        if (tempBank.length > 4) {
            let tempChoices = determineChoices([...tempBank])
            let tempCurrentWord = tempChoices.length ? tempChoices[randomIndex(tempChoices)] : 'test'
            setWordBank(tempBank)
            setChoices(tempChoices)
            setCurrentWord(tempCurrentWord)
            determineDef(tempCurrentWord)
                .then(def => setCurrentDef(def))
                .catch(e => setCurrentDef(e))
        }
    }, [])

    const randomIndex = arr => Math.floor(Math.random() * arr.length)

    const determineChoices = tempBank => {
        let choices = {}
        // Pick five random and different words or however many are available
        while (Object.keys(choices).length < 5 && tempBank.length > 0) {
            let pluckedWord = tempBank.splice(randomIndex(tempBank), 1)
            if (pluckedWord[0].length === 1 || !pluckedWord[0]) continue
            choices[pluckedWord] = ''
        }

        // Turn the above object of unique keys into an array of strings 
        choices = Object.keys(choices).map(w => w = w[0].toUpperCase() + w.slice(1).toLowerCase())
        return choices
    }

    const determineDef = word => {
        return new Promise((resolve, reject) => {
            props
                .defineApi(word)
                .then(def => {
                    console.log('here')
                    let definitions = def.split('.').slice(1)
                    console.log(definitions)
                    let chosenDefinition = definitions.length ? definitions[randomIndex(definitions)].split('\n')[0].trim() : 'No definition (API please!)'
                    resolve(chosenDefinition)
                })
                .catch(e => reject(e))
        })
    }

    const nextWord = (correct) => {
        let tempChoices = determineChoices([...wordBank])
        let tempCurrentWord = tempChoices.length ? tempChoices[randomIndex(tempChoices)] : 'test'
        let tempScore = [...score]
        if (correct) tempScore[0]++
        if (tempScore[0] > props.streak) props.setStreak(props.streak + 1)
        setScore(tempScore)
        setChoices(tempChoices)
        setCurrentWord(tempCurrentWord)
        determineDef(tempCurrentWord).then(def => setCurrentDef(def)).catch(e => setCurrentDef(e))
    }

    const checkAnswer = (answer, choice) => {

        let defDiv = document.getElementById('quiz-definition')
        let defWord = document.getElementById(`c-${choice}`)

        const otherChoicesFunc = () => {
            let otherChoices = []
            for (let i = 0; i < 10; i++) {
                let otherChoice = document.getElementById(`c-${i}`)
                let checkIfSame = otherChoice !== null && otherChoice.innerText.toLowerCase() === answer.toLowerCase()
                let checkIfOther = otherChoice !== null && !checkIfSame
                if (checkIfOther) otherChoices.push(otherChoice)
                else if (checkIfSame) continue
                else break;
            }
            return otherChoices
        }

        if (answer.toLowerCase() === currentWord.toLowerCase()) {
            defDiv.style.borderColor = 'lime'
            defWord.style.borderColor = 'lime'
            let otherChoices = otherChoicesFunc()
            otherChoices.forEach(c => c.style.opacity = '.1')
            setTimeout(() => {
                otherChoices.forEach(c => c.style.opacity = '1')
                defDiv.style.borderColor = 'black'
                defWord.style.borderColor = 'black'
                nextWord(true)
            }, 1500)

        } else {
            defDiv.style.borderColor = 'blue'
            defWord.style.borderColor = 'red'
            let actual;
            let otherChoices = otherChoicesFunc()
            otherChoices.forEach(c => {
                if (c.innerText.toLowerCase() !== currentWord.toLowerCase()) { 
                    c.style.opacity = '.1'
                } else {
                    actual = c.innerText 
                    c.style.borderColor = 'blue'
                }
            })
            let tempScore = [...score]
            let tempWrongWords = [...wrongWords, actual]
            setSeize(true)
            setOtherBoxes([otherChoices, defDiv, defWord])
            setScore([0, tempScore[1]])
            setWrongWords(tempWrongWords)
        }
    }

    const retry = () => {
        let [otherChoices, defDiv, defWord] = otherBoxes
        otherChoices.forEach(c => {
            c.style.opacity = '1'
            c.style.borderColor = 'black'
        })
        defDiv.style.borderColor = 'black'
        defWord.style.borderColor = 'black'
        document.getElementById('word-input').value = ''
        setSeize(false)
        setFilteredWords([])
        nextWord()
    }

    const handleChange = (e) => {
        let value = e.target.value
        setSearchWord(value)
        if (!value) {
            setFilteredWords([])
            return;
        }
        let filteredWords = wordBank.filter(w => w.slice(0, value.length).toLowerCase() === value.toLowerCase())
        setFilteredWords(filteredWords)
    }

    const deleteWord = word => {
        let deleting = window.confirm(`Would you like to delete ${word.toUpperCase()} from your list of interesting words?`)
        if (!deleting) return
        // this.props.book.user !== 'none'
        let updatedWordBank = []

        for (let i = 0; i < props.books.length; i++) {
            let currentWordBank = props.books[i].words.split(/[.,\-\s]\s/)
            let wordIndex;
            for (let j = 0; j < currentWordBank.length; j++) {
                if (currentWordBank[j].toLowerCase() === word.toLowerCase()) {
                    wordIndex = j
                    break;
                }
            }
            if (wordIndex) {
                currentWordBank.splice(wordIndex, 1)
                updatedWordBank = [currentWordBank.join('. '), i, props.books[i]._id]
                break;
            }
        }

        console.log(updatedWordBank)

        let [updatedWb, bookIndex, bookId] = updatedWordBank

        const removeFromLocalWordBank = () => {
            let idx = wordBank.findIndex(w => w.toLowerCase() === word.toLowerCase())
            let newWordBank = [...wordBank]
            newWordBank.splice(idx, 1)
            setWordBank(newWordBank)
            setFilteredWords([])
            document.getElementById('word-input').value = ''
        }

        // update back end permanent data
        if (props.books[0].user !== 'none') {
            let updatedBook = {...props.books[bookIndex]}
            updatedBook.words = updatedWb
            console.log('UPDATE request')
            console.log(updatedBook)
            console.log(bookId)

            axios
              .post(`/api/memories/update/${bookId}`, {...updatedBook}).then(res => console.log(res.data))

        } 

        // update front end temporary data 
        props.setWordBank(updatedWb, bookIndex)
        removeFromLocalWordBank()
    }

    let filteredWordsList = filteredWords.map((w,i) => {
        return (
            <li key={i}>
                <span className='removable-word' onClick={() => props.defineApi(w).then(def => alert(def))}>{w}</span> 
                <span id='delete-word' onClick={() => deleteWord(w)}>X</span>
            </li>
        )
    })

    let wrongWordDiv = wrongWords.length ? <div id='wrong-words'>{wrongWords.map((w,i) => <span key={i} className='random-color' onClick={() => seize ? props.defineApi(w).then(def => alert(def)) : null}>{w}. </span>)}</div> : ''
    let footer = (
        <div id='quiz-footer'>
            <p><span>Current Streak</span><span>Longest Streak</span><span>Total Wrong</span></p>
            <p><span>{score[0]}</span><span>{props.streak}</span><span>{wrongWords.length}</span></p>
        </div>
    )

    let quizDef = currentDef ? currentDef : 'WORD QUIZ : Add more "Interesting Words" to your book entries!'
    let quizDefStyle = !currentDef ? {gridColumn: '1 / span 2'} : {}
    let quizChoiceStyle = !currentDef ? {height: '0px'} : {height: `190px`}

    return (
        <div id='quiz-container'>
            <h5><p id='word-count'>Word Count: {wordBank.length}</p></h5>
            <h6 id='quiz-definition' style={quizDefStyle}>{quizDef}</h6>
            <ul id='quiz-choices' style={quizChoiceStyle}>
{/*                <button onClick={() => console.log(currentDef)}>DAS IT</button>   */}
                {choices.map((c,i) => <li key={i} id={`c-${i}`} onClick={() => !seize && checkAnswer(c, i)}>{c}</li>)}
            </ul>
            {currentDef ? footer : ''}
            {wrongWordDiv}
            {seize ? <div id='retry-button' onClick={retry}>RETRY</div> : ''}
            {seize ? <input id='word-input' onChange={handleChange} placeholder='Find specific words to define or remove' /> : ''}
            {seize ? <ul id='search-results'>{filteredWordsList}</ul> : ''}
            <div id='black-space'></div>
        </div>
    )
}

export default WordQuiz;