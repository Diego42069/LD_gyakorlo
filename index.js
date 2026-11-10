const express = require('express');
const mysql = require('mysql2');

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'raktar_db',
    port: 3306
});

db.connect((err) => {

    if (err) {
        console.log('Hiba!');
    } else {
        console.log('Kapcsolódva!');
    }
});

app.get("/termekek", (req, res) => {
    db.query(`
        SELECT
            t.id,
            t.nev,
            t.ar,
            t.keszlet,
            t.elerheto,
            k.nev AS kategoria_nev
        FROM termekek t
        INNER JOIN kategoriak k
        ON t.kategoria_id = k.id
        ORDER BY t.ar ASC
    `, (err, result) => {
        if (err) {
            return res.status(500).json({
                hiba: "Szerverhiba"
            });
        }

        res.json(result);
    });
});

app.get('/termekek/elerheto', (req, res) => {
    db.query('SELECT * FROM termekek WHERE elerheto = 1 AND keszlet > 0;', (err, result) => {
        if (err) {
            return res.status(500).json({
                hiba: "Szerverhiba"
            });
        }

        res.json(result);
    });
});

app.get('/termekek/kereses/:szoveg', (req, res) => {
    const szoveg = req.params.szoveg;
    db.query('SELECT * FROM termekek WHERE nev LIKE ?', [`%${szoveg}%`], (err, result) => {
        if (err) {
            return res.status(500).json({
                hiba: 'Szerverhiba'
            });
        }
        res.json(result);
    });
});

app.listen(3000, () => {
    console.log('Server fut 3000 porton');
});
