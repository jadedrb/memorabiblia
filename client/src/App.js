import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import axios from 'axios';

import Home from './Components/Home';
import ReadingList from './Components/ReadingList';
import Profile from './Components/Profile';

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
        nextId: 0,
        deletedIds: []
      }
      this.setUser = this.setUser.bind(this)
      this.onChange = this.onChange.bind(this)
      this.randomColor = this.randomColor.bind(this)
      this.newBook = this.newBook.bind(this)
      this.chronological = this.chronological.bind(this)
      this.bookBlueprint = this.bookBlueprint.bind(this)
      this.handleAttention = this.handleAttention.bind(this)
      this.minimize = this.minimize.bind(this)
  }

  setUser(user = 'none', email = '', creationDate) {
    let { books } = this.state
    if (user !== 'none') {
      this.setState({user, email, creationDate}) 
      if (books.length > 0) {
        books.forEach((b,i) => {
          let bCopy = {...b}
          bCopy.user = user
          axios
            .post('/api/memories', bCopy)
            .then(res => {
              console.log(`post ${i} done`)
              return axios
                      .post(`/api/memories/update/${res.data._id}`, bCopy)
                      .then(() => {
                        console.log(`update ${i} done`)
                        if (i === books.length - 1) this.loadUserBooks()
                      })
            })
        })
      } else {
        this.loadUserBooks()
      }
    } else {
      this.setState({user, email, books: []}) 
    }
  }

  loadUserBooks = () => {
    console.log('READ request')
    axios
      .get('/api/memories')
      .then(res => {
        let userBooks = [];
        let Book = this.bookBlueprint()
        let defaultUrl = 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png'
        res.data.filter(b => b.user === this.state.user).forEach((b,i) => {
          let url = b.url !== defaultUrl && b.url ? b.url : defaultUrl
          let currentBook = new Book(i, b.title, b.author, b.genre, b.pages, b.started = null, b.finished = null, b.rating, b.why, b.words, b.quotes, b.moments, b.color, url, b.published, b.user, b._id)
          userBooks.push({...currentBook});
        })
        this.setState({isLoaded: true, books: userBooks})
        console.log(userBooks)
        console.log('^userBooks')
        console.log(res)
        console.log('^res')
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
      if (this.state.user !== 'none') {
        axios
          .delete(`/api/memories/remove/${_id}`)
          .then(() => console.log('Book entry deleted.'))
      }
    }
  }

  bookBlueprint() {
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

  newBook() {
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
      if (user !== 'none') {
        console.log('POST request')
        axios
          .post('/api/memories', newBook)
          .then(res => {
            newBook._id = res.data._id
            this.setState({books: [...books, newBook], nextId, deletedIds})
            console.log(this.state)
            console.log('state^')
          })
      } else {
        this.setState({books: [...books, newBook], nextId, deletedIds})
      }
  }

  randomColor(initial = 'newObject') {
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

  timeStamp() {
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

  chronological(books, organize) {
    return books.slice().sort((a,b) => {
      let aYear = 0
      let bYear = 0
      let aMonth = 0
      let bMonth = 0
      let aDay = 0
      let bDay = 0
      if (a.started !== null) {
        aYear = Number(a.started.split('/')[2].split(' ')[0])
        aMonth = Number(a.started.split('/')[0])
        aDay = Number(a.started.split('/')[1])
      }
      if (b.started !== null) {
        bYear = Number(b.started.split('/')[2].split(' ')[0])
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

  onChange(e, other, extra) {
    let stateCopy = this.state.books.slice()
    let idNum;
    let property;
    let book;

    if (e === 'start') {
      idNum = other
      book = stateCopy.filter(b => b.id === idNum)[0]
      if (book.started === null) {
        book.started = this.timeStamp()
        this.setState({ current: book })
      } else if (book.finished === null) {
        book.finished = this.timeStamp()
        this.setState({ finished: book })
      } else {
        book.started = null
        book.finished = null
        if (this.state.current !== null && book.id === this.state.current.id) { this.setState({ current: null }) }
        if (this.state.finished !== null && book.id === this.state.finished.id) { this.setState({ finished: null }) }
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

  handleAttention(book) { 
    console.log(book)
    this.setState({switchPage: book}) 
    setTimeout(() => this.setState({switchPage: false}), 100)
  }

  minimize(bar = 'searchBar') { 
    if (bar === 'searchBar') {
      this.setState({searchBar: !this.state.searchBar}) 
    } else {
      let menuBtn = document.querySelector('.menu-btn')
      let navList = document.querySelector('.nav-list')
      if (this.state.hamburger) {
        navList.classList.remove('block-list')
        menuBtn.classList.remove('open')
      } else {
        navList.classList.add('block-list')
        menuBtn.classList.add('open')
      }
      this.setState({hamburger: !this.state.hamburger}) 
    }
  }

  componentDidMount() { console.log('v1.02') }

  componentDidUpdate() {
    if (this.state.isLoaded === true) {
      if (!this.state.books.length) { this.newBook() }
      this.setState({isLoaded: 'Done'})
    } 
  }

  render() {
    let { user, switchPage } = this.state
    return (
      <div id='grandpa'>
        <Router>
          <nav>
            <div className='menu-btn' onClick={() => this.minimize('hamburger')}><div className='menu-btn_burger'></div></div>
            <ul className='nav-list'>
              <li><Link to="/" className='link' onClick={() => this.minimize('hamburger')}>HOME</Link></li>
              <li><Link to="/MyReads" className='link' onClick={() => this.minimize('hamburger')}>MY READS</Link></li>
              {user !== 'none' && <li><Link to="/Profile" className='link' onClick={() => this.minimize('hamburger')}>PROFILE</Link></li>}
              <li>
                <Link 
                    onClick={() => {
                                user !== 'none' && this.setUser()
                                this.minimize('hamburger')}} 
                    to="/Log" 
                    className='link'>{user === 'none' ? 'LOGIN' : 'LOGOUT'}
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
                                                    onChange={this.onChange} 
                                                    newBook={this.newBook} 
                                                    deleteBook={this.deleteBook} 
                                                    chron={this.chronological} 
                                                    randomC={this.randomColor}
                                                    bookBlueprint={this.bookBlueprint}
                                                    switchPage={this.state.switchPage}
                                                    searchBar={this.state.searchBar}
                                                    minimize={this.minimize}/>} />
            <Route path="/Profile" render={() => <Profile setUser={this.setUser} 
                                                    data={this.state} 
                                                    timeStamp={this.timeStamp} 
                                                    handleAttention={this.handleAttention}/>}/>
            <Redirect path="/Log" to="/Profile"/>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
