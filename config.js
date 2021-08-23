require("dotenv").config();

module.exports = {
    DB: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        application_name: process.env.DB_APPLICATION
    },
    port: process.env.API_PORT
}