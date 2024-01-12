import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import next from 'next';
import pool from './db';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


//let bodyParser = require('body-parser');
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.prepare().then(() => {
const server = express();
	
	pool.connect((err: any, client: any, release: any) => {
    if (err) {
      throw new Error(`Database connection error: ${err.stack}`);
    }
    console.log('Database Connected Successfully');
    release();

	server.post('/api/login/password', passport.authenticate('local'));
// Next.js page handling
  server.get('*', (req: any, res: any) => {
    return handle(req, res);
  });


const PORT = process.env.PORT || 3000;
server.listen(PORT, (err: any) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${PORT}`);
});

});
	});
