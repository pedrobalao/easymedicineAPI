const firebaseAuth = require('./firebase')

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ msg: 'Invalid token' })
    }

    const token = req.headers.authorization.replace(/Bearer /i, '')

    firebaseAuth(token).then((decodedToken) => {
        req.body.userid = decodedToken.uid
        next()
    }).catch((_error) => {
        res.status(401).send({ msg: 'Invalid token' })
    });
}
