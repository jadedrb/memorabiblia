// UNUSED MIDDLEWARE (as of now)

const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
    try {
        // 1. Check if user has a token
        const token = req.header('token')

        if (!token)
            throw new Error('No token provided')
        
        // 2. Check that token provided is valid and not expired
        const payload = await jwt.verify(token, process.env.SECRET_STRING)

        if (payload.error) 
            throw new Error(payload.error)
        
        if (req.body.user)
            if (req.body.user !== payload.user)
                throw new Error('Wrong user trying to access.')
                
        // 3. Attach the payload (user id) to the request object
        req.user = payload.user
        req.user_id = payload.id

        // 4. Move on to the requested route
        next()

    } catch (error) {
        res.status(403).json({ error: error.message })
    }
}


module.exports = { requireAuth };