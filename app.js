//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});
const Schema = mongoose.Schema;
userSchema = new Schema({email:String, password:String});

const secret = "Thisisoutlittlesecret.";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model('User', userSchema);


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res)=>{
  res.render('home');
});

app.get('/login', (req, res)=>{
  res.render('login');
});
app.get('/register', (req, res)=>{
  res.render('register');
});
app.get('/secrets', (req, res)=>{
  res.render('secrets');
});

app.post('/register', (req, res)=>{

  let username = req.body.username;
  let password = req.body.password;

  const user = new User({
    email: username,
    password:password
  });
  user.save();
  res.render('secrets');
});

app.post('/login', (req, res)=>{
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({email:username}, (err, result)=>{
    if(!err){
      if(!result){
        console.log("no match");
        res.render('/');
      }else{
        if( result.email === username && result.password === password){
          res.redirect('/secrets');
        }
      }
    }else{
      console.log(err);
    }
  });
});

app.listen(3000, ()=>{console.log("Server initiated @3000");});
