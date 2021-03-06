const mongo = require('./lib/Mongo')
const fs = require('fs')
// const sharp = require('sharp')
const web3 = require('./lib/Web3')

var options = {
    key: fs.readFileSync('./certs/duurzamezaken.io/key.pem'),
    cert: fs.readFileSync('./certs/duurzamezaken.io/cert.pem'),
    requestCert: false,
    rejectUnauthorized: false
};

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var app = require('https').createServer(options);
// var app = require('http').createServer();
var io = require('socket.io').listen(app);
app.listen(4567); // for release builds change this to 3456

// console.log("Mongo", mongo.db);

web3.subscribeEvents(io) // subscribe to events

// setTimeout(() => {
//     web3.createNewCrowdFundToken("0x423B7B8Da5ec685130670A978a1A680dFa27c879")
// }, 5000);

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
    socket.on('get', data => handleGet(socket, data));
    socket.on('fetch', data => handleFetch(socket, data));
    socket.on('update', data => handleUpdate(socket, data));
    socket.on('userEvent', data => io.sockets.emit('event', data));
    socket.on('confirmHash', data => web3.getConfirmationsHash(data, event => io.sockets.emit('event', event)));

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
    let sorting = 1
    if (data.result === "invoices") sorting = -1
    mongo.db[data.module].find(
        query,
        filter,
    ).sort({ "_id": sorting }, (err, result) => { console.log("RESULT: ", result.length); socket.emit('data', { module: data.result || data.module, result: result }) });
}

handleGet = (socket, data) => {
    console.log(data);
    if (data.query && data.query["_id"]) data.query["_id"] = mongo.obj.ObjectId(data.query["_id"]);

    let query = data.query || {}
    let filter = data.filter || {}
    mongo.db[data.module].findOne(
        query,
        filter,
        (err, result) => { console.log("RESULT: ", result); socket.emit('data', { module: data.result || data.module, result: result }) });
}

handleNew = (socket, request) => {
    console.log("NEW Request: ", request)
    if (request)
        mongo.db[request.module].insert(
            request.data,
            (err, result) => {
                if (err || !result) {
                    console.log(err);
                } else {
                    socket.emit('data', { module: ((request.result || request.module) + "_new"), result: result })
                    if (request.result === "usernames") io.sockets.emit('event', { event: "NewMember" })
                    if (request.result === "members") io.sockets.emit('event', { event: "NewObject", data: request.data.objectName })
                    if (request.result === "invoices") io.sockets.emit('event', { event: "NewInvoice" })
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
        (err, result) => {
            console.log("RESULT: ", result);
            socket.emit('data', { module: ((data.result || data.module) + "_edit"), result: true })
            // if (request.result === "usernames") io.sockets.emit('event', { event: "UpdateMember" })
        });
}




