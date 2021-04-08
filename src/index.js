const fs = require('fs')
    //api handler but for express
const collection = require('@discordjs/collection')
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const ejs = require("ejs")
var bodyParser = require('body-parser')
app.use(bodyParser())
app.use("/client", express.static("client"))
app.use(bodyParser.json())
app.set('view engine', "ejs")

const apiFiles = fs.readdirSync('../src/v1').filter(file => file.endsWith('.js'));
const api = new collection()
const realtime = require("./realtime")
for (const file of apiFiles) {
    const command = require(`./v1/${file}`);
    api.set(command.name, command);
}



app.get('/', (req, res) => {
    res.render("index")
});

app.get('/create', (req, res) => {
    res.render("create")
});
app.get("/play", (req, res) => {

    var auth = req.cookies.authorization
    var code = req.cookies.code
    api.get("getauth").func(auth)
        .then((data) => {
            if (data.success) {
                api.get("getquiz").func(code)
                    .then((datat) => {
                        if (datat.success) {
                            res.clearCookie("authorization")
                            res.clearCookie("code")
                            res.render("play", { cookie: true, hostdata: data.data, quizdata: datat.data, auth: auth })
                        } else {

                            res.render("play", { cookie: false })
                        }
                    })
            } else {
                res.render("play", { cookie: false })
            }
        })

})
app.get("/host/dashboard", (req, res) => {

    var auth = req.cookies.authorization
    var code = req.cookies.code
    api.get("getauth").func(auth)
        .then((data) => {
            if (data.success) {
                api.get("getquiz").func(code)
                    .then((datat) => {
                        if (datat.success) {
                            res.clearCookie("authorization")
                            res.clearCookie("code")
                            res.render("hostdashboard", { cookie: true, hostdata: data.data, quizdata: datat.data, auth: auth })
                        } else {

                            res.render("hostdashboard", { cookie: false })
                        }
                    })
            } else {
                res.render("hostdashboard", { cookie: false })
            }
        })

})
app.get('/host', (req, res) => {
    api.get("getallquiz").func()
        .then((data) => {
            res.render("host", { data: data })
        })

});
app.get('/join', (req, res) => {
    res.render("join")
});





//API


app.get('/api/:command', (req, res) => {
    res.redirect("/api/v1/" + req.params.command)

});
app.get('/api/v1/:command', (req, res) => {
    if (api.get(req.params.command)) {
        if (api.get(req.params.command).hasOwnProperty("get")) {
            api.get(req.params.command).get(req, res)
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }

});
app.post('/api/v1/:command', (req, res) => {
    if (api.get(req.params.command)) {
        if (api.get(req.params.command).hasOwnProperty("post")) {
            api.get(req.params.command).post(req, res)
        } else {
            res.sendStatus(404);
        }

    } else {
        res.sendStatus(404);
    }

});
http.listen(3000, () => {
    console.log('server started');

    realtime(io)
});