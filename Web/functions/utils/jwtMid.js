//Defines the JWT middleware functions used by express

const jwt = require('jsonwebtoken');

module.exports = {
    authenticateToken: function (req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401) //no token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403) //token incorrect, send 403
  
      req.user = user
  
      next()
    })
  }
}
    