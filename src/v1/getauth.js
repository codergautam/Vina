const quick = require('quick.db')
const users = new quick.table("users")
module.exports = {
  name: "getauth",
  get(req, res) {
   getauth(req.query.auth)
   .then((data) => {
     res.end(JSON.stringify(data))
   })

  },
  func: getauth
}

function getauth(auth) {
  return new Promise((resolve, reject) => {
    if(auth) {
   var data= users.get(auth)
   if(data) {
     resolve({
       success: true,
       data: data
     })
   } else {
          resolve({
       success: false,
       errmsg: "Invalid auth"
     })
   }
   
    } else {
      resolve({
        success: false,
        errmsg: "No auth specified"
      })
    }

  })

}