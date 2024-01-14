import dotenv from 'dotenv';
import express from 'express';
import next from 'next';
import pool from './db.js';
import passport from 'passport';
import strategy from './passport.js';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';


dotenv.config();
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;
const SQLiteStoreModule = SQLiteStore(session);

passport.use(strategy);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/'); // Redirect to homepage if not authenticated
}

app.prepare().then(() => {
  const server = express();

	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));

  // Database Check Endpoint
  server.get('/api/dbcheck', (req, res) => {
	  console.log('Got the thingy');
    pool.connect((err, client, release) => {
      if (err) {
        console.error('Error acquiring client', err.stack);
        res.status(500).send('Database connection failed');
        return;
      }
      res.send('Database connection successful');
      release();
    });
  });

	server.use(session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		store: new SQLiteStoreModule({ db: 'sessions.db', dir: './var/db' })
		}));
	server.use(passport.authenticate('session'));

  // Other Routes
  server.post('/api/login/password', (req, res, next) => { 
	  console.log('Login Request Body:', req.body);
	  next(); 
  }, passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/not-found'})
  );

server.post('/api/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
	  console.log('Succesfully logged out');
	  res.status(200).send('Logged out');
  });
});

	// Protected route example
	server.get('/dashboard', ensureAuthenticated, (req, res) => {
		 return app.render(req, res, '/dashboard', req.query);
	});



  // Next.js page handling
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});

