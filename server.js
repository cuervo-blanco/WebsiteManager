import dotenv from 'dotenv';
import express from 'express';
import next from 'next';
import pool from './db.js';
import passport from 'passport';
import strategy from './passport.js';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import { getUserPages } from './db.js';

// Load environment variables
dotenv.config();

// Check if the app is running in development or production mode
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;
const SQLiteStoreModule = SQLiteStore(session);

// Configure passport with the authentication strategy
passport.use(strategy);

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/'); // Redirect to homepage if not authenticated
}

// Prepare the Next.js app and then set up the Express server
app.prepare().then(() => {
  const server = express();

  // Middleware for parsing JSON and URL-encoded data
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));


  // Database health check endpoint
  server.get('/api/dbcheck', (req, res) => {
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

  // Session configuration
  server.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStoreModule({ db: 'sessions.db', dir: './var/db' })
  }));

  // Initialize passport session
  server.use(passport.authenticate('session'));

  // Login route
  server.post('/api/login/password', (req, res, next) => { 
    next(); 
  }, passport.authenticate('local', { successRedirect: '/admin-panel', failureRedirect: '/not-found' }));

  // Logout route
  server.post('/api/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(200).send('Logged out');
    });
  });

  // API endpoint to get menu items for a user
  server.get('/api/menu-items', async (req, res) => {
    try {
      const userId = req.user.id;
      const pages = await getUserPages(userId);
      res.json(pages);
    } catch (error) { 
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

	
	server.get('/api/auth-check', (req, res) => {
	 const isAuthenticated = req.isAuthenticated();
	 // Render the Next.js homepage with the authentication statu
		res.send(isAuthenticated);
	});

  // Protected routes for different admin panel sections
  server.get('/admin-panel', ensureAuthenticated, (req, res) => {
    return app.render(req, res, '/admin-panel', req.query);
  });

	server.get('/admin-panel/blog', ensureAuthenticated, (req, res) => {
		 return app.render(req, res, '/admin-panel/blog', req.query);
	});
server.get('/admin-panel/gallery', ensureAuthenticated, (req, res) => {
		 return app.render(req, res, '/admin-panel/gallery', req.query);
	});
server.get('/admin-panel/bio', ensureAuthenticated, (req, res) => {
		 return app.render(req, res, '/admin-panel/bio', req.query);
	});
server.get('/admin-panel/shop', ensureAuthenticated, (req, res) => {
		 return app.render(req, res, '/admin-panel/shop', req.query);
	});
server.get('/admin-panel/media', ensureAuthenticated, (req, res) => {
		 return app.render(req, res, '/admin-panel/media', req.query);
	});
server.get('/admin-panel/settings', ensureAuthenticated, (req, res) => {
		 return app.render(req, res, '/admin-panel/settings', req.query);
	});  

// Catch-all route for Next.js page handling
 server.get('*', (req, res) => {
    return handle(req, res);
  });

  // Start the server
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
