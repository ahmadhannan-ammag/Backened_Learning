import OperatorRouter from "./routers/operatorRouter"
import morgan from 'morgan'
import cors from 'cors'
import { adminProtect, operatorProtect } from "./modules/auth"
import { adminSignin, createOperator, deleteOperator, getAllOperators, signin } from "./handlers/user"
import { addTranslation, getOnePublicNews, getPublicNews } from "./handlers/news"
import rateLimit from "express-rate-limit"


const express = require('express')

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
//     handler: function (req, res) {
//         res.status(429).json({ error: 'Too many requests, please try again later.' });
//     },
// });




const limiter = rateLimit({
    windowMs: 5 * 1000, // 5 seconds
    max: 1, // limit each IP to 1 request per windowMs
    handler: function (req, res) {
        res.status(429).json({ error: 'Too many requests, please try again later.' });
    },
});



app.use("/api/", limiter);



app.get('/', (req, res) => {
    res.json({ Message: 'Hello get Request' })
 

})


app.use((req, res, next) => {
    req.shhhh_sercret = 'doggy'
    next()
})
// public
app.get('/api/paris-news/:language', getPublicNews)
app.get('/api/paris-news/:language/:id', getOnePublicNews)

app.post('/api/operator/signin', signin)
app.use('/api/operator', operatorProtect, OperatorRouter)



app.post('/api/admin/signin', adminSignin)
app.get('/api/admin/operator', adminProtect, getAllOperators)
app.post('/api/admin/create-operator', adminProtect, createOperator)
app.delete('/api/admin/operator/:id', adminProtect, deleteOperator)









// error  handler, should be define at the end of the middlewares and routes
// because it will catch all the errors that are thrown in the application

app.use((err, req, res, next) => {
    console.error(err)
    if (err.type == 'auth') {
        res.status(401).json({ error: "Unauthorized", message: err.message })
        return
    } else if (err.type == 'input') {
        res.status(400).json({ error: "invalid input", errors: err.errors })
        return
    } else {
        res.status(500).json({ error: ' Oops, Something went wrong' })
    }
})

export default app