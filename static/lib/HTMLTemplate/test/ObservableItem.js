// TODO: import library

var l = new ObservableList();
l.listen(function (e) {
    console.log(l.internalArray);
    console.log(e);
});
var o = new ObservableObject({
    name: "Mitsuha",
    say: function () {
        console.debug(this.name);
    }
});
l.add(o);
l[0].say();
l[0].name = "Taki";
l[0].say();