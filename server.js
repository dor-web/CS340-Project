var express = require('express');
var exphbs = require('express-handlebars')
var bodyParser = require('body-parser');

var app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

PORT = 6557;                 // Set a port number at the top so it's easy to change in the future

app.get('/', function(req, res,next){    // This is the basic syntax for what is called a 'route'
    res.render('home');
});

app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://flip2.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
});