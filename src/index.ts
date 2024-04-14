import app from "./server"
import * as dotenv from 'dotenv'
import config from "./config"


dotenv.config()

app.listen(config.port,()=>{
    console.log('server started at port ',config.port)
})







/**
 * simple method of node js
 */

// const http = require('http')

// const server = http.createServer((req,res)=>{
//     if(req.method=='GET'&&req.url=='/'){
//         console.log('My newly created server')
//     }
//     res.end()
// })

// server.listen(8000,()=>{
//     console.log(
//     'server started at port 8000'
//     )
// })