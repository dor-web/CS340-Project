module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getShowings(res, mysql, context, complete){
        mysql.pool.query(`
          SELECT title,time, cost, Showings.RoomID as room  FROM Showings
          JOIN Rooms ON Rooms.RoomID = Showings.RoomID
            `, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.showings  = results;
            complete();
        });
    }


    router.get('/', function(req, res){
        var context = {active_showings: true};
        var mysql = req.app.get('mysql');
        getShowings(res, mysql, context, complete);
        function complete(){
                res.render('showings', context);
        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Showings (title, time, roomID, cost) VALUES(?, ?, ?, ?)";
        var inserts = [req.body.title,req.body.time,req.body.room,req.body.amount];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
              res.redirect('/showings');}
        });
    });

    return router;
}();
