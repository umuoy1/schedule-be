const express = require('express')
const app = express()
const getSchedule = require('./utils/test')

app.get('/', async (req, res) => {
    const {username, password} = req.query
    try{
        const r = await getSchedule(username, password)
        res.json(r)
    }catch (e){
        res.end("Error")
    }
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))