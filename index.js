const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const API = require('./config/config')
const axios = require('axios')

const app = express()

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/client/dist'));

app.get('/', (req, res) => {
  res.send('reaching port 3000')
})


app.post('/search', (req, res) => {
  console.log('Console logging req.body.search: ', req.body.search);
  console.log(API.api_key);
  axios.get(`https://api.themoviedb.org/3/search/movie/?query=${req.body.search}&sort_by=vote_average.asc&api_key=${API.api_key}`)
  .then((result) => {
    res.send(result.data);
  })
})

app.post('/createPlaylist', (req, res) => {
  console.log('Console logging req.body /createPlaylist: ', req.body)
  // let sqlString = "INSERT INTO <tableName> VALUES (?, ?, ? etc)"
  // let params = [different parts of req.body, e.g. req.body.title, req.body.result]
  // db.query(sqlString, params, (err, data) => {

  // })
})

app.listen(3000, () => {console.log('Listening to port 3000')})