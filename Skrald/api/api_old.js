
function orderProduct (req, res){
    if (req.session.loggedin === true){
        pool.query(`select count(op.productid), p.modelname, op.productid, p.price
                    from orderproduct as op 
                    JOIN products as p
                    on op.productid = p.productid
                    JOIN orders as o
                    on o.orderid = op.orderid
                    JOIN users as u 
                    on u.userid = o.userid
                    where o.orderid = $1 AND u.userid = $2
                    group by p.modelname, op.productid, p.price
                    order by op.productid;`, [req.params.orderid, req.session.userid]).then(result =>{
            console.log(result.rows);
            res.send(result.rows);
        });
    } else if (req.session.adminloggedin === true){
        pool.query(`select count(op.productid), p.modelname, op.productid, p.price
                    from orderproduct as op JOIN products as p
                    on op.productid = p.productid 
                    where orderid = $1
                    group by p.modelname, op.productid, p.price
                    order by op.productid;`, [req.params.orderid]).then(result =>{
            res.send(result.rows);
        });
    }
}
