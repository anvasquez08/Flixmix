const db = require('../database/db.js');

module.exports = {
  checkUserCredentials: (req, res) => {
    db.handleDisconnect();
    let {username, password} = req.body;
    db.connection.query('SELECT users_id, username, password FROM users WHERE username = ? AND password = ?', [username, password] ,(err, data) => {
      if (err) {
        console.log(err)
      } else {
        res.send(data)
      }
    }) 
  },
  signup: (req, res) => {
    db.handleDisconnect();
    let {username, password} = req.body; 
    db.connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, data) => {
      if (err) {
        console.log(err)
      } else {
        res.send(data)
      }
    })
  }, 
  addProfile: (req, res) => {
    //Pending
  }
}
