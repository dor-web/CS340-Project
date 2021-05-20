module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getShowings(res, mysql, context, complete){
        mysql.pool.query(`
          SELECT title,time, cost, RoomID as room  FROM Showings
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

    return router;
}();