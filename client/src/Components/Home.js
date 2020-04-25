import React from 'react';

const Home = (props) => {
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
          <img src={props.current !== undefined ? props.current.url : ''} alt='Book Cover'/>
        </div>
        <div>
          <h1>Recently Finished:</h1>
          <img src={props.finished ? props.finished.url : ''} alt='Book Cover' />
        </div>
      </div>
    </div>
  )
}

export default Home;
