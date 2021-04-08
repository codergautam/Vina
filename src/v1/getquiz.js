const quick = require('quick.db')
const games = new quick.table("games")
module.exports = {
  name: "getquiz",
  get(req, res) {
   getquiz(req.query.joincode)
   .then((data) => {
     res.end(JSON.stringify(data))
   })

  },
  func: getquiz
}

function getquiz(code) {
  return new Promise((resolve, reject) => {
    if(code) {
   var data= games.get(code)

   if(data) {
     resolve({
       success: true,
       data: data
     })
   } else {
          resolve({
       success: false,
       errmsg: "Invalid joincode"
     })
   }
   
    } else {
      resolve({
        success: false,
        errmsg: "No joincode specified"
      })
    }

  })

}