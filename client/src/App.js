//引入react
import React, { Component } from 'react';
//引入样式文件
import './App.css';
//引入axios
import axios from 'axios';
//引入antd相关组件
import { Button, Input, List, Avatar, Card } from 'antd';
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[], 
            id:0,
            message:null,
            intervalIsSet :false,
            idToDelete: null,
            idToUpdate: null,
            objectToUpdate: null
        };
    }
    //首先从数据库中获取已有数据
    //然后添加轮询机制，用于检测数据库的数据，当数据发生变化时，重新渲染UI
    componentDidMount() {
        this.getDataFromDb();
        if(!this.state.intervalIsSet){
            let interval = setInterval(this.getDataFromDb,1000);
            this.setState({intervalIsSet:interval});
            console.log(this.state.intervalIsSet);
        }
    }
    //及时销毁不需要的进程
    componentWillUnmount(){
        if(this.state.intervalIsSet){
            clearInterval(this.state.intervalIsSet);
            this.setState({intervalIsSet : null});
        }
    }
    //在前台使用ID作为数据的key来辨识所需更新或删除的数据
    //在后台使用ID作为M哦能够DB中的数据实例的修改依据
    //获取数据
    getDataFromDb = () => {
        fetch('/api/getData')
            .then(data => data.json())
            .then(res => {
                this.setState({ data: res})
            });
    }

    //调用后台API接口向数据库新增数据
    putDataToDb = message => {
        let currentIds = this.state.data.data.map(data => data.id);
        let idToBeAdded = 0;
        while(currentIds.includes(idToBeAdded)) {
            ++ idToBeAdded;
        }
        axios.post('/api/putData',{
            id:idToBeAdded,
            message:message
        });
        window.location.reload();
    };
    
    //deleteFromDB函数用于调用后台API，删除数据库中已经存在的数据
    deleteFromDB = idToDelete=>{
        let objIdToDelete = null;
        this.state.data.data.forEach(item=>{
            if(item.id == idToDelete){
                objIdToDelete = item._id;
            }
        })
        axios.delete('/api/deleteData',{
            data:{
                id:objIdToDelete
            }
        });
        window.location.reload();
    }
    //updateDB函数用于调用后台API，更新数据库中已经存在的数据
    updateDB = (idToUpdate, objectToUpdate)=>{
        let objIdToUpdate = null;
        this.state.data.data.forEach(item=>{
            if(item.id == idToUpdate){
                objIdToUpdate = item._id;
            }
        });
        // console.log(objIdToUpdate);
        axios.post('/api/updateData',{
            id:objIdToUpdate,
            update:{message: objectToUpdate}
        });
        window.location.reload();
    }
    //渲染UI的核心方法
    //该渲染函数渲染的内容与前台界面展示一致
    render() {
        const { data = [] } = this.state;
        console.log('data', data);
        return (
            <div style={{ width: 990, margin: 20 }}>
                <Card title='新增笔记' style={{ padding: 10, margin: 10 }}>
                    <Input onChange={e => this.setState({ message: e.target.value })}
                        placeholder='请输入笔记内容'
                        style={{ width: 200 }}
                    />
                    <Button
                        type='primary'
                        style={{ margin: 20 }}
                        onClick={() => this.putDataToDb(this.state.message)}>添加
                    </Button>
                </Card>
                <Card
                    title = '删除笔记'
                    style = {{padding:10, margin:10}}>
                    <input
                    style = {{width:'200px'}}
                    onChange={e =>this.setState({idToDelete:e.target.value})}
                    placeholder= '填写所需删除的ID'/>
                    <Button
                        type = "primary"
                        style ={{margin:20}} 
                        onClick ={()=>this.deleteFromDB(this.state.idToDelete)}>删除
                    </Button>
                </Card>
                <Card
                    title = '更新笔记'
                    style = {{padding:10,margin:10}}>
                    <input
                        style={{width:200,marginRight:10}}
                        onChange={e=>this.setState({idToUpdate:e.target.value})}
                        placeholder='所需更新的ID'/>
                    <input
                        style={{width:200}}
                        onChange={e=>this.setState({objectToUpdate:e.target.value})}
                        placeholder='请输入所需更新的内容'/>
                    <Button
                        type ="primary"
                        style={{margin:20}}
                        onClick={()=>this.updateDB(this.state.idToUpdate, this.state.objectToUpdate)}>更新
                    </Button>
                </Card>
            </div>
        );
    }
}
export default App;
