const mysql = require("mysql");

const config = {
  host: "us-cdbr-iron-east-04.cleardb.net",
  user: "bd0716b7938c2c",
  password: "63e9914e",
  database: "heroku_69ec92a76fd7e58"
};

const connection = mysql.createConnection(config); 

connection.connect(function(err) {
  if (err) {
    console.log("error when connecting to db:", err);
    setTimeout(handleDisconnect, 2000); 
  } 
});

connection.on("error", function(err) {
  console.log("db error", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    handleDisconnect(); 
  } else {
    throw err; 
  }
});


exports.handleDisconnect = handleDisconnect;

exports.connection = connection;