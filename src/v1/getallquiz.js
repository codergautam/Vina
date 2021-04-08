const db = require('pouchdb')
const quizzes = new db('quizzes')

module.exports = {
  name: "getallquiz",
  get(req, res) {
   getallquiz()
   .then((data) => {
     res.end(JSON.stringify(data))
   })

  },
  func: getallquiz
}

function getallquiz() {
  return new Promise((resolve, reject) => {
   quizzes.allDocs({
      include_docs: true
    })
    .then((docs) => {
  
      var docres = {}
      for (row in docs.rows) {
        var thevalue = docs.rows[row].doc
        delete thevalue._rev
        delete thevalue.questions
        docres[docs.rows[row].id] =  thevalue
      }
     resolve(docres)
    })
  })

}