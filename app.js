var qs = require('querystring'),
    passport = require('passport'),
    express = require('express'),
    session = require("express-session"),
    request = require("request")
    OAuthStrategy = require('passport-oauth').OAuthStrategy,
    app = express(),
    aToken = null;

passport.use(new OAuthStrategy({
        userAuthorizationURL: 'https://secure.splitwise.com/authorize',
        accessTokenURL: 'https://secure.splitwise.com/api/v3.0/get_access_token',
        consumerKey: 'gn7nzMyWMiFdgm0wOQBccEWC82USPanPQwUew2nw',
        consumerSecret: 'U7I3aFKwLx1MMcBCeircOUWIo7lubdX0qyMKw5IQ',
        callbackURL: "http://localhost:3000/callback",
        requestTokenURL: 'https://secure.splitwise.com/api/v3.0/get_request_token'
    },
    function (accessToken, refreshToken, profile, done) {
        request.get({url:'https://secure.splitwise.com/api/v3.0/get_expenses?accessToken=' + accessToken}, function optionalCallback(err, httpResponse, body) {
            if (err) {
                return console.error('upload failed:', err);
            }
            console.log(body);
        });
        aToken = accessToken;
        done(null, {
            username: 'pavan'
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
    console.log(body);
    // Successful authentication, redirect home.
    res.redirect('/success');
});

app.get('/success', function (req, res, body) {
    // perm_data = qs.parse(body)
    // var oauth = {
    //     consumer_key: 'gn7nzMyWMiFdgm0wOQBccEWC82USPanPQwUew2nw',
    //     consumer_secret: 'U7I3aFKwLx1MMcBCeircOUWIo7lubdX0qyMKw5IQ',
    //     token: aToken,
    //     token_secret: 'U7I3aFKwLx1MMcBCeircOUWIo7lubdX0qyMKw5IQ'
    // };
    res.send('Hello World');
});

app.listen(3000);

console.log('Express server started on port 3000');