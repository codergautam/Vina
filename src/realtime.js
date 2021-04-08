const db = require('pouchdb')
const auth = require("./v1/getauth")
const getquiz = require("./v1/getquiz")
var stuff = {}
const quick = require("quick.db")
const gameuser = new quick.table("gameuser")
const games = new quick.table("games")
const quizzes = new db('quizzes')
module.exports = (io) => {

    io.on("connection", (socket) => {


        socket.on("login", (data) => {
            //data = {
            // authorization: "",
            // type="host",
            // code=696969
            //}
            if (data.authorization && data.code && data.type) {
                auth.func(data.authorization)
                    .then((a) => {
                        if (a.success) {
                            if (a.data.type == data.type) {
                                if (a.data.code == data.code) {
                                    stuff[socket.id] = data
                                    stuff[socket.id].id = socket.id
                                    getquiz.func(data.code)
                                        .then((quizdata) => {




                                            if (quizdata.success) {
                                                if (data.type == "host") {
                                                    if (quizdata.data.statecode == 0) {
                                                        games.set(data.code.toString() + "." + "statecode", 1)
                                                        games.set(data.code.toString() + "." + "state", "waiting for players")
                                                    }
                                                }
                                            } else {
                                                socket.emit("login", quizdata)
                                                return
                                            }




                                            if (!gameuser.has((data.code).toString() + "." + data.authorization)) {
                                                gameuser.set((data.code).toString() + "." + data.authorization, {
                                                    socket: socket.id,
                                                    connected: true,
                                                    score: 0,
                                                    question: 1,
                                                    name: a.data.name,
                                                    type: data.type
                                                })
                                            } else {
                                                //probably reconnect
                                                gameuser.set((data.code).toString() + "." + data.authorization + ".socket", socket.id)

                                                gameuser.set((data.code).toString() + "." + data.authorization + ".connected", true)

                                            }
                                            socket.join(data.code)
                                            socket.emit("login", {
                                                success: true,
                                                data: quizdata.data
                                            })
                                        })

                                } else {
                                    socket.emit("login", {
                                        success: false,
                                        errmsg: "You don't have required permission"
                                    })
                                }

                            } else {
                                socket.emit("login", {
                                    success: false,
                                    errmsg: "You don't have required permission"
                                })
                            }
                        } else {
                            socket.emit("login", {
                                success: false,
                                errmsg: "Invalid authorization"
                            })
                        }
                    })
            } else {
                socket.emit("login", {
                    success: false,
                    errmsg: "Invalid data"
                })
            }

        })

        socket.on("users", () => {

            if (check(socket.id)) {
                var obj = gameuser.get((stuff[socket.id].code).toString())

                socket.emit("users", {
                    success: true,
                    data: Object.values(obj)
                })



            } else {
                socket.emit("users", {
                    success: false,
                    errmsg: "Socket not logged in"
                })
            }

        })

        socket.on("getCurrentQuestion", () => {
            if (check(socket.id) && gameuser.has(stuff[socket.id].code.toString())) {
                var gameuser = gameuser.has(stuff[socket.id].code.toString())


            } else {
                console.log("Err")
            }
        })

        socket.on("disconnect", () => {
            if (check(socket.id)) {
                gameuser.set((stuff[socket.id].code).toString() + "." + stuff[socket.id].authorization + ".connected", false)
            }

        })

        socket.on("state", () => {
            if (check(socket.id)) {
                getstate(stuff[socket.id].code)
                    .then((state) => {
                        socket.emit("state", state)
                    })



            } else {
                socket.emit("state", {
                    success: false,
                    errmsg: "Socket not logged in"
                })
            }
        })

        socket.on("startgame", () => {
            if (checkperms(socket.id, "host").success) {
                getstate(stuff[socket.id].code)
                    .then((state) => {
                        if (state.success) {
                            if (state.data.statecode == 1) {
                                console.log(io.sockets.adapter.rooms.get(stuff[socket.id].code.toString()))

                                if (io.sockets.adapter.rooms.get(stuff[socket.id].code.toString()).size > 1) {
                                    games.set(stuff[socket.id].code.toString() + "." + "statecode", 2)
                                    games.set(stuff[socket.id].code.toString() + "." + "state", "playing game")
                                }

                            }
                        }
                    })
            }
        })

        socket.on("getquestion", () => {

        })
    })
}


function checkperms(id, type) {
    if (stuff.hasOwnProperty(id)) {
        if (stuff[id].type == type) {
            return {
                success: true,
            }
        } else {
            return {
                success: false,
                errmsg: "Invalid perms"
            }
        }

    } else {
        return {
            success: false,
            errmsg: "Not logged in"
        }
    }
}

function check(id) {
    return stuff.hasOwnProperty(id)
}

function getstate(code) {
    return new Promise((resolve, reject) => {
        if (games.has(code)) {
            var data = games.get(code)
            resolve({
                success: true,
                data: {
                    state: data.state,
                    statecode: data.statecode
                }
            })
        } else {
            resolve({
                success: false,
                errmsg: "Invalid code"
            })
        }
    })
}