var express = require('express');
const app = express();
const port = 7610;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
//const mongourl = "mongodb://localhost:27017"
const mongourl = "mongodb+srv://snehal10:test1234@cluster0.rtae2.mongodb.net/edumato?retryWrites=true&w=majority"
let db;
//let col_name = "location"
//get
app.get('/', (req, res) => {
    res.send("Welcome to node api2")
})
//List All cities
app.get('/location',(req,res) =>{
    db.collection("locations").find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result);
    })
})
//List all restaurants
app.get('/restaurants',(req,res) =>{
    db.collection("restaurants").find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurant',(req,res) =>{
    var query = {}
    if(req.query.cityId){
        query={city:req.query.cityId}
    }else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    db.collection('restaurants').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//filterapi
app.get('/filter/:mealType',(req,res) => {
    var mealType = req.params.mealType;
    var query = {"type.mealtype":mealType};
    if(req.query.cuisine && req.query.lcost && req.query.hcost){
        query={
            $and:[{cost:{$gt:Number(req.query.lcost),$lt:Number(req.query.hcost)}}],
            "Cuisine.cuisine":req.query.cuisine,
            "type.mealtype":mealType
        }
    }
    else if(req.query.cuisine){
        query = {"type.mealtype":mealType,"Cuisine.cuisine":req.query.cuisine }
       //query = {"type.mealtype":mealType,"Cuisine.cuisine":{$in:["1","5"]}}
    }
    else if(req.query.lcost && req.query.hcost){
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"type.mealtype":mealType}
    }
    db.collection('restaurants').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//List all QuickSearches
app.get('/quicksearch',(req,res) =>{
    db.collection('mealtypes').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

MongoClient.connect(mongourl, (err,client) => {
    if(err) console.log("Error While Connecting");
    db = client.db('edumato');
    app.listen(port,()=>{
        console.log(`listening on port no ${port}`)
    });
})