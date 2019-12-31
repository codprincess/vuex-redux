/**
 * create by <714195347@qq.com> 小公主
 */
//业务逻辑文件
import axios from 'axios'
import { CHANGE_INPUT, ADD_ITEM, DELETE_ITEM, GET_LIST} from './actionTypes'
//输入值改变
export const changeInputAction = (value)=>({
    type: CHANGE_INPUT,
    value
})

//添加
export const addItemAction = ()=>({
    type: ADD_ITEM
})

//删除
export const deleteItemAction = (index)=>({
    type: DELETE_ITEM,
    index
})

//获取数据
export const getListAction = (data)=>({
    type:GET_LIST,
    data
})

export const getTodoList = ()=>{
    return (dispatch)=>{
        axios.get('https://www.easy-mock.com/mock/5cfcce489dc7c36bd6da2c99/xiaojiejie/getList').then((res) => {
            const data = res.data
           // const action = getListAction(data)
            dispatch(getListAction(data))
        })
    }
}


