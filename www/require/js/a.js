define(['b'],function (fn) {
    console.log("这是a模块");
    console.log(fn.fn_sort([2,2,34,5,3,3,2]));
    console.log(fn.ct(5,7));
    var add = function (x,y) {
        return x+y;
    }
    return{
        add:add
    }
})