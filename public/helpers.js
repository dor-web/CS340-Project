module.exports = {
    bar: function(){
        console.log("BAR!");
    },
    dbg: function () {
        console.log('------------');
        console.log(this);
        console.log('------------');
    }
}