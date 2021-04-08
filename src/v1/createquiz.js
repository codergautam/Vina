const db = require('pouchdb')
const quizzes = new db('quizzes')

module.exports = {
  name: "createquiz",
  post(req, res) {


    checkifvalidquiz(req.body)
    .then((quizchecked) =>{
      if(quizchecked.success) {
        var quiz = req.body
        quiz._id = quiz.details.name.toLowerCase()
        quiz.details.created = new Date();
        quizzes.get(quiz._id)
        .then(() => {
          res.end(JSON.stringify({
            success: false,
            errmsg: "This quiz name is already taken!"
          }))
        })
        .catch(() => {
          quizzes.put(quiz)
          .then(() => {
          res.end(JSON.stringify({
            success: true
          }))
          })
          .catch((err) => {
                            res.end(JSON.stringify({
            success: false,
            errmsg: err.toString()+".. This is a server-side error, please try again"
          }))
          })

        })
      } else {
res.end(JSON.stringify(quizchecked))
      }
    
    })
    .catch((err) => {
                res.end(JSON.stringify({
            success: false,
            errmsg: err.toString()+".. This is a server-side error, please try again"
          }))
    })
  }
}

function checkifvalidquiz(quiz) {
  return new Promise((resolve,reject) => {
if(typeof quiz.details == "object" && Array.isArray(quiz.questions)) {
if(quiz.details.name && /^[\w]+([-_\s]{1}[a-z0-9]+)*$/i.test(quiz.details.name)) {
if(quiz.details.name.length > 3 && quiz.details.name.length < 40) {
  i=1
  if(quiz.details.numofquestions == quiz.questions.length) {
  
    for (question in quiz.questions) {
    var questionobj = quiz.questions[question]
      if (questionobj.num == i.toString()) {
      var checkq = check(questionobj, "question", "The question cannot be greater than 2000 charcters!", 2000)
     if (checkq.success) {
              checkq = check(questionobj, "right", "The right answer cannot be greater than 200 charcters!", 200)
     if (checkq.success) {
            checkq = check(questionobj, "wrong1", "The wrong1 answer cannot be greater than 200 charcters!", 200)
             if (checkq.success) {
            
            checkq = check(questionobj, "wrong2", "The wrong2 answer cannot be greater than 200 charcters!", 200)
             if (checkq.success) {
            
            checkq = check(questionobj, "wrong3", "The wrong3 answer cannot be greater than 200 charcters!", 200)
             if (checkq.success) {

               resolve(checkq)


                } else {
       resolve(checkq)
     }
                } else {
       resolve(checkq)
     }
                } else {
       resolve(checkq)
     }
     } else {
       resolve(checkq)
     }
     } else {
       resolve(checkq)
     }



    } else {
        resolve( {success: false, errmsg: "Invalid Quiz Num (Likely an error with the client)"})
    }
    i+=1
  }
  } else {
  resolve( {success: false, errmsg: "quiz numofquestions doesnt match given questions. (Likely an error with the client)"})
  }

} else {
  resolve( {success: false, errmsg: "Quiz name has to be greater than 3 characters and less than 40 characters"})
}
} else {
  resolve( {success: false, errmsg: "Quiz name only allows Alphanumeric and Space characters.."})
}
} else {
  resolve( {success: false, errmsg: "Invalid Quiz JSON Format. (This is likely an error with the client)"})
}
  })

}
  

function check(questionobj, property, msg, chars) {
        if(questionobj[property]) {
        if(questionobj[property].length > chars || questionobj.question.length <0) {
                  return {success: false, errmsg: `Question ${questionobj.num}.. ${msg}`}

        } else {

          return {success: true}

        }
      } else {
         if(property == "wrong3" || property == "wrong2" ) {
 return {success: true}
         } else {
  return {success: false, errmsg: `Question ${questionobj.num}.. ${property} cannot be empty!`}
         }
                
      }
}