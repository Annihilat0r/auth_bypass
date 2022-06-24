var express = require('express');
const users = require('../model/users');
var router = express.Router();

function isAuthenticated (req, res, next) {
  if (req.session.user) next()
  else res.redirect('/login')
}

router.get('/', isAuthenticated, function (req, res) {
  // this is only called when there is an authentication user due to isAuthenticated
  res.send('hello, ' + (req.session.user) + '!<br>' +
    '<a href="/admin">Admin Panel</a><br>' +
    ' <a href="/logout">Logout</a>')
})

router.get('/login', function (req, res) {
  res.send('<form action="/login" method="post">' +
    'Username: <input name="user"><br>' +
    'Password: <input name="pass" type="password"><br>' +
    '<input type="submit" text="Login"></form>')
})

router.post('/login', express.urlencoded({ extended: false }), function (req, res) {

  let user = (users.find((user) => user.name === req.body.user));
  //res.send(user)
  if(user){

    if(user.password === req.body.pass){
    
  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  req.session.regenerate(function (err) {
    if (err) next(err)

    // store user information in session, typically a user id
    req.session.user = req.body.user
    req.session.role = user.role

    // save the session before redirection to ensure page
    // load does not happen before session is saved
    req.session.save(function (err) {
      if (err) return next(err)
      res.redirect('/')
    })
  })
  }else{
  res.send("Wrong username or password <br><a href='/'>login again</a>").end();
    }} else
    res.send("Wrong username or password <br><a href='/'>login again</a>").end();
  }
)

router.get('/logout', function (req, res, next) {
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    req.session.regenerate(function (err) {
      if (err) next(err)
      res.redirect('/')
    })
  })
})

router.get('/admin', isAuthenticated, function (req, res) {
  if (req.session.role === "admin"){
  res.send('<h3>ADMIN PANEL</h3>' +
    '<a href="/users/">User List</a><br>' +
    '<a href="/db_restart">Database Restart</a><br>' +
    '<a href="/cache">Clear Cache</a><br>' +
    '<a href="/uptime">Get server uptime</a><br>' +
    '<br><a href="/logout">Logout</a>')
  }else
  {
    res.status(403).send("Access Denied!<br><a href=\"/\">HOME</a>")
}
})

router.get('/uptime', function (req, res) {
  res.send('<h3>ADMIN PANEL</h3>' +
    'The server works ' + require('os').uptime() + ' miliseconds <br>' +
    '<br><a href="/admin">Get back to admin panel</a><br>' +
    '<br><a href="/logout">Logout</a>')

})

router.get('/db_restart', isAuthenticated, function (req, res) {
  if (req.session.role === "admin"){
  res.send('<h3>ADMIN PANEL</h3>' +
    'Database is restarting... <br>' +
    'Database is up! <br>' +
    '<br><a href="/admin">Get back to admin panel</a><br>' +
    '<br><a href="/logout">Logout</a>')
  }else{
    res.status(403).send("Access Denied!<br><a href=\"/\">HOME</a>")
  }
})


router.get('/cache', isAuthenticated, function (req, res) {
  if (req.session.role === "admin"){
  res.send('<h3>ADMIN PANEL</h3>' +
    'Cache cleared <br>' +
    '<br><a href="/admin">Get back to admin panel</a><br>' +
    '<br><a href="/logout">Logout</a>')
  }else{
    res.status(403).send("Access Denied!<br><a href=\"/\">HOME</a>")
  }
})




module.exports = router;
