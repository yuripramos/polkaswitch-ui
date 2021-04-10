const express = require('express');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
var csrf = require('csurf');
const os = require('os');
var compression = require('compression');
const basicAuth = require('express-basic-auth');

const isProduction = (process.env.NODE_ENV === 'production');
const app = express();

if (isProduction) {
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "image-src": ["'self'", "polkaswitch.freshstatus.com"],
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

app.use(compression());
app.use(csrf());
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

app.use(basicAuth({
  users: {
    'alphabuild': 'access2021'
  },
  challenge: true
}))

app.use(express.static('dist'));
app.use(express.static('public'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));

app.use(function (req, res, next) {
  res.status(404).send({ error: "not found" });
})

app.use(function(err, req, res, next) {
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
