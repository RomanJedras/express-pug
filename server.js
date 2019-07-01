
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const config = require('./config');


let googleProfile = {};


passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret:config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    googleProfile = {
      id: profile.id,
      emails:profile.emails[0].value,
      displayName: profile.displayName
    };
    cb(null, profile);
  }
));



const app = express();

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.set('view engine', 'pug');
app.set('views','./views');
app.use(passport.initialize());
app.use(passport.session());



app.use(morgan('dev'));
app.use(bodyParser.json());

//app routes
app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/logged', function(req, res){
  res.render('logged', { user: googleProfile });
});

//Passport routes
app.get('/auth/google',
  passport.authenticate('google', {
    scope : ['profile', 'email']
  }));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect : '/logged',
    failureRedirect: '/'
  }));


app.listen(3000);
app.use(function (req, res, next) {
  res.status(404).send('Wybacz, nie mogliśmy odnaleźć tego, czego żądasz!')
});




