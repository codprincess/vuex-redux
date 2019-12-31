import React, { Component } from 'react'
import 'antd/dist/antd.css'
import { changeInputAction, addItemAction, deleteItemAction } from '../store/todoList/actionCreators'
import TodoListUI from '../components/TodoListUI'
import {connect} from 'react-redux'

class TodoList extends Component {
    constructor(props){
        super(props)
        console.log('1111',this.props)
    }
    render() {
        return (
            <div>
                <TodoListUI
                    inputValue={this.props.inputValue}
                    list={this.props.list}
                    changeInputValue={this.props.changeInputValue}
                    clickBtn={this.props.clickBtn}
                    deleteItem={this.props.deleteItem}
                ></TodoListUI>

            </div>
        )
    }
}

const mapStateToProps = state=>{
    console.log('state的值', state)
    return {
        inputValue: state.reducerTodo.inputValue,
        list: state.reducerTodo.list
    }
}

const mapDispatchToProps=dispatch=>{
    return{
        changeInputValue: (e) => dispatch(changeInputAction(e.target.value)),
        clickBtn: () => dispatch(addItemAction),
        deleteItem: (index) => dispatch(deleteItemAction(index))
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(TodoList);