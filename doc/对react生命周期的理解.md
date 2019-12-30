## 对react生命周期的理解
#### 生命周期的概况图
![image](https://github.com/codprincess/vuex-redux/blob/master/img/reactLifes.png)
#### 生命周期的划分
react的生命周期主要分为三个阶段,初始化阶段(Mounting),运行阶段(Updating),销毁阶段(Unmounting)
##### Mounting初始化阶段
  . defaultProps 设置组件的默认属性
  . constructor 设置组件初始化状态和生成类的实例
  . componentWillMount（）即将被废弃的声明周期
  . render()组件渲染
  . componentDidMount() 组件已经被渲染到页面中后触发

componentWillMount() 仅在render()方法前被调用一次，如果在该方法中调用了setState方法去改变组件的状态值，那么调用render()后，将会直接看到改变过了的状态值，并且不论状态值怎么改变，componentWillMount()都不会再被调用。

componentDidMount() 仅在render()方法后被立即调用一次（客户端），相对于父组件而言，该方法在子组件中会先被调用。如果需要使用一些JaveScript框架或者类似于setInterval()这样的方法，建议在该方法内使用。

##### Updating运行阶段
 . componentWillReceiveProps(nextProps)组件接收到属性时触发,丢弃
 . shouldComponentUpdate(nextProps, nextState)
 . componentWillUpdate(nextProps, nextState)组件即将被更新时触发，丢弃
 . componentDidUpdate(nextProps, nextState) 组件被更新完成后触发。页面中产生了新的DOM的元素，可以进行DOM操作
 . ponentWillReceiveProps(nextProps):会回传更新过的props,并且可以使用setState来更新state，但是这里使用setState，并不会重新执行componentWillReceiveProps，因为ReceiveProps只会在更新传递的props的时候进行调用。


ShouldComponentUpdate(object nextProps, object nextState) 在初始渲染调用render()方法时不会被调用，后面在接受到新的state或者props时，在render()方法前被调用。为防止一些潜在的bug，该方法默认总是返回true。如果你确定state及props改变后不需要渲染组件，那么也可以指定返回false，需要注意的是，这样的结果会导致后面的render()、componentWillUpdate()、componentDidUpdate()都不会被调用。

ShouldComponentUpdate(nextProps,nextState)中加入条件判断,可以优化性能.(而一个父组件的重新更新会造成它旗下所有的子组件重新执行render()方法，形成新的虚拟DOM，再用diff算法对新旧虚拟DOM进行结构和属性的比较，决定组件是否需要重新渲染)

componentWillReceiveProps(object nextProps) 在初始渲染调用render()方法时不会被调用，当接收到一个新的props时，该方法被调用。我们知道,改变一个状态的值,会触发render()方法,所以在componentWillReceiveProps方法里调用setState()方法去改变一个状态的值,就可以避免一次render().

componentWillUpdate(object nextProps, object nextState) 在初始渲染调用render()方法时不会被调用，当接收到新的props及state时，在render()方法之前被调用。

componentDidUpdate(object prevProps, object prevState) 在初始渲染调用render()方法时不会被调用，当组件更新被刷新到DOM之后被立即调用。

##### Unmounting销毁阶段

componentWillUnmount() 在组件从DOM上卸载前被调用，在这个方法里面，我们主要是完成一些清除操作，比如说清除掉一些过时了的定时器等。

```js
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
        // console.log('父组件是否需要更新');
        // if (newState.num < 4) return true;
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
        return true;
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
```

首先执行的是:

1.父组件挂载之前->子组件挂载之前

2.子组件挂载完->父组件挂载完

3.父组件是否需要更新(true)->父组件将要更新->接收到state变化->子组件是否需要更新(true)->子组件将要更新->子组件更新完->父组件更新完成

4.父组件是否需要更新(false)->下面的将不会进行

5.父组件是否需要更新(true)->父组件将要更新->接收到state变化->子组件是否需要更新(false)->父组件更新完成(页面不会有变化)




