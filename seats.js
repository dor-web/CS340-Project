module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getSeats(res, mysql, context, complete) {
        mysql.pool.query(`
          SELECT row, col, Seats.RoomID as room, Seats.OrderID as so FROM Seats
          JOIN Orders ON Orders.OrderID = Seats.OrderID
          JOIN Rooms ON Rooms.RoomID = Seats.RoomID
          `, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.seats = results;
            complete();
        });
    }

    //Now we can grab the customer's name and stick it into context as well


    router.get('/', function (req, res) {
        var context = {active_seats: true};
        var mysql = req.app.get('mysql');
        getSeats(res, mysql, context, complete);

        function complete() {
            res.render('seats', context);
        }
    });

    return router;
}();
