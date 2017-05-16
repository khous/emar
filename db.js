module.exports = function (cb) {
    var MongoClient = require('mongodb').MongoClient,
        assert = require('assert');



// Connection URL
    var url = 'mongodb://localhost:27017/emar';
// Use connect method to connect to the Server
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        db.createCollection("surveys", function () {});
        db.createCollection("responses", function () {});

        cb(err, db);

    });
};

/*
db.createUser({ user: "emaradmin", pwd: "PkaXI6SHHtIwbU4jysLwEGfWJESQvFmX3tcnWmNXJpuHs1jVbaAQNfdlFPc8Oq4h", roles: [{ role: "userAdminAnyDatabase", db: "admin" }]  });

 db.createUser({ user: "emaruser", pwd: "Sfs0wQDoOqp9Y3ubCUJVjciU9eZeX0foKj98klR9LqXtMZWmlc2TA1YTNDNfCEvx", roles: [{ role: "readWrite", db: "emar" }]  });

 */