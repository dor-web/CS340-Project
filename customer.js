module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getCustomers(res, mysql, context, complete){
        mysql.pool.query('SELECT lastName as name, email, address1 as address FROM Customers', function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.customers  = results;
            complete();
        });
    }
    //Now we can grab the customer's name and stick it into context as well

    router.get('/', function(req, res){
        var context = {active_orders: true};
        var mysql = req.app.get('mysql');
        getCustomers(res, mysql, context, complete);
        function complete(){
                res.render('customer', context);
        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Orders (CustomerID, seatsQuant, orderDate) VALUES(?, ?, ?)";
        var inserts = [1, 1, '2021-05-12 20:27:21'];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{

              var sql = "INSERT INTO OrderShowings (OrderID, ShowingID) VALUES(?,(SELECT ShowingID FROM Showings WHERE title=?))";
              var inserts = [results.insertId, req.body.orderShowing];
              sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                  if(error){
                      console.log(JSON.stringify(error))
                      res.write(JSON.stringify(error));
                      res.end();
                  }else{



                  }
              });

            }
        });
    });

    return router;
}();
