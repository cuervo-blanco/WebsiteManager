import crypto from 'crypto';

function generateSalt(length = 16) {
	
	return crypto.randomBytes(length).toString('hex');

}

function hashPassword(password, salt, cb) {
	const saltBuffer = Buffer.from(salt, 'hex');

	crypto.pbkdf2(password, saltBuffer, 310000, 32, 'sha256', (err, derivedKey) => {
	
			if (err){
				cb(error, null);
			} else {
				cb(null, derivedKey.toString('hex'));

			}
	});
}

const salt = generateSalt();
console.log("Generated salt:", salt);

hashPassword('1234', 'c54db900d9df14e01d42e54bdf23d8c3'
, (err, hashedPassword) => {
	if ( err) {
	console.error('Error hashing password: ', err);
	} else {
	console.log("Hashed Password: ", hashedPassword);
	}
	
});
