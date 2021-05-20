module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getRooms(res, mysql, context, complete){
        mysql.pool.query(`
            SELECT RoomID as room, seatsTotal as st, seatsAvailable as sa FROM Rooms
          `, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.rooms  = results;
            complete();
        });
    }
    //Now we can grab the customer's name and stick it into context as well


    router.get('/', function(req, res){
        var context = {active_rooms: true};
        var mysql = req.app.get('mysql');
        getRooms(res, mysql, context, complete);
        function complete(){
                res.render('rooms', context);
        }
    });

    return router;
}();
