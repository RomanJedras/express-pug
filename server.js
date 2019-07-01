
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();



app.set('view engine', 'pug');
app.set('views','./views');

app.use(morgan('dev'));
app.use(bodyParser.json());

const googleLogin = (req,res) => {
  res.render('login',{
     title: "Google login",
     h1:{
       content: "Sign in with your Google Account"
     },
     action: "http://localhost:3000/auth/logged",
     method: "GET",
     user:{ firstName: 'first_name', lastName: 'last_name' },
     type: "text"
  
   });
}

const googleLoged = (req, res) => {
  res.render('logged', {
    user: {first_name: req.query.first_name, last_name: req.query.last_name}
  })
};

const googleRoute = express.Router();
const googleRouteLogged = express.Router();

googleRoute.route('/').get(googleLogin);
googleRouteLogged.route('/').get(googleLoged);

app.use('/auth/login',googleRoute);
app.use('/auth/logged',googleRouteLogged);





app.listen(3000);
app.use(function (req, res, next) {
  res.status(404).send('Wybacz, nie mogliśmy odnaleźć tego, czego żądasz!')
});




