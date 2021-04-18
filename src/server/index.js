const express = require('express');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
var csrf = require('csurf');
const os = require('os');
var compression = require('compression');
var morgan = require('morgan');
var flash = require('connect-flash');

var passport = require('./middleware/auth');

const isProduction = (process.env.NODE_ENV === 'production');
const app = express();

app.use(morgan('dev'));

if (isProduction) {
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "public-api.freshstatus.io"],
      "script-src": [
        "'self'", "blob:",
        "cdn.polyfill.io",
        "*.mxpnl.com",
        "*.mixpanel.com",
      ]
    }
  }));
}

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: {
    secure: true,
    httpOnly: true
  }
}));

app.use(flash());
app.use(compression());
app.enable('trust proxy');

// force HTTPS
app.use(function(request, response, next) {
  if (isProduction && !request.secure) {
    return response.redirect(
      "https://" + request.headers.host + request.url
    );
  }

  next();
});

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

// Bodyparser middleware, extended false does not allow nested payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
});

app.get('/login', function(req, res, next) {
  res.render('pages/login', { messages: req.flash('error') });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: 'Invalid access credentials'
}));

app.use(function(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.status(401).send({ error: "not authenticated" });
  }
});

app.use(express.static('dist'));
app.use(express.static('public'));

app.use(function (req, res, next) {
  res.status(404).send({ error: "not found" });
})

app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send({ error: 'crash - (X_X)' })
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening on port ${process.env.PORT || 5000}!`);
});

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    debug('HTTP server closed')
  })
})
