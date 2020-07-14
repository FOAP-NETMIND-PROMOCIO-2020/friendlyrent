// Express modules
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))



app.get('/', (req, res) => {

    res.send(`<h1>Estamos conectados!</h1>`);
    
});


app.listen(3000);