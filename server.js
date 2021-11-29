var path = require("path")
var express = require("express")
var hbs = require('express-handlebars');
var app = express()
const PORT = process.env.PORT || 3000;

let objInMemory = {}


const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'auta.db',
    autoload: true
});



app.get("/", function (req, res) {
    coll1.find({}, function (err, docs) {
        docs = { "docsy": docs }
        res.render('view1.hbs', docs);
    });
})


app.get("/auto", function (req, res) {

    let ube = req.query.chbxa;
    let ben = req.query.chbxb;
    let usz = req.query.chbxc;
    let nap = req.query.chbxd;



    let obj = {
        ubezpieczony: req.query.chbxa == 'on' ? "TAK" : "NIE",
        benzyna: req.query.chbxb == 'on' ? "TAK" : "NIE",
        uszkodzony: req.query.chbxc == 'on' ? "TAK" : "NIE",
        naped: req.query.chbxd == 'on' ? "TAK" : "NIE",
    }

    coll1.insert(obj, function (err, newDoc) {
        //console.log(newDoc)
    });


    // coll1.find({}, function (err, docs) {
    //     docs = { "docsy": docs }
    //     res.render('view1.hbs', docs);
    // });

    res.redirect("/")


})

app.get("/editcars", function (req, res) {
    let idobj = req.query.edit


    coll1.findOne({ _id: idobj }, function (err, doc) {

        objInMemory = doc
    });

    let obj = {
        ubezpieczony: `<select name="sel1"><option>TAK</option><option>NIE</option><option>BRAK DANYCH</option></select>`,
        benzyna: `<select name="sel2"><option>TAK</option><option>NIE</option><option>BRAK DANYCH</option></select>`,
        uszkodzony: `<select name="sel3"><option>TAK</option><option>NIE</option><option>BRAK DANYCH</option></select>`,
        naped: `<select name="sel4"><option>TAK</option><option>NIE</option><option>BRAK DANYCH</option></select>`,
    }
    coll1.update({ _id: idobj }, { $set: obj }, {}, function (err, numUpdated) { });
    coll1.find({}, function (err, docs) {
        docs = { "docsy": docs }
        res.render('view2.hbs', docs);
    });

})

app.get("/edited", function (req, res) {
    let idobj = req.query.edit
    let one = req.query.sel1;
    let two = req.query.sel2;
    let three = req.query.sel3;
    let four = req.query.sel4;

    let obj = {
        ubezpieczony: one,
        benzyna: two,
        uszkodzony: three,
        naped: four,
    }

    coll1.update({ _id: idobj }, { $set: obj }, {}, function (err, numUpdated) { });
    coll1.find({}, function (err, docs) {
        docs = { "docsy": docs }
        res.render('view1.hbs', docs);
    });
})

app.get("/deletecars", function (req, res) {
    let idobj = req.query.delete;
    coll1.remove({ _id: idobj }, {}, function (err, numRemoved) {
    });
    coll1.find({}, function (err, docs) {
        docs = { "docsy": docs }
        res.render('view1.hbs', docs);
    });
})

app.get("/canceled", function (req, res) {
    let idobj = req.query.cancel

    let obj = objInMemory

    coll1.update({ _id: idobj }, { $set: obj }, {}, function (err, numUpdated) { });
    coll1.find({}, function (err, docs) {
        docs = { "docsy": docs }
        res.render('view1.hbs', docs);
    });

})

app.use(express.static('static'))

app.set('views', path.join(__dirname, 'views'));         // ustalamy katalog views
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));   // domyślny layout, potem można go zmienić
app.set('view engine', 'hbs');

app.listen(PORT, function () {
    console.log("start serwera na  porcie " + PORT)
})