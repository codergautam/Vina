var socket = io()
var authorization = sessionStorage.getItem("authorization")
var code = sessionStorage.getItem("code")
document.getElementById('gameCode').innerHTML = "Game Code: " + code
socket.emit("login", {
    authorization: authorization,
    code: code,
    type: "host"
})
var loggedin = false
socket.on("login", (data) => {
    console.log(data)
    if (data.success) {
        loggedin = true
        if (data.data) {
            document.getElementById("getGameName").innerHTML = "Hosting Game: " + data.data.quiz
        }
    } else {
        errorQuit(data.errmsg)
    }
})

setInterval(() => {
    refreshState(loggedin)
}, 100)

function refreshState(log) {

    if (log) {
        socket.emit("state")
        socket.emit("users")
    }
}

socket.on("state", (d) => {
    if (d.success) {
        if (d.data.statecode == 1) {
            if (setStateOnDif(state, "waiting")) {
                state = "waiting"
            }

        } else if (d.data.statecode == 2) {
            if (setStateOnDif(state, "playing")) {
                state = "playing"
            }

        } else {
            errorQuit("Unexpected game state, " + d.data.state)
        }
    } else {
        errorQuit(d.errmsg)
    }
})
socket.on("users", (d) => {
    console.log(d)
    dta = ""
    if (d.success) {
        playercount = d.data.length - 1
        d.data.forEach(element => {
            if (element.type != "host") {
                dta += `${element.name}${element.connected ? "": "(disconnected)"}<br>`
            }
        })
        document.getElementById("players").innerHTML = dta
        if (playercount > 0) {
            document.getElementById("startbtn").disabled = false
        } else {
            document.getElementById("startbtn").disabled = true
        }
    }
})

$(document).ready(function() {
    $('#startbtn').click(function() {
        socket.emit("startgame")
    });
});