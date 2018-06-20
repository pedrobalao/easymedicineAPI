let mobileAuth = {
    isMobileApplication : function(req) {
        let clientId = global.secrets.oauth.app_client_id
        let clientSecret = global.secrets.oauth.app_client_secret

        let authBase64 = new Buffer(clientId + "&&" + clientSecret).toString('base64')

        if (req.headers.authorization === authBase64) return true
        
        return false
    }
}

module.exports = mobileAuth