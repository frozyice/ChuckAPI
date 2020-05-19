const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/chuckDB', {useNewUrlParser: true, useUnifiedTopology: true});

const factSchema = {
    title: String,
    content: String
};

const Fact = mongoose.model('Fact', factSchema);

app.route('/facts')
.get((req, res) => {
    Fact.find((err,facts) => {
        if(!err){
            console.log(res.send(facts));
        } else {
            console.log(err)
        }
    });
})
.post((req, res) => {
    const fact = new Fact ({
        title: req.body.title,
        content: req.body.content
    });

    fact.save((err) => {
        if (!err){
            res.send("POST /facts success");
        } else {
            res.send(err);
        }
    });
})
.delete((req, res) => {
    Fact.deleteMany((err) => {
        if (!err){
            res.send(("POST /facts success"));
        } else {
            res.send(err);
        }
    })
});

app.route('/facts/:factTitle')
.get((req, res) => {
    Fact.findOne(
        {title: req.param.factTitle},
        (err, fact) => {
            if (!err){
                res.send(fact);
            } else {
                res.send(err);
            }
        });
})
.put((req, res) => {
    Fact.update(
        {title: req.params.factTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err) => {
            if (!err){
                res.send("PUT /facts/factTitle success");
            } else {
                res.send(err);
            }
        }
    );
})
.patch((req, res) => {
    Fact.update(
        {title: req.params.factTitle},
        {$set: req.body},
        (err) => {
            if (!err){
                res.send("PATCH /facts/factTitle success");
            } else {
                res.send(err);
            }
        }
    );
})
.delete((req, res) => {
    Fact.deleteOne(
        {title: req.params.factTitle},
        (err) => {
            if (!err){
                res.send("DELETE /facts/factTitle success");
            } else {
                res.send(err);
            }
        }    
    )
});

app.listen(5000, ()=>{
    console.log("Server is running");
})