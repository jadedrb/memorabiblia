import React, { Component } from 'react';
import Login from './Login';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {totalPages: 0}
    }
    componentDidMount() {
        let { books } = this.props.data
        let totalPages = 0;
        books.map(b => {
            if (typeof(Number(b.pages)) === 'number') totalPages += Number(b.pages)
        })
        this.setState({totalPages})
    }
    render() {
        let { user, email } = this.props.data
        let profileStats = (
            <div>
                <ul>
                    <li>Email:</li>
                    <li>Username: </li>
                    <li>Account Created On: </li>
                </ul>
                <ul>
                    <li>Top 5 books:</li>
                    <li>Took the longest to read: </li>
                    <li>Was the quickest to read: </li>
                    <li>Longest page count: </li>
                    <li>Shortest page count: </li>
                    <li>Pages read: {this.state.totalPages}</li>
                </ul>
            </div>
        )
        return (
            <div>
                {user === 'none' ? <Login setUser={this.props.setUser}/> : <h1>Welcome {user}!</h1>}
                {user === 'none' ? '' : profileStats}
            </div>
        )
    }
}

export default Profile;