const path = require('path');
const express = require('express');
const mysql = require('./db-connector.js');
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser');


const app = express();
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

PORT = 6559;                 // Set a port number at the top, so it's easy to change in the future

app.get('/', function (req, res, next) {    // This is the basic syntax for what is called a 'route'
    res.render('home', {active_home: true});
});

app.use('/showings', require('./showings.js'));

app.use('/order', require('./order.js'));
app.use('/orders', require('./order.js'));

app.use('/ordershowings', require('./ordershowings.js'));

app.use('/customer', require('./customer.js'));

//app.use('/rooms', require('./rooms.js'));

app.use('/seats', require('./seats.js'));


app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
});

app.listen(PORT, function () {            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://flip2.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.')
    
});
