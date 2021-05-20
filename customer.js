module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //Grab info from Orders table and stick it into context
    function getCustomer(res, mysql, context, complete){
        mysql.pool.query(`
          SELECT lastName as name, email, address1 as address FROM Customers
          `, function(error, results, fields){
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
        var context = {active_customer: true};
        var mysql = req.app.get('mysql');
        getCustomer(res, mysql, context, complete);
        function complete(){
                res.render('customer', context);
        }
    });

    return router;
}();
