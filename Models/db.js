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
    const queryText =   `CREATE TABLE IF NOT EXISTS
                           userType(
                           userTypeId SERIAL PRIMARY KEY,
                           type VARCHAR(50));
                           
    
                        CREATE TABLE IF NOT EXISTS
                        users(
                            userId SERIAL PRIMARY KEY,
                            userTypeId INT REFERENCES userType(userTypeId),
                            userName VARCHAR(50),
                            streetName VARCHAR(50),
                            streetNumber INT,
                            postalCode INT,
                            city VARCHAR(50),
                            phone INT,
                            email VARCHAR(50),
                            password VARCHAR(50),
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            );
                            
                            CREATE TABLE IF NOT EXISTS
                            products(
                            productId SERIAL PRIMARY KEY,
                            price FLOAT,
                            modelName VARCHAR(50)
                            );
                            
                            CREATE TABLE IF NOT EXISTS
                            orders(
                            orderId SERIAL PRIMARY KEY,
                            userId INT REFERENCES users(userId),
                            orderDay INT,
                            orderMonth INT,
                            orderYear INT,
                            timePeriod VARCHAR(50),
                            orderPrice INT,
                            order_placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            );
                            
                            CREATE TABLE IF NOT EXISTS 
                           orderProduct(
                            orderProductId SERIAL PRIMARY KEY,
                            productId INT REFERENCES products(productId),
                            orderId INT REFERENCES Orders(orderId));`;


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











