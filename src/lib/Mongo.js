const mongojs = require('mongojs');
import cc from './utils';

// const db = mongojs("localhost:44444/carlease", []) // for development only
const db = mongojs("carlease", [])

db.on('error', function (err) {
	cc.log('database error', err)
})

db.on('connect', function () {
	cc.log('database connected')
})

module.exports = {
	db : db,
	obj : mongojs
}
