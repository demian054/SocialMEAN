
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');


//middlewares de bodyParser
app.use(bodyParser.urlencoded({ extended : false}));
app.use(bodyParser.json());


// configurar cabeceras y cors
app.use((req, res, next) =>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Request-With, Content-Type, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});


//rutas bases
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);

// rutas body-parser
app.get('/', (req, res) => {
  res.status(200).send({message: 'Servidor Activo'});
});
module.exports = app;
