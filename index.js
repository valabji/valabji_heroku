const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000;
console.log("Valabji Port is "+PORT)
app.get('/',(req,res)=>{
    res.status(200).send("<h1>Valabji First Heroku App</h1>")
})

app.listen(PORT)