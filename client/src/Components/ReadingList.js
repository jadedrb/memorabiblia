import React from 'react';
import Book from './Book';
import Year from './Year';

class ReadingList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '', defaultMsg: 'myframes', displayMsg: 'block', isMounted: false, screen: 0, resolution: 0 }
    this.handleChange = this.handleChange.bind(this)
    this.handleDropdown = this.handleDropdown.bind(this)
    this.reportWindowSize = this.reportWindowSize.bind(this)
    this.resetScreenCheck = this.resetScreenCheck.bind(this)
    this.booksReadThatYear = React.createRef()
  }

  componentDidUpdate() {
    if (this.state.defaultMsg === 'appear') {
      console.log('stabalize')
      this.setState({displayMsg: 'block', defaultMsg: 'myframes'})
    }
    if (this.props.books.length > 0 && this.state.defaultMsg === 'myframes') { 
      console.log('dissappear animation')
      this.setState({defaultMsg: 'dissappear'})
      setTimeout(() => this.state.isMounted && this.setState({displayMsg: 'none', defaultMsg: 'stop'}), 1000)
    } else if (this.props.books.length === 0 && this.state.defaultMsg === 'stop') {
      console.log('appear animation')
      this.setState({displayMsg: 'block', defaultMsg: 'appear'})
      setTimeout(() => this.state.isMounted && this.setState({defaultMsg: 'appear'}), 1000)
    }
  }

  componentDidMount() {
    if (this.props.switchPage) this.setState({isMounted: true, value: this.props.switchPage, screen: window.innerWidth}) 
    else this.setState({isMounted: true})
    window.addEventListener('resize', this.reportWindowSize);
  }
  
  componentWillUnmount() { 
    window.removeEventListener('resize', this.reportWindowSize);
    this.setState({isMounted: false}) 
  }

  resetScreenCheck() { this.setState({screen: true}) }

  reportWindowSize() {
   // console.log(window.innerWidth > 930 ? window.innerWidth + ' desktop' : window.innerWidth + ' mobile')
    if (window.innerWidth !== this.state.resolution) this.setState({screen: false, resolution: window.innerWidth})
  }

  handleChange(e) { this.setState({ value: e.target.value }) }

  handleFocus = e => document.getElementById('user-input').setSelectionRange(0, e.target.value.length)

  handleDropdown(e) { 
    let { setProperty, user } = this.props
    setProperty('organize', e.target.value)
    this.props.newSettings('organize', e.target.value, user)    
  }

  handleFilter = e => {
    let { setProperty, user } = this.props
    console.log(e.target.value)
    setProperty('bookFilter', e.target.value)
    this.props.newSettings('bookFilter', e.target.value, user)  
  }

  handleNewBook = () => {
    this.setState({ value: '' })
    this.props.newBook()
  }

  render() {

    let { books, bookFilter } = this.props
    let value = this.state.value
    let filteredBooks;
    let alreadyFiltered;

    // filter list based on inputted value in search bar
    if (this.state.value !== '') {
        filteredBooks = books.filter(b => {
          let checkLn;
          b.author.split(' ')[1] === undefined ? checkLn = b.author : checkLn = b.author.split(' ')[1]
          let bArray = [b.title, b.author, b.author.split(' ')[0], checkLn, b.title, b.genre]
          return bArray.some(prop => prop.toLowerCase().split('').slice(0, value.length).join('') === value.toLowerCase())
        })
        books = filteredBooks
        alreadyFiltered = true;
    }

    // filter list based on read, unread, or reading
    if (bookFilter !== 'All' && !alreadyFiltered) {
      if (bookFilter === 'readFilter') filteredBooks = books.filter(b => b.finished && typeof b.finished === 'string')
      else if (bookFilter === 'unreadFilter') filteredBooks = books.filter(b => !b.started || typeof b.started !== 'string')
      else if (bookFilter === 'readingFilter') filteredBooks = books.filter(b => (b.started && typeof b.started === 'string') && (!b.finished || typeof b.finished !== 'string'))
      console.log(filteredBooks)
      books = filteredBooks
    }

    // display numbers of each filtered category
    let allNum = this.props.bookFilter === 'All' ? `(${books.length})` : ''
    let readNum = this.props.bookFilter === 'readFilter' ? `(${books.length})` : ''
    let unreadNum = this.props.bookFilter === 'unreadFilter' ? `(${books.length})` : ''
    let readingNum = this.props.bookFilter === 'readingFilter' ? `(${books.length})` : ''

    if (true) {  // !document.getElementById('modal-edit-view')
      switch(this.props.organize) {
        case 'chrono-date-asc':
          books = this.props.chron(books, 'asc')
          break;
        case 'chrono-date-desc':
          books = this.props.chron(books, 'desc')
          break;
        case 'alpha-title-asc':
          books.sort((a, b) => a.title > b.title ? 1 : -1)
          break;
        case 'alpha-title-desc':
          books.sort((a, b) => a.title > b.title ? -1 : 1)
          break;
        case 'alpha-author-asc':
          books.sort((a, b) => a.author > b.author ? 1 : -1)
          break;
        case 'alpha-author-desc':
          books.sort((a, b) => a.author > b.author ? -1 : 1)
          break;
        case 'best':
          books.sort((a, b) => b.rating - a.rating)
          break;
        case 'worst':
          books.sort((a, b) => a.rating - b.rating)
          break;
        case 'least-pages':
          books.sort((a, b) => a.pages - b.pages)
          break;
        case 'most-pages':
          books.sort((a, b) => b.pages - a.pages)
          break;
        case 'newest':
          books.sort((a, b) => b.published - a.published)
          break;
        case 'oldest':
          books.sort((a, b) => a.published - b.published)
          break;
        default:
          books.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
          break;
      }
    }

    let inkEffect = {
      borderBottom: books.length > 0 ? 'none' : '2px solid black', 
      boxShadow: books.length > 0 ? 'none' : '0 30px 40px rgba(0,0,0,1)',
      display: this.props.searchBar ? 'flex' : 'none'
    }
    
    let defaultMsg = {
      animation: this.state.displayMsg !== 'none' ? `${this.state.defaultMsg} 1s ease-in-out 1 normal` : 'none',
      display: `${this.state.displayMsg}`
    }

    let searchBar;

    if (window.innerWidth > 590) {
      searchBar = {
        position: this.props.searchBar ? 'absolute' : 'relative',
        top: this.props.searchBar ? '55px' : '0',
        paddingRight: this.props.searchBar ? '10px' : '0',
        textAlign: 'center',
        height: this.props.searchBar ? '50px' : '25px',
        lineHeight: this.props.searchBar ? '48px' : '20px'
      }
    } else {
      searchBar = {
        position: this.props.searchBar ? 'absolute' : 'relative',
        top: this.props.searchBar ? '35px' : '0',
        left: this.props.searchBar ? '10px' : '0',
        textAlign: 'center',
        border: this.props.searchBar ? 'none' : '1px solid grey',
        height: this.props.searchBar ? '54px' : '25px',
        lineHeight: this.props.searchBar ? '48px' : '20px'
      }
    }
    
    return (
      <div>
        <div id='minimize' onClick={() => this.props.minimize()} style={searchBar}>-</div>
        <div className='options' style={inkEffect}>
          <div><input id='user-input' value={this.state.value} onFocus={this.handleFocus} onChange={this.handleChange}/></div>
          <div className='category'>
            <label htmlFor="filter"></label>
            <select id="filter" value={this.props.organize} onChange={this.handleDropdown}>
              <option>Organize:</option>
              <option value="chrono-date-asc">New Reads (Start Date)</option>
              <option value="chrono-date-desc">Old Reads (Start Date)</option>
              <option value="oldest">Oldest (Publish Dates)</option>
              <option value="newest">Newest (Publish Dates)</option>
              <option value="alpha-title-asc">Title (A-Z)</option>
              <option value="alpha-title-desc">Title (Z-A)</option>
              <option value="alpha-author-asc">Author (A-Z)</option>
              <option value="alpha-author-desc">Author (Z-A)</option>
              <option value="best">Best Rating</option>
              <option value="worst">Worst Rating</option>
              <option value="most-pages">Most Pages</option>
              <option value="least-pages">Least Pages</option>
            </select>
          </div>

          <div className='category book-filter'>
            <select value={this.props.bookFilter} onChange={this.handleFilter}>
              <option value="All">All {allNum}</option>
              <option value="readFilter">Read {readNum}</option>
              <option value="unreadFilter">Unread {unreadNum}</option>
              <option value="readingFilter">Reading {readingNum}</option>
            </select>
          </div>


          <div className='new-book' onClick={() => this.handleNewBook()}>New Book</div>
        </div>
        {books.map((book, index, arr) => 
                      <React.Fragment key={book.id}>
                          {this.props.bookFilter === 'readFilter' && !value &&
                            <Year 
                              value={value}
                              book={book} 
                              index={index} 
                              arr={arr} 
                              organize={this.props.organize}
                            />
                          }
                          <Book 
                              book={book} 
                              index={index}
                              key={book.id} 
                              onChange={this.props.onChange} 
                              deleteBook={this.props.deleteBook} 
                              randomC={this.props.randomC}
                              bookBlueprint={this.props.bookBlueprint}
                              screen={this.state.screen}
                              resetScreenCheck={this.resetScreenCheck}
                              minimize={this.props.minimize}
                              defineApi={this.props.defineApi}
                          />
                      </React.Fragment>
        )}
        <div id='r-t-r-wrapper'><div id='read-to-remember' style={defaultMsg}><div>Read</div>.<div>Rememeber</div>.<div>Relish</div></div></div>
      </div>
    )
  }
}

export default ReadingList;
