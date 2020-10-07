import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const modal = document.getElementById('modal-root')

class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = { covers: null, index: 0, isLoading: false, define: false}
    this.bookCoverApiRequest = this.bookCoverApiRequest.bind(this)
    this.definitions = this.definitions.bind(this)
  }

  el = document.createElement('div')

  bookCoverApiRequest() {

    let api = process.env.REACT_APP_GOOGLE_BOOKS_API
    let book = this.props.book.title
 
    let author = this.props.book.author
    this.setState({isLoading: true})

    axios.get(api + book)
      .then((response) => {
        let booksApi = response.data.items
        let infoArr = []
        booksApi.forEach(b => {
          let temp = {}
          let myProp;
          myProp = 'title'
          if (b.volumeInfo.hasOwnProperty(myProp)) { temp.title = b.volumeInfo.title }
          myProp = 'authors'
          if (b.volumeInfo.hasOwnProperty(myProp)) { temp.author = b.volumeInfo.authors[0] }
          myProp = 'publishedDate'
          if (b.volumeInfo.hasOwnProperty(myProp)) { temp.published = b.volumeInfo.publishedDate }
          myProp = 'pageCount'
          if (b.volumeInfo.hasOwnProperty(myProp)) { temp.pages = b.volumeInfo.pageCount }
          myProp = 'imageLinks'
          if (b.volumeInfo.hasOwnProperty(myProp)) {
            myProp = 'thumbnail'
            if (b.volumeInfo.imageLinks.hasOwnProperty(myProp)) { temp.url = b.volumeInfo.imageLinks.thumbnail }
          }

          infoArr.push(temp)
        })

        let firstFilter = infoArr.filter(info => {
          return info.title.slice(0, book.length).toLowerCase() === book.toLowerCase()
        })

        let secondFilter;

        if (firstFilter.length > 1 && author !== '') {
          secondFilter = firstFilter.filter(info => {
            let checkForProp = 'author'
            if (!info.hasOwnProperty(checkForProp)) { return false }
            if (info.author.slice(0, author.length).toLowerCase() === author.toLowerCase()) {
              return true
            } else if (info.author.split(' ')[1].slice(0, author.length).toLowerCase() === author.toLowerCase()) {
              return true
            }
            return false
          })
        }

        if (secondFilter !== undefined && secondFilter.length > 0) {
          secondFilter.sort((a, b) => {
            let newA = a.hasOwnProperty('published') && a.published.includes('-') ? a.published.split('-')[0] : a.published
            let newB = b.hasOwnProperty('published') && b.published.includes('-') ? b.published.split('-')[0] : b.published
            return Number(newA) - Number(newB)
          })
          this.setState({ covers: secondFilter })
          this.props.onChange('api', secondFilter[0], this.props.book.id)
          console.log('yessiree')
        } else if (firstFilter !== undefined && firstFilter.length > 0){
          firstFilter.sort((a, b) => {
            let newA = a.hasOwnProperty('published') && a.published.includes('-') ? a.published.split('-')[0] : a.published
            let newB = b.hasOwnProperty('published') && b.published.includes('-') ? b.published.split('-')[0] : b.published
            return Number(newA) - Number(newB)
          })
          this.setState({ covers: firstFilter })
          this.props.onChange('api', firstFilter[0], this.props.book.id)
          console.log('yezziree')
        }
        console.log(firstFilter)
        console.log(secondFilter)
        this.setState({isLoading: 'done'})
      })
  }

  definitions() { this.setState({definitions: !this.state.definitions}) }

  componentDidMount() {
    modal.appendChild(this.el)
    this.props.minimize('collapse')
    this.el.id = 'modal-edit-view'
    let currentUrl = this.props.book.url
    let defaultLink = 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png'
    if (this.props.modalNum === 1) {
      if (currentUrl === defaultLink || currentUrl === '') {
        if (this.props.book.title !== '') {
          this.bookCoverApiRequest()
        }
      }
    }
  }

  componentWillUnmount() {
    modal.removeChild(this.el)
    if (this.props.book.user !== 'none') {
      let _id = this.props.book._id
      let Book = this.props.bookBlueprint()
      let b = this.props.book
      console.log(b)
      let updatedBook = new Book(b.id, b.title, b.author, b.genre, b.pages, b.started, b.finished, b.rating, b.why, b.words, b.quotes, b.moments, b.color, b.url, b.published, b.user, b._id)
      console.log('UPDATE request')
      console.log({...updatedBook})
      axios
        .post(`/api/memories/update/${_id}`, {...updatedBook}).then(res => console.log(res.data))
    }
  }

  render() {

    let book = this.props.book
    let onChange = this.props.onChange
    let done = this.props.done
    let modal = this.props.modalNum
    let msg;

    if (book.started === null) {
      msg = 'START'
    } else if (book.finished === null) {
      msg = 'FINISH'
    } else {
      msg = 'RESET'
    }

    let bookStats = (
      <form className='book-info-modal'>
        <label>TITLE<br/>
          <input
            value={book.title}
            name={`title-${book.id}`}
            onChange={onChange}
            className='inputs'>
          </input>
        </label>
        <label>AUTHOR<br/>
          <input
            value={book.author}
            name={`author-${book.id}`}
            onChange={onChange}
            className='inputs'>
          </input>
        </label>
        <label>GENRE<br/>
          <input
            value={book.genre}
            name={`genre-${book.id}`}
            onChange={onChange}
            className='inputs'>
          </input>
        </label>
        <label>PUBLISHED<br/>
          <input
            value={book.published}
            name={`published-${book.id}`}
            onChange={onChange}
            className='inputs'>
          </input>
        </label>
        <label>PAGES<br/>
          <input
            value={book.pages}
            name={`pages-${book.id}`}
            onChange={onChange}
            className='inputs'>
          </input>
        </label>
        <label>RATING<br/>
          <input
            value={book.rating}
            name={`rating-${book.id}`}
            onChange={onChange}
            className='inputs'>
          </input>
        </label>
        <div
          className='start-finish'
          name={`start-${book.id}`}
          onClick={() => onChange('start', book.id)}>
        {msg}
        </div>
        <div
          style={{color: this.props.book.color}}
          className='random-color'
          onClick={() => console.log(this.props.randomC(book.id))}>
          Random Text Color
        </div>
      </form>
    )

    let bookCover = (
      <div className='book-cover'>
        <form>
          <label>BOOK COVER URL<br/>
            <input
              value={book.url}
              name={`url-${book.id}`}
              onChange={onChange}>
            </input>
          </label>
        </form>
        <img src={book.url} alt='URL Not Found'/>
      </div>
    )

    let splitCriteria = /[.,\-\s]\s/.test(book.words) ? /[.,\-\s]\s/ : ' '

    let bookMemory = (
      <form className='book-memory'>
        <label>WHY I READ IT<br/>
          <input
            value={book.why}
            name={`why-${book.id}`}
            onChange={onChange}>
          </input>
        </label>
        <label>INTERESTING WORDS<br/>
          {!this.state.definitions ? <input
            value={book.words}
            name={`words-${book.id}`}
            onChange={onChange}>
          </input> : <div id='define'>{book.words.split(splitCriteria).map((w,i) => <span key={i} className='random-color' onClick={() => this.props.defineApi(w).then(def => alert(def))}>{w} </span>)}</div>}
          {book.words && book.words !== 'words' ? <div 
            className='random-color'
            onClick={this.definitions}>
              {!this.state.definitions ? 'Define' : 'Back'}
          </div> : ''}
        </label>
        <label>FAVORITE QUOTE(S)<br/>
          <textarea
            value={book.quotes}
            name={`quotes-${book.id}`}
            onChange={onChange}>
          </textarea>
        </label>
        <label>MEMORABLE MOMENTS<br/>
          <textarea
            value={book.moments}
            name={`moments-${book.id}`}
            onChange={onChange}>
          </textarea>
        </label>
      </form>
    )

    let scrollCovers = (
      <div className='scroll-covers'>
        <button onClick={() => {
          console.log(this.state.index)
          if (this.state.index < this.state.covers.length - 1) {
            this.setState(prevState => {
              return { index: prevState.index + 1 }
            })
            this.props.onChange('api', this.state.covers[this.state.index + 1], this.props.book.id)
          }
        }}>Forward</button>
        <span className='selection'>
          {`${this.state.index + 1} / ${this.state.covers ? this.state.covers.length : ''}`}
        </span>
        <button onClick={() => {
          console.log(this.state.index)
          if (this.state.index > 0) {
            this.setState(prevState => {
              return { index: prevState.index - 1 }
            })
            this.props.onChange('api', this.state.covers[this.state.index - 1], this.props.book.id)
          }
        }}>Backward</button>
      </div>
    )

    let loading = ( 
      <div className='scroll-covers'>
        {this.state.isLoading && this.state.isLoading !== 'done' ? 'Loading...' : ''}
        {this.state.isLoading === 'done' && this.state.covers === null ? 'No results found.' : ''}
        {this.state.covers === null && this.props.book.title && !this.state.isLoading && this.state.isLoading !== 'done' ? <button onClick={() => this.bookCoverApiRequest()}>Find new covers</button> : ''}
      </div> 
    )

    return ReactDOM.createPortal(
      <div className='modal'>
        <div className='delete d-modal' onClick={done}>X</div>
        <div className='close' onClick={done}></div>
          <div className='modal-info-container'>
            {modal === 3 ? bookMemory
              : modal === 2 ? bookStats
              : modal === 1 ? bookCover
              : bookStats}
            {modal === 1 && this.state.covers !== null ? scrollCovers : modal === 1 ? loading : ''}
          </div>
        <div className='close' onClick={done}></div>
        <div className='extra-opacity'></div>
      </div>,
      this.el)
  }
}

export default Modal;
