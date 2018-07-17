const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')

const db = require('./server/database/db.js')
const movieRoutes = require('./server/routes.js')
const app = express()

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/client/dist'));

app.use('/mixflix', movieRoutes)

app.listen(3000, () => {console.log('Listening to port 3000')})