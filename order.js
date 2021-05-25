module.exports = function () {
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getOrders(res, mysql, context, complete) {
        mysql.pool.query(`
          SELECT Orders.OrderID as id, lastName as name, title, RoomID as room,  OrderStatuses.name as os FROM Orders
          JOIN Customers ON Customers.CustomerID = Orders.CustomerID
          JOIN OrderShowings ON OrderShowings.OrderID = Orders.OrderID
          JOIN Showings ON Showings.ShowingID = OrderShowings.ShowingID
          JOIN OrderStatuses ON OrderStatuses.OrderStatusID = Orders.OrderStatusID
          `, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.orders = results;
            complete();
        });
    }

    //get showings to populate order menu
    function getShowings(res, mysql, context, complete) {
        mysql.pool.query(`
          SELECT title, time FROM Showings
          `, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.showings = results;
            complete();
        });
    }
    //get seats to populate order
    function getSeats(res, mysql, context, complete) {
        mysql.pool.query(`
          SELECT OrderID as id, GROUP_CONCAT(row, col) as seats FROM Seats
          GROUP BY OrderID;
          `, function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.seats = results;
            complete();
        });
    }


    router.get('/', function (req, res) {
        var checks = 0;
        var context = {active_orders: true};
        var mysql = req.app.get('mysql');
        getOrders(res, mysql, context, complete);
        getShowings(res, mysql, context, complete);
        getSeats(res, mysql, context, complete);

        function complete() {
            checks++
            if (checks>=3){
                for (const ordersKey in context.orders) {
                    //----Combining the results from each query into one context.
                    //console.log(context.orders[ordersKey].id);
                    //console.log(context.seats.find(x=>x.id === context.orders[ordersKey].id).seats);
                    context.orders[ordersKey].seats = context.seats.find(x=>x.id === context.orders[ordersKey].id).seats;
                    //console.log(context.orders);
                }


                res.render('order', context);
            }

        }
    });

    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders (CustomerID, seatsQuant, orderDate) VALUES(?, ?, ?)";
        var inserts = [1, 1, '2021-05-12 20:27:21'];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {

                var sql = "INSERT INTO OrderShowings (OrderID, ShowingID) VALUES(?,(SELECT ShowingID FROM Showings WHERE title=?))";
                var inserts = [results.insertId, req.body.orderShowing];
                sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                    if (error) {
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    } else {


                    }
                });

            }
        });
    });

    return router;
}();
