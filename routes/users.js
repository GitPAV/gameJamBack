const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const connexion = require('../conf');
const jwtSecret = require("../jwtSecret");
let pseudoNodeUser = '';

// Body parser module

const bodyParser = require('body-parser');
// Support JSON-encoded bodies
router.use(bodyParser.urlencoded({
  extended: false
}));

router.use(bodyParser.json());

// Verify token function

const verifToken = req => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      console.log(req.headers.authorization)
      console.log('log in function : ' +req.headers.authorization.split(" ")[1])
      return req.headers.authorization.split(" ")[1]
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  };

// *******************************************  
// ****************** Query ******************
// *******************************************

// *******************************************
// Post into UsersDB, creating new user
// *******************************************

router.get('/get-user', (req, res) => {

  connexion.query(`SELECT * FROM UserBase`, (err, results) => {
      if (err) {
          console.log(err)
          res.status(500)
      } else {
          res.status(200).json(results)
      }
  })
})

router.get('/get-user-infos', (req, res) => {
  connexion.query(`SELECT * FROM User WHERE pseudo = '${pseudoNodeUser}'`, (err, results) => {
      if (err) {
          console.log(err)
          res.status(500)
      } else {
          res.status(200).json(results)
      }
  })
})


router.post("/create-profile", (req, res) => {

    const userData = req.body;
    const userMail = req.body.email;  
    const emailCheck = `SELECT email FROM User WHERE email = '${userMail}'`;
    const setBase = 'UPDATE UserBase SET inhabited=1 WHERE (SELECT id=(FLOOR(RAND()*100)) WHERE inhabited=0)';
    const getNewBase = 'SELECT id AS base_id FROM UserBase JOIN User ON User.id = base_id WHERE inhabited = 1 AND base_id IS NULL';

  connexion.beginTransaction( (err) => {
    if (err) { throw err } 
    
    connexion.query(emailCheck, (err, results) => {
      if (err) {
        return connexion.rollback(_ => {
          res
            .status(500)
            .send("error while checking email")
          throw err
        })
      } else if (results.length > 0) {
        console.log('utilisateur déjà dans la BDD')
      } else {
        connexion.query(setBase, (err, results) => {
          if (err) {
            return connection.rollback(_ => {
              res
                .status(500)
                .send("erreur lors de l'occupation d'une base")
              throw err
            })
          } else {
            // récupérer Id ont le booléen vient d'être mis à 1
          }
        })

      }
    })        
    connection.query('INSERT INTO cinema SET ?', formDataCinema, (err, results) => {
      if (err) {
        return connection.rollback(_ => {
          res
            .status(500)
            .send(" erreur lors de l'insertion cinema")
          throw err
        })
      } else {
        joinObject.cinema_idCinema = results.insertId       

        connection.query('SELECT * FROM realisateurs', formDataReal, (err, results) => {
          const real = results.filter(result => result.name == formDataReal.name)                    
          if (real.length !== 0) {
            joinObject.realisateurs_idRealisateur = real.idRealisateur
          } else {
            connection.query('INSERT INTO realisateurs SET ?', formDataReal, (err, results) => {
              if (err) {
                return connection.rollback(_ => {
                  res
                    .status(500)
                    .send(" error insert realisateur")
                  throw err
                })
              }
            })
          } connection.query('SELECT * FROM distributeurEditeur', formDataEdit, (err, results) => {
            const edit = results.filter(result => result.name == formDataEdit.name)                                
            if (edit.length !== 0) {
              joinObject.distributeurEditeur_idDistributeurEditeur = edit.distributeurEditeur
            } else {
              connection.query('INSERT INTO distributeurEditeur SET ?', formDataEdit, (err, results) => {
                if (err) {
                  return connection.rollback(_ => {
                    res
                      .status(500)
                      .send(" error insert distributeur")
                    throw err
                  })
                }
              })
            }
          })                  
            connection.commit((err) => {
            if (err) {
              return connection.rollback(_ => {
                res
                  .status(500)
                  .send(" error end rollback")
                throw err
              })
            }
          })
          res.status(200).json({ results: "send" })
        })
      }
    })
  })
})

  router.put('/update-user', (req, res) => {
    const userId = req.body.id 
    const userMoney = req.body.userMoney

  connexion.query(`UPDATE UserBase SET userMoney = ${userMoney} WHERE id= ${userId}`, (err, results) => {

    if (err) {

      console.log(err);
      res.status(500).send("Erreur lors de la modification de données");
    } else {
      console.log(results);
      res.sendStatus(200);
    }
});
  })

// **********************************************************
// Login standard pour tous les users qui ont déjà un profil
// **********************************************************

router.post("/login", (req, res) => {
    const userData = req.body
    const userPseudo = req.body.pseudo
    pseudoNodeUser = userPseudo;
    const userPw = req.body.password
    console.log(userData)
  
    connexion.query(`SELECT pseudo FROM User WHERE pseudo = '${userPseudo}'`, (err, results) => {

      if (results.length === 0) {
        res.status(401).send("Vous n'avez pas de compte")
      } else {
        connexion.query(`SELECT password FROM User WHERE pseudo = '${userPseudo}' AND password = '${userPw}'`, (err, results) => {
          if(results.length === 0) {
            console.error(err)
            res.status(401).send("Mauvais mot de passe")
          } else {
            console.log("T'existes bravo")
            const token = jwt.sign(userData, jwtSecret)
            console.log('token = ' + token);
            res.header("Access-Control-Expose-Headers", "x-access-token")
            res.set("x-access-token", token)
            res.status(200).send({ auth: true, token: token});
          }
        })
      }
    })
  })
  
  // ******************************************
  // vérifier le token pour les pages protégées 
  // ******************************************

  router.post("/protected", (req, res, next) => {
    const token = verifToken(req);
    const objectTests = { //data appelées par la bdd 
      test: 'ok',
    }
    jwt.verify(token, jwtSecret, (err, decoded) => {
      console.log(token)
      if(err) {
        console.log(err)
        return res.sendStatus(401)
      }
      console.log('decode',decoded)
      return res.status(200).send({mess: 'Données du user', objectTests })
    })
  })

  module.exports = router