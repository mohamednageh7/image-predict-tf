let express = require('express')
let app = express()

app.use(function(req,res,next){
    // console.log(`${new Date()} - ${req.method} - ${req.url}`)
    next()
})

app.use(express.static("../static"))

app.listen(3000,function(){
    console.log('server running on port 3000')
})