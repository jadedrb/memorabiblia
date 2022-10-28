import jwt_decode from "jwt-decode"

export const verifyToken = () => {
    let token = localStorage.getItem("token")
console.log(typeof token)
    if (!token) {
        console.log('No token')
        return false
    }

    // decode token to get payload (user info and exp date)
    let decodedToken = jwt_decode(token)

    let currentDate = new Date()

    // check if token exp date has passed
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log('Token expired.')
        localStorage.removeItem("token")
        return false
    }

    // return username to indicate valid token
    console.log('Token valid!')
    return { user: decodedToken.user, id: decodedToken.id }
}