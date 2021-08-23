const config = require("./config");
const express = require("express");
const app = express()
app.use(express.json());

const Joi = require("joi"); // Он пользуются для проверки валидации даты

const { Pool } = require("pg"); // Pool для Postgresql
const pool = new Pool(config.DB);
pool.query(`CREATE TABLE IF NOT EXISTS coordinates (id SERIAL PRIMARY KEY, user_id NUMERIC NOT NULL, coordinate JSON, 
    created_time TIMESTAMP DEFAULT NOW())`)

// 1-задача: имплементировать Endpoint, на который будет передаваться ID пользователя и его текущая GPS координата, 
//и сохранить эти данные в базе данных PostgreSQL.

app.post("/save_gps", async (req, res) => {
    const {error, value} = Joi.object({
        id: Joi.number().integer().positive(),
        latitude: Joi.number().precision().min(-90).max(90),
        longitude: Joi.number().precision().min(-180).max(180)
    }).validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    pool.query("INSERT INTO coordinates (user_id, coordinate) VALUES ($1, $2)", 
        [value.id, {latitude: value.latitude, longitude: value.longitude}],
        (err, resp) => {
            if (err) {
                console.log("Error in /save_gps route, first query to databas. Error message: ", err.message);
                return res.status(500).send("Internal server error");
            }
            return res.send("Success");
        }
    )
})

app.post("/save_gps", async (req, res) => {
    const {error, value} = Joi.object({
        id: Joi.number().integer().positive(),
        latitude: Joi.number().precision().min(-90).max(90),
        longitude: Joi.number().precision().min(-180).max(180)
    }).validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    pool.query("INSERT INTO coordinates (user_id, coordinate) VALUES ($1, $2)", 
        [value.id, {latitude: value.latitude, longitude: value.longitude}],
        (err, resp) => {
            if (err) {
                console.log("Error in /save_gps route, first query to databas. Error message: ", err.message);
                return res.status(500).send("Internal server error");
            }
            return res.send("Success");
        }
    )
})


// 2-задача: Написать другой Endpoint который будет отдавать GPS координаты по ID пользователя и по определенному 
// временному промежутку. (ОВП) - где начальные и конечные даты могут быть открытыми


app.get("/path", (req, res) => {
    const { error, value } = Joi.object({
        user_id: Joi.number().integer().positive.required(),
        start: Joi.date().optional().allow(null),
        end: Joi.date().optional().allow(null).max(new Date()),
    }).validate(req.query);
    if (error) return res.status(400).send(error.details[0].message);
    let query = `SELECT * FROM coordinates WHERE user_id = $1 AND created_time BETWEEN $2 AND COALESCE($3, NOW()) 
    ORDER BY id ASC`

    //Если не будет начало ОВП, будет возвращены координаты до настоящего времени

    if (!value.start) query = `SELECT id, coordinate, created_time FROM coordinates WHERE user_id = $1 AND created_time <= COALESCE($3, NOW()) ORDER BY id ASC`
    pool.query(query, [value.user_id, value.start, value.end], (err, resp) => {
        if (err) {
            console.log(err.message);
            return res.status(500).send("Internal server error")
        }
        return res.send(resp.rows)
    })
})

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}...`)
})