const { Pool } = require("pg");

let connection = new Pool({
    user: "postgres",
    host: "localhost",
    database: "native_dummy",
    password: "Chetan@123", //enter your postgres password here
    port: 5432,
});

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Database connected successfully....");
    }
});

module.exports = connection;
