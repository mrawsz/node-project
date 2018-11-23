require('dotenv').config();
const secret = process.env.secret;

module.exports = {
    'secret': secret
};
console.log(secret)