import React from 'react';
import Book from './Book'

class ReadingList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '', organize: 'chrono' }
    this.handleChange = this.handleChange.bind(this)
    this.handleDropdown = this.handleDropdown.bind(this)
  }

  handleChange(e) {
    this.setState({ value: e.target.value })
  }

  handleDropdown(e) {
    this.setState({ organize: e.target.value })
    console.log(this.state.organize)
  }

  render() {

    let books = this.props.books
    let newBook = this.props.newBook
    let value = this.state.value
    let filteredBooks;

    if (this.state.value !== '') {
        filteredBooks = books.filter(b => {
          let checkLn;
          b.author.split(' ')[1] === undefined ? checkLn = b.author : checkLn = b.author.split(' ')[1]
          let bArray = [b.title, b.author, b.author.split(' ')[0], checkLn, b.title, b.genre]
          return bArray.some(prop => prop.toLowerCase().split('').slice(0, value.length).join('') === value.toLowerCase())
        })
        books = filteredBooks
    }

    switch(this.state.organize) {
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
    }

    return (
      <div>
        <div className='options'>
          <div><input value={this.state.value} onChange={this.handleChange}/></div>
          <div className='category'>
            <label htmlFor="filter"></label>
            <select id="filter" onChange={this.handleDropdown}>
              <option value=''>Organize:</option>
              <option value="chrono-date-asc">New Reads (Start Date)</option>
              <option value="chrono-date-desc">Old Reads (Start Date)</option>
              <option value="oldest">Oldest (Publish Dates)</option>
              <option value="newest">Newest (Publish Dates)</option>
              <option value="alpha-title-asc">Alphabetical (Ascending): Title</option>
              <option value="alpha-title-desc">Alphabetical (Descending): Title</option>
              <option value="alpha-author-asc">Alphabetical (Ascending): Author</option>
              <option value="alpha-author-desc">Alphabetical (Descending): Author</option>
              <option value="short-read">Shortest Reading Time</option>
              <option value="long-read">Longest Reading Time</option>
              <option value="best">Best Rating</option>
              <option value="worst">Worst Rating</option>
              <option value="most-pages">Most Pages</option>
              <option value="least-pages">Least Pages</option>
            </select>
          </div>
          <div className='new-book' onClick={newBook}>New Book</div>
        </div>
        {books.map(book => <Book 
                              book={book} 
                              key={book.id} 
                              onChange={this.props.onChange} 
                              deleteBook={this.props.deleteBook} 
                              randomC={this.props.randomC}
                              bookBlueprint={this.props.bookBlueprint}/>)}
      </div>
    )
  }
}

export default ReadingList;
