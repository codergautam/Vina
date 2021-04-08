const db = require('pouchdb')
const quizzes = new db('quizzes')
const quick = require("quick.db")
const users = new quick.table("users")
const games = new quick.table("games")
const gameuser = new quick.table("gameuser")
const uuid = require("uuid")
module.exports = {
  name: "host",
  post(req, res) {
    quizzes.get(req.body.quiz)
    .then((doc) => {
      var result = {
      }
      var joincode = Math.floor(100000 + Math.random() * 900000)
      var authorization = uuid.v4()
      users.set(authorization, {
        code: joincode,
        type: "host"
      })
      games.set(joincode.toString(), {
        quiz: doc.details.name,
        state: "waiting for host",
        statecode: 0
        //maybe more details here, like hoster, idk
      })
      gameuser.set(joincode.toString(), {})
      result.success = true
      result.quizdata = doc.details
      result.gamedata = {
        joincode: joincode,
        authorization: authorization
      }
      res.end(JSON.stringify(result))
    })
    .catch((e) => {
      console.log(e)
res.end(JSON.stringify({
success: false,
errmsg: "Invalid Quiz Specified, "+req.body.quiz
}))
    })
  }
}

