const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cphjetskis',
    password: 'cphjetskis',
    port: 5432,
});
module.exports = pool;

//Opretter tabeller med udgangspunkt i E/R
const createTables = () =>{
    const queryText = `CREATE TABLE IF NOT EXISTS
                        Customers(
                            customerId SERIAL PRIMARY KEY,
                            customerName VARCHAR(50),
                            streetName VARCHAR(50),
                            streetNumber INT,
                            postalCode INT,
                            city VARCHAR(50),
                            phone INT,
                            email VARCHAR(50),
                            password VARCHAR(50) 
                            );
                            
                            CREATE TABLE IF NOT EXISTS
                            Products(
                            productId SERIAL PRIMARY KEY,
                            price INT,
                            modelName VARCHAR(50)
                            );
                            
                            CREATE TABLE IF NOT EXISTS
                            Orders(
                            orderId SERIAL PRIMARY KEY,
                            orderDay VARCHAR(50),
                            orderMonth VARCHAR(50),
                            orderYear INT,
                            timePeriod VARCHAR(50),
                            orderPrice INT);
                            
                            CREATE TABLE IF NOT EXISTS 
                            orderProduct(
                            orderProductId SERIAL PRIMARY KEY);
                            
                            CREATE TABLE IF NOT EXISTS
                            admin(
                            adminId SERIAL PRIMARY KEY,
                            userName VARCHAR(50),
                            password VARCHAR(50));`;

   pool.query(queryText)
        .then(()=>{
        })
        .catch((err)=>{
            console.log(err);
            pool.end();
        });
};
createTables();

//TODO fjernes












