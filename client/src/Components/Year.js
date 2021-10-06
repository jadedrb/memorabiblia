import React from 'react'

const Year = ({ book, index, arr, organize }) => {

    /*
       giveFullYear - Turn 10/10/21 format to just the full year. [ Output: 2021 string ]
       compareThisAndLast - Compare the year this book was finished with the previous book in the list. [ Output: true/false ]
       numberofBooksThatYear - Count number of books finished the same year as current book. [ Output: 20 number ]
    */

    const giveFullYear = (bookDate) => String(new Date().getFullYear()).substr(0,2) + bookDate.split('/')[2].split(' ')[0]

    const compareThisAndLast = () => !index || giveFullYear(arr[index - 1].finished) !== giveFullYear(book.finished)

    const numberOfBooksThatYear = () => arr.reduce((acc, curr) => giveFullYear(curr.finished) === giveFullYear(book.finished) ? acc + 1 : acc, 0)

    if ((organize === 'chrono-date-asc' || organize === 'chrono-date-desc') && compareThisAndLast()) {
        return (
            <div className="year">
                <span>{giveFullYear(book.finished)}</span>
                <span>({numberOfBooksThatYear()})</span>
            </div>
        )
    } else return null
    
}

export default Year