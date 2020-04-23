var express = require('express');
var bodyParser = require('body-parser');
var router = require('./router');
var config = require('./config');
//express 实例
const app = express();
app.use(router);
app.use(bodyParser.json());//注意加上，否则返回的是数据流，不是json
app.listen(config.port,function(){//启动应用
    console.log('server is run on ' + config.port);
})