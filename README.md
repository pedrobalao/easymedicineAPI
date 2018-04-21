# easymedicineAPI
easymedicine API

## Configuration
1. `mkdir config`
1. `cd config`
1. `cat > secrets.js`

```javascript
var secrets = {};
secrets.db = {};
secrets.db.user = 'username';
secrets.db.password = 'password';
secrets.db.server = 'host:port';
secrets.db.database= 'database';
secrets.db.options = {
      encrypt: true
    };

module.exports = secrets;
```

