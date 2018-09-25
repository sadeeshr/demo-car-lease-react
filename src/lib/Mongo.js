const mongojs = require('mongojs');

const db = mongojs("localhost:44444/carlease", []) // for development only
// const db = mongojs("carlease", [])

// create index for object ID in crowdfund objects table, like
// db.getCollection("crowdfundobj").createIndex({ "objectID": -1, "objectName": -1  }, { "unique": true })

// to change string to int
// db.crowdfundobj.find({}).forEach(function(doc) {
//     if (doc["objectID"])
//         doc["objectID"] = NumberInt(doc["objectID"])
//     db.crowdfundobj.save(doc);
// })


db.on('error', function (err) {
	console.log('database error', err)
})

db.on('connect', function () {
	console.log('database connected')
})

module.exports = {
	db: db,
	obj: mongojs
}
