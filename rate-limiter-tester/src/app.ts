const process = require('process')
const querystring = require('querystring')
const https = require('https');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

let counter = 0;
const counterLimit = 20

while (counter++ < counterLimit) {

    const postData = querystring.stringify({
        'iTitleID': '1',
        'cFirstName': 'john',
        'cLastName': 'doe',
        'cEmail': 'john' + counter + '@doe.com',
        'cPassword': 'zaq1@WSX',
        'cPasswordConfirmation': 'zaq12wsx'
    });

    const postOptions = {
        hostname: 'local.lcb',
        port: 443,
        path: '/index.cfm?fa=AccountMod.DoCreateNewAccount',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    }

    let req = https.request(postOptions, (res) => {
        console.log("Request response: " + res.statusCode)
    })
    req.write(postData)
    req.end()
}