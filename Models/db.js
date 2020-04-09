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
                            modelName VARCHAR(50),
                            modelDescription VARCHAR(250),
                            maxAmount INT,
                            imageSRC VARCHAR(50)
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
                            orderId INT REFERENCES Orders(orderId));
                            
                            INSERT INTO products(
                            productId,
                            price, 
                            modelName,
                            modelDescription,
                            maxAmount,
                            imageSRC)
                            VALUES(
                            1, 300, 'Sea Doo Spark', 'Sea Doo Spark er en fornuftig maskine til en stærk pris. <br><br> Pris: 300 kr. for 2 timer.', 3, '../images/sea-doo-spark.jpg') ON CONFLICT (productId) DO NOTHING;
                            
                            INSERT INTO products(
                            productId,
                            price, 
                            modelName,
                            modelDescription,
                            maxAmount,
                            imageSRC)
                            VALUES(
                            2, 500, 'Yamaha Waverunner VX', 'Pris: 500 kr. for 2 timer', 3, '../images/yamaha-waverunner-vx.jpg') ON CONFLICT (productId) DO NOTHING;
                            
                            INSERT INTO products(
                            productId,
                            price, 
                            modelName,
                            modelDescription,
                            maxAmount,
                            imageSRC)
                            VALUES(
                            3, 600, 'Kawasaki STF-15F', 'Pris: 600 kr. for 2 timer', 3, '../images/kawasaki-stx-15f.jpg') ON CONFLICT (productId) DO NOTHING;
                            `;


   pool.query(queryText)
        .then(()=>{
        })
        .catch((err)=>{
            console.log(err);
            pool.end();
        });
};

//Kør denne funktion for at oprette lidt data
function createProducts(){
    const queryText = `INSERT INTO products(productId, price, modelName)
                       values(1, 300, 'Sea Doo Spark');
                       INSERT INTO products(productId, price, modelName)
                       values(2, 500, 'Yamaha Waverunner VX');
                       INSERT INTO products(productId, price, modelName)
                       values(3, 600, 'Kawasaki STF-15F');
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
        pool.query(`INSERT INTO users(
                    usertypeid, userName, email, password)
                    VALUES($1, 'admin', 'admin@admin.com', 'admin');`, [usertypeid]);
    }
}



// Funktion der pusher producter ind i product tabel
 const pushProducts = () =>{

 }

/* TODO: Slet evt tables før arbejde med DB fortsættes:
Dette skyldes vi benytter "Create table if not exist"
Drop tabels og derefter refresh.
 */




//kør disse funktioner for at få noget data i databasen

createTables();
//createData();
//createProducts();










