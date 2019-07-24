const credentials = {
    client: {
        id: '78ces7rr8idfht',
        secret: 'ar8dMa4NHy5QHrDr'
    },
    auth: {
        tokenHost: 'https://www.linkedin.com/oauth/v2/authorization',
        authorizePath: '/oauth/v2/authorization'
    }
};

const
    express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    path = require('path'),
    router = express.Router(),
    app = express(bodyParser.json()),
    oauth = require('simple-oauth2').create(credentials),
    cors = require('cors'),
    port = 1603;

app.use('/', router);

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.listen(port, (err, req, res) => {
    if (err) return console.log(`Something bad has happen : ${err}`);
    console.log(`Server listening at port ${port}`);
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

router.get('/auth', (req, res)=>{
    const redirectUri = oauth.authorizationCode.authorizeURL({
        response_type:"code",
        redirect_uri: "https://kh-gis-chat-bot.intetics.com/intetics-bot-test/test-page-1.html",
        state: "linkedinAuthState",
        scope: "r_liteprofile r_emailaddress w_member_social"
    });
    res.status(200).json({uri: redirectUri});
});

router.get('/exchange', async (req, res)=>{
    console.log(req.query.code);
    request({
        "uri": 'https://www.linkedin.com/oauth/v2/accessToken',
        "qs": {
                grant_type: "authorization_code",
                code: req.query.code,
                redirect_uri: "https://kh-gis-chat-bot.intetics.com/intetics-bot-test/test-page-1.html",
                client_id: '78ces7rr8idfht',
                client_secret: 'ar8dMa4NHy5QHrDr'
            },
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        "method": "POST"
    }, (err, resp, body) => {
        if (!err) {
            console.log(JSON.parse(body));
            res.json(JSON.parse(body));
        } else {
            console.error("Unable to send message:" + err);
        }
    });
});

router.get('/getUser', async (req, res)=>{
    console.log(req.query);
    request({
        "uri": 'https://api.linkedin.com/v2/me',
        "headers": {
            "Authorization": 'Bearer ' + req.query.access_token,
            "Connection": 'Keep-Alive'
        },
        "method": "GET"
    }, (err, resp, body) => {
        if (!err) {
            console.log(body);
            res.json(JSON.parse(body));
        } else {
            console.error("Unable to send message:" + err);
        }
    });
});

router.get('/getEmail', async (req, res)=>{
    console.log(req.query);
    request({
        "uri": 'https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))',
        "headers": {
            "Authorization": 'Bearer ' + req.query.access_token,
            "Connection": 'Keep-Alive'
        },
        "method": "GET"
    }, (err, resp, body) => {
        if (!err) {
            console.log(body);
            res.json(JSON.parse(body));
        } else {
            console.error("Unable to send message:" + err);
        }
    });
});




