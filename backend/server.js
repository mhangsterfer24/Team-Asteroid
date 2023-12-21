const bodyParser=require('body-parser');
const cors=require('cors');
const express = require('express');
const app = express();
const path =  require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
// var corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

const _dirname = path.dirname("")
const buildPath = path.join(_dirname  , "../client/build");

app.use(express.static(buildPath))

app.get("/*", function(req, res){

    res.sendFile(
        path.join(__dirname, "../client/build/index.html"),
        function (err) {
          if (err) {
            res.status(500).send(err);
          }
        }
      );

})

var mysql = require('mysql');
 
// create a connection variable with the required details
var con = mysql.createConnection({
  host: "host", // ip address of server running mysql
  user: "user", // user name to your mysql database
  password: "password", // corresponding password
  database: "database" // use the specified database
});

 
// make to connection to the database.
con.connect(function(err) {
  if (err) throw err;
  // if connection is successful
 console.log('connection successful');
});



app.post('/api/:zipcode', (req,res) => {
  res.set('Access-Control-Allow-Origin', '*');
  //SELECT latitude, longitude, street_address, city, state, zip, country FROM evloco.CarData;
  
  con.query("Select latitude, longitude, street_address, city, state, zip, country from evloco.CarData where zip= "+req.params.zipcode+" ;",
    [req.params.Zipcode],  function(err,dbRes){
      if(err){
        console.log(err);
        throw(err);
      }
      res.send(dbRes);
    });
})

app.listen(3001,()=>{
  console.log("Port 3001");
})