import crypto from 'crypto';
import pool from './db.js';
import passport from 'passport';


var db = pool;

import { Strategy as LocalStrategy } from 'passport-local';

var strategy = new LocalStrategy(function verify(username, password, cb) {
  db.query('SELECT * FROM users WHERE username = $1', [ username ], function(err, result) {
    if (err) { return cb(err); }
    if (result.rows.length === 0) { return cb(null, false, { message: 'Incorrect username or password.' }); }

	const user = result.rows[0];
	  console.log('Domain: ', user.domain);
		const saltBuffer = Buffer.from(user.salt, 'hex');

    crypto.pbkdf2(password, saltBuffer, 310000, 32, 'sha256', function(err, hashedPassword) {

      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(Buffer(user.hashed_password, 'hex'), hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, user);
    });
  });
});

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.user_id, username: user.username, domain: user.domain });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});



export default strategy;
