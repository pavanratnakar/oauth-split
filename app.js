var qs = require('querystring'),
    passport = require('passport'),
    express = require('express'),
    session = require("express-session"),
    request = require("request")
    OAuthStrategy = require('passport-oauth').OAuthStrategy,
    app = express();

passport.use(new OAuthStrategy({
        userAuthorizationURL: 'https://secure.splitwise.com/authorize',
        accessTokenURL: 'https://secure.splitwise.com/api/v3.0/get_access_token',
        consumerKey: 'gn7nzMyWMiFdgm0wOQBccEWC82USPanPQwUew2nw',
        consumerSecret: 'U7I3aFKwLx1MMcBCeircOUWIo7lubdX0qyMKw5IQ',
        callbackURL: "http://localhost:3000/callback",
        requestTokenURL: 'https://secure.splitwise.com/api/v3.0/get_request_token'
    },
    function (accessToken, refreshToken, profile, done) {
        done(null, {
            consumer_key: 'gn7nzMyWMiFdgm0wOQBccEWC82USPanPQwUew2nw',
            consumer_secret: 'U7I3aFKwLx1MMcBCeircOUWIo7lubdX0qyMKw5IQ',
            token: accessToken,
            token_secret: refreshToken
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth', passport.authenticate('oauth'));

app.get('/callback', passport.authenticate('oauth', { failureRedirect: '/failure' }), function(req, res, body) {
    // Successful authentication, redirect home.
    res.redirect('/report');
});

app.get('/report', function (req, res, body) {
    request.get({url:'https://secure.splitwise.com/api/v3.0/get_expenses', oauth: req.user}, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error(err);
        }
        res.end(body);
    });
});

app.listen(3000);

console.log('Express server started on port 3000');