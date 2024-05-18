const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

// issue a token
exports.issueToken = (data, duration) => {
  const token = jwt.sign(data, process.env.secretKey, {expiresIn: duration})
  return token
}

// verify a token
exports.verifyToken = (token) => {
  const verified = jwt.verify(token, process.env.secretKey)
  if(verified) return verified
  return null
}

// hash password
exports.hashPass = async (pass) => {
  try {
    const hash = await argon2.hash(pass);
    return hash
  } catch (error) {
    return null
  }
}

// verify hash password
exports.verifyPass = async (hashedPass, pass) => {
  try {
    const hash = await argon2.verify(hashedPass, pass)
    return hash
  } catch (error) {
    return null
  }
}

// cookie maker
exports.cookieMaker = (data) => {
  let cookieOption = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true
  }

  return { token: issueToken(data, "1d"), cookieOption }
}