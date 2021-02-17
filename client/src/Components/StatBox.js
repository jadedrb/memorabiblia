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
        let other = [-1,-1,-1];
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

        const setLowestOrHighest = (days, hours, book) => {
            other[0] = days
            other[1] = hours
            other[2] = book
        }
        if (this.props.books.length > 0) {
            let amount;
            switch(header) {
                case 'Took the longest to read': {  // curly brackets used here variables (days, hours, b) can be used in other case blocks
                    this.props.books.forEach((b,i) => {
                        if (b.finished === null) return 
                        let [ date1, date2 ] = grabDates(i)
                        let [ days, hours ] = compareDates(date1, date2)
                        if (Number(other[0]) < Number(days)) setLowestOrHighest(days, hours, b)
                        else if (Number(other[0]) === Number(days) && Number(other[1]) < Number(hours)) setLowestOrHighest(days, hours, b)
                    })
                    let [ days, hours, b ] = other
                    defaultImg = b.url
                    title = b.title
                    result = `${Math.round(days)} days or ${hours} hours`
                    break;
                }
                case 'Was the quickest read': {
                    this.props.books.forEach((b,i) => {
                        if (b.finished === null) return 
                        let [ date1, date2 ] = grabDates(i)
                        let [ days, hours ] = compareDates(date1, date2)
                        if (other[0] === -1 && days > -1) setLowestOrHighest(days, hours, b)
                        if (days > -1 && Number(other[0]) > Number(days)) setLowestOrHighest(days, hours, b)
                        else if (days > -1 && Number(other[0]) === Number(days) && Number(other[1]) > Number(hours)) setLowestOrHighest(days, hours, b)
                    })
                    let [ days, hours, b ] = other
                    defaultImg = b.url
                    title = b.title
                    result = `${Math.round(days)} days or ${hours} hours`  
                    break;
                }
                case 'Longest page count':
                    let longest = this.props.books.filter(b => b.pages !== '').sort((a, b) => {
                        let firstValue = b.pages
                        let secondValue = a.pages
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    statMore = longest
                    longest = longest && longest[0]
                    result = longest && longest.pages
                    defaultImg = longest && longest.url
                    title = longest && longest.title
                    break;  
                case 'Shortest page count': 
                    let shortest = this.props.books.filter(b => b.pages !== '').sort((a, b) => {
                        let firstValue = a.pages
                        let secondValue = b.pages
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    statMore = shortest
                    shortest = shortest && shortest[0]
                    result = shortest && shortest.pages
                    defaultImg = shortest && shortest.url
                    title = shortest && shortest.title
                    break;
                case 'Currently reading': {
                    this.props.books.forEach((b,i) => {
                        if (b.finished !== null || b.started === null) return 
                        let [ date1 ] = grabDates(i)
                        let date2 = this.props.timeStamp().split(' ')[0]
                        let [ days, hours ] = compareDates(date1, date2)
                        if (other[0] === -1 && days > -1) setLowestOrHighest(days, hours, b)
                        if (days > -1 && Number(other[0]) > Number(days)) setLowestOrHighest(days, hours, b)
                        else if (days > -1 && Number(other[0]) === Number(days) && Number(other[1]) > Number(hours)) setLowestOrHighest(days, hours, b)
                    })
                    let [ days, hours, b ] = other
                    defaultImg = b.url
                    title = b.title
                    result = `As of ${Math.round(days)} days or ${hours} hours ago`  
                    break;
                }
                case 'Recently finished': {
                    this.props.books.forEach((b,i) => {
                        if (b.finished === null) return 
                        let [ , date1 ] = grabDates(i)
                        let date2 = this.props.timeStamp().split(' ')[0]
                        let [ days, hours ] = compareDates(date1, date2)
                        if (other[0] === -1 && days > -1) setLowestOrHighest(days, hours, b)
                        if (days > -1 && Number(other[0]) > Number(days)) setLowestOrHighest(days, hours, b)
                        else if (days > -1 && Number(other[0]) === Number(days) && Number(other[1]) > Number(hours)) setLowestOrHighest(days, hours, b)
                    })
                    let [ days, hours, b ] = other
                    defaultImg = b.url
                    title = b.title
                    result = `As of ${Math.round(days)} days or ${hours} hours ago`
                    break;
                }
                case 'A favorite book':
                    let favoriteBooks = this.props.books.filter(b => b.rating !== '').sort((a, b) => {
                        let firstValue = b.rating
                        let secondValue = a.rating
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    statMore = favoriteBooks
                    favoriteBooks = favoriteBooks.filter(b => b.rating === this.props.books[0].rating)
                    let chosenBook = favoriteBooks[Math.floor(Math.random() * favoriteBooks.length)]
                    result = chosenBook && chosenBook.rating
                    defaultImg = chosenBook && chosenBook.url
                    title = chosenBook && chosenBook.title
                    break;
                case 'A least favorite book':
                    let leastFavoriteBooks = this.props.books.filter(b => b.rating !== '').sort((a, b) => {
                        let firstValue = a.rating
                        let secondValue = b.rating
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    statMore = leastFavoriteBooks
                    leastFavoriteBooks = leastFavoriteBooks.filter(b => b.rating === this.props.books[0].rating)
                    let chosenBook1 = leastFavoriteBooks[Math.floor(Math.random() * leastFavoriteBooks.length)]
                    result = chosenBook1 && chosenBook1.rating
                    defaultImg = chosenBook1 && chosenBook1.url
                    title = chosenBook1 && chosenBook1.title
                    break;
                case 'Oldest book': {
                    let oldestBook = this.props.books.filter(b => b.published !== '').sort((a, b) => {
                        let firstValue = a.published 
                        let secondValue = b.published
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    statMore = oldestBook
                    oldestBook = oldestBook && oldestBook[0]
                    result = oldestBook && oldestBook.published
                    defaultImg = oldestBook && oldestBook.url
                    title = oldestBook && oldestBook.title
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
                    statMore = newestBook
                    newestBook = newestBook && newestBook[0]
                    result = newestBook && newestBook.published
                    defaultImg = newestBook && newestBook.url
                    title = newestBook && newestBook.title
                    break;
                }
                case 'Longest title': {
                    let longestTitle = this.props.books.filter(b => b.title !== '').sort((a, b) => {
                        let firstValue = b.title.length
                        let secondValue = a.title.length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    statMore = longestTitle
                    longestTitle = longestTitle && longestTitle[0]
                    result = longestTitle && `${longestTitle.title.split(' ').join('').length} letters long`
                    defaultImg = longestTitle && longestTitle.url
                    title = longestTitle && longestTitle.title
                    break;
                }
                case 'Shortest title': {
                    let shortestTitle = this.props.books.filter(b => b.title !== '').sort((a, b) => {
                        let firstValue = a.title.length
                        let secondValue = b.title.length
                        values[b.title] = firstValue
                        values[a.title] = secondValue
                        return firstValue - secondValue
                    })
                    statMore = shortestTitle
                    shortestTitle = shortestTitle && shortestTitle[0]
                    result = shortestTitle && `${shortestTitle.title.split(' ').join('').length} letters long`
                    defaultImg = shortestTitle && shortestTitle.url
                    title = shortestTitle && shortestTitle.title
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
                    statMore = strongMem
                    strongMem = strongMem && strongMem[0]
                    result = strongMem && `With ${strongMem.why.length + strongMem.quotes.length + strongMem.words.length + strongMem.moments.length} characters of description`
                    defaultImg = strongMem && strongMem.url
                    title = strongMem && strongMem.title
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
                    statMore = motive
                    motive = motive && motive[0]
                    amount = motive && motive.why.split(' ').length
                    result = motive && `With ${amount} word${amount > 1 ? 's' : ''} for why`
                    defaultImg = motive && motive.url
                    title = motive && motive.title
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
                    statMore = vocabulary
                    vocabulary = vocabulary && vocabulary[0]
                    amount = vocabulary && vocabulary.words.split(' ').length
                    result = vocabulary && `With ${amount} word${amount > 1 ? 's' : ''} of interest`
                    defaultImg = vocabulary && vocabulary.url
                    title = vocabulary && vocabulary.title
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
                    statMore = momentous
                    momentous = momentous && momentous[0]
                    amount = momentous && momentous.moments.split(' ').length
                    result = momentous && `With ${amount} word${amount > 1 ? 's' : ''} worth of moments`
                    defaultImg = momentous && momentous.url
                    title = momentous && momentous.title
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
                    statMore = quotable
                    quotable = quotable && quotable[0]
                    amount = quotable && quotable.quotes.split(' ').length
                    result = quotable && `With ${amount} word${amount > 1 ? 's' : ''} worth of quotes`
                    defaultImg = quotable && quotable.url
                    title = quotable && quotable.title
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
                    topGenre = topGenre && topGenre[0]
                    topGenre = topGenre && topGenre[1]
                    statMore = topGenre
                    console.log(statMore)
                    let randomBook = topGenre && topGenre[Math.floor(Math.random() * topGenre.length)]
                    result = randomBook && `${randomBook.genre}`
                    title = randomBook && randomBook.title
                    defaultImg = randomBook && randomBook.url
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
                    topauthor = topauthor && topauthor[0]
                    topauthor = topauthor && topauthor[1]
                    statMore = topauthor
                    console.log(statMore)
                    let randomBook1 = topauthor && topauthor[Math.floor(Math.random() * topauthor.length)]
                    result = randomBook1 && `${randomBook1.author}`
                    title = randomBook1 && randomBook1.title
                    defaultImg = randomBook1 && randomBook1.url
                    break;
                }
                case 'Most efficient read': {
                    this.props.books.forEach((b,i) => {
                        if (b.finished === null || !b.pages || isNaN(b.pages)) return 
                        let [ date1, date2 ] = grabDates(i)
                        console.log(grabDates(i))
                        let [ days, hours ] = compareDates(date1, date2)
                        console.log(compareDates(date1, date2))
                        let efficiency = Math.round(b.pages / days)
                        if (Number(other[0]) < Number(efficiency)) setLowestOrHighest(efficiency, hours, b)
                    })
                    let [ efish, , b ] = other
                    defaultImg = b.url
                    title = b.title
                    result = `${efish} pages a day`
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
