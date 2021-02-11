import React from 'react';
import Modal from './Modal'

class Book extends React.Component {
  constructor(props) {
    super(props)
    this.state = { message: 0, tab: 'info' }
    this.handleClick = this.handleClick.bind(this)
    this.switchTab = this.switchTab.bind(this)
  }

  componentDidMount() {
    if (window.innerWidth <= 550) this.setState({tab: 'image'})
    else this.setState({tab: 'info'})
  }

  componentDidUpdate() {
    if (!this.props.screen) {
      if (window.innerWidth <= 550 && this.state.tab !== 'image') this.setState({tab: 'image'})
      else if (window.innerWidth > 550 && this.state.tab !== 'info') this.setState({tab: 'info'})
      this.props.resetScreenCheck()
    }
  }

  handleClick(modalNum) {
    this.state.message ? this.setState({message: 0}) : this.setState({message: modalNum})
  }

  switchTab(tab) { 
    alert('switch tab: ' + tab)
    this.props.minimize('collapse')
    this.setState({tab}) 
  }

  render() {

    let book = this.props.book
    let message = this.state.message
    let color = { color: this.props.book.color }
    let bakColorOne = { backgroundColor: 'seashell' }
    let bakColorTwo = { backgroundColor: 'snow' }
    let everyOther = book.id % 2 === 0 ? true : false

    let image = (
      <React.Fragment>
        <img className='img-div' src={book.url} alt={book.title || 'Untitled'} onClick={() => this.handleClick(1)} style={{display: window.innerWidth < 551 && this.state.tab !== 'image' ? 'none' : 'block'}}/>
      </React.Fragment>
    )

    let memory = (
      <div className='memory' onClick={() => this.handleClick(3)} style={{display: window.innerWidth < 931 && this.state.tab !== 'memory' ? 'none' : 'block'}}>
        <p>Why I Read It <br />
          <span style={color}>{book.why}</span>
        </p>
        <p>Interesting Words<br />
          <span style={color}>{book.words}</span>
        </p>
        <p>Favorite Quote(s)<br />
          <span style={color}>{book.quotes}</span>
        </p>
        <p>Memorable Moments<br />
          <span style={color}>{book.moments}</span>
        </p>
      </div>
    )

    if (book.started !== null && book.finished === null) {
      bakColorOne = { border: '10px solid palegreen', backgroundColor: 'aliceblue' }
      bakColorTwo = { border: '10px solid palegreen', backgroundColor: 'aliceblue' }
    }

    return (
      <div style={everyOther ? bakColorOne : bakColorTwo} className='book'>
        <div className='mobile-friendly'> 
          <div className='div-info' onClick={() => this.switchTab('info')}><p className='flip-text'>INFO</p></div> 
          <div className='div-memory' onClick={() => this.switchTab('memory')}><p className='flip-text'>MEMORY</p></div> 
          <div className='extremely-friendly-div div-image' onClick={() => this.switchTab('image')}><p className='flip-text'>COVER</p></div> 
        </div>
        {image}
        <div className='book-info' onClick={() => this.handleClick(2)} style={{display: window.innerWidth < 931 && this.state.tab !== 'info' ? 'none' : 'block'}}>
          <p>Title <br />
            <span style={color}>{book.title}</span>
          </p>
          <p>Author <br />
            <span style={color}>{book.author}</span>
          </p>
          <p>Genre <br />
            <span style={color}>{book.genre}</span>
          </p>
          <p>Published <br />
            <span style={color}>{book.published}</span>
          </p>
          <p>Pages <br />
            <span style={color}>{book.pages}</span>
          </p>
          <p>Started <br />
            <span style={color}>
              {book.started !== null ? book.started : ''}
            </span>
          </p>
          <p>Finished <br />
            <span style={color}>
              {book.finished !== null ? book.finished : ''}
            </span>
          </p>
          <p>My Rating <br />
            <span style={color}>{book.rating}</span><span style={color}>/10</span>
          </p>
        </div>
        {memory}
        {message ? <Modal
                      book={book}
                      onChange={this.props.onChange}
                      bookBlueprint={this.props.bookBlueprint}
                      done={this.handleClick}
                      modalNum={this.state.message}
                      started={this.state.started}
                      startAndFinish={this.startAndFinish}
                      randomC={this.props.randomC}
                      defineApi={this.props.defineApi}
                      minimize={this.props.minimize}
                    /> : null}
        <div className='delete' onClick={() => this.props.deleteBook(book)}>X</div>
      </div>
    )
  }
}

export default Book;
