const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cphjetskis',
    password: 'cphjetskis',
    port: 5432,
});
module.exports = pool;

//kør disse funktioner for at få noget data i databasen
requirePgcrypto();
createTables();
//createAdmin();

function requirePgcrypto() {
    const queryText = `CREATE EXTENSION IF NOT EXISTS pgcrypto;`;

    pool.query(queryText)
        .then(()=>{
        })
        .catch((err)=>{
            console.log(err);
            pool.end();
        });
}

//Opretter tabeller med udgangspunkt i E/R
function createTables () {
    const queryText =   `CREATE TABLE IF NOT EXISTS
                           userType(
                           userTypeId SERIAL PRIMARY KEY,
                           type VARCHAR(50));
    
                        CREATE TABLE IF NOT EXISTS
                        users(
                            userId SERIAL PRIMARY KEY,
                            userTypeId INT REFERENCES userType(userTypeId) ON DELETE CASCADE,
                            userName VARCHAR(50),
                            streetName VARCHAR(50),
                            streetNumber INT,
                            postalCode INT,
                            city VARCHAR(50),
                            phone INT UNIQUE,
                            email VARCHAR(50) UNIQUE,
                            password VARCHAR(255),
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            );
                            
                            CREATE TABLE IF NOT EXISTS
                            products(
                            productId SERIAL PRIMARY KEY,
                            price FLOAT,
                            modelName VARCHAR(50),
                            modelDescription VARCHAR(250),
                            quantity INT,
                            imageSRC VARCHAR(50)
                            );
                            
                            CREATE TABLE IF NOT EXISTS
                            orders(
                            orderId SERIAL PRIMARY KEY,
                            userId INT REFERENCES users(userId) ON DELETE CASCADE,
                            orderDay INT,
                            orderMonth INT,
                            orderYear INT,
                            timePeriod VARCHAR(50),
                            orderPrice FLOAT,
                            order_placed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                            );
                            
                            CREATE TABLE IF NOT EXISTS 
                           orderProduct(
                            orderProductId SERIAL PRIMARY KEY,
                            productId INT REFERENCES products(productId),
                            orderId INT REFERENCES Orders(orderId) ON DELETE CASCADE);
                            
                            INSERT INTO products(
                            productId,
                            price, 
                            modelName,
                            modelDescription,
                            quantity,
                            imageSRC)
                            VALUES(
                            1, 300, 'Sea Doo Spark', 'Sea Doo Spark er en fornuftig maskine til en stærk pris. <br><br> Pris: 300 kr. for 2 timer.', 3, '../images/sea-doo-spark.jpg') ON CONFLICT (productId) DO NOTHING;
                            
                            INSERT INTO products(
                            productId,
                            price, 
                            modelName,
                            modelDescription,
                            quantity,
                            imageSRC)
                            VALUES(
                            2, 500, 'Yamaha Waverunner VX', 'Pris: 500 kr. for 2 timer', 3, '../images/yamaha-waverunner-vx.jpg') ON CONFLICT (productId) DO NOTHING;
                            
                            INSERT INTO products(
                            productId,
                            price, 
                            modelName,
                            modelDescription,
                            quantity,
                            imageSRC)
                            VALUES(
                            3, 600, 'Kawasaki STF-15F', 'Pris: 600 kr. for 2 timer', 3, '../images/kawasaki-stx-15f.jpg') ON CONFLICT (productId) DO NOTHING;
                            
                            INSERT INTO userType(
                            userTypeId,
                            type)
                            VALUES(
                            1, 'adm') ON CONFLICT (userTypeId) DO NOTHING;
                            
                            INSERT INTO userType(
                            userTypeId,
                            type)
                            VALUES(
                            2, 'cus') ON CONFLICT (userTypeId) DO NOTHING;
                            `;


   pool.query(queryText)
        .then(()=>{
        })
        .catch((err)=>{
            console.log(err);
            pool.end();
        });
}



function createAdmin(){
    var usertypeid = null;
    const type = "adm";
    pool.query(`INSERT INTO usertype(type) VALUES ($1) RETURNING userTypeId;`, [type], function (error, results) {
        if (error){
            throw error;
        } else{
            usertypeid = results.rows[0].usertypeid;
            console.log(usertypeid);
            insertAdmin();
        }
    });

    function insertAdmin(){
        pool.query(`
                    INSERT INTO users(        
                    usertypeid, userName, email, password)
                    VALUES($1, 'admin', 'admin@admin.com', crypt('admin', gen_salt('bf')));`, [usertypeid]);
    }
}











