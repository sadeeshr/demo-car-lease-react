const mongo = require('./lib/Mongo');
const fs = require('fs')
var options = {
    key: fs.readFileSync('./certs/blockchain.techiearea.com/key.pem'),   //relative path to package json run script
    cert: fs.readFileSync('./certs/blockchain.techiearea.com/cert.pem'),
    // key: fs.readFileSync('./certs/smartjuice.apayaa.com/key.pem'),  
    // cert: fs.readFileSync('./certs/smartjuice.apayaa.com/cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = require('https').createServer(options);
// var app = require('http').createServer();
var io = require('socket.io').listen(app);
app.listen(3456);

console.log("Mongo", mongo.db);


/**
 * socket io handler
 */

let online = 0;
io.on('connection', (socket) => {
    online++;
    console.log(`Socket ${socket.id} connected.`);
    console.log(`Online Connections: ${online}`);
    socket.emit('response', "You are Online now");

    // socket.on('user', data => user.handleUser(socket, data));
    // socket.on('admin', data => admin.handleAdmin(socket, data));

    socket.on('fetch', data => fetchDBQuery(socket, data));
    socket.on('update', data => updateDBQuery(socket, data));

    socket.on('disconnect', () => {
        online--;
        console.log(`Socket ${socket.id} disconnected.`);
        console.log(`Online Connections: ${online}`);
    });

});



fetchDBQuery = (socket, data) => {
    mongo.db["contractdata"].findOne(
        {},
        {
            "_id": 0,
            [data]: 1
        },
        (err, result) => {console.log("RESULT: ", result); socket.emit('data', result)});
}

updateDBQuery = (socket, data) => {

    mongo.db["contractdata"].findAndModify(
        {
            query: {},
            update: { $set: data },
            new: true
        },
        (err, result) => {console.log("RESULT: ",result); socket.emit('data', result)});
}
