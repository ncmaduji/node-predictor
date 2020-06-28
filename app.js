const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const faker = require('faker');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');


const { generateEnrollmentData } = require('./data.js');
const {getPerson} = require('./utilities')

console.log(generateEnrollmentData());


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.use(session({
  secret: 'predictor app',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost/predictorDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  password: String,
  username: String,
})

const enrollmentSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    highSchoolGPA:Number,
    gender:String,
    logisticsStatus: String,
    financialAid: Boolean,
    club: Boolean,
    sportTeam: Boolean,
    prediction: Number
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);
  
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// const data = generateEnrollmentData();
// Enrollment.insertMany(data, function(error, docs) {
//     if(error){
//         console.log(error);
//     } else {
//         console.log(docs);
//     }
// });

app.get('/enrollments', function(req, res){
  if(req.isAuthenticated()){
    Enrollment.find({}, function(err, enrollments){
      if(!err) res.render('index', {
        enrollments: enrollments,
        user: req.user
      });
      else res.send(err);
    })
  } else {
    res.redirect('/login');
  }
    
})


app.get('/enrollments/:id', function(req, res){
  if(req.isAuthenticated()){
    Enrollment.findById(req.params.id, function(err, enrollment){
      if(err){
        console.log(err);
      } else res.render('update', {enrollment});
    })
  }
  
})

app.get('/create', function(req, res) {
  res.render('create');
})

app.post('/enrollments/:id/edit',  async function(req, res){
  if(req.isAuthenticated()){
    const filter = {_id: req.params.id};
  
    const update = { ...getPerson(req.body)};
    try {
      let doc = await Enrollment.findByIdAndUpdate(filter, update, {new: true});
      res.redirect('/enrollments');
    } catch (error) {
      console.log(error);
    }
  }
  
})

app.post('/enrollments/:id/delete', function(req, res){
  if(req.isAuthenticated()){
    Enrollment.deleteOne({ _id: req.params.id }, function (err) {
      if (err) throw(err);
      res.redirect('/enrollments');
    });
  }
  
})

app.post('/enrollments', function(req, res){
  if(req.isAuthenticated()){
    new Enrollment(getPerson(req.body)).save(function(err){
      if(err) console.log(err);
      else res.redirect('/enrollments');
    })
  }
    
  
});

app.post('/register', function(req, res){
  User.register({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  }, req.body.password, function(err, user){
    if(err){
      console.log(err);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, function(){
        res.redirect('/enrollments');
      })
    }
  })
})

app.post('/login', function(req, res){
  req.login(new User({
    username: req.body.userName,
    password: req.body.password
  }), function(err){
    if(err){
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function(){
        res.redirect('/enrollments');
      })
    }
  })
})

app.get('/login', function(req, res){
  res.render('login');
})

app.get('/register', function(req, res){
  res.render('register')
})

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
})



app.listen(4000, function() {
  console.log("Server started on port 4000");
});