const users = require('../model/users');
var express = require('express');
var router = express.Router();

function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else res.redirect('/login')
}


/* GET users listing. */
router.get('/', function (req, res) {
  if (req.session.role === "admin"){
    let page = '<h3>ADMIN PANEL</h3>' +
    'User list <br>' +
    '<script>'+
    'function make_pass_request(name){fetch(name)    .then((response) => {      return response.json();    })    .then((data) => {      alert(\"user password:\"+data);    });}' +
    '</script>'
 
    for (user in users){
      page += "---------------------";
      page += "<br>Username: " + users[user].name ;
      page += "<br>Email: " + users[user].mail ;
      page += "<br>Role: " + users[user].role ;
      page += "<br>Password: <span onclick='if(confirm(\"Are you sure want to read the password\")) (make_pass_request(\""+ users[user].name + "\"))'>********</span>";
      page += "<br>"
    }
    page += "---------------------";
    page += ('<br><a href="/admin">Get back to admin panel</a><br>' +
    '<br><a href="/logout">Logout</a>')

    res.send(page);
  }else{
    res.status(403).send("Access Denied!<br><a href=\"/\">HOME</a>")
  }
})

router.get('/:name?',isAuthenticated, function userIdHandler (req, res) {
  console.log(req)
  res.json(users.find((user) => user.name === req.params.name).password)
})

module.exports = router;
