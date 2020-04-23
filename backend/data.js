const mongoose = require('mongoose');

//注意这是我们的数据结构
const DataSchema = new mongoose.Schema(
    {id: Number,
    message:String
    },
    {timestamps:true ,useFindAndModify:true}
);
// //返回Schema,便于通过Node.js使用
module.exports = mongoose.model('input01',DataSchema);