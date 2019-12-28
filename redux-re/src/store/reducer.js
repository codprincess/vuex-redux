/**
 * create by <714195347@qq.com> 小公主
 */
import { combineReducers } from 'redux'
import reducerTodo from './todoList/reducerTodo'
import counter from './counter/reducerCounter'
import reducerPrice from './prices/reducerPrice'
import products,* as fromProducts from './products/reducerProducts';
import cart, * as fromCart from './products/reducerCart'
const reducer = combineReducers({
    reducerTodo,
    counter,
    reducerPrice,
    products,
    cart,
})

const getAddedIds = state => fromCart.getAddedIds(state.cart)
const getQuantity = (state, id) => fromCart.getQuantity(state.cart, id)
const getProduct = (state, id) => fromProducts.getProduct(state.products, id)

export const getTotal = state =>
    getAddedIds(state)
        .reduce((total, id) =>
            total + getProduct(state, id).price * getQuantity(state, id),
            0
        )
        .toFixed(2)

export const getCartProducts = state =>
    getAddedIds(state).map(id => ({
        ...getProduct(state, id),
        quantity: getQuantity(state, id)
    }))

export default reducer