function setState(state) {
    document.getElementById("connecting").style.display = "none"
    document.getElementById("waiting").style.display = "none"
document.getElementById("playing").style.display = "none"
document.getElementById(state).style.display = ""
}

function errorQuit(err) {

    document.getElementById("connecting").style.display = "none"
    document.getElementById("waiting").style.display = "none"
 document.getElementById("errort").innerHTML = "<strong>Unexpected Error: </strong><br>"+err+"<br><br>Try refreshing the page to reconnect"
    document.getElementById("error").style.display = ""


}
function setStateOnDif(main, val) {
  if(main == val) {
    //no change
    return false
  } else {
    setState(val)
    return true
  }
}