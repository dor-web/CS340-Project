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
    //getCustomers to choose from.
    function getCustomers(res, mysql, context, complete) {
        mysql.pool.query('SELECT lastName, CustomerID FROM Customers', function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
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
        getCustomers(res, mysql, context, complete);

        function complete() {
            checks++
            if (checks>=4){
                for (const ordersKey in context.orders) {
                    //----Combining the results from each query into one context.
                    //console.log(context.orders[ordersKey].id);
                    //console.log(context.seats.find(x=>x.id === context.orders[ordersKey].id).seats);
                    var orderSeat = context.seats.find(x => x.id === context.orders[ordersKey].id);
                    context.orders[ordersKey].seats = (orderSeat) ? orderSeat.seats : 'Canceled';
                    //console.log(context.orders);
                }


                res.render('order', context);
            }

        }
    });

    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders (CustomerID, seatsQuant, orderDate) VALUES((SELECT CustomerID FROM Customers WHERE lastName = ?), ?, ?)";
        var inserts = [req.body.orderParty, 1, '2021-05-12 20:27:21'];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            const orderInsertID = results.insertId;
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();

            } else {

                var sql = "INSERT INTO OrderShowings (OrderID, ShowingID) VALUES(?,(SELECT ShowingID FROM Showings WHERE title=?))";
                var inserts = [orderInsertID, req.body.orderShowing];
                sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                    if (error) {
                        console.log(JSON.stringify(error))
                        res.write(JSON.stringify(error));
                        res.end();
                    } else {

                        var sql = "INSERT INTO Seats (row, col, RoomID, OrderID) VALUES(?, ?, (SELECT RoomID FROM Showings WHERE title=?), ?)";
                        var inserts = [req.body.orderRow, req.body.orderCol, req.body.orderShowing, orderInsertID];
                        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
                            if (error) {
                                console.log(JSON.stringify(error))
                                res.write(JSON.stringify(error));
                                res.end();
                            } else {
                                res.redirect('/order');

                            }
                        });


                    }
                });

            }
        });
    });

    router.delete('/:id', function(req, res){
        console.log("Recieved Delete for " + req.params.id);
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Orders WHERE OrderID = ?";
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
        console.log(req.body.orderShowing + '\n' + req.body.orderRow + '\n' + req.body.orderCol + '\n');
        var mysql = req.app.get('mysql');
        //First update the Showing
        var sql = "UPDATE OrderShowings SET OrderShowings.ShowingID = (SELECT ShowingID FROM Showings WHERE Showings.title = ?) WHERE OrderID = ?;";
        var inserts = [req.body.orderShowing, req.params.id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                //Now the seats
                var sql = "UPDATE Seats SET row=?, col=? WHERE Seats.OrderID = ?;";
                var inserts = [req.body.orderRow.toUpperCase(), req.body.orderCol, req.params.id];
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
                //-------------
            }
        })
    })

    return router;
}();
