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

        const compareDates = (dOne, dTwo) => {
            let date1 = new Date(dOne)
            let date2 = new Date(dTwo)
            let difference = date2.getTime() - date1.getTime()
            let days = difference / (1000 * 3600 * 24)
            let hours = difference / (1000 * 3600)
            return [days, hours]
        }

        const grabDates = i => {
            let date1 = this.props.books.length > 0 && this.props.books[i].started ? this.props.books[i].started.split(' ')[0] : ''
            let date2 = this.props.books.length > 0 && this.props.books[i].finished ? this.props.books[i].finished.split(' ')[0] : ''
            return [date1, date2]
        }

        const random = (arr) => Math.floor(Math.random() * arr.length)

        if (this.props.books.length > 0) {
            switch(header) {
                case 'Took the longest to read': {  // curly brackets used here variables (days, hours, b) can be used in other case blocks
                    let dateArray = []
                    this.props.books.forEach((b,i) => {
                        if (b.finished === null) return 
                        let bCopy = {...b}
                        let [ date1, date2 ] = grabDates(i)
                        let [ days, hours ] = compareDates(date1, date2)
                        bCopy['days'] = days
                        bCopy['hours'] = hours
                        dateArray.push(bCopy)
                    })

                    dateArray = dateArray.sort((a, b) => b.days - a.days)
                    statMore = dateArray
                    if (!dateArray.length) return
                    let topBook = dateArray[0]

                    if (dateArray.length > 1 && dateArray[0].days === dateArray[1].days) {
                        dateArray = dateArray.filter((b, i, arr) => b.days === arr[0].days)
                        topBook = dateArray[random(dateArray)]
                    }
 
                    defaultImg = topBook.url
                    title = topBook.title
                    result = `${Math.round(topBook.days)} days or ${topBook.hours} hours`
                    break;
                }
                case 'Was the quickest read': {
                    let dateArray = []
                    this.props.books.forEach((b,i) => {
                        if (b.finished === null) return 
                        let bCopy = {...b}
                        let [ date1, date2 ] = grabDates(i)
                        let [ days, hours ] = compareDates(date1, date2)
                        bCopy['days'] = days
                        bCopy['hours'] = hours
                        dateArray.push(bCopy)
                    })
                 
                    dateArray = dateArray.sort((a, b) => a.days - b.days)
                    statMore = dateArray
                    if (!dateArray.length) return
                    let topBook = dateArray[0]

                    if (dateArray.length > 1 && dateArray[0].days === dateArray[1].days) {
                        dateArray = dateArray.filter((b, i, arr) => b.days === arr[0].days)
                        topBook = dateArray[random(dateArray)]
                    }
 
                    defaultImg = topBook.url
                    title = topBook.title
                    result = `${Math.round(topBook.days)} days or ${topBook.hours} hours`
                    break;
                }
                case 'Longest page count': {
                    let longest = this.props.books.filter(b => b.pages !== '').sort((a, b) => {
                        let firstValue = b.pages
                        let secondValue = a.pages
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!longest.length) return 

                    statMore = longest

                    if (longest.length > 1 && values[longest[0].title] === values[longest[1].title]) 
                        longest = longest.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else longest = [longest[0]]

                    longest = longest[random(longest)]
                    let amount = values[longest.title] ? values[longest.title] : longest.pages

                    result = `${amount}`
                    title = longest.title
                    defaultImg = longest.url
                    break;  
                }
                case 'Shortest page count': { 
                    let shortest = this.props.books.filter(b => b.pages !== '').sort((a, b) => {
                        let firstValue = a.pages
                        let secondValue = b.pages
                        values[a.title] = firstValue
                        values[b.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!shortest.length) return 

                    statMore = shortest

                    if (shortest.length > 1 && values[shortest[0].title] === values[shortest[1].title]) 
                        shortest = shortest.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else shortest = [shortest[0]]

                    shortest = shortest[random(shortest)]
                    let amount = values[shortest.title] ? values[shortest.title] : shortest.pages

                    result = `${amount}`
                    title = shortest.title
                    defaultImg = shortest.url
                    break;
                }
                case 'Currently reading': {
                    let dateArray = []
                    this.props.books.forEach((b,i) => {
                        let bCopy = {...b}
                        if (b.finished !== null || b.started === null) return 
                        let [ date1 ] = grabDates(i)
                        let date2 = this.props.timeStamp().split(' ')[0]
                        let [ days, hours ] = compareDates(date1, date2)
                        bCopy['days'] = days
                        bCopy['hours'] = hours
                        dateArray.push(bCopy)
                    })

                    dateArray = dateArray.sort((a, b) => b.days - a.days)
                    statMore = dateArray
                    if (!dateArray.length) return
                    let topBook = dateArray[0]
                    
                    defaultImg = topBook.url
                    title = topBook.title
                    result = `As of ${Math.round(topBook.days)} days or ${topBook.hours} hours ago`
                    break;
                }
                case 'Recently finished': {
                    let dateArray = []
                    this.props.books.forEach((b,i) => {
                        let bCopy = {...b}
                        if (b.finished === null) return 
                        let [ , date1 ] = grabDates(i)
                        let date2 = this.props.timeStamp().split(' ')[0]
                        let [ days, hours ] = compareDates(date1, date2)
                        bCopy['days'] = days
                        bCopy['hours'] = hours
                        dateArray.push(bCopy)
                    })

                    dateArray = dateArray.sort((a, b) => b.days - a.days)
                    statMore = dateArray
                    if (!dateArray.length) return
                    let topBook = dateArray[0]
                    
                    defaultImg = topBook.url
                    title = topBook.title
                    result = `As of ${Math.round(topBook.days)} days or ${topBook.hours} hours ago`
                    break;
                }
                case 'A favorite book': {
                    let favoriteBooks = this.props.books.filter(b => b.rating !== '').sort((a, b) => {
                        let firstValue = b.rating
                        let secondValue = a.rating
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!favoriteBooks.length) return 

                    statMore = favoriteBooks

                    if (favoriteBooks.length > 1 && values[favoriteBooks[0].title] === values[favoriteBooks[1].title]) 
                        favoriteBooks = favoriteBooks.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else favoriteBooks = [favoriteBooks[0]]

                    favoriteBooks = favoriteBooks[random(favoriteBooks)]
                    let amount = values[favoriteBooks.title] ? values[favoriteBooks.title] : favoriteBooks.rating

                    result = `${amount}`
                    title = favoriteBooks.title
                    defaultImg = favoriteBooks.url
                    break;
                }
                case 'A least favorite book': {
                    let leastFavoriteBooks = this.props.books.filter(b => b.rating !== '').sort((a, b) => {
                        let firstValue = a.rating
                        let secondValue = b.rating
                        values[a.title] = firstValue
                        values[b.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!leastFavoriteBooks.length) return 

                    statMore = leastFavoriteBooks

                    if (leastFavoriteBooks.length > 1 && values[leastFavoriteBooks[0].title] === values[leastFavoriteBooks[1].title]) 
                        leastFavoriteBooks = leastFavoriteBooks.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else leastFavoriteBooks = [leastFavoriteBooks[0]]

                    leastFavoriteBooks = leastFavoriteBooks[random(leastFavoriteBooks)]
                    let amount = values[leastFavoriteBooks.title] ? values[leastFavoriteBooks.title] : leastFavoriteBooks.rating

                    result = `${amount}`
                    title = leastFavoriteBooks.title
                    defaultImg = leastFavoriteBooks.url
                    break;
                }
                case 'Oldest book': {
                    let oldestBook = this.props.books.filter(b => b.published !== '').sort((a, b) => {
                        let firstValue = a.published 
                        let secondValue = b.published
                        values[a.title] = firstValue
                        values[b.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!oldestBook.length) return 

                    statMore = oldestBook

                    if (oldestBook.length > 1 && values[oldestBook[0].title] === values[oldestBook[1].title]) 
                        oldestBook = oldestBook.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else oldestBook = [oldestBook[0]]

                    oldestBook = oldestBook[random(oldestBook)]
                    let amount = values[oldestBook.title] ? values[oldestBook.title] : oldestBook.published

                    result = `${amount}`
                    title = oldestBook.title
                    defaultImg = oldestBook.url
                    break;
                }
                case 'Newest book': {
                    let newestBook = this.props.books.filter(b => b.published !== '').sort((a, b) => {
                        let firstValue = b.published
                        let secondValue = a.published
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!newestBook.length) return 

                    statMore = newestBook

                    if (newestBook.length > 1 && values[newestBook[0].title] === values[newestBook[1].title]) 
                        newestBook = newestBook.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else newestBook = [newestBook[0]]

                    newestBook = newestBook[random(newestBook)]
                    let amount = values[newestBook.title] ? values[newestBook.title] : newestBook.published

                    result = `${amount}`
                    title = newestBook.title
                    defaultImg = newestBook.url
                    break;
                }
                case 'Longest title': {
                    let longestTitle = this.props.books.filter(b => b.title !== '').sort((a, b) => {
                        let firstValue = b.title.split(' ').join('').length
                        let secondValue = a.title.split(' ').join('').length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
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
                case 'Shortest title': {
                    let shortestTitle = this.props.books.filter(b => b.title !== '').sort((a, b) => {
                        let firstValue = a.title.split(' ').join('').length
                        let secondValue = b.title.split(' ').join('').length
                        values[a.title] = firstValue
                        values[b.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!shortestTitle.length) return 

                    statMore = shortestTitle

                    if (shortestTitle.length > 1 && values[shortestTitle[0].title] === values[shortestTitle[1].title]) 
                        shortestTitle = shortestTitle.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else shortestTitle = [shortestTitle[0]]

                    shortestTitle = shortestTitle[random(shortestTitle)]
                    let amount = values[shortestTitle.title] ? values[shortestTitle.title] : shortestTitle.title.split(' ').join('').length

                    result = `${amount} letters long`
                    title = shortestTitle.title
                    defaultImg = shortestTitle.url
                    break;
                }
                case 'Strongest memory': {
                    let strongMem = this.props.books.filter(b => b.words !== 'words' || b.why !== 'because' || b.moments !== 'that one time when' || b.quotes !== 'to be or not to be').sort((a, b) => {
                        let firstValue = (b.why.length + b.quotes.length + b.words.length + b.moments.length)
                        let secondValue = (a.why.length + a.quotes.length + a.words.length + a.moments.length)
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
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
                case 'Motive': {
                    let motive = this.props.books.filter(b => b.why !== 'because').sort((a, b) => {
                        let firstValue = b.why.split(' ').length
                        let secondValue = a.why.split(' ').length
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
                    let amount = values[motive.title] ? values[motive.title] : motive.why.split(' ').length
                   
                    result = `With ${amount} word${amount > 1 ? 's' : ''} for why`
                    title = motive.title
                    defaultImg = motive.url
                    break;
                }
                case 'Vocabulary': {
                    let vocabulary = this.props.books.filter(b => b.words !== 'words').sort((a, b) => {
                        let firstValue = b.words.split(' ').length
                        let secondValue = a.words.split(' ').length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!vocabulary.length) return 

                    statMore = vocabulary

                    if (vocabulary.length > 1 && values[vocabulary[0].title] === values[vocabulary[1].title]) 
                        vocabulary = vocabulary.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else vocabulary = [vocabulary[0]]

                    vocabulary = vocabulary[random(vocabulary)]
                    let amount = values[vocabulary.title] ? values[vocabulary.title] : vocabulary.words.split(' ').length 
                   
                    result = `With ${amount} word${amount > 1 ? 's' : ''} of interest`
                    title = vocabulary.title
                    defaultImg = vocabulary.url
                    break;
                }
                case 'Momentous': {
                    let momentous = this.props.books.filter(b => b.moments !== 'that one time when').sort((a, b) => {
                        let firstValue = b.moments.split(' ').length
                        let secondValue = a.moments.split(' ').length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })

                    if (!momentous.length) return 

                    statMore = momentous

                    if (momentous.length > 1 && values[momentous[0].title] === values[momentous[1].title]) 
                        momentous = momentous.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else momentous = [momentous[0]]

                    momentous = momentous[random(momentous)]
                    let amount = values[momentous.title] ? values[momentous.title] : momentous.moments.split(' ').length
                   
                    result = `With ${amount} word${amount > 1 ? 's' : ''} worth of moments`
                    title = momentous.title
                    defaultImg = momentous.url
                    break;
                }
                case 'Quotable': {
                    let quotable = this.props.books.filter(b => b.quotes !== 'to be or not to be').sort((a, b) => {
                        let firstValue = b.quotes.split(' ').length
                        let secondValue = a.quotes.split(' ').length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })

                    if (!quotable.length) return 

                    statMore = quotable

                    if (quotable.length > 1 && values[quotable[0].title] === values[quotable[1].title]) 
                        quotable = quotable.filter((b, i, arr) => values[b.title] === values[arr[0].title])
                    else quotable = [quotable[0]]

                    quotable = quotable[random(quotable)]
                    let amount = values[quotable.title] ? values[quotable.title] : quotable.quotes.split(' ').length
                   
                    result = `With ${amount} word${amount > 1 ? 's' : ''} worth of quotes`
                    title = quotable.title
                    defaultImg = quotable.url
                    break;
                }
                case 'A book from a favored genre': {
                    let genreObj = {}
                    this.props.books.forEach(b => {
                        if (genreObj.hasOwnProperty(b.genre)) genreObj[b.genre].push(b)
                        else if (b.genre) genreObj[b.genre] = [b]
                    })
                    let topGenre = Object.entries(genreObj).sort((a,b) => {
                        let firstValue = b[1].length
                        let secondValue = a[1].length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!topGenre.length) return 

                    if (topGenre.length > 1 && topGenre[0][1].length === topGenre[1][1].length) 
                        topGenre = topGenre.filter((b, i, arr) => b[1].length === arr[0].length)
                    else topGenre = [topGenre[0]]

                    topGenre = topGenre[random(topGenre)]
                    statMore = topGenre[1]
                    topGenre = statMore[random(statMore)]
                    
                    result = `${topGenre.genre}`
                    title = topGenre.title
                    defaultImg = topGenre.url
                    break;
                }
                case 'A book from a favored author': {
                    let authorObj = {}
                    this.props.books.forEach(b => {
                        if (authorObj.hasOwnProperty(b.author)) authorObj[b.author].push(b)
                        else if (b.author) authorObj[b.author] = [b]
                    })
                    let topauthor = Object.entries(authorObj).sort((a,b) => {
                        let firstValue = b[1].length
                        let secondValue = a[1].length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    if (!topauthor.length) return 

                    // DATA LOOKS LIKE : [ [ 'Author', [ {...1stBookByAuthor}, {...2ndBookByAuthor} ] ],  [ 'Author', [ {...1stBookByAuthor}, {...2ndBookByAuthor} ] ] ]
                    if (topauthor.length > 1 && topauthor[0][1].length === topauthor[1][1].length) 
                        topauthor = topauthor.filter((b, i, arr) => b[1].length === arr[0].length)
                    else topauthor = [topauthor[0]]
                   
                    // Select a random favored author if there's more than one
                    topauthor = topauthor[random(topauthor)]
                    // Ignore the String in index 0 and grab the array of objects in index 1
                    statMore = topauthor[1]
                    // Select a random book from the favored author
                    topauthor = statMore[random(statMore)]
                    
                    result = `${topauthor.author}`
                    title = topauthor.title
                    defaultImg = topauthor.url
                    break;
                }
                case 'Most efficient read': {
                    let dateArray = []
                    this.props.books.forEach((b,i) => {
                        let bCopy = {...b}
                        if (b.finished === null || !b.pages || isNaN(b.pages)) return 
                        let [ date1, date2 ] = grabDates(i)
                        let [ days, hours ] = compareDates(date1, date2)
                        let efficiency = Math.round(b.pages / days)
                        bCopy['efficiency'] = efficiency
                        bCopy['hours'] = hours
                        dateArray.push(bCopy)
                    })

                    dateArray = dateArray.sort((a, b) => b.efficiency - a.efficiency)
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
                default:
                    break;
            }
        }

        if (!defaultImg) defaultImg = originalDefaultImg
        if (!statMore) statMore = this.state.statMore

        this.setState({header, result, defaultImg, title, statMore})
    }

    render() {

        let { result, header, defaultImg, title, statMore } = this.state

        return(
            <div className='stat-box'>
                {result && !String(result).includes('-1') ? <div className='stat-head' onClick={(e) => this.props.statBoxMoreToggle(e, { statMore, header })}>{header} <br/><span className='lil-stat'>({result}{header && header.includes('favorite') ? '/10' : ''})</span></div> : ''}
                <div><img className='profile-book' src={defaultImg} onClick={() => this.props.handleAttention(title)} alt=''></img></div>
            </div>
        )
    }
}

export default StatBox;
