define(["c"],function(cFn){
    console.log("这是b模块");
    cFn.show();
    var fn_sort = function(arr){
        for(var i = 0;i<arr.length;i++){
            for(var j=i+1;j<arr.length;j++){
                if(arr[i]==arr[j]){
                    arr.splice(j,1);
                    j--;
                }
            }
        }
        return arr;
    }
    var ct=function(x,y){
         return x+y;
    }
    return{
        fn_sort:fn_sort,
        ct:ct
    }
})