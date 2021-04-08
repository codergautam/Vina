const db = require('pouchdb')
const quizzes = new db('quizzes')
const quick = require("quick.db")
const users = new quick.table("users")
const games = new quick.table("games")
const uuid = require("uuid")
module.exports = {
  name: "join",
  post(req, res) {
    var joincode = req.body.code
    var name = req.body.name
    if (name && /^[\w]+([-_\s]{1}[a-z0-9]+)*$/i.test(name)) {
      if (name.length > 3 && name.length < 30) {
        if(games.has(req.body.code)) {
            var authorization = uuid.v4()

            users.set(authorization, {
              code: joincode,
              type: "player",
              name: name
            })

            res.end(JSON.stringify({
              success: true,
              authorization: authorization
            }))
        } else {
   
            res.end(JSON.stringify({
              success: false,
              errmsg: "Invalid code, " + req.body.code
            }))
        }

      } else {
        res.end(JSON.stringify({
          success: false,
          errmsg: "Name has to be greater than 3 characters and less than 30 characters"
        }))
      }
    } else {
      res.end(JSON.stringify({
        success: false,
        errmsg: "Name can only contain alphanumeric and spaces"
      }))
    }
  }
}

