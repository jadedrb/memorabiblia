import React, { Component } from 'react';
import Login from './Login';
import StatBox from './StatBox';
import axios from 'axios';
import GeneralModal from './GeneralModal';

import auth from '../auth'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.initialState = {
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
            theme: 'light',
            statBoxMore: false,
            rememberOrKnow: 'Remember',
            userBookShowcase: {},
            previewValue: false,
            settingsModal: false,
            modalState: false
        }

        this.state = this.initialState

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
        let tempHighStore = {}
        let indexReadStore = []
        let inNeedOfAttention = [0, 0];

        let noStressMsgs = ['All entries filled', 'Nothing to worry about', 'Dutiful. Well done', 'Your memory is strong', 'Maybe add more books']
        noStressMsgs = noStressMsgs[Math.floor(Math.random() * noStressMsgs.length)]

        books.forEach((b, i) => {
            if (typeof(Number(b.pages)) === 'number') totalPages += Number(b.pages)
            if (b.finished !== null && typeof(Number(b.pages)) === 'number') pagesRead += Number(b.pages)
            if (b.finished !== null) booksRead++
            bookPropStore[i] = Object.keys(b).filter(p => (p !== 'id' && p !== '_id' && p !== 'started' && p !== 'finished' && b[p] === '') || b[p] === 'because' || b[p] === 'words' || b[p] === 'to be or not to be' || b[p] === 'that one time when' || b[p] === defaultImg)
            let fieldToFill = bookPropStore[i].length
            tempHighStore[fieldToFill] = tempHighStore[fieldToFill] ? tempHighStore[fieldToFill] = [...tempHighStore[fieldToFill], i] : tempHighStore[fieldToFill] = [i]
            if (b.started && fieldToFill) indexReadStore.push(i)
            if (fieldToFill > inNeedOfAttention[1]) inNeedOfAttention = [i, fieldToFill] 
        })

        const random = arr => Math.floor(Math.random() * arr.length)

        let rememberOrKnow = indexReadStore.length

        // Prioritize books that are being or have been read
        if (rememberOrKnow) {
            let inx = indexReadStore[random(indexReadStore)]
            inNeedOfAttention = [inx, bookPropStore[inx].length]
        // Otherwise select an unread book with the most fields to fill, randomize if more than one 
        } else if (Object.keys(tempHighStore).length && tempHighStore[inNeedOfAttention[1]].length > 1) {
            let arrAttentionBooks = tempHighStore[inNeedOfAttention[1]]
            let test = [arrAttentionBooks[random(arrAttentionBooks)], inNeedOfAttention[1]]
            inNeedOfAttention = test
        }

        let [ index ] = inNeedOfAttention
        let missingProps = bookPropStore[index]
        let bookInNeed = books[index]
        inNeedOfAttention = [missingProps, bookInNeed]

        let boxes = ['A book from a favored author', 'A book from a favored genre', 'Took the longest to read', 'Was the quickest read', 'Longest page count', 'Shortest page count', 'Currently reading', 'Recently finished', 'A favorite book', 'A least favorite book', 'Oldest book', 'Newest book', 'Strongest memory', 'Weakest memory', 'Longest title', 'Shortest title', 'Momentous', 'Quotable', 'Motive', 'Vocabulary', 'Most efficient read', 'Least efficient read', 'Longest break after reading', 'A book from a prolific month']
        // let boxes = ['Longest break after reading', 'Longest break after reading', 'Longest break after reading', 'Longest break after reading', 'Longest break after reading', 'Longest break after reading']

        let choices = []

        while (choices.length < 6) {
            let pick = boxes.splice(random(boxes), 1)
            choices.push(...pick)
        }

        let userTextProps = ['why', 'words', 'quotes', 'moments']
        let userTextPieces = []
        let userBookShowcase = {}

        while (books.length > 0 && userTextProps.length > 0) {
            let property = userTextProps.shift()
            let randomChoice = random(books)
            userBookShowcase[property] = books[randomChoice]
            let stringValue = books[randomChoice][property]
            let slicePoint = random(stringValue)
            let textPiece = stringValue.slice(slicePoint).length > 140 ? stringValue.slice(slicePoint, slicePoint + 140) : stringValue.slice(0,140)
            userTextPieces.push(textPiece)
        }

        let [ whyTextPiece, wordTextPiece, quoteTextPiece, momentTextPiece ] = userTextPieces

        this.setState({totalPages, pagesRead, booksRead, totalBooks, inNeedOfAttention, choices, whyTextPiece, wordTextPiece, quoteTextPiece, momentTextPiece, noStressMsgs, rememberOrKnow, userBookShowcase})
    }

    async deleteAccount() {

        try {
            
            let verifiedUser = await axios.get('/api/users/verify')
            let deleting = window.confirm('Are you sure you want to delete your account? This will remove all saved entries and user information permanently.')
            
            if (deleting) {

                let confirm = prompt(`Please confirm your action by typing: "Yes I, ${this.props.data.user}, would like to delete my account"`)
                
                if (confirm === `Yes I, ${this.props.data.user}, would like to delete my account`) {
                    
                    let books = this.props.data.books
                    books.map(b => axios.delete(`/api/memories/remove/${b._id}`))

                    await axios.delete(`api/users/remove/${verifiedUser.data.user}`)
                    alert('Account deleted successfully.')
                    this.handleToggleSettings()
                    this.props.setUser()
                }
            }

        } catch (err) { console.log(err) }
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

    statBoxMoreToggle = (event, stats) => {
        if (!this.state.statBoxMore) this.setState({ statBoxMore: stats })
        else this.setState({ statBoxMore: false, previewValue: false })
    }

    miniStatClick = (title) => {
        let wh = window.innerHeight
        let ww = window.innerWidth

        if (ww <= 800 && wh <= 800) {
            if (this.state.previewValue === title) 
                this.props.handleAttention(title)

            this.setState({ previewValue: title })
        } 
        else 
            this.props.handleAttention(title)
    }

    handleMouseOvers = (title) => {
        let wh = window.innerHeight
        let ww = window.innerWidth

        if (ww > 800 || wh > 800) 
            typeof title === 'string' ? this.setState({ previewValue: title }) : this.setState({ previewValue: false })
        else 
            return
    }

    handleToggleSettings = (e) => {
        // let cn = e.target.className
        // console.log(cn)
        // if (this.state.settingsModal && cn === 'm-settings') return
        this.setState({ settingsModal: !this.state.settingsModal, modalState: false })
    }

    handleToggleModalState = () => this.setState({ modalState: !this.state.modalState })

    clipboard = e => {
        let textarea = e.target.previousSibling
        textarea.focus()
        textarea.select()
        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.getSelection().removeAllRanges()
    }

    render() {
        let { user, books, email, creationDate } = this.props.data
        let { pagesRead, totalPages, booksRead, totalBooks, whyTextPiece, wordTextPiece, quoteTextPiece, momentTextPiece, noStressMsgs } = this.state
        let [ properties, bookNeed ] = this.state.inNeedOfAttention
        let { statMore, header, values } = this.state.statBoxMore 
        let { rememberOrKnow, userBookShowcase, previewValue } = this.state

        let attention = (
            <div id='attention'>
                <div id='attention-title'><span><i>{bookNeed && bookNeed.title ? bookNeed.title : 'Untitled'}</i> needs your attention.</span><br/> {rememberOrKnow ? 'Remember' : 'Know'} anything else about this book?</div>
                <img className='profile-book' src={bookNeed && bookNeed.url} onClick={() => this.props.handleAttention(bookNeed.title)} alt={''}></img>
                <ul>
                    <li id='missing' style={{ color: rememberOrKnow ? 'red' : 'maroon' }}>Missing...</li>
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
            let statBoxArr = [1,2,3,4,5,6];
            statBoxes = (
                <div id='profile-stats'>
                    {statBoxArr.map(id => 
                        <StatBox 
                            key={id}
                            header={choices.splice(choices.indexOf(choices[random(choices)]), 1)} 
                            books={books} 
                            timeStamp={this.props.timeStamp}
                            handleAttention={this.props.handleAttention}
                            statBoxMore={this.state.statBoxMore}
                            statBoxMoreToggle={this.statBoxMoreToggle}
                        />
                    )}
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
                    {whyTextPiece && whyTextPiece !== 'because' ? <li><span className='hl-blue' onClick={() => this.props.handleAttention(userBookShowcase.why.title)}>Why</span><br/> <span className='u-dots'>...</span> {whyTextPiece} <span className='u-dots'>...</span></li> : ''}
                    {wordTextPiece && wordTextPiece !== 'words' ? <li><span className='hl-blue' onClick={() => this.props.handleAttention(userBookShowcase.words.title)}>Word</span><br/> <span className='u-dots'>...</span> {wordTextPiece.split(splitCriteria).map((w,i) => <span key={i} className='profile-words' onClick={() => this.props.defineApi(w).then(def => alert(def))}>{w} </span>)} <span className='u-dots'>...</span></li> : ''}
                    {quoteTextPiece && quoteTextPiece !== 'to be or not to be' ? <li><span className='hl-blue' onClick={() => this.props.handleAttention(userBookShowcase.quotes.title)}>Quote</span><br/> <span className='u-dots'>...</span> {quoteTextPiece} <span className='u-dots'>...</span></li> : ''}
                    {momentTextPiece && momentTextPiece !== 'that one time when' ? <li><span className='hl-blue' onClick={() => this.props.handleAttention(userBookShowcase.moments.title)}>Moment</span><br/> <span className='u-dots'>...</span> {momentTextPiece} <span className='u-dots'>...</span></li> : ''}
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

        let gear =  (
            <svg className="delete delete-account" id="gear" onClick={this.handleToggleSettings} opacity=".1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M24 14.187v-4.374c-2.148-.766-2.726-.802-3.027-1.529-.303-.729.083-1.169 1.059-3.223l-3.093-3.093c-2.026.963-2.488 1.364-3.224 1.059-.727-.302-.768-.889-1.527-3.027h-4.375c-.764 2.144-.8 2.725-1.529 3.027-.752.313-1.203-.1-3.223-1.059l-3.093 3.093c.977 2.055 1.362 2.493 1.059 3.224-.302.727-.881.764-3.027 1.528v4.375c2.139.76 2.725.8 3.027 1.528.304.734-.081 1.167-1.059 3.223l3.093 3.093c1.999-.95 2.47-1.373 3.223-1.059.728.302.764.88 1.529 3.027h4.374c.758-2.131.799-2.723 1.537-3.031.745-.308 1.186.099 3.215 1.062l3.093-3.093c-.975-2.05-1.362-2.492-1.059-3.223.3-.726.88-.763 3.027-1.528zm-4.875.764c-.577 1.394-.068 2.458.488 3.578l-1.084 1.084c-1.093-.543-2.161-1.076-3.573-.49-1.396.581-1.79 1.693-2.188 2.877h-1.534c-.398-1.185-.791-2.297-2.183-2.875-1.419-.588-2.507-.045-3.579.488l-1.083-1.084c.557-1.118 1.066-2.18.487-3.58-.579-1.391-1.691-1.784-2.876-2.182v-1.533c1.185-.398 2.297-.791 2.875-2.184.578-1.394.068-2.459-.488-3.579l1.084-1.084c1.082.538 2.162 1.077 3.58.488 1.392-.577 1.785-1.69 2.183-2.875h1.534c.398 1.185.792 2.297 2.184 2.875 1.419.588 2.506.045 3.579-.488l1.084 1.084c-.556 1.121-1.065 2.187-.488 3.58.577 1.391 1.689 1.784 2.875 2.183v1.534c-1.188.398-2.302.791-2.877 2.183zm-7.125-5.951c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.238-5 5s2.238 5 5 5 5-2.238 5-5-2.238-5-5-5z"/>
            </svg>
        )
        
        return (
            <div id='profile'>

                {this.state.statBoxMore && 
                    <GeneralModal toggle={this.statBoxMoreToggle}>
                            <div className='m-stat'>
                                <h6>{header}</h6>
                                <ul>
                                    {statMore.slice(0,5).map((b,i) => 
                                        <li key={b.id}>
                                            <span>{i+1}</span>
                                            {previewValue === b.title && <span className='p-value'>{values[b.title]}</span>}
                                            <img 
                                                alt={b.title} 
                                                className='profile-book' 
                                                src={b.url} 
                                                onClick={() => this.miniStatClick(b.title)} 
                                                onMouseOver={() => this.handleMouseOvers(b.title)} 
                                                onMouseLeave={this.handleMouseOvers}
                                            />
                                        </li>
                                    )}
                                </ul>
                            </div>
                    </GeneralModal>
                }

                {this.state.settingsModal &&
                    <GeneralModal toggle={this.handleToggleSettings}>
                            <div className="m-settings">
                                {!this.state.modalState ?
                                    <>
                                        <h6>General Settings</h6>
                                        <div className="delete delete-account" id="e-prof" onClick={this.handleToggleSettings}>X</div>
                                        <div>Show year and total books finished in timespan (My Reads)</div>
                                        <div>
                                            <span>Copy all of my current notes and back them up somewhere</span>
                                            <button onClick={this.handleToggleModalState}>COPY</button>
                                        </div>
                                        <div>
                                            <span>Delete my account and all data associated with it</span>
                                            <button onClick={this.deleteAccount}>DELETE</button>
                                        </div>
                                    </>
                                : 
                                    <>
                                        <textarea value={JSON.stringify(this.props.books)} className='notes-copy' readOnly style={{ resize: 'none' }}></textarea>
                                        <svg className="svg-clipboard" viewBox="0 0 20 20" onClick={this.clipboard}>
							                <path d="M17.391,2.406H7.266c-0.232,0-0.422,0.19-0.422,0.422v3.797H3.047c-0.232,0-0.422,0.19-0.422,0.422v10.125c0,0.232,0.19,0.422,0.422,0.422h10.125c0.231,0,0.422-0.189,0.422-0.422v-3.797h3.797c0.232,0,0.422-0.19,0.422-0.422V2.828C17.812,2.596,17.623,2.406,17.391,2.406 M12.749,16.75h-9.28V7.469h3.375v5.484c0,0.231,0.19,0.422,0.422,0.422h5.483V16.75zM16.969,12.531H7.688V3.25h9.281V12.531z"></path>
						                </svg>
                                    </>
                                }
                            </div>
                    </GeneralModal>
                }


                {!auth.isAuthenticated() ? <Login setUser={this.props.setUser}/> : <div id='userInfo'><h1> Welcome <span id='user-name'>{user}</span><span id='profile-dot'>.</span></h1>{userInfo}</div>}
                {!auth.isAuthenticated() ? '' : profileStats}
                {/* {!auth.isAuthenticated() ? '' : <div className='delete delete-account' onClick={this.deleteAccount}>X</div>} */}
                {!auth.isAuthenticated() ? '' : gear}
                {!auth.isAuthenticated() ? '' : <div className='theme' onClick={this.changeTheme} style={{display: 'none'}}>Theme</div>}
            </div>
        )
    }
}

export default Profile;