import React from 'react';
import Modal from './Modal'

class Book extends React.Component {
  constructor(props) {
    super(props)
    this.state = { message: 0 }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(modalNum) {
    this.state.message ? this.setState({message: 0}) : this.setState({message: modalNum})
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
        <img className='img-div' src={book.url} alt={book.title || 'Untitled'} onClick={() => this.handleClick(1)} />
      </React.Fragment>
    )

    let memory = (
      <div className='memory' onClick={() => this.handleClick(3)}>
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
        {image}
        <div className='book-info' onClick={() => this.handleClick(2)}>
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
                    /> : null}
        <div className='delete' onClick={() => this.props.deleteBook(book)}>X</div>
      </div>
    )
  }
}

export default Book;
