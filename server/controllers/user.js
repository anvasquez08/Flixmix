const db = require('../database/db.js');
const userController = require('../models/users.js');

module.exports = {
  checkUserCredentials: (req, res) => {
    let {username, password} = req.body;
    console.log('checking if user is in the DB', username, password)
    db.connection.query('SELECT users_id, username, password FROM users WHERE username = ? AND password = ?', [username, password] ,(err, data) => {
      if (err) {
        console.log(err)
      } else {
        res.send(data)
      }
    }) 
  },
  signup: (req, res) => {
    let {username, password} = req.body; 
    console.log('signing up user to DB', username, password) 
    db.connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, data) => {
      if (err) {
        console.log(err)
      } else {
        res.send(data)
      }
    })
  }
}
