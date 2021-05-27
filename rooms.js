module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getRooms(res, mysql, context, complete) {
        mysql.pool.query(`
            SELECT RoomID as room, seatsTotal as st, seatsAvailable as sa FROM Rooms
          `, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rooms = results;
            complete();
        });
    }

    //Now we can grab the customer's name and stick it into context as well


    router.get('/', function (req, res) {
        var context = {active_rooms: true};
        var mysql = req.app.get('mysql');
        getRooms(res, mysql, context, complete);

        function complete() {
            res.render('rooms', context);
        }
    });

    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Rooms (seatsTotal, seatsAvailable) VALUES(?,?)";
        var inserts = [req.body.seats, req.body.seats];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/rooms');
            }
        });
    });

    router.delete('/:id', function(req, res){
    console.log("Recieved delete for " + req.params.id)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Rooms WHERE RoomID = ?";
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
