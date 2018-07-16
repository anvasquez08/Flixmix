const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/client/dist'));

app.get('/', (req, res) => {
  res.send('reaching port 3000')
})

app.listen(3000, () => {console.log('Listening to port 3000')})