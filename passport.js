import crypto from 'crypto';
import pool from './db.js';
import passport from 'passport';


var db = pool;

import { Strategy as LocalStrategy } from 'passport-local';

var strategy = new LocalStrategy(function verify(username, password, cb) {
  db.query('SELECT * FROM users WHERE username = $1', [ username ], function(err, result) {
    if (err) { return cb(err); }
    if (result.rows.length === 0) { return cb(null, false, { message: 'Incorrect username or password.' }); }

	  console.log(result.rows[0]);
	 
	const user = result.rows[0];
	  console.log("Salt: ", user.salt);
	  console.log("Hashed-Password: ", user.hashed_password);
		const saltBuffer = Buffer.from(user.salt, 'hex');

    crypto.pbkdf2(password, saltBuffer, 310000, 32, 'sha256', function(err, hashedPassword) {
		const BuffedPassword = Buffer.from(user.hashed_password, 'hex');
				console.log("hash password new: ", hashedPassword, "hash password database: ", BuffedPassword);

      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(Buffer(user.hashed_password, 'hex'), hashedPassword)) {
		  console.log("Oops.. wrong password");
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, result);
    });
  });
});

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});



export default strategy;
