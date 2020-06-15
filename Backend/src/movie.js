const express = require('express');

function createRouter(db) {
  const router = express.Router();
  const owner = '';

  // the routes are defined here
  router.post('/movie', (req, res, next) => {
    db.query(
      'INSERT INTO movies (name, studio, year, duration, owner, date) VALUES (?,?,?,?,?,?)',
      [req.body.name, req.body.studio, req.body.year, req.body.duration, owner, new Date(req.body.date)],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });
  router.get('/movie/random/:number', function (req, res, next) {
    db.query('SELECT COUNT(id) AS idCount FROM movies WHERE id = ?', [req.params.number],
      (error, results) => {
        const count = results[0].idCount;
        
        console.log(`idCount: ${count}`);
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }

    );
  });

  router.get('/movie', function (req, res, next) {
    db.query(
      'SELECT id, name, studio, year, duration FROM movies WHERE owner=?',
      [owner, 10 * (req.params.page || 0)],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json(results);
        }
      }
    );
  });
  router.put('/movie/:id', function (req, res, next) {
    db.query(
      'UPDATE movies SET name=?, studio=?, year=?, duration=?, date=? WHERE id=? AND owner=? ',
      [req.body.name, req.body.studio, req.body.year, req.body.duration, new Date(req.body.date), req.params.id, owner],
      (error) => {
        if (error) {
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });
  router.delete('/movie/:id', function (req, res, next) {
    db.query(
      'DELETE FROM movies WHERE id=? AND owner=?',
      [req.params.id, owner],
      (error) => {
        if (error) {
          res.status(500).json({ status: 'error' });
        } else {
          res.status(200).json({ status: 'ok' });
        }
      }
    );
  });

  router.get('/movie/:id',function(req, res, next){
    const id = req.params.id;
    db.query('SELECT name, year, studio FROM movies WHERE id=?',[id] , (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ status: 'error' });
      } else {
        res.status(200).json(results);
      }
    }

    )
  })
  return router;
}

module.exports = createRouter;