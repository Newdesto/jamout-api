import bcrypt from 'bcryptjs';

// uses bcrypt to hash a given password
export function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
            if(error) return reject(error);

            bcrypt.hash(password, salt, (error, hash) => {
                if(error) return reject(error);
                return resolve(hash);
            });
        });
    });
}

// uses bcrypt to compare password and hash
export function authenticate(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (error, response) => {
            if(error) return reject(error);
            return resolve(response);
        });
    });
}
