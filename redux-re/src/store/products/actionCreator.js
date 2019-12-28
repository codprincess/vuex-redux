/**
 * create by <714195347@qq.com> 小公主
 */
import shop from '../../api/shop'

import * as types from './ActionTypes'

//action就是普通的对象,形式一般为 参数和ActionTypes

const receiveProducts = (products)=>({
    type:types.RECEIVE_PRODUCTS,
    products
})


//获取所有数据
export const getAllProducts = ()=>dispatch=>{
    console.log('这里的dispatch',dispatch)
    shop.getProducts(products=>{
        dispatch(receiveProducts(products))
    })
}

//加入购物车
const addToCartUnsafe = (productId)=>({
    type:types.ADD_TO_CART,
    productId
})

//添加操作
export const addToCart = (productId)=>(dispatch,getState)=>{
    console.log('加入购物车dispatch',dispatch)
    console.log('加入购物车getState',getState)
    if (getState().products.byId[productId].inventory >0){
        dispatch(addToCartUnsafe(productId))
    }
}

//支付请求
const checkoutRequest = ()=>({
    type:types.CHECKOUT_REQUEST
})

//支付成功
const checkoutSuccess = (cart)=>({
    type:types.CHECKOUT_SUCCESS,
    cart
})

//支付失败
const checkoutFailure = (cart) => ({
    type: types.CHECKOUT_FAILURE,
    cart
})
    


//支付操作
export const checkout = (products)=>(dispatch,getState)=>{
    console.log('支付的getState',getState)
    const {cart} = getState()
    //请求支付
    dispatch(checkoutRequest())
    shop.buyProducts(products,()=>{
        //支付成功
        dispatch(checkoutSuccess(cart))
    })
    //支付失败
    dispatch(checkoutFailure(cart))

}
