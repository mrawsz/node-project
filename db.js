const mongoose = require('mongoose');
let uri = 'mongodb://root:root@cluster0-shard-00-00-elac6.mongodb.net:27017,cluster0-shard-00-01-elac6.mongodb.net:27017,cluster0-shard-00-02-elac6.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
mongoose.connect(uri);
