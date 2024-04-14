import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export const comparePawsswords = (password,hash)=>{
    return bcrypt.compare(password,hash)
}

export const hashPassword = (password)=>{
    return bcrypt.hash(password,5)
}



export const createJWT = ({id,username})=>{
    const token = jwt.sign({id,username}, process.env.JWT_SECRET)
    return token
}

export const protect = (req,res,next)=>{
    const bearer = req.headers.authorization

    if(!bearer){
        res.status(401)
        res.json({Message:'Headers Auth missing'})
        return
    }

    const [,token] = bearer.split(' ')

    if(!token){
        res.status(401)
        res.json({Message:'Token missing'})
        return
    }

    try {
        const user = jwt.verify(token,process.env.JWT_SECRET)
        console.log(user,'user')
        req.user = user
        next()
    } catch (error) {
        res.status(401)
        res.json({Message:'invalid token'})
        console.log(error)
        return
    }  
}