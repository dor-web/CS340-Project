var path = require('path');
var express = require('express');
var mysql = require('./db-connector.js');
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser');


var app = express();
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'layouts'),
  helpers: require("./public/helpers.js")
}));
app.set('view engine', 'handlebars');
app.set('mysql', mysql);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

PORT = 6559;                 // Set a port number at the top so it's easy to change in the future

app.get('/', function(req, res,next){    // This is the basic syntax for what is called a 'route'
    res.render('home', {active_home: true});
});


// app.get('/showings', function(req, res,next){    // This is the basic syntax for what is called a 'route'
//     res.render('showings', {active_showings: true});
// });
app.use('/showings', require('./showings.js'));

app.use('/order', require('./order.js'));

app.get('/ordershowings', function(req, res,next){    // This is the basic syntax for what is called a 'route'
  res.render('ordershowings', {active_os: true});
});

// app.get('/customer', function(req, res,next){    // This is the basic syntax for what is called a 'route'
//   res.render('customer', {active_customer: true});
// });

app.use('/customer', require('./customer.js'));

app.get('/rooms', function(req, res,next){    // This is the basic syntax for what is called a 'route'
  res.render('rooms', {active_rooms: true});
});
app.get('/seats', function(req, res,next){    // This is the basic syntax for what is called a 'route'
  res.render('seats', {active_seats: true});
});



app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
  });

  app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
  });

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://flip2.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});
