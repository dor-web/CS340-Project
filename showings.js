module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getShowings(res, mysql, context, complete) {
        mysql.pool.query(`
          SELECT ShowingID as id, title,time, cost, RoomID as room  FROM Showings
            `, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.showings = results;
            complete();
        });
    }


    router.get('/', function (req, res) {
        var context = {active_showings: true};
        var mysql = req.app.get('mysql');
        getShowings(res, mysql, context, complete);

        function complete() {
            res.render('showings', context);
        }
    });

    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Showings (title, time, roomID, cost) VALUES(?, ?, ?, ?)";
        var inserts = [req.body.title, req.body.time, req.body.room, req.body.amount];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/showings');
            }
        });
    });
    router.delete('/:id', function(req, res){
    console.log("Recieved delete for " + req.params.id)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Showings WHERE ShowingID = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
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

    router.put('/:id', function(req, res){
        console.log('Recieved update for ' + req.params.id);
        console.log(req.body.title + '\n' + req.body.time + '\n' + req.body.room + '\n'+ req.body.amount );
        var mysql = req.app.get('mysql');
        //First update the Showing
        var sql = "UPDATE Showings SET title=?, time=?, roomID=?, cost=? WHERE ShowingID=?";
        var inserts = [req.body.title, req.body.time, req.body.room, req.body.amount, req.params.id];
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
    })
    return router;
}();
