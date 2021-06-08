module.exports = function () {
    const express = require('express');
    const router = express.Router();

    //Grab info from Orders table and stick it into context
    function getCustomers(res, mysql, context, complete) {
        mysql.pool.query('SELECT CustomerID as id, lastName as name, email, address1 as address FROM Customers', function (error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers = results;
            complete();
        });
    }

    //Now we can grab the customer's name and stick it into context as well

    router.get('/', function (req, res) {
        var context = {active_orders: true};
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);

        function complete() {
            res.render('customer', context);
        }
    });

    router.post('/', function (req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Customers (lastName, email, address1) VALUES(?, ?, ?)";
        var inserts = [req.body.customerName, req.body.customerEmail, req.body.customerAddr];
        sql = mysql.pool.query(sql, inserts, function (error, results, fields) {
            if (error) {
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            } else {
                res.redirect('/customer');
            }
        });
    });

    router.delete('/:id', function(req, res){
    console.log("Recieved delete for " + req.params.id)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Customers WHERE CustomerID = ?";
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
        console.log(req.body.customerName + '\n' + req.body.customerEmail + '\n' + req.body.customerAddr + '\n');
        var mysql = req.app.get('mysql');
        //First update the Showing
        var sql = "UPDATE Customers Set lastName=?, email=?, address1=? WHERE CustomerID=?";
        var inserts = [req.body.customerName, req.body.customerEmail, req.body.customerAddr, req.params.id];
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
