var uid = 0;
/**
 * [Dep 依赖类]
 */
function Dep() {
    // dep id
    this.id = uid++;
    // array 存储Watcher
    this.subs = [];
}
Dep.target = null;
Dep.prototype = {
    /**
     * [addSub 添加订阅者]
     * @param {[type]} sub [订阅者]
     */
    addSub: function (sub) {
        this.subs.push(sub);
    },
    /**
     * [removeSub 移除订阅者]
     * @param  {[type]} sub [订阅者]
     */
    removeSub: function (sub) {
        let index = this.subs.indexOf(sub);
        if(index !== -1){
            this.subs.splice(index, 1);
        }
    },
    // 通知数据变更
    notify: function() {
        this.subs.forEach(sub => {
            // 执行sub的update更新函数
            sub.update();
        });
    },
    // add Watcher
    depend: function () {
        Dep.target.addDep(this);
    }
}