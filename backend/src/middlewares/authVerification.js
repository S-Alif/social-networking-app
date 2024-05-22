const { verifyToken } = require("../utils/helpers")

module.exports = async (req, res, next) => {
  try {
    let token = req.headers['token']
    if (!token) token = req.cookies['token']

    if (token) {
      let decoded = verifyToken(token)
      if (!decoded) {
        return res.status(401).json({ status: 0, code: 401, data: "unauthorized" })
      }
      else {
        req.headers.email = decoded['email']
        req.headers.id = decoded['id']
        req.headers.isAdmin = decoded['isAdmin']
        next()
      }
    }
    else {
      res.status(401).json({ status: 0, code: 401, data: "token not found" })
    }
  } catch (error) {
    res.status(500).json({ status: 0, code: 500, data: "Server error" })
  }
}