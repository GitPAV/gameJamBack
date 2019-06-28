const express = require("express");

const router = express.Router();

const connexion = require('../conf');

// Body parser module

const bodyParser = require('body-parser');
// Support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  extended: false
}));

router.use(bodyParser.json());

router.get('/get-soldier', (req, res) => {

    connexion.query(`SELECT * FROM Soldat`, (err, results) => {
        if (err) {
            console.log(err)
            res.status(500)
        } else {
            console.log('results : ' + results[0].soldatName)
            res.status(200).json(results)
        }
    })
})

module.exports = router