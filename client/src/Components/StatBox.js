import React, { Component } from 'react';

class StatBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            header: '', 
            result: '', 
            defaultImg: '', 
            title: '',
            statMore: []
        }
    }

    componentDidMount() {
   
        let result, title, statMore;
        let originalDefaultImg = 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png'
        let defaultImg = originalDefaultImg
        let values = {}
        let [ header ] = this.props.header 

        // delete later
        // header = 'A book from a prolific month'

        const compareDates = (dOne, dTwo) => {
            let date1 = new Date(dOne)
            let date2 = new Date(dTwo)
            let difference = date2.getTime() - date1.getTime()
            let days = difference / (1000 * 3600 * 24)
            let hours = difference / (1000 * 3600)
            return [days, hours]
        }

        const grabDates = i => {
            let date1 = this.props.books.length > 0 && this.props.books[i]?.started ? this.props.books[i]?.started.split(' ')[0] : ''
            let date2 = this.props.books.length > 0 && this.props.books[i]?.finished ? this.props.books[i]?.finished.split(' ')[0] : ''
            return [date1, date2]
        }

        const random = (arr) => Math.floor(Math.random() * arr.length)

        if (this.props.books.length > 0) {
            switch(header) {
                case 'Was the quickest read':
                case 'Currently reading':
                case 'Recently finished':
                case 'Took the longest to read': {  // curly brackets used here variables (days, hours, b) can be used in other case blocks
                    let dateArray = []

                    let condition = header === 'Recently finished' || header === 'Currently reading'
                    let condition2 = header === 'Currently reading' || header === 'Took the longest to read'
                    let condition3 = header === 'Recently finished'

                    this.props.books.forEach((b,i) => {
                        if ((condition && !condition3) && (b.finished !== null || b.started === null)) return 
                        else if ((condition3 || !condition) && b.finished === null) return

                        let bCopy = {...b}
                        let [ date1, date2 ] = grabDates(i)

                        if (condition3) date1 = date2
                        if (condition) date2 = this.props.timeStamp().split(' ')[0]
                        
                        let [ days, hours ] = compareDates(date1, date2)
                        bCopy['days'] = days
                        bCopy['hours'] = hours
                        values[b.title] = Math.round(days)
                        dateArray.push(bCopy)
                    })

                    dateArray = dateArray.sort((a, b) => condition2 ? b.days - a.days : a.days - b.days)
                    statMore = dateArray
                    if (!dateArray.length) return
                    let topBook = dateArray[0]

                    if (!condition && dateArray.length > 1 && dateArray[0].days === dateArray[1].days) {
                        dateArray = dateArray.filter((b, i, arr) => b.days === arr[0].days)
                        topBook = dateArray[random(dateArray)]
                    }
 
                    defaultImg = topBook.url
                    title = topBook.title
                    result = `${condition ? 'As of ' : ''}${Math.round(topBook.days)} days or ${topBook.hours} hours${condition ? ' ago' : ''}`
                    break;
                }
                case 'Shortest page count':
                case 'Longest page count':
                case 'Newest book':
                case 'Oldest book':
                case 'A least favorite book':
                case 'A favorite book': {
                    let property;

                    if (header === 'Newest book' || header === 'Oldest book') property = 'published'
                    else if (header ==='Shortest page count' || header === 'Longest page count') property = 'pages'
                    else property = 'rating'

                    let favoriteBooks = this.props.books.filter(b => b[property] !== '').sort((a, b) => {
                        let firstValue = b[property]
                        let secondValue = a[property]
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        let condition = header === 'A favorite book' || header === 'Newest book' || header === 'Longest page count'
                        return condition ? firstValue - secondValue : secondValue - firstValue
                    })
                    if (!favoriteBooks.length) return 

                    statMore = favoriteBooks

                    if (favoriteBooks.length > 1 && values[favoriteBooks[0].title] === values[favoriteBooks[1].title]) 
                        favoriteBooks = favoriteBooks.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else favoriteBooks = [favoriteBooks[0]]

                    favoriteBooks = favoriteBooks[random(favoriteBooks)]
                    let amount = values[favoriteBooks.title] ? values[favoriteBooks.title] : favoriteBooks[property]

                    result = `${amount}`
                    title = favoriteBooks.title
                    defaultImg = favoriteBooks.url
                    break;
                }

                case 'Shortest title':
                case 'Longest title': {
                    let longestTitle = this.props.books.filter(b => b.title !== '').sort((a, b) => {
                        let firstValue = b.title.split(' ').join('').length
                        let secondValue = a.title.split(' ').join('').length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return header === 'Longest title' ? firstValue - secondValue : secondValue - firstValue
                    })
                    if (!longestTitle.length) return 

                    statMore = longestTitle

                    if (longestTitle.length > 1 && values[longestTitle[0].title] === values[longestTitle[1].title]) 
                        longestTitle = longestTitle.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else longestTitle = [longestTitle[0]]

                    longestTitle = longestTitle[random(longestTitle)]
                    let amount = values[longestTitle.title] ? values[longestTitle.title] : longestTitle.title.split(' ').join('').length

                    result = `${amount} letters long`
                    title = longestTitle.title
                    defaultImg = longestTitle.url
                    break;
                }
                case 'Strongest memory':
                case 'Weakest memory': {
                    let strongMem = this.props.books.filter(b => b.words !== 'words' || b.why !== 'because' || b.moments !== 'that one time when' || b.quotes !== 'to be or not to be').sort((a, b) => {
                        let firstValue = (b.why.length + b.quotes.length + b.words.length + b.moments.length)
                        let secondValue = (a.why.length + a.quotes.length + a.words.length + a.moments.length)
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return header ===  'Strongest memory' ? firstValue - secondValue : secondValue - firstValue
                    })
                    if (!strongMem.length) return 

                    statMore = strongMem

                    if (strongMem.length > 1 && values[strongMem[0].title] === values[strongMem[1].title]) 
                        strongMem = strongMem.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else strongMem = [strongMem[0]]

                    strongMem = strongMem[random(strongMem)]
                    let amount = values[strongMem.title] ? values[strongMem.title] : (strongMem.why.length + strongMem.quotes.length + strongMem.words.length + strongMem.moments.length)
                   
                    result = `With ${amount} characters of description`
                    title = strongMem.title
                    defaultImg = strongMem.url
                    break;
                }
                case 'Momentous':
                case 'Vocabulary':
                case 'Quotable':
                case 'Motive': {
                    let property, customResult;

                    if (header === 'Motive') property = 'why'
                    if (header === 'Quotable') property = 'quotes'
                    if (header === 'Vocabulary') property = 'words'
                    if (header === 'Momentous') property = 'moments'
 
                    let motive = this.props.books.filter(b => b[property] !== 'because').sort((a, b) => {
                        let firstValue = b[property].split(' ').length
                        let secondValue = a[property].split(' ').length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!motive.length) return 

                    statMore = motive

                    if (motive.length > 1 && values[motive[0].title] === values[motive[1].title]) 
                        motive = motive.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else motive = [motive[0]]

                    motive = motive[random(motive)]

                    let amount = values[motive.title] ? values[motive.title] : motive[property].split(' ').length

                    if (header === 'Motive') customResult = `With ${amount} word${amount > 1 ? 's' : ''} for why`
                    if (header === 'Quotable' || header === 'Momentous') customResult = `With ${amount} word${amount > 1 ? 's' : ''} worth of ${property}`
                    if (header === 'Vocabulary') customResult = `With ${amount} word${amount > 1 ? 's' : ''} of interest`
                   
                    result = customResult
                    title = motive.title
                    defaultImg = motive.url
                    break;
                }
                case 'A book from a favored genre': 
                case 'A book from a prolific month':
                case 'A book from a favored author': {
                    let authorObj = {}
                    let property = header === 'A book from a favored author' ? 'author' : 'genre'
                    property = header === 'A book from a prolific month' ? 'month' : property

                    this.props.books.forEach(b => {
                        let months;
                        if(property === 'month') {
                            if (!b.started) return
                            // console.log(b.started, new Date(b.started).getMonth() + 1)
                            months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                            b[property] = months[new Date(b.started).getMonth() + 1]
                        }
                        if (authorObj.hasOwnProperty(b[property])) authorObj[b[property]].push(b)
                        else if (b[property]) authorObj[b[property]] = [b]
                        values[b.title] = b[property]
                    })
                    let topauthor = Object.entries(authorObj).sort((a,b) => {
                        let firstValue = b[1].length
                        let secondValue = a[1].length
                        return firstValue - secondValue
                    })
                    if (!topauthor.length) return 
  
                    // DATA LOOKS LIKE : [ [ 'Author', [ {...1stBookByAuthor}, {...2ndBookByAuthor} ] ],  [ 'Author', [ {...1stBookByAuthor}, {...2ndBookByAuthor} ] ] ]
                    if (topauthor.length > 1 && topauthor[0][1].length === topauthor[1][1].length) 
                        topauthor = topauthor.filter((b, i, arr) => b[1].length === arr[0][1].length)
                    else topauthor = [topauthor[0]]
 
                    // Select a random favored author if there's more than one
                    topauthor = topauthor[random(topauthor)]
  
                    // Ignore the String in index 0 and grab the array of objects in index 1
                    statMore = topauthor[1]
                    // Select a random book from the favored author
                    topauthor = statMore[random(statMore)]
                    
                    result = `${topauthor[property]}`
                    title = topauthor.title
                    defaultImg = topauthor.url
                    break;
                }
                case 'Most efficient read': 
                case 'Least efficient read': {
                    let dateArray = []
                    this.props.books.forEach((b,i) => {
                        let bCopy = {...b}
                        if (b.finished === null || !b.pages || isNaN(b.pages)) return 
                        let [ date1, date2 ] = grabDates(i)
                        let [ days, hours ] = compareDates(date1, date2)
                        let efficiency = Math.round(b.pages / days)
                        bCopy['efficiency'] = efficiency
                        bCopy['hours'] = hours
                        values[b.title] = efficiency
                        dateArray.push(bCopy)
                    })

                    dateArray = dateArray.sort((a, b) => header === 'Most efficient read' ? b.efficiency - a.efficiency : a.efficiency - b.efficiency)
                
                    statMore = dateArray
                    if (!dateArray.length) return
                    let topBook = dateArray[0]

                    // Check if there are multiple books tied for best efficiency
                    if (dateArray.length > 1 && dateArray[0].efficiency === dateArray[1].efficiency) {
                        dateArray = dateArray.filter((b, i, arr) => b.efficiency === arr[0].efficiency)
                        topBook = dateArray[random(dateArray)]
                    }
                    
                    defaultImg = topBook.url
                    title = topBook.title
                    result = `${topBook.efficiency} pages a day`
                    break;
                }
                case 'Longest break after reading': {
   
                    const findThatIndex = (b) => b ? this.props.books.findIndex(item => item._id === b._id) : 0
                    
                    let dateArray = []

                    /*
                        First filter out books that haven't been started.
                        For those that have, assign a new property that reflects
                        how many days have passed since it was started
                    */
                    this.props.books.forEach((b,i) => {
                        if (!b.started) return
                        let bCopy = {...b}
                        let [ date1, date2 ] = grabDates(i)
                        date2 = this.props.timeStamp().split(' ')[0]
                        
                        let [ days, hours ] = compareDates(date1, date2)
                        //console.log(days)
                        
                        bCopy['days'] = days
                        bCopy['hours'] = hours
                        values[b.title] = Math.round(days)
                        dateArray.push(bCopy)
                    })

                    /*
                        Use that new days property to sort them by start date.
                        More recently started are higher up (or closer to 0 index)
                    */
                    dateArray = dateArray.sort((a, b) => a.days - b.days)
                    
                    let dateArray2 = []
                    let cr = 0

                    /*
                        Now that they're sorted, compare the start date of the 
                        previous book (index - 1) with the finish date of the 
                        current book (index), taking into account edge cases.
                        Assign the days between to a new property for each book.
                    */
    
                    dateArray.forEach((b,i) => {
         
                        if (!i && b.started && !b.finished) cr = b
                        if (!b.started || !b.finished) return
                        if (typeof cr === 'number') cr++
                
                        let bCopy = {...b}

                        // start date of previous book in timeline
                        let [ date2 ] = grabDates(findThatIndex(dateArray[i-1]))

                        // finish date of current book in iteration
                        let [ , date1 ] = grabDates(findThatIndex(b))

                        if (cr === 1) {
                            //console.log('comparing last finished book with current date:')
                            date1 = grabDates(findThatIndex(b))[1]
                            date2 = this.props.timeStamp().split(' ')[0]
                            //console.log(findThatIndex(b))
                        }

                        //console.log(i, b.title)
                        
                        if (typeof cr === 'object') {
                            // console.log('comparing current reading with last finished:')
                            date2 = grabDates(findThatIndex(cr))[0]
                            date1 = grabDates(findThatIndex(b))[1]
                            cr = false
                        }
                        
                       
                        let [ days ] = compareDates(date1, date2)
                        //console.log(days)
                        if (!days) return
                        bCopy['break'] = days
                        values[b.title] = Math.round(days)
                        dateArray2.push(bCopy)
                    })

                    if(!dateArray2.length) return
                    //console.log('hmmmm:', dateArray)
                    // console.log('sorted by start date:', dateArray2)
                    dateArray2 = dateArray2.sort((a, b) => b.break - a.break)
                    //console.log(dateArray2)

                    //console.log('values:', values)
                    statMore = dateArray2
                    if (!dateArray2.length) return
                    let topBook = dateArray2[0]

                    if (dateArray2.length > 1 && dateArray2[0].break === dateArray2[1].break) {
                        dateArray2 = dateArray2.filter((b, i, arr) => b.break === arr[0].break)
                        topBook = dateArray2[random(dateArray2)]
                    }

                    defaultImg = topBook.url
                    title = topBook.title
                    result = `A lapse of ${Math.round(topBook.break)} days`
                }
                    break;
                default:
                    break;
            }
        }

        if (!defaultImg) defaultImg = originalDefaultImg
        if (!statMore) statMore = this.state.statMore

        this.setState({header, result, defaultImg, title, statMore, values})
    }

    render() {

        let { result, header, defaultImg, title, statMore, values } = this.state

        return(
            <div className='stat-box'>
                {result && !String(result).includes('-1') ? <div className='stat-head' onClick={(e) => this.props.statBoxMoreToggle(e, { statMore, header, values })}>{header} <br/><span className='lil-stat'>({result}{header && header.includes('favorite') ? '/10' : ''})</span></div> : ''}
                <div><img className='profile-book' src={defaultImg} onClick={() => this.props.handleAttention(title)} alt=''></img></div>
            </div>
        )
    }
}

export default StatBox;
