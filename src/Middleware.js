const mongo = require('./lib/Mongo')
const fs = require('fs')
// const sharp = require('sharp')
const web3 = require('./lib/Web3')

var options = {
    // key: fs.readFileSync('./certs/blockchain.techiearea.com/key.pem'),   //relative path to package json run script
    // cert: fs.readFileSync('./certs/blockchain.techiearea.com/cert.pem'),
    key: fs.readFileSync('./certs/smartjuice.apayaa.com/key.pem'),
    cert: fs.readFileSync('./certs/smartjuice.apayaa.com/cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = require('https').createServer(options);
// var app = require('http').createServer();
var io = require('socket.io').listen(app);
app.listen(3456);

// console.log("Mongo", mongo.db);

web3.subscribeEvents(io) // subscribe to events

/**
 * socket io handler
 */

let online = 0;
io.on('connection', (socket) => {
    online++;
    console.log(`Socket ${socket.id} connected.`);
    console.log(`Online Connections: ${online}`);
    socket.emit('response', "You are Online now");

    // setTimeout(() => {
    // subscribe to events
    // }, 3000);
    // socket.on('user', data => user.handleUser(socket, data));
    // socket.on('admin', data => admin.handleAdmin(socket, data));

    socket.on('new', data => handleNew(socket, data));
    socket.on('fetch', data => handleFetch(socket, data));
    socket.on('update', data => handleUpdate(socket, data));

    socket.on('disconnect', () => {
        online--;
        console.log(`Socket ${socket.id} disconnected.`);
        console.log(`Online Connections: ${online}`);
    });

});



handleFetch = (socket, data) => {
    console.log(data);
    let query = data.query || {}
    let filter = data.filter || {}
    mongo.db[data.module].find(
        query,
        filter,
        (err, result) => { console.log("RESULT: ", result.length); socket.emit('data', { module: data.result || data.module, result: result }) });
}

handleNew = (socket, request) => {
    mongo.db[request.module].insert(
        request.data,
        (err, result) => {
            if (err || !result) {
                console.log(err);
            } else {
                socket.emit('data', { module: ((request.result || request.module) + "_new"), result: true })
            }
        })
}

handleUpdate = (socket, data) => {
    data.query["_id"] = mongo.obj.ObjectId(data.query["_id"]);
    mongo.db[data.module].findAndModify(
        {
            query: data.query || {},
            update: { $set: data.data },
            new: true
        },
        (err, result) => { console.log("RESULT: ", result); socket.emit('data', { module: ((data.result || data.module) + "_edit"), result: true }) });
}




