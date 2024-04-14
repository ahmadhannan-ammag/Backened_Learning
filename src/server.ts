import router from "./router"
import morgan from 'morgan'
import cors from 'cors'
import { protect } from "./modules/auth"
import { createNewUser, signin } from "./handlers/user"


const express = require('express')

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/',(req,res)=>{
    res.json({Message:'Hello get Request'})
    // throw new Error('Oops, Something went wrong')
    
})


app.use((req,res,next)=>{
    req.shhhh_sercret = 'doggy'
    next()
})


app.use('/api',protect,router)
app.post('/user',createNewUser)
app.post('/signin',signin)

// error  handler, should be define at the end of the middlewares and routes
// because it will catch all the errors that are thrown in the application

app.use((err,req,res,next)=>{
    console.error(err)
    if(err.type =='auth'){
        res.status(401).json({error:"Unauthorized",message:err.message})
        return
    }else if(err.type == 'input'){
        res.status(400).json({error:"invalid input",errors:err.errors})
        return
    }else{
        res.status(500).json({error:' Oops, Something went wrong'})
    }
})

export default app