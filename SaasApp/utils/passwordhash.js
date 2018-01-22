/**
 * Created by rakesh on 3/11/17.
 */
const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '{50lut10n5I%cn50';

function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,password)
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};
module.exports = { decrypt, encrypt };