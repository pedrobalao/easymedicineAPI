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
      user: 'USER',
      password: 'PASSWORD',
      host: 'HOST',
      database: 'DB',
      ssl: true
    }
  }
};

module.exports = secrets;
```

