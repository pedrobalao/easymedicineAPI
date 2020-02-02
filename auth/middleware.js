var firebaseAuth = require('./firebase')

module.exports = function (req, res, next) {
    if (req.headers.authorization === undefined) {
        return res.status(401).send({msg: 'Invalid token'})
    }
    let token = req.headers.authorization.replace(/Bearer /i, '')
    firebaseAuth(token).then((decodedToken) => {
        req.body.userid = decodedToken.uid
        next()
    }).catch(function(error) {
        res.status(401).send({msg: 'Invalid token'})
    });
}