import React, { Component } from 'react'

class Life extends Component {
    constructor(props){
        super(props)// 必须调用super方法
        console.log(this.props)//拿到this.props的值
        this.state = {num:0}//初始化state
       // this.setNewNumber = this.setNewNumber.bind(this);
    }

    //父组件
    componentWillMount(){
        console.log('父组件挂载之前');
    }
    componentDidMount(){
        console.log('父组件挂载完');
    }
    shouldComponentUpdate(newProps,newState){
        // console.log(newState)
        // console.log('父组件是否需要更新');
        // if (newState.num < 2) return true;
        // return false
        return true
    }
    componentWillUpdate(){
        console.log('父组件将要更新');
    }
    componentDidUpdate(){
        console.log('父组件更新完成');
    }


    //es6箭头函数的写法我们就不用在constructor绑定事件
    setNewNumber = ()=>{
        const addData = this.state.num + 1
        this.setState({
            num: addData
        })
    }
    render() {
        
        return (
            <div>
                <button onClick={this.setNewNumber}>INCREMENT</button>
                <LifeC myNumber={this.state.num} />
            </div>
        )
    }


}


class LifeC extends Component {
    //子组件
    //进入页面首先加载componentWillMount->componentDidMount
    componentWillMount() {
        console.log('子组件挂载之前')
    }
    componentDidMount() {
        console.log('子组件挂载完')
    }
    //state改变之后依次执行
    // 子组件将要更新
    // 子组件将要更新
    // 子组件更新完
    componentWillReceiveProps(newProps) {
        console.log('接收到state变化')
    }
    shouldComponentUpdate(newProps, newState) {
        console.log('子组件是否需要更新');
        return false;
    }
    componentWillUpdate(nextProps, nextState) {
        console.log('子组件将要更新');
    }
    componentDidUpdate(prevProps, prevState) {
        console.log('子组件更新完');
    }
    //离开页面Component WILL UNMOUNT!
    componentWillUnmount() {
        console.log('Component WILL UNMOUNT!')
    }

    render() {
        return (
            <div>
                <h3>{this.props.myNumber}</h3>
            </div>
        );
    }
}



export default Life
