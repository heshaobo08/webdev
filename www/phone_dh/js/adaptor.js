/**
 * Created by My on 2016/9/27.
 */
(function(window){
    /*根据屏幕宽度动态的改变html的font-size大小*/
    var winW = document.documentElement.clientWidth||document.body.clientWidth;
    /*winW/10+"px"不管屏幕多大，都等分为10分*/
    document.documentElement.style.fontSize = winW/10+"px";
    window.onresize = function(){
        var winW = document.documentElement.clientWidth||document.body.clientWidth;
        document.documentElement.style.fontSize = winW/10+"px";
    }
})(window);

