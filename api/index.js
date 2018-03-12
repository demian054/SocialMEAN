'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3789;

// connect db
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/social_db')
    .then(() =>{
      console.log('Conexion exitosa a mongo db');

      //create application
      app.listen(port, () => {
        console.log("servidor local activo en "+port);
      });
    })
    .catch(err => console.log(err));
