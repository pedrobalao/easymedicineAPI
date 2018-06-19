# easymedicineAPI
easymedicine API

## Configuration
1. `mkdir config`
1. `cd config`
1. `cat > secrets.js`

```javascript
var secrets = {
  db:{
    config: {
      user: 'easypeduser@easypedmysql',
      password: 'easyPED!1',
      host: 'easypedmysql.mysql.database.azure.com',
      database: 'easypedprod',
      ssl: true
    }
  }
};

module.exports = secrets;
```

