/**
 * create by <714195347@qq.com> 小公主
 */

import {combineReducers} from 'redux'
import {RECEIVE_PRODUCTS,ADD_TO_CART} from './ActionTypes'

const products = (state,action)=>{
    console.log('11111',state)
    console.log('22222',action)
    switch(action.type){
        case ADD_TO_CART:
            return {
                ...state,
                inventory:state.inventory - 1
            }
        default:
            return state
    }
}

const byId = (state= {},action)=>{
    console.log('byid',action)
    switch(action.type){
        case RECEIVE_PRODUCTS:
            return {
                ...state,
                //计算数组元素相加后的总和
                ...action.products.reduce((obj,product)=>{
                    obj[product.id] = product
                    return obj
                },{})
            }
        default:
            const {productId} = action
            if(productId){
                return {
                    ...state,
                    [productId]:products(state[productId],action)
                }
            }
        return state
    }
}

const visibleIds = (state=[],action)=>{
    console.log('3333',action)
    switch(action.type){
        case RECEIVE_PRODUCTS:
            return action.products.map(product=>product.id)
        default:
            return state
    }

}

export default combineReducers({
    byId,
    visibleIds
})

//seletor  查询
export const getProduct = (state,id)=>state.byId[id]

export const getVisibleProducts = state=>state.visibleIds.map(id=>getProduct(state,id))


