var firebaseAuth = require('./firebase')
var mobileAuth = require('./mobile')

module.exports = function (req, res, next) {
    if (mobileAuth.isMobileApplication(req)) return next()
    if (req.headers.authorization === undefined) {
        return res.status(401).send({msg: 'Invalid token'})
    }
    let token = req.headers.authorization.replace(/Bearer /i, '')
    firebaseAuth(token).then((decodedToken) => {
        next()
    }).catch(function(error) {
        res.status(401).send({msg: 'Invalid token'})
    });
}