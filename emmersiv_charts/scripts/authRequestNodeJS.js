var request = require('request');

var url = 'https://westhci.auth0.com/oauth/ro';
var body = {
    "client_id": "Rpl8D1n6DUhppbnihKGMaWPHxmz0tmMj",
    "username": "asim.mittal@gmail.com",
    "password": "password",
    "connection": "emmersiv",
    "grant_type": "password",
    "scope": "openid"
};

request.post({url: url, body: body, json:true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log("Authorization: ");
        console.log("bearer " + body.id_token);
    }else{
        console.log(error);
    }
});