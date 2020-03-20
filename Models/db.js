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
                        customers(
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
                            products(
                            productId SERIAL PRIMARY KEY,
                            price INT,
                            modelName VARCHAR(50)
                            );
                            
                            CREATE TABLE IF NOT EXISTS
                            orders(
                            orderId SERIAL PRIMARY KEY,
                            customerId int REFERENCES customers(customerId),
                            orderDay INT,
                            orderMonth INT,
                            orderYear INT,
                            timePeriod VARCHAR(50),
                            orderPrice INT);
                            
                            CREATE TABLE IF NOT EXISTS 
                            orderProduct(
                            orderProductId SERIAL PRIMARY KEY,
                            productId int REFERENCES Products(productId),
                            orderId int REFERENCES Orders(orderId));
                            
                            
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

// Funktion der pusher producter ind i product tabel
 const pushProducts = () =>{

 }

/* TODO: Slet evt tables før arbejde med DB fortsættes:
Dette skyldes vi benytter "Create table if not exist"
Drop tabels og derefter refresh.
 */











