const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cphjetskis',
    password: 'cphjetskis',
    port: 5432,
});

//laver en customer-tabel

const createCustomerTable = () =>{
    const queryText = `CREATE TABLE IF NOT EXISTS
                        Customers(
                            customerId INT PRIMARY KEY,
                            customerName VARCHAR(50),
                            streetName VARCHAR(50),
                            streetNumber INT,
                            postalCode INT,
                            phone INT,
                            email VARCHAR(50),
                            password VARCHAR(50) 
                            )`;

    pool.query(queryText)
        .then((res)=>{
            console.log(res);
            pool.end();
        })
        .catch((err)=>{
            console.log(err);
            pool.end();
        });
};


















