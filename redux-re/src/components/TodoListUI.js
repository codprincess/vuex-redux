import React, { Component } from 'react'
import 'antd/dist/antd.css'
import { Input, Button, List } from 'antd'

//无状态组件的改写
//函数传递一个props参数，之后修改里边的所有props，去掉this
const TodoListUI = (props)=>{
    return(
        <div style={{ margin: '10px' }}>
            <div>
                <Input 
                    onChange={props.changeInputValue} 
                    placeholder={props.inputValue} 
                    style={{ width: '250px', marginRight: '10px' }} 
                />
                <Button onClick={props.clickBtn} type="primary">增加</Button>
            </div>
            <div style={{ margin: '10px', width: '300px' }}>
                <List
                    bordered
                    dataSource={props.list}
                    renderItem={(item, index) => (<List.Item onClick={props.deleteItem.bind(this, index)}>{item}</List.Item>)}
                ></List>
            </div>
        </div>
    )
}

export default TodoListUI
