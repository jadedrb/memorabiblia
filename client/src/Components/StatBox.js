import React from 'react';

function StatBox(props) {

    let result, title;
    let other = [-1,-1,-1];
    let defaultImg = 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png'
    let [ header ] = props.header 

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

    const setLowestOrHighest = (days, hours, book) => {
        other[0] = days
        other[1] = hours
        other[2] = book
    }
    if (props.books.length > 0) {
        let amount;
        console.log(header)
        switch(header) {
            case 'Took the longest to read':
                props.books.forEach((b,i) => {
                    if (b.finished === null) return 
                    console.log('start of took the longest')
                    let [ date1, date2 ] = grabDates(i)
                    let [ days, hours ] = compareDates(date1, date2)
                    if (Number(other[0]) < Number(days)) setLowestOrHighest(days, hours, b)
                    else if (Number(other[0]) === Number(days) && Number(other[1]) < Number(hours)) setLowestOrHighest(days, hours, b)
                })
                let [ days, hours, b1 ] = other
                defaultImg = b1.url
                title = b1.title
                result = `${days} days or ${hours} hours`
                break;
            case 'Was the quickest read':
                props.books.forEach((b,i) => {
                    if (b.finished === null) return 
                    let [ date1, date2 ] = grabDates(i)
                    let [ days, hours ] = compareDates(date1, date2)
                    if (other[0] === -1 && days > -1) setLowestOrHighest(days, hours, b)
                    if (days > -1 && Number(other[0]) > Number(days)) setLowestOrHighest(days, hours, b)
                    else if (days > -1 && Number(other[0]) === Number(days) && Number(other[1]) > Number(hours)) setLowestOrHighest(days, hours, b)
                })
                let [ dayz, hourz, b2 ] = other
                defaultImg = b2.url
                title = b2.title
                result = `${dayz} days or ${hourz} hours`  
                break;
            case 'Longest page count':
                let longest = props.books.filter(b => b.pages !== '').sort((a, b) => b.pages - a.pages)[0]
                result = longest && longest.pages
                defaultImg = longest && longest.url
                title = longest && longest.title
                break;  
            case 'Shortest page count': 
                let shortest = props.books.filter(b => b.pages !== '').sort((a, b) => a.pages - b.pages)[0]
                result = shortest && shortest.pages
                defaultImg = shortest && shortest.url
                title = shortest && shortest.title
                break;
            case 'Currently reading':
                props.books.forEach((b,i) => {
                    if (b.finished !== null || b.started === null) return 
                    let [ date1 ] = grabDates(i)
                    let date2 = props.timeStamp().split(' ')[0]
                    let [ days, hours ] = compareDates(date1, date2)
                    if (other[0] === -1 && days > -1) setLowestOrHighest(days, hours, b)
                    if (days > -1 && Number(other[0]) > Number(days)) setLowestOrHighest(days, hours, b)
                    else if (days > -1 && Number(other[0]) === Number(days) && Number(other[1]) > Number(hours)) setLowestOrHighest(days, hours, b)
                })
                let [ dayzz, hourzz, b3 ] = other
                defaultImg = b3.url
                title = b3.title
                result = `As of ${dayzz} days or ${hourzz} hours ago`  
                break;
            case 'Recently finished':
                props.books.forEach((b,i) => {
                    if (b.finished === null) return 
                    let [ , date1 ] = grabDates(i)
                    let date2 = props.timeStamp().split(' ')[0]
                    let [ days, hours ] = compareDates(date1, date2)
                    if (other[0] === -1 && days > -1) setLowestOrHighest(days, hours, b)
                    if (days > -1 && Number(other[0]) > Number(days)) setLowestOrHighest(days, hours, b)
                    else if (days > -1 && Number(other[0]) === Number(days) && Number(other[1]) > Number(hours)) setLowestOrHighest(days, hours, b)
                })
                let [ dayzzz, hourzzz, b4 ] = other
                defaultImg = b4.url
                title = b4.title
                result = `As of ${dayzzz} days or ${hourzzz} hours ago`
                break;
            case 'A favorite book':
                let favoriteBooks = props.books.filter(b => b.rating !== '').sort((a, b) => b.rating - a.rating).filter(b => b.rating === props.books[0].rating)
                let chosenBook = favoriteBooks[Math.floor(Math.random() * favoriteBooks.length)]
                result = chosenBook && chosenBook.rating
                defaultImg = chosenBook && chosenBook.url
                title = chosenBook && chosenBook.title
                break;
            case 'A least favorite book':
                let leastFavoriteBooks = props.books.filter(b => b.rating !== '').sort((a, b) => a.rating - b.rating).filter(b => b.rating === props.books[0].rating)
                let chosenBook1 = leastFavoriteBooks[Math.floor(Math.random() * leastFavoriteBooks.length)]
                result = chosenBook1 && chosenBook1.rating
                defaultImg = chosenBook1 && chosenBook1.url
                title = chosenBook1 && chosenBook1.title
                break;
            case 'Oldest book':
                let oldestBook = props.books.filter(b => b.published !== '').sort((a, b) => a.published - b.published)[0]
                result = oldestBook && oldestBook.published
                defaultImg = oldestBook && oldestBook.url
                title = oldestBook && oldestBook.title
                break;
            case 'Newest book':
                let newestBook = props.books.filter(b => b.published !== '').sort((a, b) => b.published - a.published)[0]
                result = newestBook && newestBook.published
                defaultImg = newestBook && newestBook.url
                title = newestBook && newestBook.title
                break;
            case 'Longest title':
                let longestTitle = props.books.filter(b => b.title !== '').sort((a, b) => b.title.length - a.title.length)[0]
                result = longestTitle && `${longestTitle.title.split(' ').join('').length} letters long`
                defaultImg = longestTitle && longestTitle.url
                title = longestTitle && longestTitle.title
                break;
            case 'Shortest title':
                let shortestTitle = props.books.filter(b => b.title !== '').sort((a, b) => a.title.length - b.title.length)[0]
                result = shortestTitle && `${shortestTitle.title.split(' ').join('').length} letters long`
                defaultImg = shortestTitle && shortestTitle.url
                title = shortestTitle && shortestTitle.title
                break;
            case 'Strongest memory':
                let strongMem = props.books.filter(b => b.words !== 'words' || b.why !== 'because' || b.moments !== 'that one time when' || b.quotes !== 'to be or not to be').sort((a, b) => (b.why.length + b.quotes.length + b.words.length + b.moments.length) - (a.why.length + a.quotes.length + a.words.length + a.moments.length))[0]
                result = strongMem && `With ${strongMem.why.length + strongMem.quotes.length + strongMem.words.length + strongMem.moments.length} characters of description`
                defaultImg = strongMem && strongMem.url
                title = strongMem && strongMem.title
                break;
            case 'Motive':
                let motive = props.books.filter(b => b.why !== 'because').sort((a, b) => b.why.split(' ').length - a.why.split(' ').length)[0]
                amount = motive && motive.why.split(' ').length
                result = motive && `With ${amount} word${amount > 1 ? 's' : ''} for why`
                defaultImg = motive && motive.url
                title = motive && motive.title
                break;
            case 'Vocabulary':
                let vocabulary = props.books.filter(b => b.words !== 'words').sort((a, b) => b.words.split(' ').length - a.words.split(' ').length)[0]
                amount = vocabulary && vocabulary.words.split(' ').length
                result = vocabulary && `With ${amount} word${amount > 1 ? 's' : ''} of interest`
                defaultImg = vocabulary && vocabulary.url
                title = vocabulary && vocabulary.title
                break;
            case 'Momentous':
                let momentous = props.books.filter(b => b.moments !== 'that one time when').sort((a, b) => b.moments.split(' ').length - a.moments.split(' ').length)[0]
                amount = momentous && momentous.moments.split(' ').length
                result = momentous && `With ${amount} word${amount > 1 ? 's' : ''} worth of moments`
                defaultImg = momentous && momentous.url
                title = momentous && momentous.title
                break;
            case 'Quotable':
                let quotable = props.books.filter(b => b.quotes !== 'to be or not to be').sort((a, b) => b.quotes.split(' ').length - a.quotes.split(' ').length)[0]
                amount = quotable && quotable.quotes.split(' ').length
                result = quotable && `With ${amount} word${amount > 1 ? 's' : ''} worth of quotes`
                defaultImg = quotable && quotable.url
                title = quotable && quotable.title
                break;
            default:
                break;
        }
    }
    console.log(title)
    console.log('^^')
    let cover = <img className='profile-book' src={defaultImg} onClick={() => props.handleAttention(title)} alt=''></img>
    return(
        <div className='stat-box'>
            {result && !String(result).includes('-1') ? <div className='stat-head'>{header} <br/><span className='lil-stat'>({result}{header && header.includes('favorite') ? '/10' : ''})</span></div> : ''}
            <div>{cover}</div>
        </div>
    )
}

export default StatBox;