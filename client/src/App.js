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
        isLoaded: false,
        books: []
      }
      this.setUser = this.setUser.bind(this)
      this.onChange = this.onChange.bind(this)
      this.randomColor = this.randomColor.bind(this)
      this.newBook = this.newBook.bind(this)
      this.chronological = this.chronological.bind(this)
      this.currentAndRecent = this.currentAndRecent.bind(this)
      this.bookBlueprint = this.bookBlueprint.bind(this)
  }

  setUser(user = 'none', email = '') { 
    let { books } = this.state
    if (user !== 'none') {
      this.setState({user, email}) 
      if (books.length > 0) {
        books.map((b,i) => {
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
        res.data.filter(b => b.user === this.state.user).map((b,i) => {
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
      let onesLessBook = this.state.books.slice().filter(b => b.id !== id)
      this.setState({books: onesLessBook})
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
                  rating, why, words, quotes, moments, color, url, published, user, _id) {
        this.id = id; this.title = title; this.author = author; this.genre = genre; this.pages = pages;
        this.started = started; this.finished = finished; this.rating = rating; this.why = why;
        this.words = words; this.quotes = quotes; this.moments = moments; this.color = color; this.url = url; this.published = published; this.user = user; this._id = _id;
      }
    }
    return Book;
  }

  newBook() {
      let Book = this.bookBlueprint();
      let books = this.state.books
      let nextId = books.length > 0 ? books[books.length - 1].id + 1 : 0
      let newBook = new Book(nextId, '', '', '', '', null, null, '',
                            'because', 'words', 'to be or not to be', 'that one time when', this.randomColor(), 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png', '', this.state.user, '')
      if (this.state.user !== 'none') {
        console.log('POST request')
        axios
          .post('/api/memories', newBook)
          .then(res => {
            newBook._id = res.data._id
            this.setState({books: [...this.state.books, newBook]})
            console.log(this.state)
            console.log('state^')
          })
      } else {
        this.setState({books: [...this.state.books, newBook]})
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

     let day;
     let month;
     let year;
     let hour;
     let minute;
     let timeOfDay;

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

  currentAndRecent(current, recent) {
    if (current !== undefined && current.id !== this.state.current.id) {
      this.setState({current: current, finished: recent})
    }
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
      console.log('list')
      console.log(author)
      console.log(title)
      console.log(published)
      console.log(pages)
      console.log(url)
      console.log('ok then')
      console.log(book)
    } else {
      book[property] = e.target.value
    }
    console.log('we got here')
    this.setState({ books: stateCopy })
  }

  componentDidUpdate() {
    let current = this.chronological(this.state.books, 'asc').filter(b => b.started !== null)
    this.currentAndRecent(current[0], current[1])
    if (this.state.isLoaded === true) {
      if (!this.state.books.length) { this.newBook() }
      this.setState({isLoaded: 'Done'})
    } 
  }

  render() {
    let { user } = this.state
    return (
      <div>
        <Router>
          <nav>
            <ul>
              <li><Link to="/" className='link'>HOME</Link></li>
              <li><Link to="/MyReads" className='link'>MY READS</Link></li>
              {user !== 'none' && <li><Link to="/Profile" className='link'>PROFILE</Link></li>}
              <li><Link onClick={() => user !== 'none' && this.setUser()} to="/Log" className='link'>{user === 'none' ? 'LOGIN' : 'LOGOUT'}</Link></li>
            </ul>
          </nav>
          <Switch>
            <Route exact path="/" render={() => <Home current={this.state.current} finished={this.state.finished} />} />
            <Route path="/MyReads" render={() => <ReadingList 
                                                    books={this.state.books} 
                                                    onChange={this.onChange} 
                                                    newBook={this.newBook} 
                                                    deleteBook={this.deleteBook} 
                                                    chron={this.chronological} 
                                                    randomC={this.randomColor}
                                                    bookBlueprint={this.bookBlueprint}/>} />
            <Route path="/Profile" render={() => <Profile setUser={this.setUser} data={this.state}/>}/>
            <Redirect path="/Log" to="/Profile"/>
          </Switch>
        </Router>
      </div>
    )
  }
}

export default App;
