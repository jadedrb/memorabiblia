import React, { Component } from 'react';
import Login from './Login';
import StatBox from './StatBox';
import axios from 'axios';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            whyTextPiece: '',
            wordTextPiece: '',
            quoteTextPiece: '',
            momentTextPiece: '',
            totalPages: 0, 
            pagesRead: 0, 
            booksRead: 0, 
            totalBooks: 0, 
            inNeedOfAttention: [], 
            choices: [],
            noStressMsgs: '',
            theme: 'light'
        }
        this.deleteAccount = this.deleteAccount.bind(this)
        this.changeTheme = this.changeTheme.bind(this)
    }
    componentDidMount() {
        let { books } = this.props.data
        let pagesRead = 0;
        let booksRead = 0;
        let totalBooks = books.length;
        let totalPages = 0;
        let defaultImg = 'https://i.pinimg.com/originals/e7/46/b5/e746b5242cc4ca1386ab8cbc87885ff5.png'
        let bookPropStore = {}
        let inNeedOfAttention = [0, 0];

        let noStressMsgs = ['All entries filled', 'Nothing to worry about', 'Dutiful. Well done', 'Your memory is strong', 'Maybe add more books']
        noStressMsgs = noStressMsgs[Math.floor(Math.random() * noStressMsgs.length)]

        books.forEach((b, i) => {
            if (typeof(Number(b.pages)) === 'number') totalPages += Number(b.pages)
            if (b.finished !== null && typeof(Number(b.pages)) === 'number') pagesRead += Number(b.pages)
            if (b.finished !== null) booksRead++
            bookPropStore[i] = Object.keys(b).filter(p => (p !== 'id' && p !== '_id' && p !== 'started' && p !== 'finished' && b[p] === '') || b[p] === 'because' || b[p] === 'words' || b[p] === 'to be or not to be' || b[p] === 'that one time when' || b[p] === defaultImg)
            if (bookPropStore[i].length > inNeedOfAttention[1]) inNeedOfAttention = [i, bookPropStore[i].length] 
        })

        let [ index ] = inNeedOfAttention
        let missingProps = bookPropStore[index]
        let bookInNeed = books[index]
        inNeedOfAttention = [missingProps, bookInNeed]

        let boxes = ['A book from a favored author', 'A book from a favored genre', 'Took the longest to read', 'Was the quickest read', 'Longest page count', 'Shortest page count', 'Currently reading', 'Recently finished', 'A favorite book', 'A least favorite book', 'Oldest book', 'Newest book', 'Strongest memory', 'Longest title', 'Shortest title', 'Momentous', 'Quotable', 'Motive', 'Vocabulary', 'Most efficient read']
        let choices = []

        const random = arr => Math.floor(Math.random() * arr.length)

        while (choices.length < 6) {
            let pick = boxes.splice(random(boxes), 1)
            choices.push(...pick)
        }

        let userTextProps = ['why', 'words', 'quotes', 'moments']
        let userTextPieces = []

        while (books.length > 0 && userTextProps.length > 0) {
            let property = userTextProps.shift()
            let stringValue = books[Math.floor(Math.random() * books.length)][property]
            let slicePoint = Math.floor(Math.random() * stringValue.length)
            let textPiece = stringValue.slice(slicePoint).length > 140 ? stringValue.slice(slicePoint, slicePoint + 140) : stringValue.slice(0,140)
            userTextPieces.push(textPiece)
        }

        let [ whyTextPiece, wordTextPiece, quoteTextPiece, momentTextPiece ] = userTextPieces

        this.setState({totalPages, pagesRead, booksRead, totalBooks, inNeedOfAttention, choices, whyTextPiece, wordTextPiece, quoteTextPiece, momentTextPiece, noStressMsgs})
    }

    deleteAccount() {
        let deleting = window.confirm('Are you sure you want to delete your account? This will remove all saved entries and user information permanently.')
        if (deleting) {
            let confirm = prompt(`Please confirm your action by typing: "Yes I, ${this.props.data.user}, would like to delete my account"`)
            if (confirm === `Yes I, ${this.props.data.user}, would like to delete my account`) {
                let books = this.props.data.books
                books.map(b => axios.delete(`/api/memories/remove/${b._id}`))

                axios
                    .get('/api/users')
                    .then(res => {
                        console.log(res.data)
                        let user = res.data.filter(b => b.username === this.props.data.user)[0]._id
                        axios
                            .delete(`api/users/remove/${user}`)
                            .then(() => {
                                alert('Account deleted successfully.')
                                this.props.setUser()
                            })
                    })
            }
        }
    }

    changeTheme() {
        if (this.state.theme === 'light') {
            document.querySelector('body').style.backgroundColor = 'rgb(31,23,15)'
            document.querySelector('body').style.color = 'white'
            document.querySelector('nav').style.backgroundColor = 'rgb(44,33,2)'
            this.setState({theme: 'dark'})
        } else {
            document.querySelector('body').style.backgroundColor = 'seashell'
            document.querySelector('body').style.color = 'black'
            document.querySelector('nav').style.backgroundColor = 'papayawhip'
            this.setState({theme: 'light'})
        }
    }

    render() {
        let { user, books, email, creationDate } = this.props.data
        let { pagesRead, totalPages, booksRead, totalBooks, whyTextPiece, wordTextPiece, quoteTextPiece, momentTextPiece, noStressMsgs } = this.state
        let [ properties, bookNeed ] = this.state.inNeedOfAttention

        let attention = (
            <div id='attention'>
                <div id='attention-title'><span><i>{bookNeed && bookNeed.title ? bookNeed.title : 'Untitled'}</i> needs your attention.</span><br/> Remember anything else about this book?</div>
                <img className='profile-book' src={bookNeed && bookNeed.url} onClick={() => this.props.handleAttention(bookNeed.title)} alt={''}></img>
                <ul>
                    <li id='missing'>Missing...</li>
                    {properties && properties.map((p,i) => <li key={i} style={i % 2 === 0 ? {color: '#505050'} : {color: 'black'}}>{p === 'url' ? 'cover' : p}</li>)}
                </ul>
            </div>
        )

        let noStress = (
            <div id='no-stress'>{noStressMsgs} <span role="img" aria-label="check mark">✔️</span></div>
        )

        let choices = [...this.state.choices]

        const random = arr => Math.floor(Math.random() * arr.length)

        let booksReadC = booksRead === totalBooks ? {color: '#3577CB'} : {color: '#9FBEE5'}
        let pagesReadC = pagesRead === totalPages ? {color: '#3577CB'} : {color: '#9FBEE5'}

        let statBoxes;

        if (!books.length || !choices.length) {
            statBoxes = <div id='profile-stats'></div>
        } else {
            statBoxes = (
                <div id='profile-stats'>
                    <StatBox 
                        header={choices.splice(choices.indexOf(choices[random(choices)]), 1)} 
                        books={books} 
                        timeStamp={this.props.timeStamp}
                        handleAttention={this.props.handleAttention}/>
                    <StatBox 
                        header={choices.splice(choices.indexOf(choices[random(choices)]), 1)} 
                        books={books} 
                        timeStamp={this.props.timeStamp}
                        handleAttention={this.props.handleAttention}/>
                    <StatBox 
                        header={choices.splice(choices.indexOf(choices[random(choices)]), 1)} 
                        books={books} 
                        timeStamp={this.props.timeStamp}
                        handleAttention={this.props.handleAttention}/>
                    <StatBox 
                        header={choices.splice(choices.indexOf(choices[random(choices)]), 1)} 
                        books={books} 
                        timeStamp={this.props.timeStamp}
                        handleAttention={this.props.handleAttention}/>
                    <StatBox 
                        header={choices.splice(choices.indexOf(choices[random(choices)]), 1)} 
                        books={books} 
                        timeStamp={this.props.timeStamp}
                        handleAttention={this.props.handleAttention}/>
                    <StatBox 
                        header={choices.splice(choices.indexOf(choices[random(choices)]), 1)} 
                        books={books} 
                        timeStamp={this.props.timeStamp}
                        handleAttention={this.props.handleAttention}/>
                </div>
            )
        }

        let splitCriteria = /[.,\-\s]\s/.test(wordTextPiece) ? /[.,\-\s]\s/ : ' '

        let profileStats = (
            <div id='profile-parent'>
                {properties && properties.length !== 0 ? attention : noStress}
                <ul id='basic-stats'>
                    <li>You have read <span style={booksReadC}>{booksRead}</span> out of <span className='hl-blue'>{totalBooks}</span> book{totalBooks === 1 ? '' : 's'}</li>
                    <li>That's <span style={pagesReadC}>{pagesRead}</span> out of <span className='hl-blue'>{totalPages}</span> pages</li><br/>
                    {whyTextPiece && whyTextPiece !== 'because' ? <li><span className='hl-blue'>Why</span><br/> <span className='u-dots'>...</span> {whyTextPiece} <span className='u-dots'>...</span></li> : ''}
                    {wordTextPiece && wordTextPiece !== 'words' ? <li><span className='hl-blue'>Word</span><br/> <span className='u-dots'>...</span> {wordTextPiece.split(splitCriteria).map((w,i) => <span key={i} className='profile-words' onClick={() => this.props.defineApi(w).then(def => alert(def))}>{w} </span>)} <span className='u-dots'>...</span></li> : ''}
                    {quoteTextPiece && quoteTextPiece !== 'to be or not to be' ? <li><span className='hl-blue'>Quote</span><br/> <span className='u-dots'>...</span> {quoteTextPiece} <span className='u-dots'>...</span></li> : ''}
                    {momentTextPiece && momentTextPiece !== 'that one time when' ? <li><span className='hl-blue'>Moment</span><br/> <span className='u-dots'>...</span> {momentTextPiece} <span className='u-dots'>...</span></li> : ''}
                </ul>
                <div id='just-a-border'></div>
                <div id='dot-barrier'><span>.</span><span>.</span><span>.</span><span>.</span><span>.</span><span>.</span><span>.</span><span>.</span><span>.</span><span>.</span></div>
                {statBoxes}
            </div>
        )

        let userInfo = (
            <ul id='user-info'>
                <li>Email: {email}</li>
                <li>Username: {user}</li>
                <li>Account Created: {creationDate}</li>
            </ul>
        )
        return (
            <div id='profile'>
                {user === 'none' ? <Login setUser={this.props.setUser}/> : <div id='userInfo'><h1> Welcome <span id='user-name'>{user}</span><span id='profile-dot'>.</span></h1>{userInfo}</div>}
                {user === 'none' ? '' : profileStats}
                {user === 'none' ? '' : <div className='delete delete-account' onClick={this.deleteAccount}>X</div>}
                {user === 'none' ? '' : <div className='theme' onClick={this.changeTheme} style={{display: 'none'}}>Theme</div>}
            </div>
        )
    }
}

export default Profile;