import React from 'react';

import mix from '../config/mixedContent'

const Home = (props) => {
  let started, finished;
  let defaultImg = 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png'
  let other = [-1,-1,-1]
  let other2 = [-1,-1,-1]

  const compareDates = (dOne, dTwo) => {
    let date1 = new Date(dOne)
    let date2 = new Date(dTwo)
    let difference = date2.getTime() - date1.getTime()
    let days = difference / (1000 * 3600 * 24)
    let hours = difference / (1000 * 3600)
    return [days, hours]
  }

  const grabDates = i => {
    let date1 = props.books.length > 0 && props.books[i].started ? props.books[i].started.split(' ')[0] : ''
    let date2 = props.books.length > 0 && props.books[i].finished ? props.books[i].finished.split(' ')[0] : ''
    return [date1, date2]
  }

  const setLowestOrHighest = (days, hours, book, which) => {
    if (which === 'started') {
      other[0] = days
      other[1] = hours
      other[2] = book
    } else {
      other2[0] = days
      other2[1] = hours
      other2[2] = book
    }
  }

  props.books.forEach((b,i) => {
    if (b.finished !== null || b.started === null) return 
    let [ date1 ] = grabDates(i)
    let date2 = props.timeStamp().split(' ')[0]
    let [ days, hours ] = compareDates(date1, date2)
    if (other[0] === -1 && days > -1) setLowestOrHighest(days, hours, b, 'started')
    if (days > -1 && Number(other[0]) > Number(days)) setLowestOrHighest(days, hours, b, 'started')
    else if (days > -1 && Number(other[0]) === Number(days) && Number(other[1]) > Number(hours)) setLowestOrHighest(days, hours, b, 'started')
  })
  let [ , , b3 ] = other
  started = b3


  props.books.forEach((b,i) => {
    if (b.finished === null) return 
    let [ , date1 ] = grabDates(i)
    let date2 = props.timeStamp().split(' ')[0]
    let [ days, hours ] = compareDates(date1, date2)
    if (other2[0] === -1 && days > -1) setLowestOrHighest(days, hours, b, 'finished')
    if (days > -1 && Number(other2[0]) > Number(days)) setLowestOrHighest(days, hours, b, 'finished')
    else if (days > -1 && Number(other2[0]) === Number(days) && Number(other2[1]) > Number(hours)) setLowestOrHighest(days, hours, b, 'finished')
  })

  let [ , , b4 ] = other2
  finished = b4
  
  return (
    <div className='subtext-parent'>
      <h1 className='memora'>memora
        <span className='dot'>.</span>
        <span className='bib'>bib</span>
        <span className='dot'>.</span>
        <span className='lia'>lia</span>
      </h1>
      <h2 className='subtext'>memorabilia ... biblioteca ... biblia</h2>
      <div className='subtext-boxes'>
        <p>
          Objects kept or collected ... especially those associated with
          memorable people or events ... from Latin, neuter plural of memorabilis ‘memorable’.
        </p>
        <p>
          From Spanish, a library. English, bibliotheca, plural bibliothecae, a list of books in a catalog.
        </p>
        <p>
          Latin biblia, from Greek (ta) biblia ‘(the) books’, from biblion ‘book’, originally
          a diminutive of biblos ‘papyrus, scroll’, of Semitic origin.
        </p>
      </div>
      <div className='current-reading'>
        <div>
          <h1>Currently Reading:</h1>
          <img className='profile-book' onClick={() => props.handleAttention(started.title)} src={started && started.url ? mix(started.url) : mix(defaultImg)} alt='Book Cover'/>
        </div>
        <div>
          <h1>Recently Finished:</h1>
          <img className='profile-book' onClick={() => props.handleAttention(finished.title)} src={finished && finished.url ? mix(finished.url) : mix(defaultImg)} alt='Book Cover' />
        </div>
      </div>
    </div>
  )
}

export default Home;
