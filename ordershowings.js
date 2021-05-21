module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getOrderShowings(res, mysql, context, complete){
        mysql.pool.query(`
          SELECT OrderShowings.ShowingID as showing, OrderShowings.OrderID as os FROM OrderShowings
          JOIN Showings ON Showings.ShowingID = OrderShowings.ShowingID
          JOIN Orders ON Orders.OrderID = OrderShowings.OrderID
         `, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.os  = results;
            complete();
        });
    }
    //Now we can grab the customer's name and stick it into context as well


    router.get('/', function(req, res){
        var context = {active_os: true};
        var mysql = req.app.get('mysql');
        getOrderShowings(res, mysql, context, complete);
        function complete(){
                res.render('ordershowings', context);
        }
    });

    return router;
}();
