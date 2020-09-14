var mysql = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'sayonara97',
    database : 'mycloset',
    dateStrings: 'date'
  });
  db.connect();
  module.exports=db;