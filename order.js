module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getOrders(res, mysql, context, complete){
        mysql.pool.query(`
          SELECT lastName as name, title, RoomID as room,  OrderStatuses.name as os FROM Orders
          JOIN Customers ON Customers.CustomerID = Orders.CustomerID
          JOIN OrderShowings ON OrderShowings.OrderID = Orders.OrderID
          JOIN Showings ON Showings.ShowingID = OrderShowings.ShowingID
          JOIN OrderStatuses ON OrderStatuses.OrderStatusID = Orders.OrderStatusID
          `, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders  = results;
            complete();
        });
    }
    //Now we can grab the customer's name and stick it into context as well


    router.get('/', function(req, res){
        var context = {active_orders: true};
        var mysql = req.app.get('mysql');
        getOrders(res, mysql, context, complete);
        function complete(){
                res.render('order', context);
        }
    });

    return router;
}();
