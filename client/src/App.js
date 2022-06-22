import React, { Component } from 'react';
import './App.css';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import Home from './Components/Home';
import ReadingList from './Components/ReadingList';
import Profile from './Components/Profile';
import WordQuiz from './Components/WordQuiz';
import PageNotFound from './Components/PageNotFound';

import auth from './auth'

class App extends Component {
  constructor() {
    super()
    this.state = {
        current: {id: 11},
        finished: {id: 22},
        user: 'none',
        email: '',
        creationDate: '',
        updateHomePage: false,
        isLoaded: false,
        books: [],
        switchPage: false,
        searchBar: true,
        hamburger: false,
        streak: 0,
        organize: 'chrono',
        nextId: 0,
        deletedIds: [],
        bookFilter: 'All'
      }
  }

  currentAppVersion = "1.50"

  setUser = (user = 'none', email = '', creationDate, settings) => {
    let { books } = this.state
    if (user !== 'none') {
      auth.login(() => console.log('logged in - setUser'))
      console.log(auth.isAuthenticated())
      this.setState({user, email, creationDate}) 
      let confirmTransfer = books.length > 0 && window.confirm(`Would you like to transfer your unsaved book entries (${books.length}) to your account?`)
      
      if (confirmTransfer) {

        books.forEach((b,i) => {
          let bCopy = {...b}
          bCopy.user = user
          axios
            .post('/api/memories', bCopy)
            .then(res => {
              console.log('this is what I think it is')
              console.log(`post ${i} done`)
              return axios
                      .post(`/api/memories/update/${res.data._id}`, bCopy)
                      .then(() => {
                        console.log(`update ${i} done`)
                        if (i === books.length - 1) {
                          this.loadUserBooks()
                          this.applySettings(settings)
                        }
                      })
            })
        })
      } else {
        this.loadUserBooks()
        this.applySettings(settings)
      }
    } else {
      // remove jwt cookie after logout
      axios
        .get('/api/users/logout')
        .then(() => {
          auth.logout(() => console.log('logged out - setUser'))
          console.log(auth.isAuthenticated())
          this.setState({user, email, books: []}) 
        })
    }
  }

  loadUserBooks = () => {
    console.log('READ request')
    axios
      .get(`/api/memories/${this.state.user}`)
      .then(res => {

        let { books } = this.state
        let userBooks = [];
        let Book = this.bookBlueprint()
        let defaultUrl = 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png'

        let nextId = books.length ? this.state.nextId : 0
        let deletedIds = [...this.state.deletedIds]

        res.data.forEach(b => {
          let url = b.url !== defaultUrl && b.url ? b.url : defaultUrl

          if (userBooks.length) !deletedIds.length ? nextId += 1 : nextId += 0
          let actualId = !deletedIds.length ? nextId : deletedIds.shift()

          let currentBook = new Book(actualId, b.title, b.author, b.genre, b.pages, b.started, b.finished, b.rating, b.why, b.words, b.quotes, b.moments, b.color, url, b.published, b.user, b._id, b.creationDate)
          userBooks.push({...currentBook});
        })
        this.setState({isLoaded: true, books: userBooks, deletedIds, nextId})
      });
  }

  deleteBook = (book) => {
    let { id, _id } = book
    console.log('delete book ' + id)
    let deleting = window.confirm('Are you sure you want to delete? This will remove the book entry permanently.')
    if (deleting) {
      let onesLessBook = [...this.state.books].filter(b => b.id !== id)
      let deletedIds = onesLessBook.length ? [...this.state.deletedIds, id] : []
      this.setState({books: onesLessBook, deletedIds})
      if (auth.isAuthenticated()) {
        axios
          .delete(`/api/memories/remove/${_id}`)
          .then(() => console.log('Book entry deleted.'))
      }
    }
  }

  bookBlueprint = () => {
    class Book {
      constructor(id, title, author, genre, pages, started, finished,
                  rating, why, words, quotes, moments, color, url, published, user, _id, creationDate) {
        this.id = id; this.title = title; this.author = author; this.genre = genre; this.pages = pages;
        this.started = started; this.finished = finished; this.rating = rating; this.why = why;
        this.words = words; this.quotes = quotes; this.moments = moments; this.color = color; this.url = url; 
        this.published = published; this.user = user; this._id = _id; this.creationDate = creationDate;
      }
    }
    return Book;
  }

  newBook = () => {
      let Book = this.bookBlueprint();
      let { books, user } = this.state

      let nextId = books.length ? this.state.nextId : 0
      let deletedIds = [...this.state.deletedIds]
      if (books.length) !deletedIds.length ? nextId = this.state.nextId + 1 : nextId = this.state.nextId
      let actualId = !deletedIds.length ? nextId : deletedIds.shift()

      let creationDate = new Date()
      creationDate = creationDate.toString()
      let newBook = new Book(actualId, '', '', '', '', null, null, '',
                            'because', 'words', 'to be or not to be', 'that one time when', this.randomColor(), 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png', '', user, '', creationDate)
      
      let organize = 'Organize:'
      let bookFilter = 'All'

      if (auth.isAuthenticated()) {
        console.log('POST request')
        axios
          .post('/api/memories', newBook)
          .then(res => {
            newBook._id = res.data._id
            this.setState({books: [...books, newBook], nextId, deletedIds, organize, bookFilter})
          })
      } else {
        this.setState({books: [...books, newBook], nextId, deletedIds, organize, bookFilter})
      }
  }

  randomColor = (initial = 'newObject') => {
    let randomR = Math.floor(Math.random() * 255)
    let randomG = Math.floor(Math.random() * 255)
    let randomB = Math.floor(Math.random() * 255)
    if (initial === 'newObject') {
      return `rgb(${randomR}, ${randomG}, ${randomB})`
    } else {
      let stateCopy = [...this.state.books]
      let book = stateCopy.filter(b => b.id === initial)[0]
      book.color = `rgb(${randomR}, ${randomG}, ${randomB})`
      this.setState({ books: stateCopy })
      console.log('random color was reset')
    }
  }

  timeStamp = () => {
     let date = new Date()
     let date2 = new Date()
     date = date.toUTCString().split(' ')
     date2 = date2.toLocaleTimeString().split(':')
     let day, month, year, hour, minute, timeOfDay;
     day = Number(date[1][0]) ? day = date[1] : day = date[1][1]

     let dateObj = {Jan: '1', Feb: '2', Mar: '3', Apr: '4', May: '5', Jun: '6', Jul: '7', Aug: '8', Sep: '9', Oct: '10', Nov: '11', Dec: '12'}
     month = dateObj[date[2]]

     year = date[3].slice(2)
     hour = date2[0]
     minute = date2[1]
     timeOfDay = date2[2].split(' ')[1]

     return `${month}/${day}/${year} ${hour}:${minute} ${timeOfDay}`
  }

  chronological = (books, organize) => {
    return books.slice().sort((a,b) => {
      let aYear = 0
      let bYear = 0
      let aMonth = 0
      let bMonth = 0
      let aDay = 0
      let bDay = 0
      if (a.started) {
        aYear = Number(a.started.split('/')[2]?.split(' ')[0])
        aMonth = Number(a.started.split('/')[0])
        aDay = Number(a.started.split('/')[1])
      }
      if (b.started) {
        bYear = Number(b.started.split('/')[2]?.split(' ')[0])
        bMonth = Number(b.started.split('/')[0])
        bDay = Number(b.started.split('/')[1])
      }
      let year = organize === 'desc' ? aYear - bYear : bYear - aYear
      let month = organize === 'desc' ? aMonth - bMonth : bMonth - aMonth
      let day = organize === 'desc' ? aDay - bDay : bDay - aDay
      if (year !== 0) {
        return year
      } else if (month !== 0) {
        return month
      } else {
        return day
      }
    })
  }

  onChange = (e, other, extra) => {
    let stateCopy = this.state.books.slice()
    let idNum, property, book, organize, bookFilter;


    if (e === 'start') {
      idNum = other
      book = stateCopy.filter(b => b.id === idNum)[0]
      if (book.started === null) {
        book.started = this.timeStamp()
        organize = 'chrono-date-asc'
        bookFilter = 'readingFilter'
        this.setState({ current: book, organize, bookFilter })
      } else if (book.finished === null) {
        book.finished = this.timeStamp()
        organize = 'chrono-date-asc'
        bookFilter = 'readFilter'
        this.setState({ finished: book, organize, bookFilter })
      } else {
        
        let confirmChoice = window.confirm('Are you sure you want to reset your start and finish dates?')
        
        // Reset start and finish timestamps for book entry only if user confirms first
        if (confirmChoice) {
          let setAtLeastOnce = 0
          book.started = null
          book.finished = null
          organize = 'Organize:'
          bookFilter = 'All'
          if (this.state.current !== null && book.id === this.state.current.id) { 
            setAtLeastOnce++
            this.setState({ current: null, organize, bookFilter })
          }
          if (this.state.finished !== null && book.id === this.state.finished.id) { 
            setAtLeastOnce++
            this.setState({ finished: null, organize, bookFilter })
          }
          if (!setAtLeastOnce) this.setState({ organize, bookFilter })
        }
        
      }
    } else if (e !== 'api') {
      idNum = Number(e.target.name.split('-')[1])
      property = e.target.name.split('-')[0]
      book = stateCopy.filter(b => b.id === idNum)[0]
    }

    if (e === 'start') {
      book[property] = 'result'
    } else if (e === 'api') {
      let { author, title, published, pages, url } = other
      if (url === undefined) { url = 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png' }
      if (published !== undefined && published.includes('-')) { published = published.split('-')[0] }
      book = stateCopy.filter(b => b.id === extra)[0]
      if (author) { book.author = author }
      if (title) { book.title = title }
      if (published) { book.published = published }
      if (pages) { book.pages = pages }
      if (url) { book.url = url }
    } else {
      book[property] = e.target.value
    }
    this.setState({ books: stateCopy })
  }

  handleAttention = (book) => { 
    console.log(book)
    this.setState({switchPage: book}) 
    setTimeout(() => this.setState({switchPage: false}), 100)
  }

  minimize = (bar = 'searchBar') => { 
    if (bar === 'searchBar') {
      this.setState({searchBar: !this.state.searchBar}) 
    } else if (window.innerWidth < 550) {
      let menuBtn = document.querySelector('.menu-btn')
      let navList = document.querySelector('.nav-list')
      let navBlock = document.querySelector('.nav-block')
      if (this.state.hamburger) {
        navList.classList.remove('block-list')
        menuBtn.classList.remove('open')
        navBlock.classList.remove('nav-block-show')
      } else if (bar !== 'collapse') {
        navList.classList.add('block-list')
        menuBtn.classList.add('open')
        navBlock.classList.add('nav-block-show')
      }
      if (bar !== 'collapse') this.setState({hamburger: !this.state.hamburger}) 
    }
  }

  defineApi = async (word) => {
   
      try {

        let hVars = await axios.post('/heroku-env', { hVarAuth: 'PAJAMA' }).catch((err) => alert('PROMISE1 (failed) : ' + err))
  
        let api = hVars.data.defineApi
        let key = hVars.data.defineApiKey

        let lastCh = word[word.length - 1].toLowerCase()
        if (!/[a-z]/.test(lastCh)) word = word.split(lastCh)[0]
     
        let res = await axios.get(api + word + key).catch((err) => alert('PROMISE2 (failed) : ' + err))
        
        let concatDefs = ''
        let shortdef = res.data[0].shortdef
        
        if (shortdef) {
          shortdef.forEach((def,i) => {
          i++
          def += '\n\n'
          concatDefs += i + '. ' + def
          })
          return `${word.toUpperCase()}\n\n${concatDefs}`
        } else {
          return 'No definition (API please!)'
        }
      } 
      catch (err) { 
        return `Hmmm... something's wrong here`
      }

  }

  setStreak = (streak) => { 
    let { user } = this.state
    this.setState({streak})
    this.newSettings('streak', streak, user)
  }

  newSettings = (property, value, user) => {
    if (user !== 'none') {
      axios
        .post(`/api/users/${user}/settings`, [property, value])
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }
  }

  setProperty = (property, value) => { this.setState({ [property] : value }) }

  applySettings = (data) => {
    if (!data) return
    let settings = JSON.parse(data)
    Object.keys(settings).forEach(property => this.setState({ [property] : settings[property] }))
    this.changeVersionNumber(settings)
  }

  setWordBank = (updatedWb, bookIndex) => {
    let booksCopy = [...this.state.books]
    booksCopy[bookIndex]['words'] = updatedWb
    this.setState({books: booksCopy})
  }

  changeVersionNumber = (settings) => {
    if ('version' in settings && this.currentAppVersion === settings.version) return
    else {
      if (this.state.user && auth.isAuthenticated()) this.newSettings('version', this.currentAppVersion, this.state.user)
      if ('version' in settings) this.newVersionDisplay()
    }
  }

  newVersionDisplay = () => {
    let div = document.getElementById('n-v')

    if (!div.classList.contains('new-version')) {
      div.classList.add('new-version')

      setTimeout(() => {
        div.classList.add('new-version-d')
        setTimeout(() => {
          div.classList.remove('new-version')
          div.classList.remove('new-version-d')
        }, 900)
      }, 6000)

    } else {
      div.classList.add('new-version-d')
      setTimeout(() => {
        div.classList.remove('new-version')
        div.classList.remove('new-version-d')
      }, 900)
    }
  }

  componentDidMount() { 
// Check for a JWT token and convert it into a user id
    axios
      .get('/api/users/verify')
      .then(response => {
    // Search for the user with that id and set the app state
        axios
          .get(`/api/users/${response.data.user}`)
          .then(user => this.setUser(user.data.username, user.data.email, user.data.creationDate, user.data.settings))
          .catch(() => 'Error: fetching user data')
      })
      .catch(() => console.log('Error: verifying user'))
   }

  componentDidUpdate() {
    if (this.state.isLoaded === true) {
      if (!this.state.books.length) { this.newBook() }
      this.setState({isLoaded: 'Done'})
    } 
  }

  render() {
    let { switchPage } = this.state
    return (
      <div id='grandpa'>

          <div className='n-v' id='n-v' onClick={this.newVersionDisplay}>
            <h2>NEW VERSION</h2>
            <h4>{this.currentAppVersion}</h4>
            <p>this message is just to let you know there was an update recently</p>
          </div>

          <div className='nav-block' onClick={() => this.minimize('hamburger')}>nav block</div>

          <nav>
            <div className='menu-btn' onClick={() => this.minimize('hamburger')}><div className='menu-btn_burger'></div></div>
            <ul className='nav-list'>
              <li><Link to="/" className='link' onClick={() => this.minimize('hamburger')}>HOME</Link></li>
              <li><Link to="/MyReads" className='link' onClick={() => this.minimize('hamburger')}>READING</Link></li>
              {auth.isAuthenticated() && <li><Link to="/Profile" className='link' onClick={() => this.minimize('hamburger')}>PROFILE</Link></li>}
              <li><Link to='WordQuiz' className='link' onClick={() => this.minimize('hamburger')}>WORDS</Link></li>
              <li>
                <Link 
                    onClick={() => {
                                auth.isAuthenticated() && this.setUser()
                                this.minimize('hamburger')}} 
                    to="/Log" 
                    className='link'>{!auth.isAuthenticated() ? 'LOGIN' : 'LOGOUT'}
                </Link>
              </li>
            </ul>
          </nav>
          <Switch>
            {switchPage ? <Redirect exact path="/" to="/MyReads"/> : ''}
            {switchPage ? <Redirect path="/Profile" to="/MyReads"/> : ''}
            <Route exact path="/" render={() => <Home 
                                                    books={this.state.books} 
                                                    timeStamp={this.timeStamp} 
                                                    handleAttention={this.handleAttention}/>} />
            <Route path="/MyReads" render={() => <ReadingList 
                                                    books={this.state.books} 
                                                    user={this.state.user}
                                                    organize={this.state.organize}
                                                    bookFilter={this.state.bookFilter}
                                                    setProperty={this.setProperty}
                                                    newSettings={this.newSettings}
                                                    onChange={this.onChange} 
                                                    newBook={this.newBook} 
                                                    deleteBook={this.deleteBook} 
                                                    chron={this.chronological} 
                                                    randomC={this.randomColor}
                                                    bookBlueprint={this.bookBlueprint}
                                                    switchPage={this.state.switchPage}
                                                    searchBar={this.state.searchBar}
                                                    minimize={this.minimize}
                                                    defineApi={this.defineApi}/>} />
            <Route path="/Profile" render={() => <Profile 
                                                    setUser={this.setUser} 
                                                    data={this.state} 
                                                    timeStamp={this.timeStamp} 
                                                    handleAttention={this.handleAttention}
                                                    key={this.state.user}
                                                    books={this.state.books}
                                                    defineApi={this.defineApi}/>}/>
            <Route path='/WordQuiz' render={() => <WordQuiz
                                                    user={this.state.user}
                                                    books={this.state.books}
                                                    setStreak={this.setStreak}
                                                    streak={this.state.streak}
                                                    setWordBank={this.setWordBank}
                                                    defineApi={this.defineApi}/>}/>
            <Redirect path="/Log" to="/Profile"/>
            <Route component={PageNotFound}/>
          </Switch>
      </div>
    )
  }
}

export default App;
