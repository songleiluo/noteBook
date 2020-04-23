//引入mongoose
const mongoose = require('mongoose');
//引入express
const express = require('express');
//引入body-parser
const bodyParse = require('body-parser');
const logger = require('morgan');
const input01 = require('./data');

const API_PORT = 3001;
//express 实例
const app = express();
//路由
const router  = express.Router();

//定义MongoDB数据库
const dbRoute = 'mongodb://localhost/data01';

//连接数据库
mongoose.connect(
    dbRoute,
    {useNewUrlParser:true,useUnifiedTopology: true})
.then(()=>console.log('数据库连接成功'))
.catch(err =>console.log(err,'数据库连接失败'));

//转换为可读的json模式
app.use(bodyParse.urlencoded({ extended:false}));
app.use(bodyParse.json());
//获取数据的方法
//用于获取数据库中所有有用的数据
router.get('/getData',(req,res)=>{
    input01.find((err,data)=>{
        if(err) return res.json({success:false, error : err});
        return res.json({success:true, data:data})
    });
});

//添加数据方法
//用于在数据库中添加数据
router.post('/putData',(req,res)=>{
    let data = new input01();
    const { id, message } = req.body;
    if((!id && id !==0) || !message){
        return res.json({
            succes:false,
            error:'INVALID INPUTS'
        });
    }
    data.id = id;
    data.message =message;
    data.save(err =>{
        if(err) return res.json({success:false, error:err});
        return res.json({ success:true });
    });
});
//数据更新方法
//用于对数据库已有数据进行更新
router.post('/updateData',(req,res)=>{
    console.log(req.body);
    const {id, update} = req.body;
    input01.findOneAndUpdate({_id:id}, update ,{new: true},err=>{
        if (err) return res.json({success:false,error :err});
        return res.json({success:true});
    });

});
//删除数据方法
//用于删除数据库中已有数据
router.delete('/deleteData',(req,res)=>{
    console.log(req.body);
    const {id} = req.body;
    input01.findOneAndDelete({_id:id}, err =>{
        if(err) return res.send(err);
        return res.json({success:true});
    });
});
//对http请求增加api路由
app.use('/api', router);
//开启端口
app.listen(API_PORT,()=>console.log('LISTENING ON PORT ${API_PORT}'));
module.exports = router;
