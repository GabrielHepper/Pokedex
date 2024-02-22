const express = require('express')
const server = express()
const dadosTimes = require("./data/times.json");
const fs = require('fs')
const cors = require('cors')

const timesRouter = require('./controllerTimes')

server.use(express.json())
server.use(cors())

server.use('/ApiTimes', timesRouter.server)

server.listen(3000, () =>{
    console.log(`O servidor está funcionando!`);
})