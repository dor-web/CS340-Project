module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getSeats(res, mysql, context, complete) {
        mysql.pool.query(`
          SELECT SeatsID as id, row, col, Seats.RoomID as room, Seats.OrderID as so FROM Seats
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
        var context = {active_seat: true};
        var mysql = req.app.get('mysql');
        getSeats(res, mysql, context, complete);

        function complete() {
            res.render('seats', context);
        }
    });
    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Seats (row, col, roomID, OrderID) VALUES(?, ?, ?, ?)";
        var inserts = [req.body.row, req.body.col, req.body.room, req.body.order];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/seats');
            }
        });
    });
    router.delete('/:id', function(req, res){
        console.log("Recieved delete for " + req.params.id)
            var mysql = req.app.get('mysql');
            var sql = "DELETE FROM Showings WHERE ShowingID = ?";
            var inserts = [req.params.id];
            mysql.pool.query(sql, inserts, function(error, results, fields){
                if(error){
                    console.log(error)
                    res.write(JSON.stringify(error));
                    res.status(400);
                    res.end();
                }else{
                    res.status(202).end();
                }
            })
        });
    return router;
}();
