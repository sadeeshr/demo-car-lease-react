const mongojs = require('mongojs');

const db = mongojs("carlease", [])

db.on('error', function (err) {
	console.log('database error', err)
})

db.on('connect', function () {
	console.log('database connected')
})

module.exports = {
	db : db,
	obj : mongojs
}
